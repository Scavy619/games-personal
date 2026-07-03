"use client";

import { useState } from "react";
import { TabNav, type TabKey } from "@/components/layout/TabNav";
import { GamingTab } from "@/components/gaming/GamingTab";
import { PersonalTab } from "@/components/personal/PersonalTab";
import { JournalTab } from "@/components/journal/JournalTab";
import { EntertainmentTab } from "@/components/entertainment/EntertainmentTab";
import { ContactTab } from "@/components/contact/ContactTab";

export default function Home() {
  const [tab, setTab] = useState<TabKey>("gaming");

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <TabNav active={tab} onChange={setTab} />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 sm:px-6">
        {tab === "personal" && <PersonalTab />}
        {tab === "gaming" && <GamingTab />}
        {tab === "journal" && <JournalTab />}
        {tab === "entertainment" && <EntertainmentTab />}
        {tab === "contact" && <ContactTab />}
      </main>
    </div>
  );
}
