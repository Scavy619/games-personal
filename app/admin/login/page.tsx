"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Login failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm p-6">
        <div className="mb-1 font-mono text-[0.6rem] uppercase tracking-[4px] text-cyan">
          Restricted
        </div>
        <h1 className="mb-5 font-display text-2xl font-bold text-white">
          <span className="gradient-text">Admin</span> Login
        </h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          className="mb-3 w-full rounded-r8 border border-border bg-surface2 px-3 py-2 text-sm text-text outline-none focus:border-violet"
        />
        {error && <div className="mb-3 text-xs text-red">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-r8 bg-gradient-to-br from-violet to-indigo-600 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
