export function ChartCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`card p-4 ${className ?? ""}`}>
      <div className="mb-3 font-mono text-[0.6rem] uppercase tracking-[2px] text-text-dim">
        {title}
      </div>
      {children}
    </div>
  );
}
