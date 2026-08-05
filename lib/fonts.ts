import { Fraunces, Plus_Jakarta_Sans, Hind_Siliguri } from "next/font/google";

// Display face — used sparingly for headlines. Carries the "academy" warmth
// that a generic geometric sans (the default ed-tech choice) would not.
export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

// Body / UI face — clean, highly legible at small sizes.
export const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

// Bengali face — full parity with the Latin type system, not an afterthought.
export const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const fontVariables = `${fraunces.variable} ${jakarta.variable} ${hindSiliguri.variable}`;
