import { cn } from "@/lib/utils";

type BadgeVariant = "violet" | "cyan" | "gold" | "green";

export function Badge({
  children,
  variant = "violet",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span className={cn("badge", `badge-${variant}`, className)}>{children}</span>
  );
}
