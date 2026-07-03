import { ContactForm } from "@/components/contact/ContactForm";
import { LiveChat } from "@/components/contact/LiveChat";
import { SocialLinks } from "@/components/contact/SocialLinks";
import { DonationButton } from "@/components/contact/DonationButton";

export function ContactTab() {
  return (
    <section>
      <div className="mb-6">
        <div className="font-mono text-[0.6rem] uppercase tracking-[4px] text-cyan">Contact</div>
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Contact &amp; <span className="gradient-text">Support</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <ContactForm />
          <SocialLinks />
        </div>
        <div className="space-y-5">
          <LiveChat />
          <DonationButton />
        </div>
      </div>
    </section>
  );
}
