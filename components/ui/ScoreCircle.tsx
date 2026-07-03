import { scoreColor } from "@/lib/utils";

export function ScoreCircle({
  score,
  size = 32,
}: {
  score: number | null | undefined;
  size?: number;
}) {
  const color = scoreColor(score);
  return (
    <div
      className="inline-flex items-center justify-center rounded-full border-2 font-mono font-bold"
      style={{
        width: size,
        height: size,
        borderColor: color,
        color,
        fontSize: size * 0.34,
      }}
    >
      {score ?? "–"}
    </div>
  );
}
