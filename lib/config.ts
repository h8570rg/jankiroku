export const PASSWORD_MIN_LENGTH = 6;
export const NAME_MAX_LENGTH = 12;
export const JANRECO_ID_MIN_LENGTH = 4;
export const JANRECO_ID_MAX_LENGTH = 12;

export const rates = [0, 1, 2, 3, 5, 10, 20, 50, 100] as const;
export const rateLabel: Record<(typeof rates)[number], string> = {
  0: "なし",
  1: "1 (テンイチ)",
  2: "2 (テンニ)",
  3: "3 (テンサン)",
  5: "5 (テンゴ)",
  10: "10 (テンピン)",
  20: "20 (テンリャンピン)",
  50: "50 (ウーピン)",
  100: "100 (デカピン)",
};

export const chipRates = [0, 50, 100, 200, 500, 1000] as const;
export const chipRateLabel: Record<(typeof chipRates)[number], string> = {
  0: "なし",
  50: "50円",
  100: "100円",
  200: "200円",
  500: "500円",
  1000: "1000円",
};

export const calcMethods = [
  "round",
  "roundOff",
  "roundDown",
  "roundUp",
] as const;
export const calcMethodLabel: Record<(typeof calcMethods)[number], string> = {
  round: "五捨六入",
  roundOff: "四捨五入",
  roundDown: "切り捨て",
  roundUp: "切り上げ",
};

const inclinesFor4Players = [
  "custom",
  "0_0_0_0",
  "10_5_-5_-10",
  "20_10_-10_-20",
  "30_10_-10_-30",
] as const;
const inclinesFor3Players = [
  "custom",
  "0_0_0_0",
  "10_0_-10_0",
  "20_0_-20_0",
  "30_0_-30_0",
] as const;
export const inclines = [
  ...inclinesFor4Players,
  ...inclinesFor3Players,
] as const;
export const inclineFor4PlayersLabel: Record<
  (typeof inclinesFor4Players)[number],
  string
> = {
  "0_0_0_0": "なし",
  "10_5_-5_-10": "+10, +5, -5, -10 (ゴットー)",
  "20_10_-10_-20": "+20, +10, -10, -20 (ワンツー)",
  "30_10_-10_-30": "+30, +10, -10, -30 (ワンスリー)",
  custom: "カスタム",
};
export const inclineFor3PlayersLabel: Record<
  (typeof inclinesFor3Players)[number],
  string
> = {
  "0_0_0_0": "なし",
  "10_0_-10_0": "+10, 0, -10 (順位ウマ10)",
  "20_0_-20_0": "+20, 0, -20 (順位ウマ20)",
  "30_0_-30_0": "+30, 0, -30 (順位ウマ30)",
  custom: "カスタム",
};
