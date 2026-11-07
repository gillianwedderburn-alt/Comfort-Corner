import { describe, expect, it } from "vitest";
import manifest from "../../public/manifest.json";

describe("home-screen installation", () => {
  it("opens Comfort Corner in standalone mode", () => {
    expect(manifest.display).toBe("standalone");
  });
  it("launches at the existing shared access screen", () => {
    expect(manifest.start_url).toBe("/");
    expect(manifest.scope).toBe("/");
  });
});