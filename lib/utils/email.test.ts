import { describe, expect, it } from "vitest";
import { maskEmail } from "./email";

describe("maskEmail", () => {
  it("ローカル部の先頭 1 文字だけを残す", () => {
    expect(maskEmail("test@example.com")).toBe("t***@example.com");
  });

  it("ローカル部が 1 文字でも長さを推測できない形にする", () => {
    expect(maskEmail("a@example.com")).toBe("a***@example.com");
  });

  it("@ を含まない文字列はそのまま返す", () => {
    expect(maskEmail("invalid")).toBe("invalid");
  });
});
