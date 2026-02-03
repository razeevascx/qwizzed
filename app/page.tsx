import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import FAQSection from "@/components/faq-section";
import Landing from "@/components/section/Landing";
import PrivacySecurity from "@/components/section/PrivacySecurity";

import Steps from "@/components/section/Steps";
import Features from "@/components/section/Features";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      <SiteHeader />

      <main className="flex flex-col bg-background text-foreground">
        <Landing />
        <Features />

        <Steps />

        <PrivacySecurity />

        <FAQSection />
      </main>

      <SiteFooter />
    </div>
  );
}
