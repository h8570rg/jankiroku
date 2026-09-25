import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { CalcMethod, Match, Rate } from "@/lib/type";
import { aggregateMatchPlayerStats } from "@/lib/utils/match";
import { getUser } from "./user";

/**
 * Match aggregate の読み書き。
 * 意図的に未提供: updateMatch / updateRule / deleteMatch / removeMatchPlayer（UI なし）。
 * Game の create/delete は `./game`。
 */

export async function createMatch({
  calcMethod,
  chipRate,
  crackBoxBonus,
  defaultCalcPoints,
  defaultPoints,
  playersCount,
  rate,
  incline,
  playerIds,
}: {
  calcMethod: string;
  chipRate: number;
  crackBoxBonus: number;
  defaultCalcPoints: number;
  defaultPoints: number;
  playersCount: number;
  rate: number;
  incline: string;
  playerIds?: string[];
}): Promise<{
  id: string;
}> {
  const supabase = await createClient();
  const user = await getUser();

  const createMatchResponse = await supabase
    .from("matches")
    .insert({ created_by: user.id })
    .select()
    .single();
  if (createMatchResponse.error) throw createMatchResponse.error;
  const match = createMatchResponse.data;

  const matchPlayerRows =
    playerIds && playerIds.length > 0
      ? playerIds.map((playerId, index) => ({
          match_id: match.id,
          player_id: playerId,
          order: index,
        }))
      : [
          {
            match_id: match.id,
            player_id: user.id,
            order: 0,
          },
        ];

  const [createRuleResponse, createMatchPlayerResponse] = await Promise.all([
    supabase.from("rules").insert({
      calc_method: calcMethod,
      chip_rate: chipRate,
      crack_box_bonus: crackBoxBonus,
      default_calc_points: defaultCalcPoints,
      default_points: defaultPoints,
      match_id: match.id,
      players_count: playersCount,
      rate,
      incline,
      created_by: user.id,
      updated_by: user.id,
    }),
    supabase.from("match_players").insert(matchPlayerRows),
  ]);
  if (createRuleResponse.error) throw createRuleResponse.error;
  if (createMatchPlayerResponse.error) throw createMatchPlayerResponse.error;
  return {
    id: match.id,
  };
}

export async function getMatch({ matchId }: { matchId: string }): Promise<Match> {
  const supabase = await createClient();
  const matchResult = await supabase
    .from("matches")
    .select("*, match_players(*, profiles!inner(*)), rules(*), games(*, game_players(*))")
    .eq("id", matchId)
    .order("order", { referencedTable: "match_players", ascending: true })
    .single();
  if (matchResult.error) throw matchResult.error;
  const match = matchResult.data;

  return formatMatch(match);
}

export async function getMatches({
  page = 1,
  size = 999, // TODO: 全件取得どうするか
}: {
  page?: number;
  size?: number;
} = {}): Promise<Match[]> {
  const supabase = await createClient();
  const user = await getUser();

  const matchesResponse = await supabase
    .from("match_players")
    .select(
      "matches!inner(*, match_players(*, profiles!inner(*)), rules(*), games(*, game_players(*)))",
      { count: "exact" },
    )
    .eq("player_id", user.id)
    .range((page - 1) * size, page * size - 1)
    .order("created_at", { referencedTable: "matches", ascending: false })
    .order("order", { referencedTable: "matches.match_players", ascending: true });

  if (matchesResponse.error) throw matchesResponse.error;

  return matchesResponse.data.map((row) => formatMatch(row.matches));
}

export async function addMatchPlayers({
  matchId,
  playerIds,
  startOrder,
}: {
  matchId: string;
  playerIds: string[];
  startOrder: number;
}): Promise<void> {
  const supabase = await createClient();
  const addMatchPlayerResponses = await Promise.all(
    playerIds.map((playerId, index) =>
      supabase.from("match_players").insert({
        match_id: matchId,
        player_id: playerId,
        order: startOrder + index,
      }),
    ),
  );
  addMatchPlayerResponses.forEach((response) => {
    if (response.error) throw response.error;
  });
  return;
}

export async function updateMatchPlayer({
  matchId,
  playerId,
  chipCount,
}: {
  matchId: string;
  playerId: string;
  chipCount: number | null;
}): Promise<void> {
  const supabase = await createClient();
  const updateMatchPlayerResponse = await supabase
    .from("match_players")
    .update({
      chip_count: chipCount,
    })
    .eq("match_id", matchId)
    .eq("player_id", playerId);
  if (updateMatchPlayerResponse.error) throw updateMatchPlayerResponse.error;

  return;
}

const formatMatch = (match: {
  id: string;
  created_at: string;
  match_players: {
    profiles: {
      id: string;
      name: string | null;
      display_id: string | null;
      avatar_url: string | null;
      user_id: string | null;
    };
    chip_count: number | null;
  }[];
  rules: {
    players_count: number;
    default_points: number;
    default_calc_points: number;
    rate: number;
    chip_rate: number;
    crack_box_bonus: number;
    calc_method: string;
    incline: string;
  }[];
  games: {
    id: string;
    game_players: {
      player_id: string;
      score: number;
      rank: number;
    }[];
  }[];
}): Match => {
  const rule = match.rules[0];
  const incline = rule.incline.split("_").map((value) => Number(value));
  const [incline1, incline2, incline3, incline4] = incline;

  const games = match.games.map((game) => ({
    id: game.id,
    players: game.game_players.map((gamePlayer) => ({
      id: gamePlayer.player_id,
      score: gamePlayer.score,
      rank: gamePlayer.rank,
    })),
  }));

  const players = aggregateMatchPlayerStats({
    players: match.match_players.map(({ profiles, chip_count }) => ({
      id: profiles.id,
      // Player.name は string。欠落行は表示用に空文字
      name: profiles.name ?? "",
      displayId: profiles.display_id,
      avatarUrl: profiles.avatar_url,
      chipCount: chip_count,
    })),
    games,
    playersCount: rule.players_count,
    chipRate: rule.chip_rate,
    rate: rule.rate,
  });

  return {
    id: match.id,
    createdAt: match.created_at,
    players,
    rule: {
      playersCount: rule.players_count,
      defaultPoints: rule.default_points,
      defaultCalcPoints: rule.default_calc_points,
      rate: rule.rate as Rate,
      chipRate: rule.chip_rate,
      crackBoxBonus: rule.crack_box_bonus,
      calcMethod: rule.calc_method as CalcMethod,
      incline: {
        incline1,
        incline2,
        incline3,
        incline4,
      },
    },
    games,
  };
};
