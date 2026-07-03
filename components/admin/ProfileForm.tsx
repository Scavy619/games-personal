"use client";

import { useEffect, useState } from "react";
import type {
  Profile,
  TimelineEvent,
  GalleryPhoto,
  InterestTag,
  SocialLink,
} from "@/lib/generated/prisma/client";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

const inputClass =
  "w-full rounded-r8 border border-border bg-surface2 px-3 py-2 text-sm text-text outline-none focus:border-violet";
const labelClass = "mb-1 block font-mono text-[0.6rem] uppercase tracking-wider text-text-dim";

export function ProfileForm() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [interests, setInterests] = useState<InterestTag[]>([]);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const [newYear, setNewYear] = useState("");
  const [newEvent, setNewEvent] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newPlatform, setNewPlatform] = useState("");
  const [newUrl, setNewUrl] = useState("");

  function loadAll() {
    fetch("/api/profile").then((r) => r.json()).then((d) => setProfile(d ?? {}));
    fetch("/api/timeline").then((r) => r.json()).then((d) => setTimeline(d.events ?? []));
    fetch("/api/gallery").then((r) => r.json()).then((d) => setGallery(d.photos ?? []));
    fetch("/api/interests").then((r) => r.json()).then((d) => setInterests(d.tags ?? []));
    fetch("/api/social-links").then((r) => r.json()).then((d) => setLinks(d.links ?? []));
  }

  useEffect(loadAll, []);

  function set<K extends keyof Profile>(key: K, val: Profile[K]) {
    setProfile((p) => ({ ...p, [key]: val }));
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  }

  async function addTimeline() {
    if (!newYear || !newEvent) return;
    await fetch("/api/timeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ year: Number(newYear), eventText: newEvent }),
    });
    setNewYear("");
    setNewEvent("");
    loadAll();
  }

  async function deleteTimeline(id: string) {
    await fetch(`/api/timeline/${id}`, { method: "DELETE" });
    loadAll();
  }

  async function addInterest() {
    if (!newInterest.trim()) return;
    await fetch("/api/interests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newInterest.trim() }),
    });
    setNewInterest("");
    loadAll();
  }

  async function deleteInterest(id: string) {
    await fetch(`/api/interests/${id}`, { method: "DELETE" });
    loadAll();
  }

  async function addPhoto(url: string) {
    await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: url }),
    });
    loadAll();
  }

  async function deletePhoto(id: string) {
    await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    loadAll();
  }

  async function addLink() {
    if (!newPlatform.trim() || !newUrl.trim()) return;
    await fetch("/api/social-links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform: newPlatform.trim(), url: newUrl.trim() }),
    });
    setNewPlatform("");
    setNewUrl("");
    loadAll();
  }

  async function deleteLink(id: string) {
    await fetch(`/api/social-links/${id}`, { method: "DELETE" });
    loadAll();
  }

  return (
    <div className="max-w-2xl space-y-6">
      <form onSubmit={saveProfile} className="card grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
        <div className="sm:col-span-2 flex justify-center">
          <ImageUploadField
            label="Avatar"
            value={profile.avatarUrl}
            onChange={(url) => set("avatarUrl", url)}
            kind="avatars"
          />
        </div>
        <div>
          <label className={labelClass}>Display Name *</label>
          <input
            required
            value={profile.displayName ?? ""}
            onChange={(e) => set("displayName", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Handle</label>
          <input
            value={profile.handle ?? ""}
            onChange={(e) => set("handle", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Bio</label>
          <textarea
            rows={3}
            value={profile.bio ?? ""}
            onChange={(e) => set("bio", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input
            value={profile.location ?? ""}
            onChange={(e) => set("location", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Occupation</label>
          <input
            value={profile.occupation ?? ""}
            onChange={(e) => set("occupation", e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Gaming Since</label>
          <input
            value={profile.gamingSince ?? ""}
            onChange={(e) => set("gamingSince", Number(e.target.value) || null)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Favourite Genre</label>
          <input
            value={profile.favGenre ?? ""}
            onChange={(e) => set("favGenre", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Now Playing</label>
          <input
            value={profile.nowPlaying ?? ""}
            onChange={(e) => set("nowPlaying", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-r8 bg-gradient-to-br from-violet to-indigo-600 px-6 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
          {savedMsg && <span className="text-xs text-green">Saved ✓</span>}
        </div>
      </form>

      <div className="card p-4">
        <h3 className="mb-3 font-display text-lg font-bold text-white">Timeline</h3>
        <div className="mb-3 space-y-1">
          {timeline.map((t) => (
            <div key={t.id} className="flex items-center justify-between text-sm">
              <span>
                <span className="font-mono text-violet2">{t.year}</span> — {t.eventText}
              </span>
              <button onClick={() => deleteTimeline(t.id)} className="text-xs text-red">
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Year"
            value={newYear}
            onChange={(e) => setNewYear(e.target.value)}
            className={`${inputClass} w-24`}
          />
          <input
            placeholder="Event"
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            className={inputClass}
          />
          <button onClick={addTimeline} className="whitespace-nowrap text-xs text-cyan2">
            + Add
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="mb-3 font-display text-lg font-bold text-white">Interests</h3>
        <div className="mb-3 flex flex-wrap gap-2">
          {interests.map((tag) => (
            <span
              key={tag.id}
              className="flex items-center gap-1 rounded-full border border-border2 px-3 py-1 text-xs text-text"
            >
              {tag.label}
              <button onClick={() => deleteInterest(tag.id)} className="text-red">
                ✕
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            placeholder="New interest"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            className={inputClass}
          />
          <button onClick={addInterest} className="whitespace-nowrap text-xs text-cyan2">
            + Add
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="mb-3 font-display text-lg font-bold text-white">Photo Gallery</h3>
        <div className="mb-3 flex flex-wrap gap-3">
          {gallery.map((photo) => (
            <div key={photo.id} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.imageUrl} alt="" className="h-20 w-20 rounded-r8 object-cover" />
              <button
                onClick={() => deletePhoto(photo.id)}
                className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs text-red"
              >
                ✕
              </button>
            </div>
          ))}
          <ImageUploadField label="" value={null} onChange={addPhoto} kind="gallery" />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="mb-3 font-display text-lg font-bold text-white">Social Links</h3>
        <div className="mb-3 space-y-1">
          {links.map((link) => (
            <div key={link.id} className="flex items-center justify-between text-sm">
              <span>
                <span className="text-violet2">{link.platform}</span> — {link.url}
              </span>
              <button onClick={() => deleteLink(link.id)} className="text-xs text-red">
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Platform"
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            className={`${inputClass} w-32`}
          />
          <input
            placeholder="URL"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            className={inputClass}
          />
          <button onClick={addLink} className="whitespace-nowrap text-xs text-cyan2">
            + Add
          </button>
        </div>
      </div>
    </div>
  );
}
