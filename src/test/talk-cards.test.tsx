import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TalkCards from "@/components/TalkCards";
import { talkCards } from "@/data/talkCards";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("Talk card behavior", () => {
  it("contains exactly fifteen cards", () => {
    expect(talkCards).toHaveLength(15);
  });

  it("wraps backward and forward through all fifteen cards", () => {
    render(<TalkCards />);
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByText(talkCards[14]?.question ?? "missing card")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText(talkCards[0]?.question ?? "missing card")).toBeVisible();
    for (let i = 0; i < 15; i++) fireEvent.click(screen.getByRole("button", { name: "Next" }));
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

  it("shuffles without duplicates and resets position and flip", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    render(<TalkCards />);
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "Flip" }));
    fireEvent.click(screen.getByRole("button", { name: "Shuffle" }));
    const cardButton = screen.getByRole("button", { name: "Show what to try together" });
    expect(cardButton).toHaveTextContent(talkCards[1]?.question ?? "missing card");
    const seen = new Set<string>();
    for (let i = 0; i < 15; i++) {
      seen.add(cardButton.textContent ?? "");
      fireEvent.click(screen.getByRole("button", { name: "Next" }));
    }
    expect(seen.size).toBe(15);
    expect(cardButton).toHaveTextContent(talkCards[1]?.question ?? "missing card");
  });

  it("never saves card interactions to browser storage", () => {
    const save = vi.spyOn(Storage.prototype, "setItem");
    render(<TalkCards />);
    for (const name of ["Flip", "Next", "Back", "Shuffle"]) fireEvent.click(screen.getByRole("button", { name }));
    expect(save).not.toHaveBeenCalled();
  });
});