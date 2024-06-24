import {
  CalcMethod,
  ChipRate,
  GamePlayer,
  Match,
  MatchPlayer,
  Rate,
} from "@/lib/type";
import { Supabase } from ".";

export function matchService(supabase: Supabase) {
  return {
    async createMatch({
      calcMethod,
      chipRate,
      crackBoxBonus,
      defaultCalcPoints,
      defaultPoints,
      playersCount,
      rate,
      incline,
    }: {
      calcMethod: string;
      chipRate: number;
      crackBoxBonus: number;
      defaultCalcPoints: number;
      defaultPoints: number;
      playersCount: number;
      rate: number;
      incline: string;
    }): Promise<{
      id: string;
    }> {
      const createMatchResponse = await supabase
        .from("matches")
        .insert({})
        .select()
        .single();
      if (createMatchResponse.error) throw createMatchResponse.error;
      const match = createMatchResponse.data;

      const [createRuleResponse, createMatchPlayerResponse] = await Promise.all(
        [
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
          }),
          supabase.from("match_players").insert({ match_id: match.id }),
        ],
      );
      if (createRuleResponse.error) throw createRuleResponse.error;
      if (createMatchPlayerResponse.error)
        throw createMatchPlayerResponse.error;
      return {
        id: match.id,
      };
    },

    async getMatch({ matchId }: { matchId: string }): Promise<Match> {
      const matchResult = await supabase
        .from("matches")
        .select(
          "*, match_players(*, profiles!inner(*)), rules(*), games(*, game_players(*))",
        )
        .eq("id", matchId)
        .single();
      if (matchResult.error) throw matchResult.error;
      const match = matchResult.data;

      return formatMatch(match);
    },

    async getMatches({
      page = 1,
      size = 99,
    }: {
      page?: number;
      size?: number;
    }): Promise<Match[]> {
      const userResponse = await supabase.auth.getUser();
      if (userResponse.error) throw userResponse.error;
      const user = userResponse.data.user;

      // matchesResponse取得のとこで、inで取得してもfilterできなかったので
      const playerMatchesResponse = await supabase
        .from("match_players")
        .select("*")
        .eq("player_id", user.id);
      if (playerMatchesResponse.error) throw playerMatchesResponse.error;
      const playerMatches = playerMatchesResponse.data;

      const matchesResponse = await supabase
        .from("matches")
        .select(
          "*, match_players(*, profiles!inner(*)), rules(*), games(*, game_players(*))",
        )
        .in(
          "id",
          playerMatches.map((playerMatch) => playerMatch.match_id),
        )
        .range((page - 1) * size, page * size - 1)
        .order("created_at", { ascending: false });

      if (matchesResponse.error) throw matchesResponse.error;
      const matches = matchesResponse.data;

      return matches.map(formatMatch);
    },

    // TODO: 消す
    async addMatchPlayer({
      matchId,
      playerId,
    }: {
      matchId: string;
      playerId: string;
    }): Promise<void> {
      const addMatchPlayerResponse = await supabase
        .from("match_players")
        .insert({
          match_id: matchId,
          player_id: playerId,
        });
      if (addMatchPlayerResponse.error) throw addMatchPlayerResponse.error;
      return;
    },

    async addMatchPlayers({
      matchId,
      playerIds,
    }: {
      matchId: string;
      playerIds: string[];
    }): Promise<void> {
      const addMatchPlayerResponses = await Promise.all(
        playerIds.map((playerId) =>
          supabase.from("match_players").insert({
            match_id: matchId,
            player_id: playerId,
          }),
        ),
      );
      addMatchPlayerResponses.forEach((response) => {
        if (response.error) throw response.error;
      });
      return;
    },

    async updateMatchPlayer({
      matchId,
      playerId,
      chipCount,
    }: {
      matchId: string;
      playerId: string;
      chipCount: number;
    }): Promise<void> {
      const updateMatchPlayerResponse = await supabase
        .from("match_players")
        .update({
          match_id: matchId,
          player_id: playerId,
          chip_count: chipCount,
        })
        .eq("match_id", matchId)
        .eq("player_id", playerId);
      if (updateMatchPlayerResponse.error)
        throw updateMatchPlayerResponse.error;

      return;
    },

    async createGame({
      matchId,
      gamePlayers,
    }: {
      gamePlayers: GamePlayer[];
      matchId: string;
    }): Promise<void> {
      const createGameResponse = await supabase
        .from("games")
        .insert({
          match_id: matchId,
        })
        .select()
        .single();
      if (createGameResponse.error) throw createGameResponse.error;
      const game = createGameResponse.data;

      await Promise.all(
        gamePlayers.map(async ({ id, score, rank }) => {
          const addGamePlayersResponse = await supabase
            .from("game_players")
            .insert({
              game_id: game.id,
              player_id: id,
              score,
              rank,
            });
          if (addGamePlayersResponse.error) throw addGamePlayersResponse.error;
        }),
      );
      return;
    },
  };
}

function formatMatch(match: {
  id: string;
  created_at: string;
  match_players: {
    profiles: {
      id: string;
      name: string | null;
      janreco_id: string | null;
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
    game_players: {
      player_id: string;
      score: number;
      rank: number;
    }[];
  }[];
}) {
  const rule = match.rules[0];
  const incline = rule.incline.split("_").map((incline) => Number(incline));
  const [incline1, incline2, incline3, incline4] = incline;

  const players: MatchPlayer[] = match.match_players.map(
    ({ profiles, chip_count }) => ({
      id: profiles.id,
      name: profiles.name,
      janrecoId: profiles.janreco_id,
      rankCounts: new Array(match.match_players.length).fill(0),
      averageRank: 0,
      totalScore: 0,
      chipCount: chip_count,
      result: 0,
    }),
  );

  match.games.forEach(({ game_players }) => {
    game_players.forEach(({ player_id, score, rank }) => {
      const player = players.find((player) => player.id === player_id);
      if (!player) return;
      player.rankCounts[rank - 1]++;
      player.totalScore += score;
    });
  });

  players.forEach((player) => {
    player.averageRank =
      player.rankCounts.reduce(
        (acc, rankCount, rank) => acc + rankCount * (rank + 1),
        0,
      ) / match.games.length;
    player.result =
      (player.chipCount ?? 0) * rule.chip_rate + player.totalScore * rule.rate;
  });

  return {
    id: match.id,
    createdAt: match.created_at,
    players: players,
    rule: {
      playersCount: rule.players_count,
      defaultPoints: rule.default_points,
      defaultCalcPoints: rule.default_calc_points,
      rate: rule.rate as Rate,
      chipRate: rule.chip_rate as ChipRate,
      crackBoxBonus: rule.crack_box_bonus,
      calcMethod: rule.calc_method as CalcMethod,
      incline: {
        incline1,
        incline2,
        incline3,
        incline4,
      },
    },
    games: match.games.map((game) => ({
      players: game.game_players.map((gamePlayer) => ({
        id: gamePlayer.player_id,
        score: gamePlayer.score,
        rank: gamePlayer.rank,
      })),
    })),
  };
}
