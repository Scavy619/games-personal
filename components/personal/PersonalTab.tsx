"use client";

import { useEffect, useState } from "react";
import type {
  Profile,
  TimelineEvent,
  GalleryPhoto,
  InterestTag,
} from "@/lib/generated/prisma/client";

export function PersonalTab() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [interests, setInterests] = useState<InterestTag[]>([]);

  useEffect(() => {
    fetch("/api/profile").then((r) => r.json()).then(setProfile);
    fetch("/api/timeline").then((r) => r.json()).then((d) => setTimeline(d.events ?? []));
    fetch("/api/gallery").then((r) => r.json()).then((d) => setGallery(d.photos ?? []));
    fetch("/api/interests").then((r) => r.json()).then((d) => setInterests(d.tags ?? []));
  }, []);

  const initials = (profile?.displayName ?? "S").slice(0, 2).toUpperCase();

  return (
    <section>
      <div className="mb-6">
        <div className="font-mono text-[0.6rem] uppercase tracking-[4px] text-cyan">Personal</div>
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Hey, I&apos;m <span className="gradient-text">{profile?.displayName ?? "Scavy"}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <div className="card sticky top-20 self-start p-5 text-center">
          <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-border2 bg-gradient-to-br from-violet to-cyan font-display text-3xl font-bold text-white">
            {profile?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="font-display text-xl font-bold text-white">
            {profile?.displayName ?? "Scavy"}
          </div>
          {profile?.handle && (
            <div className="font-mono text-xs text-violet2">@{profile.handle}</div>
          )}
          {profile?.bio && <p className="mt-3 text-sm text-text-muted">{profile.bio}</p>}
        </div>

        <div className="space-y-5">
          <div className="card p-5">
            <h3 className="mb-3 font-display text-lg font-bold text-white">About Me</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                ["Location", profile?.location],
                ["Occupation", profile?.occupation],
                ["Gaming Since", profile?.gamingSince],
                ["Fav Genre", profile?.favGenre],
                ["Now Playing", profile?.nowPlaying],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <div className="font-mono text-[0.52rem] uppercase tracking-wider text-text-dim">
                    {label}
                  </div>
                  <div className="text-sm text-text">{value ?? "—"}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="mb-3 font-display text-lg font-bold text-white">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {interests.length === 0 && (
                <span className="font-mono text-xs text-text-dim">{"// none added yet"}</span>
              )}
              {interests.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full border border-border2 px-3 py-1 text-xs text-text"
                >
                  {tag.icon} {tag.label}
                </span>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="mb-3 font-display text-lg font-bold text-white">Timeline</h3>
            <div className="space-y-2">
              {timeline.length === 0 && (
                <span className="font-mono text-xs text-text-dim">{"// no events yet"}</span>
              )}
              {timeline.map((t) => (
                <div key={t.id} className="flex gap-3 text-sm">
                  <span
                    className="dot-glow mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet"
                    style={{ color: "var(--violet)" }}
                  />
                  <div>
                    <div className="font-mono text-xs text-violet2">{t.year}</div>
                    <div className="text-text-muted">{t.eventText}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="mb-3 font-display text-lg font-bold text-white">Gallery</h3>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {gallery.length === 0 && (
                <span className="font-mono text-xs text-text-dim">{"// no photos yet"}</span>
              )}
              {gallery.map((photo) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={photo.id}
                  src={photo.imageUrl}
                  alt={photo.caption ?? ""}
                  className="aspect-square rounded-r8 object-cover"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
