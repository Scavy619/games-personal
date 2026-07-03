import { platformColor } from "@/lib/utils";

export function PlatformDot({ platform }: { platform: string }) {
  const color = platformColor(platform);
  return (
    <span
      className="dot-glow inline-block h-2 w-2 rounded-full"
      style={{ background: color, color }}
      title={platform.toUpperCase()}
    />
  );
}
