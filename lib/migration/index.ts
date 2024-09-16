/* eslint-disable no-console */
import fs from "fs";
import readline from "readline";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../database.types";

// readline インターフェースを作成
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const supabase_url = process.env.SUPABASE_URL;
const service_role_key = process.env.SERVICE_ROLE_KEY;

if (!supabase_url) {
  throw new Error("SUPABASE_URL is not set");
}
if (!service_role_key) {
  throw new Error("SERVICE_ROLE_KEY is not set");
}

const supabase = createClient<Database>(supabase_url, service_role_key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// 移管前のデータを読み込む
const oldRawData = fs.readFileSync("lib/migration/old-data.json", "utf8");
const oldData = JSON.parse(oldRawData);
type OldData = {
  __collections__: {
    scores: {
      [key: string]: {
        players: {
          nickName: string;
          id: string;
        }[];
        chips: {
          chip: number;
          id: string;
        }[];
        rule: {
          lastUse: string;
          numberOfPlayers: number;
          chip: number;
          round: "四捨五入" | "五捨六入" | "切り捨て" | "切り上げ";
          rate: number;
          bonus: number;
          uma: number[];
          title: string;
          kaeshi: number;
          defaultScore: number;
        };
        scores: {
          [key: string]: {
            score: number;
            id: string;
          }[];
        };
      };
    };
  };
};

// メイン関数
async function main() {
  // 移管前の userId の入力を促す
  rl.question("Enter the userId before transfer: ", (userIdBefore) => {
    // 移管後の userId の入力を促す
    rl.question("Enter the userId after transfer: ", (userIdAfter) => {
      // 入力値を確認
      console.log(
        `You entered: userId before transfer: ${userIdBefore}, userId after transfer: ${userIdAfter}`,
      );

      // 実行確認のメッセージ
      rl.question(
        "Do you want to proceed with these values? (Y/n): ",
        (confirmation) => {
          if (
            confirmation.toLowerCase() === "y" ||
            confirmation.toLowerCase() === ""
          ) {
            // ユーザーが「Y」または空入力で確認した場合、特定のプログラムを実行
            console.log(
              `Executing program with userIds: ${userIdBefore} and ${userIdAfter}`,
            );

            // 実行
            migration({
              oldData,
              userIdBefore,
              userIdAfter,
            });
          } else {
            // ユーザーが「n」などで確認しなかった場合の処理
            console.log("Operation canceled.");
          }

          // readline インターフェースを閉じる
          rl.close();
        },
      );
    });
  });
}

async function migration({
  oldData,
  userIdBefore,
  userIdAfter,
}: {
  oldData: OldData;
  userIdBefore: string;
  userIdAfter: string;
}) {
  const { scores: oldMatches } = oldData.__collections__;
  const oldMatchesArray = Object.entries(oldMatches).map(([key, value]) => ({
    id: key,
    ...value,
    createdAt: key,
  }));

  const olsPlayerMatches = oldMatchesArray.filter((item) =>
    item.players.some((player) => player.id === userIdBefore),
  );

  for (const playerMatch of olsPlayerMatches) {
    const {
      players: oldPlayers,
      chips: oldChips,
      rule: oldRule,
      scores: oldGames,
      createdAt: oldMatchCreatedAt,
    } = playerMatch;

    // 移管後の playerId と移管前の playerId の対応を保存
    const playerIdMap: { [key: string]: string } = {};

    // match を作成
    const match = await createMatch({
      createdAt: oldMatchCreatedAt,
      userIdAfter,
    });

    // rule を作成
    await createRule({
      matchId: match.id,
      rule: oldRule,
      userIdAfter,
      createdAt: oldMatchCreatedAt,
    });

    // player を作成
    for (const player of oldPlayers) {
      const playerChipPoints = oldChips.find(
        (chip) => chip.id === player.id,
      )?.chip;
      let playerChip = undefined;
      if (playerChipPoints === undefined || !oldRule.chip) {
        playerChip = undefined;
      } else {
        playerChip = playerChipPoints / oldRule.chip;
        // playerChipが整数でない場合は整数にする
        // 整合性は保たれないが、なぜか整数でないデータが存在するため
        if (!Number.isInteger(playerChip)) {
          playerChip = Math.round(playerChip);
        }
      }
      if (player.id !== userIdBefore) {
        const profile = await createProfile({
          name: player.nickName,
        });
        await createMatchPlayer({
          matchId: match.id,
          playerId: profile.id,
          chipCount: playerChip,
        });
        playerIdMap[player.id] = profile.id;
      } else {
        await createMatchPlayer({
          matchId: match.id,
          playerId: userIdAfter,
          chipCount: playerChip,
        });
        playerIdMap[userIdBefore] = userIdAfter;
      }
    }

    // game を作成
    const oldGamesArray = Object.entries(oldGames).map(([key, value]) => ({
      index: key,
      playerScores: value,
    }));
    for (const oldGame of oldGamesArray) {
      const { index, playerScores } = oldGame;
      const game = await createGame({
        matchId: match.id,
        matchCreatedAt: oldMatchCreatedAt,
        index,
        userIdAfter,
      });
      for (const playerScore of playerScores) {
        const rank =
          playerScores.filter((score) => score.score > playerScore.score)
            .length + 1;
        await createGamePlayer({
          gameId: game.id,
          playerId: playerIdMap[playerScore.id],
          score: playerScore.score,
          rank,
        });
      }
    }
  }
}

async function createMatch({
  createdAt,
  userIdAfter,
}: {
  createdAt: string;
  userIdAfter: string;
}) {
  const createdAtFormatted = new Date(createdAt).toISOString();
  const match = await supabase
    .from("matches")
    .insert({
      created_at: createdAtFormatted,
      created_by: userIdAfter,
    })
    .select()
    .single();
  if (match.error) {
    console.error("Match creation failed", match.error);
    throw match.error;
  }
  console.log(`Match created: ${match.data.id}`);
  return match.data;
}

async function createRule({
  matchId,
  rule: {
    numberOfPlayers,
    chip,
    round,
    rate,
    bonus,
    uma,
    kaeshi,
    defaultScore,
  },
  userIdAfter,
  createdAt,
}: {
  matchId: string;
  rule: {
    numberOfPlayers: number;
    chip: number;
    round: "四捨五入" | "五捨六入" | "切り捨て" | "切り上げ";
    rate: number;
    bonus: number;
    uma: number[];
    kaeshi: number;
    defaultScore: number;
  };
  userIdAfter: string;
  createdAt: string;
}) {
  const calcMethodMap = {
    四捨五入: "roundOff",
    五捨六入: "round",
    切り捨て: "roundDown",
    切り上げ: "roundUp",
  };
  const rule = await supabase
    .from("rules")
    .insert({
      calc_method: calcMethodMap[round],
      chip_rate: chip * rate * 10,
      crack_box_bonus: bonus * 1000,
      default_calc_points: kaeshi,
      default_points: defaultScore,
      match_id: matchId,
      players_count: numberOfPlayers,
      rate,
      incline: `${uma[0]}_${uma[1]}_${uma[2]}_${uma[3] ?? 0}`,
      created_by: userIdAfter,
      created_at: new Date(createdAt).toISOString(),
      updated_by: userIdAfter,
      updated_at: new Date(createdAt).toISOString(),
    })
    .select()
    .single();
  if (rule.error) {
    console.error("Rule creation failed", rule.error);
    throw rule.error;
  }
  console.log(`Rule created: ${rule.data.id}`);
  return rule.data;
}

async function createProfile({ name }: { name: string }) {
  const profile = await supabase
    .from("profiles")
    .insert({ name })
    .select()
    .single();
  if (profile.error) {
    console.error("Profile creation failed", profile.error);
    throw profile.error;
  }
  console.log(`Profile created: ${profile.data.id}`);
  return profile.data;
}

async function createMatchPlayer({
  matchId,
  playerId,
  chipCount,
}: {
  matchId: string;
  playerId: string;
  chipCount: number | undefined;
}) {
  const matchPlayer = await supabase
    .from("match_players")
    .insert({ match_id: matchId, player_id: playerId, chip_count: chipCount })
    .select()
    .single();
  if (matchPlayer.error) {
    console.error("MatchPlayer creation failed", matchPlayer.error);
    console.debug({ matchId, playerId, chipCount });

    throw matchPlayer.error;
  }
  console.log(
    `MatchPlayer created: matchId: ${matchPlayer.data.match_id}, playerId: ${matchPlayer.data.player_id}`,
  );
  return matchPlayer.data;
}

async function createGame({
  matchId,
  userIdAfter,
  index,
  matchCreatedAt,
}: {
  matchId: string;
  userIdAfter: string;
  index: string;
  matchCreatedAt: string;
}) {
  const gameCreatedAt = new Date(matchCreatedAt);
  gameCreatedAt.setSeconds(gameCreatedAt.getSeconds() + parseInt(index));

  const game = await supabase
    .from("games")
    .insert({
      match_id: matchId,
      created_at: gameCreatedAt.toISOString(),
      created_by: userIdAfter,
    })
    .select()
    .single();
  if (game.error) {
    console.error("Game creation failed", game.error);
    throw game.error;
  }
  console.log(`Game created: ${game.data.id}`);
  return game.data;
}

async function createGamePlayer({
  gameId,
  playerId,
  score,
  rank,
}: {
  gameId: string;
  playerId: string;
  score: number;
  rank: number;
}) {
  const gamePlayer = await supabase
    .from("game_players")
    .insert({
      game_id: gameId,
      player_id: playerId,
      score,
      rank,
    })
    .select()
    .single();
  if (gamePlayer.error) {
    console.error("GamePlayer creation failed", gamePlayer.error);
    throw gamePlayer.error;
  }
  console.log(
    `GamePlayer created: gameId: ${gamePlayer.data.game_id}, playerId: ${gamePlayer.data.player_id}`,
  );
  return gamePlayer;
}

main();
