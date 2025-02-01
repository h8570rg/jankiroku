import { describe, it, expect } from "vitest";
import { Rule } from "../type";
import {
  round,
  roundOff,
  roundDown,
  roundUp,
  calcRound,
  calcScore,
  calcPlayerScores,
} from "./score";

const rule1: Rule = {
  playersCount: 4,
  defaultPoints: 25000,
  defaultCalcPoints: 30000,
  rate: 5,
  chipRate: 100,
  crackBoxBonus: 10000,
  calcMethod: "round",
  incline: {
    incline1: 10,
    incline2: 5,
    incline3: -5,
    incline4: -10,
  },
};
const rule2: Rule = {
  playersCount: 4,
  defaultPoints: 25000,
  defaultCalcPoints: 30000,
  rate: 5,
  chipRate: 100,
  crackBoxBonus: 10000,
  calcMethod: "round",
  incline: {
    incline1: 20,
    incline2: 10,
    incline3: -10,
    incline4: -20,
  },
};
const rule3: Rule = {
  playersCount: 4,
  defaultPoints: 25000,
  defaultCalcPoints: 30000,
  rate: 5,
  chipRate: 100,
  crackBoxBonus: 10000,
  calcMethod: "roundOff",
  incline: {
    incline1: 20,
    incline2: 10,
    incline3: -10,
    incline4: -20,
  },
};
const rule4: Rule = {
  playersCount: 3,
  defaultPoints: 35000,
  defaultCalcPoints: 40000,
  rate: 5,
  chipRate: 100,
  crackBoxBonus: 10000,
  calcMethod: "round",
  incline: {
    incline1: 30,
    incline2: 10,
    incline3: -40,
    incline4: 0,
  },
};

