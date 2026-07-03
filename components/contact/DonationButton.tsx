export function DonationButton() {
  return (
    <div
      className="card p-5 text-center"
      style={{ background: "linear-gradient(135deg, rgba(245,158,11,.15), rgba(249,115,22,.1))" }}
    >
      <div className="mb-2 font-display text-lg font-bold text-white">Enjoying the site?</div>
      <p className="mb-3 text-sm text-text-muted">
        If you like what you see, consider buying me a coffee.
      </p>
      <a
        href="https://ko-fi.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-r12 bg-gradient-to-br from-gold to-orange px-8 py-3 font-display text-sm font-bold tracking-wide text-white"
      >
        ☕ Buy Me a Coffee
      </a>
    </div>
  );
}
