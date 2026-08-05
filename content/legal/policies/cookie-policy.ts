import type { PolicyDocument } from "@/content/legal/types";

export const cookiePolicy: PolicyDocument = {
  slug: "cookie-policy",
  title: "Cookie Policy",
  shortDescription: "The small set of cookies we use, and how to control them.",
  category: "Safety & Privacy",
  lastUpdated: "2026-08-01",
  icon: "🍪",
  blocks: [
    {
      type: "paragraph",
      text: "Cookies are small pieces of data stored in your browser. HEA uses a deliberately small set of them — we're a learning platform, not an advertising business, so we have little use for the extensive tracking cookies common elsewhere online.",
    },
    { type: "heading", text: "1. Cookies We Use" },
    {
      type: "list",
      items: [
        "Authentication cookies (essential): keep you securely logged in as you move between pages, and support the 'Remember Me' option at login. Without these, you'd need to log in on every page.",
        "Preference cookies: remember your choice of light or dark theme, and your preferred display currency.",
        "Basic analytics cookies: help us understand which pages are used and where students get stuck, in aggregate — not to build an individual advertising profile of you.",
      ],
    },
    {
      type: "callout",
      text: "We do not use third-party advertising cookies, and we do not sell or share cookie data with ad networks.",
    },
    { type: "heading", text: "2. Essential vs. Optional Cookies" },
    {
      type: "paragraph",
      text: "Authentication cookies are essential — the Platform cannot function without them, since they're what keeps your dashboard, courses, and progress tied securely to your account. Preference and analytics cookies are not strictly essential; you can use the Platform without them, though your theme or currency choice won't be remembered between visits.",
    },
    { type: "heading", text: "3. Third-Party Cookies" },
    {
      type: "paragraph",
      text: "Where we embed third-party functionality — for example, Razorpay's or Stripe's checkout, or a Google Meet/Zoom join link — those providers may set their own cookies during that interaction, governed by their own cookie policies, not ours.",
    },
    { type: "heading", text: "4. How Long Cookies Last" },
    {
      type: "paragraph",
      text: "Authentication cookies typically expire when you log out, or after 30 days if you've chosen 'Remember Me.' Preference cookies persist until you clear your browser data or change the setting again.",
    },
    { type: "heading", text: "5. Managing Cookies" },
    {
      type: "paragraph",
      text: "Most browsers let you view, delete, and block cookies through their settings. Blocking essential authentication cookies will prevent you from staying logged in. We don't currently show a cookie-consent banner for essential-only, non-advertising cookie use, consistent with common practice for functionally necessary cookies — but you're always free to manage them at the browser level.",
    },
    { type: "heading", text: "6. Local Storage" },
    {
      type: "paragraph",
      text: "In addition to cookies, we use your browser's local storage for a small amount of non-sensitive interface state (like whether a sidebar is collapsed). This never leaves your device and is not used for tracking.",
    },
    { type: "heading", text: "7. Changes to This Policy" },
    {
      type: "paragraph",
      text: "If the cookies we use change meaningfully, we'll update this page and its 'Last Updated' date.",
    },
    { type: "heading", text: "8. Contact" },
    {
      type: "paragraph",
      text: "Questions about our cookie use can be sent to hidayetenglishacademy@gmail.com.",
    },
    { type: "heading", text: "9. Cookies on Mobile Devices" },
    {
      type: "paragraph",
      text: "If you access HEA through a mobile browser rather than a dedicated app, the same cookie behavior described above applies. We don't currently operate a native mobile app with its own separate tracking mechanisms — the mobile web experience uses the identical, minimal cookie set as desktop.",
    },
    { type: "heading", text: "10. Do Not Track Signals" },
    {
      type: "paragraph",
      text: "Some browsers send a 'Do Not Track' signal. Because we already avoid third-party advertising and cross-site tracking cookies by design, our practical behavior doesn't meaningfully change based on this signal — but we respect its spirit regardless of whether your browser sends it.",
    },
    { type: "heading", text: "11. Session vs. Persistent Cookies" },
    {
      type: "paragraph",
      text: "A session cookie is deleted automatically when you close your browser; a persistent cookie remains until it expires or you delete it. Our authentication cookie is persistent only if you choose 'Remember Me' at login — otherwise it behaves as a session cookie, ending when you close your browser, for extra security on shared devices.",
    },
    { type: "heading", text: "12. Updates as the Platform Grows" },
    {
      type: "paragraph",
      text: "As HEA adds new features — for example, if we introduce more detailed learning analytics in the future — this Policy will be updated to reflect any new cookies that come with them, always following the same principle: essential and preference cookies only, never third-party advertising tracking.",
    },
    { type: "heading", text: "13. Cookies Set by Embedded Payment Widgets" },
    {
      type: "paragraph",
      text: "During checkout, Razorpay's payment widget may set its own short-lived cookies to complete the transaction securely. These exist only during the payment flow itself and are governed by Razorpay's own privacy and cookie practices, not ours.",
    },
    { type: "heading", text: "14. No Cross-Site Tracking" },
    {
      type: "paragraph",
      text: "We do not use cookies to track your activity across other websites you visit, and we do not participate in any ad-network cookie-matching or cross-site retargeting programs — our cookie footprint stops at the edge of our own Platform.",
    },
  ],
};
