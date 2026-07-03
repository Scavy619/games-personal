import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export const PALETTE = [
  "#8B5CF6",
  "#06EFC9",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#F97316",
  "#3b82f6",
  "#a78bfa",
  "#34d8b4",
  "#ec4899",
  "#facc15",
  "#22d3ee",
];

export const darkTooltip = {
  backgroundColor: "#161434",
  titleColor: "#E8E6FF",
  bodyColor: "#a29dd6",
  borderColor: "#2d2860",
  borderWidth: 1,
  padding: 10,
  titleFont: { family: "var(--font-jbmono)", size: 11 },
  bodyFont: { family: "var(--font-jbmono)", size: 11 },
};

export const baseGridOptions = {
  color: "#1e1b42",
};

export const baseTickOptions = {
  color: "#6B68A0",
  font: { family: "var(--font-jbmono)", size: 10 },
};