describe("calculate score", () => {
  it("round", () => {
    expect(round(0)).toBe(0);
    expect(round(100)).toBe(0);
    expect(round(400)).toBe(0);
    expect(round(500)).toBe(0);
    expect(round(600)).toBe(1000);
    expect(round(1000)).toBe(1000);
    expect(round(1100)).toBe(1000);
    expect(round(1400)).toBe(1000);
    expect(round(1500)).toBe(1000);
    expect(round(1600)).toBe(2000);
    expect(round(1900)).toBe(2000);
    expect(round(2000)).toBe(2000);
    expect(round(2100)).toBe(2000);
    expect(round(-100)).toBe(0);
    expect(round(-400)).toBe(0);
    expect(round(-500)).toBe(0);
    expect(round(-600)).toBe(-1000);
    expect(round(-1000)).toBe(-1000);
    expect(round(-1100)).toBe(-1000);
    expect(round(-1400)).toBe(-1000);
    expect(round(-1500)).toBe(-1000);
    expect(round(-1600)).toBe(-2000);
    expect(round(-1900)).toBe(-2000);
    expect(round(-2000)).toBe(-2000);
    expect(round(-2100)).toBe(-2000);
    expect(round(12345.67)).toBe(12000);
    expect(round(-12345.67)).toBe(-12000);
  });

  it("roundOff", () => {
    expect(roundOff(0)).toBe(0);
    expect(roundOff(100)).toBe(0);
    expect(roundOff(400)).toBe(0);
    expect(roundOff(500)).toBe(1000);
    expect(roundOff(600)).toBe(1000);
    expect(roundOff(1000)).toBe(1000);
    expect(roundOff(1100)).toBe(1000);
    expect(roundOff(1400)).toBe(1000);
    expect(roundOff(1500)).toBe(2000);
    expect(roundOff(1600)).toBe(2000);
    expect(roundOff(1900)).toBe(2000);
    expect(roundOff(2000)).toBe(2000);
    expect(roundOff(2100)).toBe(2000);
    expect(roundOff(-100)).toBe(0);
    expect(roundOff(-400)).toBe(0);
    expect(roundOff(-500)).toBe(-1000);
    expect(roundOff(-600)).toBe(-1000);
    expect(roundOff(-1000)).toBe(-1000);
    expect(roundOff(-1100)).toBe(-1000);
    expect(roundOff(-1400)).toBe(-1000);
    expect(roundOff(-1500)).toBe(-2000);
    expect(roundOff(-1600)).toBe(-2000);
    expect(roundOff(-1900)).toBe(-2000);
    expect(roundOff(-2000)).toBe(-2000);
    expect(roundOff(-2100)).toBe(-2000);
    expect(roundOff(12345.67)).toBe(12000);
    expect(roundOff(-12345.67)).toBe(-12000);
  });

  it("roundDown", () => {
    expect(roundDown(0)).toBe(0);
    expect(roundDown(100)).toBe(0);
    expect(roundDown(400)).toBe(0);
    expect(roundDown(500)).toBe(0);
    expect(roundDown(600)).toBe(0);
    expect(roundDown(1000)).toBe(1000);
    expect(roundDown(1100)).toBe(1000);
    expect(roundDown(1400)).toBe(1000);
    expect(roundDown(1500)).toBe(1000);
    expect(roundDown(1600)).toBe(1000);
    expect(roundDown(1900)).toBe(1000);
    expect(roundDown(2000)).toBe(2000);
    expect(roundDown(2100)).toBe(2000);
    expect(roundDown(-100)).toBe(0);
    expect(roundDown(-400)).toBe(0);
    expect(roundDown(-500)).toBe(0);
    expect(roundDown(-600)).toBe(0);
    expect(roundDown(-1000)).toBe(-1000);
    expect(roundDown(-1100)).toBe(-1000);
    expect(roundDown(-1400)).toBe(-1000);
    expect(roundDown(-1500)).toBe(-1000);
    expect(roundDown(-1600)).toBe(-1000);
    expect(roundDown(-1900)).toBe(-1000);
    expect(roundDown(-2000)).toBe(-2000);
    expect(roundDown(-2100)).toBe(-2000);
    expect(roundDown(12345.67)).toBe(12000);
    expect(roundDown(-12345.67)).toBe(-12000);
  });

  it("roundUp", () => {
    expect(roundUp(0)).toBe(0);
    expect(roundUp(100)).toBe(1000);
    expect(roundUp(400)).toBe(1000);
    expect(roundUp(500)).toBe(1000);
    expect(roundUp(600)).toBe(1000);
    expect(roundUp(1000)).toBe(1000);
    expect(roundUp(1100)).toBe(2000);
    expect(roundUp(1400)).toBe(2000);
    expect(roundUp(1500)).toBe(2000);
    expect(roundUp(1600)).toBe(2000);
    expect(roundUp(1900)).toBe(2000);
    expect(roundUp(2000)).toBe(2000);
    expect(roundUp(2100)).toBe(3000);
    expect(roundUp(-100)).toBe(-1000);
    expect(roundUp(-400)).toBe(-1000);
    expect(roundUp(-500)).toBe(-1000);
    expect(roundUp(-600)).toBe(-1000);
    expect(roundUp(-1000)).toBe(-1000);
    expect(roundUp(-1100)).toBe(-2000);
    expect(roundUp(-1400)).toBe(-2000);
    expect(roundUp(-1500)).toBe(-2000);
    expect(roundUp(-1600)).toBe(-2000);
    expect(roundUp(-1900)).toBe(-2000);
    expect(roundUp(-2000)).toBe(-2000);
    expect(roundUp(-2100)).toBe(-3000);
    expect(roundUp(12345.67)).toBe(13000);
    expect(roundUp(-12345.67)).toBe(-13000);
  });

  it("calcRound", () => {
    expect(calcRound({ points: 0, calcMethod: "round" })).toBe(0);
    expect(calcRound({ points: 0, calcMethod: "roundOff" })).toBe(0);
    expect(calcRound({ points: 0, calcMethod: "roundDown" })).toBe(0);
    expect(calcRound({ points: 0, calcMethod: "roundUp" })).toBe(0);
    expect(calcRound({ points: 400, calcMethod: "round" })).toBe(0);
    expect(calcRound({ points: 400, calcMethod: "roundOff" })).toBe(0);
    expect(calcRound({ points: 400, calcMethod: "roundDown" })).toBe(0);
    expect(calcRound({ points: 400, calcMethod: "roundUp" })).toBe(1000);
    expect(calcRound({ points: 500, calcMethod: "round" })).toBe(0);
    expect(calcRound({ points: 500, calcMethod: "roundOff" })).toBe(1000);
    expect(calcRound({ points: 500, calcMethod: "roundDown" })).toBe(0);
    expect(calcRound({ points: 500, calcMethod: "roundUp" })).toBe(1000);
    expect(calcRound({ points: 600, calcMethod: "round" })).toBe(1000);
    expect(calcRound({ points: 600, calcMethod: "roundOff" })).toBe(1000);
    expect(calcRound({ points: 600, calcMethod: "roundDown" })).toBe(0);
    expect(calcRound({ points: 600, calcMethod: "roundUp" })).toBe(1000);
    expect(calcRound({ points: 900, calcMethod: "round" })).toBe(1000);
    expect(calcRound({ points: 900, calcMethod: "roundOff" })).toBe(1000);
    expect(calcRound({ points: 900, calcMethod: "roundDown" })).toBe(0);
    expect(calcRound({ points: 900, calcMethod: "roundUp" })).toBe(1000);
    expect(calcRound({ points: 1000, calcMethod: "round" })).toBe(1000);
    expect(calcRound({ points: 1000, calcMethod: "roundOff" })).toBe(1000);
    expect(calcRound({ points: 1000, calcMethod: "roundDown" })).toBe(1000);
    expect(calcRound({ points: 1000, calcMethod: "roundUp" })).toBe(1000);
  });

  it("calcScore", () => {
    expect(
      calcScore({
        points: 8600,
        index: 3,
        rule: rule1,
        crackBoxBonusPoints: 0,
      }),
    ).toBe(-31);
    expect(
      calcScore({
        points: -1500,
        index: 3,
        rule: rule2,
        crackBoxBonusPoints: -10000,
      }),
    ).toBe(-61);
    expect(
      calcScore({
        points: 31500,
        index: 1,
        rule: rule3,
        crackBoxBonusPoints: 0,
      }),
    ).toBe(12);
    expect(
      calcScore({
        points: 31500,
        index: 1,
        rule: rule4,
        crackBoxBonusPoints: 0,
      }),
    ).toBe(1);
  });

  it("calcPlayerScores", () => {
    // 普通の
    expect(
      calcPlayerScores({
        players: [
          {
            id: "1",
            points: 18600,
          },
          {
            id: "2",
            points: 4900,
          },
          {
            id: "3",
            points: 38500,
          },
          {
            id: "4",
            points: 38000,
          },
        ],
        rule: rule1,
      }),
    ).toEqual([
      {
        id: "3",
        rank: 1,
        score: 38,
      },
      {
        id: "4",
        rank: 2,
        score: 13,
      },
      {
        id: "1",
        rank: 3,
        score: -16,
      },
      {
        id: "2",
        rank: 4,
        score: -35,
      },
    ]);
    // 一人飛び
    expect(
      calcPlayerScores({
        players: [
          {
            id: "1",
            points: 18600,
          },
          {
            id: "2",
            points: -4900,
          },
          {
            id: "3",
            points: 38500,
          },
          {
            id: "4",
            points: 47800,
          },
        ],
        rule: rule2,
        crackBoxPlayerId: "4",
      }),
    ).toEqual([
      {
        id: "4",
        rank: 1,
        score: 68,
      },
      {
        id: "3",
        rank: 2,
        score: 18,
      },
      {
        id: "1",
        rank: 3,
        score: -21,
      },
      {
        id: "2",
        rank: 4,
        score: -65,
      },
    ]);
    // 一人飛び & 飛び賞なし
    expect(
      calcPlayerScores({
        players: [
          {
            id: "1",
            points: 18600,
          },
          {
            id: "2",
            points: -4900,
          },
          {
            id: "3",
            points: 38500,
          },
          {
            id: "4",
            points: 47800,
          },
        ],
        rule: rule2,
      }),
    ).toEqual([
      {
        id: "4",
        rank: 1,
        score: 58,
      },
      {
        id: "3",
        rank: 2,
        score: 18,
      },
      {
        id: "1",
        rank: 3,
        score: -21,
      },
      {
        id: "2",
        rank: 4,
        score: -55,
      },
    ]);
    // 一人飛び & 2着が飛ばし
    expect(
      calcPlayerScores({
        players: [
          {
            id: "1",
            points: 18600,
          },
          {
            id: "2",
            points: -4900,
          },
          {
            id: "3",
            points: 38500,
          },
          {
            id: "4",
            points: 47800,
          },
        ],
        rule: rule2,
        crackBoxPlayerId: "3",
      }),
    ).toEqual([
      {
        id: "4",
        rank: 1,
        score: 58,
      },
      {
        id: "3",
        rank: 2,
        score: 28,
      },
      {
        id: "1",
        rank: 3,
        score: -21,
      },
      {
        id: "2",
        rank: 4,
        score: -65,
      },
    ]);
    // 二人飛び
    expect(
      calcPlayerScores({
        players: [
          {
            id: "1",
            points: 18600,
          },
          {
            id: "2",
            points: -4900,
          },
          {
            id: "3",
            points: 86800,
          },
          {
            id: "4",
            points: -500,
          },
        ],
        rule: rule2,
        crackBoxPlayerId: "3",
      }),
    ).toEqual([
      {
        id: "3",
        rank: 1,
        score: 116,
      },
      {
        id: "1",
        rank: 2,
        score: -1,
      },
      {
        id: "4",
        rank: 3,
        score: -50,
      },
      {
        id: "2",
        rank: 4,
        score: -65,
      },
    ]);
  });
});
