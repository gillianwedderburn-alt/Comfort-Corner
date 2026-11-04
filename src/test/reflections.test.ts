import { describe, expect, it } from "vitest";
import { PROMPTS, randomPrompt } from "@/data/reflections";

describe("reflection prompts", () => {
  it("Anxious and Overwhelmed share the same five prompts", () => {
    expect(PROMPTS.Anxious).toHaveLength(5);
    expect(PROMPTS.Overwhelmed).toEqual(PROMPTS.Anxious);
  });
  it("picks a prompt from the chosen mood only", () => {
    for (let i = 0; i < 20; i++) expect(PROMPTS.Tired).toContain(randomPrompt("Tired"));
  });
});
