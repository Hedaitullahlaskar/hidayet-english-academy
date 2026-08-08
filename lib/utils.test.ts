import { describe, it, expect } from "vitest";
import { cn, safeJsonLd } from "./utils";

describe("cn", () => {
  it("joins truthy string arguments with a space", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("drops falsy values (false, null, undefined, empty string) without leaving gaps", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("flattens nested arrays, the pattern every variant-map call site relies on", () => {
    expect(cn("a", ["b", ["c", false, "d"]])).toBe("a b c d");
  });

  it("keeps the literal 0, since dropping it would silently break a class like 'opacity-0'", () => {
    expect(cn("a", 0, "b")).toBe("a 0 b");
  });
});

describe("safeJsonLd", () => {
  it("produces valid, parseable JSON for ordinary data", () => {
    const data = { name: "Hidayet English Academy", price: 500 };
    expect(JSON.parse(safeJsonLd(data))).toEqual(data);
  });

  it("escapes a literal </script> so admin-entered content can never break out of the JSON-LD tag — the actual XSS this function exists to prevent", () => {
    const malicious = { description: "Great course</script><script>alert(1)</script>" };
    const output = safeJsonLd(malicious);
    expect(output).not.toContain("</script>");
    // Only `<` needs escaping — `>` alone can't open or close a tag, so
    // leaving it literal is correct, not a partial fix.
    expect(output).toContain("\\u003c/script>");
  });

  it("round-trips the escaped value back to the original string when parsed", () => {
    const malicious = { description: "</script>" };
    const parsed = JSON.parse(safeJsonLd(malicious));
    expect(parsed.description).toBe("</script>");
  });
});
