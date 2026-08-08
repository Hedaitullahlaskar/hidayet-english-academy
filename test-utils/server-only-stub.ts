// Test-environment stand-in for the `server-only` package. The real
// package unconditionally throws when required outside Next.js's bundler
// (it can't tell "compiled into a server component" apart from "any other
// Node process"), which breaks importing repository files directly in
// Vitest. Aliased in vitest.config.mts — never shipped to production,
// where Next's own bundler resolves the real package as designed.
export {};
