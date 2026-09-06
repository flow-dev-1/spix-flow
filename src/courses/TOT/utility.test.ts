import { describe, expect, it } from "vitest";
import { calculateResult, calculateScore } from "./utility";

describe("TOT assessment scoring", () => {
  const questions = [
    { id: 1, correctOption: "B" },
    { id: 2, correctOption: "C" },
  ];
  const answers = [
    { id: 1, value: "B" },
    { id: 2, value: "A" },
  ];

  it("returns xAPI score fields from the shared calculation", () => {
    expect(calculateScore(questions, answers, questions.length)).toEqual({
      raw: 1,
      min: 0,
      max: 2,
      scaled: 0.5,
      percentage: 50,
    });
  });

  it("preserves the existing percentage result", () => {
    expect(calculateResult(questions, answers, questions.length)).toBe(50);
  });
});