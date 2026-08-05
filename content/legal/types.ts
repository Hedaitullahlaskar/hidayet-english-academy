export type PolicyBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "callout"; text: string };

export interface PolicyDocument {
  slug: string;
  title: string;
  shortDescription: string;
  category: "Legal" | "Academic" | "Conduct" | "Payments" | "Safety & Privacy";
  lastUpdated: string; // ISO date
  icon: string;
  blocks: PolicyBlock[];
}
