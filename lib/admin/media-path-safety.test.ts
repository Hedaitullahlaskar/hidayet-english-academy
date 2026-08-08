import { describe, it, expect } from "vitest";
import { isSafePath } from "./media-path-safety";

describe("isSafePath", () => {
  it("allows ordinary nested folder paths", () => {
    expect(isSafePath("gallery")).toBe(true);
    expect(isSafePath("gallery/2026")).toBe(true);
    expect(isSafePath("")).toBe(true);
  });

  it("rejects a leading slash (absolute-path attempt)", () => {
    expect(isSafePath("/etc/passwd")).toBe(false);
  });

  it("rejects any path segment that is exactly '..'", () => {
    expect(isSafePath("..")).toBe(false);
    expect(isSafePath("gallery/../../avatars")).toBe(false);
    expect(isSafePath("../avatars")).toBe(false);
  });

  it("does not false-positive on a filename that merely contains dots", () => {
    expect(isSafePath("gallery/photo..v2.jpg")).toBe(true);
    expect(isSafePath("gallery/...hidden")).toBe(true);
  });
});
