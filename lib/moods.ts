export interface Mood {
  key: string;
  label: string;
  emoji: string;
  description: string;
  genres: string[];
  minScore: number;
  gradient: string;
}

export const MOODS: Mood[] = [
  {
    key: "epic-adventure",
    label: "Epic Adventure",
    emoji: "⚔️",
    description: "Sprawling worlds and heroic journeys",
    genres: ["RPG", "Action RPG", "Open World", "Adventure", "Action-Adventure"],
    minScore: 70,
    gradient: "linear-gradient(135deg, #8B5CF6, #3b82f6)",
  },
  {
    key: "intense-action",
    label: "Intense Action",
    emoji: "🔫",
    description: "Fast reflexes, faster bullets",
    genres: ["First-Person Shooter", "Shooter", "FPS"],
    minScore: 60,
    gradient: "linear-gradient(135deg, #EF4444, #F97316)",
  },
  {
    key: "just-chill",
    label: "Just Chill",
    emoji: "🌿",
    description: "Low-stakes, high-comfort",
    genres: ["Simulation", "Platformer", "Sports", "Racing"],
    minScore: 0,
    gradient: "linear-gradient(135deg, #06EFC9, #34d8b4)",
  },
  {
    key: "big-brain",
    label: "Big Brain Mode",
    emoji: "🧠",
    description: "Think three moves ahead",
    genres: ["Strategy"],
    minScore: 0,
    gradient: "linear-gradient(135deg, #a78bfa, #ec4899)",
  },
  {
    key: "scare-me",
    label: "Scare Me",
    emoji: "💀",
    description: "Turn the lights off first",
    genres: ["Survival Horror", "Stealth", "Horror"],
    minScore: 0,
    gradient: "linear-gradient(135deg, #7f1d1d, #431407)",
  },
  {
    key: "get-competitive",
    label: "Get Competitive",
    emoji: "🏆",
    description: "Winner takes all",
    genres: ["Battle Royale", "Fighting", "Sports", "Racing"],
    minScore: 0,
    gradient: "linear-gradient(135deg, #F97316, #EF4444)",
  },
];
