export const SERVICE_NAME = "雀鬼録";
export const PASSWORD_MIN_LENGTH = 6;
export const NAME_MAX_LENGTH = 12;
export const DISPLAY_ID_MIN_LENGTH = 4;
export const DISPLAY_ID_MAX_LENGTH = 12;

export const rates = [0, 1, 3, 5, 10, 20] as const;
export const rateLabel: Record<(typeof rates)[number], string> = {
  0: "なし",
  1: "テンイチ",
  3: "テンサン",
  5: "テンゴ",
  10: "テンピン",
  20: "リャンピン",
};
export const rateDescription: Record<(typeof rates)[number], string | null> = {
  0: null,
  1: "1000点10円",
  3: "1000点30円",
  5: "1000点50円",
  10: "1000点100円",
  20: "1000点200円",
};

export const chipRatePresets = [
  "0",
  "50",
  "100",
  "200",
  "500",
  "custom",
] as const;
export const chipRatePresetLabel: Record<
  (typeof chipRatePresets)[number],
  string
> = {
  0: "なし",
  50: "50円",
  100: "100円",
  200: "200円",
  500: "500円",
  custom: "カスタム",
};
export const chipRatePresetValue: Record<
  (typeof chipRatePresets)[number],
  number | null
> = {
  0: 0,
  50: 50,
  100: 100,
  200: 200,
  500: 500,
  custom: null,
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

export const inclinesPresetsFor4Players = [
  "0_0_0_0",
  "10_5_-5_-10",
  "20_10_-10_-20",
  "30_10_-10_-30",
  "custom",
] as const;
export const inclinesPresetsFor3Players = [
  "0_0_0_0",
  "10_0_-10_0",
  "20_0_-20_0",
  "30_0_-30_0",
  "custom",
] as const;
export const inclinePresetLabelFor4Players: Record<
  (typeof inclinesPresetsFor4Players)[number],
  string
> = {
  "0_0_0_0": "なし",
  "10_5_-5_-10": "ゴットー",
  "20_10_-10_-20": "ワンツー",
  "30_10_-10_-30": "ワンスリー",
  custom: "カスタム",
};
export const inclinePresetLabelFor3Players: Record<
  (typeof inclinesPresetsFor3Players)[number],
  string
> = {
  "0_0_0_0": "なし",
  "10_0_-10_0": "ウマ10",
  "20_0_-20_0": "ウマ20",
  "30_0_-30_0": "ウマ30",
  custom: "カスタム",
};
export const inclinePresetValuesFor4Players: Record<
  (typeof inclinesPresetsFor4Players)[number],
  readonly [number, number, number, number] | null
> = {
  "0_0_0_0": [0, 0, 0, 0],
  "10_5_-5_-10": [10, 5, -5, -10],
  "20_10_-10_-20": [20, 10, -10, -20],
  "30_10_-10_-30": [30, 10, -10, -30],
  custom: null,
};
export const inclinePresetValuesFor3Players: Record<
  (typeof inclinesPresetsFor3Players)[number],
  readonly [number, number, number, number] | null
> = {
  "0_0_0_0": [0, 0, 0, 0],
  "10_0_-10_0": [10, 0, -10, 0],
  "20_0_-20_0": [20, 0, -20, 0],
  "30_0_-30_0": [30, 0, -30, 0],
  custom: null,
};
