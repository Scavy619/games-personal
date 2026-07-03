"use client";

type ExtraValue = Record<string, string>;

export function ExtraFieldsEditor({
  value,
  onChange,
}: {
  value: ExtraValue;
  onChange: (v: ExtraValue) => void;
}) {
  const entries = Object.entries(value);

  function updateEntry(index: number, key: string, val: string) {
    const next = [...entries];
    next[index] = [key, val];
    onChange(Object.fromEntries(next));
  }

  function removeEntry(index: number) {
    const next = entries.filter((_, i) => i !== index);
    onChange(Object.fromEntries(next));
  }

  function addEntry() {
    onChange({ ...value, "": "" });
  }

  return (
    <div>
      <label className="mb-1 block font-mono text-[0.6rem] uppercase tracking-wider text-text-dim">
        Custom Fields
      </label>
      <div className="space-y-2">
        {entries.map(([key, val], i) => (
          <div key={i} className="flex gap-2">
            <input
              value={key}
              onChange={(e) => updateEntry(i, e.target.value, val)}
              placeholder="field name"
              className="w-1/3 rounded-r8 border border-border bg-surface2 px-2 py-1.5 text-xs text-text outline-none focus:border-violet"
            />
            <input
              value={val}
              onChange={(e) => updateEntry(i, key, e.target.value)}
              placeholder="value"
              className="flex-1 rounded-r8 border border-border bg-surface2 px-2 py-1.5 text-xs text-text outline-none focus:border-violet"
            />
            <button
              type="button"
              onClick={() => removeEntry(i)}
              className="text-xs text-red hover:underline"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addEntry}
        className="mt-2 rounded-r8 border border-dashed border-border2 px-3 py-1 text-xs text-cyan2 transition-colors hover:border-cyan"
      >
        + Add field
      </button>
    </div>
  );
}
