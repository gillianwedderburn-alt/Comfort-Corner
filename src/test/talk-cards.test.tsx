import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TalkCards from "@/components/TalkCards";
import { talkCards } from "@/data/talkCards";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("Talk card behavior", () => {
  it("contains twenty-three cards: eight starting and fifteen growing", () => {
    expect(talkCards).toHaveLength(23);
    expect(talkCards.filter((c) => c.stage === "starting")).toHaveLength(8);
    expect(talkCards.filter((c) => c.stage === "growing")).toHaveLength(15);
  });

  it("wraps backward and forward through all twenty-three cards", () => {
    render(<TalkCards />);
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByText(talkCards[22]?.question ?? "missing card")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText(talkCards[0]?.question ?? "missing card")).toBeVisible();
    for (let i = 0; i < 23; i++) fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText(talkCards[0]?.question ?? "missing card")).toBeVisible();
  });

  it("flips to the suggestion and resets to the question when moving", () => {
    render(<TalkCards />);
    fireEvent.click(screen.getByRole("button", { name: "Flip" }));
    expect(screen.getByText(talkCards[0]?.tryThis ?? "missing card")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText(talkCards[1]?.question ?? "missing card")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Show what to try together" }));
    expect(screen.getByText(talkCards[1]?.tryThis ?? "missing card")).toBeVisible();
  });

  it("filters by stage, counts the filtered set and resets position and flip", () => {
    render(<TalkCards />);
    fireEvent.click(screen.getByRole("radio", { name: "Just starting out" }));
    expect(screen.getByText("Card 1 of 8")).toBeVisible();
    expect(screen.getByText(talkCards[0]?.question ?? "missing card")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "Flip" }));
    expect(screen.getByText(talkCards[1]?.tryThis ?? "missing card")).toBeVisible();

    fireEvent.click(screen.getByRole("radio", { name: "Growing up" }));
    expect(screen.getByText("Card 1 of 15")).toBeVisible();
    expect(screen.getByText(talkCards[4]?.question ?? "missing card")).toBeVisible();

    fireEvent.click(screen.getByRole("radio", { name: "All cards" }));
    expect(screen.getByText("Card 1 of 23")).toBeVisible();
  });

  it("shuffles without duplicates and resets position and flip", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    render(<TalkCards />);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "Flip" }));
    fireEvent.click(screen.getByRole("button", { name: "Shuffle" }));
    const cardButton = screen.getByRole("button", { name: "Show what to try together" });
    const seen = new Set<string>();
    for (let i = 0; i < 23; i++) {
      seen.add(cardButton.textContent ?? "");
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
    }
    expect(seen.size).toBe(23);
  });

  it("shuffles only the filtered cards", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    render(<TalkCards />);
    fireEvent.click(screen.getByRole("radio", { name: "Just starting out" }));
    fireEvent.click(screen.getByRole("button", { name: "Shuffle" }));
    expect(screen.getByText("Card 1 of 8")).toBeVisible();
    const cardButton = screen.getByRole("button", { name: "Show what to try together" });
    const seen = new Set<string>();
    for (let i = 0; i < 8; i++) {
      seen.add(cardButton.textContent ?? "");
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
    }
    expect(seen.size).toBe(8);
    for (const text of seen) {
      const card = talkCards.find((c) => text.includes(c.question));
      expect(card?.stage).toBe("starting");
    }
  });

  it("never saves card interactions to browser storage", () => {
    const save = vi.spyOn(Storage.prototype, "setItem");
    render(<TalkCards />);
    fireEvent.click(screen.getByRole("radio", { name: "Growing up" }));
    for (const name of ["Flip", "Next", "Back", "Shuffle"]) fireEvent.click(screen.getByRole("button", { name }));
    expect(save).not.toHaveBeenCalled();
  });
});
