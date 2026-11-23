import { describe, expect, it } from "vitest";
import { ACCESS_CODE_HASHES, isValidAccessCode } from "@/lib/accessCodes";

describe("access codes", () => {
  it("has 50 buyer codes stored as hashes", () => {
    expect(ACCESS_CODE_HASHES).toHaveLength(50);
    for (const hash of ACCESS_CODE_HASHES) {
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    }
  });

  it("rejects an unknown code", async () => {
    await expect(isValidAccessCode("NOT-A-REAL-CODE")).resolves.toBe(false);
  });

  it("rejects empty input", async () => {
    await expect(isValidAccessCode("")).resolves.toBe(false);
    await expect(isValidAccessCode("   ")).resolves.toBe(false);
  });
});
