import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function scoreColor(score: number | null | undefined): string {
  if (score == null) return "var(--text-dim)";
  if (score >= 90) return "var(--green)";
  if (score >= 80) return "#84cc16";
  if (score >= 70) return "var(--orange)";
  return "var(--red)";
}

export function platformColor(platform: string): string {
  switch (platform) {
    case "pc":
      return "var(--cyan)";
    case "ps5":
      return "var(--violet)";
    case "ps4":
      return "var(--blue)";
    default:
      return "var(--text-dim)";
  }
}

export function platformLabel(platform: string): string {
  switch (platform) {
    case "pc":
      return "PC";
    case "ps5":
      return "PS5";
    case "ps4":
      return "PS4";
    default:
      return platform.toUpperCase();
  }
}
