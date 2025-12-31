import type {
  CalcMethod,
  ChipRate,
  GamePlayer,
  Match,
  MatchPlayer,
  Rate,
} from "@/lib/type";
import type { Supabase } from ".";

export const matchService = (supabase: Supabase) => {
  return {
    createMatch: async ({
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
    }> => {
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

    getMatch: async ({ matchId }: { matchId: string }): Promise<Match> => {
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

    getMatches: async ({
      page = 1,
      size = 999, // TODO: 全件取得どうするか
    }: {
      page?: number;
      size?: number;
    }): Promise<Match[]> => {
      const matchesResponse = await supabase
        .from("matches")
        .select(
          "*, match_players(*, profiles!inner(*)), rules(*), games(*, game_players(*))",
          { count: "exact" },
        )
        .range((page - 1) * size, page * size - 1)
        .order("created_at", { ascending: false });

      if (matchesResponse.error) throw matchesResponse.error;
      const matches = matchesResponse.data;

      return matches.map(formatMatch);
    },

    addMatchPlayers: async ({
      matchId,
      playerIds,
    }: {
      matchId: string;
      playerIds: string[];
    }): Promise<void> => {
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

    updateMatchPlayer: async ({
      matchId,
      playerId,
      chipCount,
    }: {
      matchId: string;
      playerId: string;
      chipCount: number;
    }): Promise<void> => {
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

    createGame: async ({
      matchId,
      gamePlayers,
    }: {
      gamePlayers: GamePlayer[];
      matchId: string;
    }): Promise<void> => {
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
};

const formatMatch = (match: {
  id: string;
  created_at: string;
  match_players: {
    profiles: {
      id: string;
      name: string | null;
      display_id: string | null;
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
}) => {
  const rule = match.rules[0];
  const incline = rule.incline.split("_").map((incline) => Number(incline));
  const [incline1, incline2, incline3, incline4] = incline;

  const players: MatchPlayer[] = match.match_players.map(
    ({ profiles, chip_count }) => ({
      id: profiles.id,
      name: profiles.name,
      displayId: profiles.display_id,
      rankCounts: new Array(rule.players_count).fill(0),
      averageRank: null,
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
    if (player.rankCounts.reduce((acc, cur) => acc + cur, 0) > 0) {
      player.averageRank =
        player.rankCounts.reduce(
          (acc, cur, index) => acc + cur * (index + 1),
          0,
        ) / player.rankCounts.reduce((acc, cur) => acc + cur, 0);
    }
    player.result =
      (player.chipCount ?? 0) * rule.chip_rate +
      player.totalScore * rule.rate * 10;
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
      id: game.id,
      players: game.game_players.map((gamePlayer) => ({
        id: gamePlayer.player_id,
        score: gamePlayer.score,
        rank: gamePlayer.rank,
      })),
    })),
  };
};
