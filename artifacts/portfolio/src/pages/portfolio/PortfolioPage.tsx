import { useState } from "react";
import { BootScreen } from "@/components/portfolio/BootScreen";
import { Navigation } from "@/components/portfolio/Navigation";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { ExperienceSection } from "@/components/portfolio/ExperienceSection";
import { ProjectsSection } from "@/components/portfolio/ProjectsSection";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import { AboutSection } from "@/components/portfolio/AboutSection";
import { CertificationsSection } from "@/components/portfolio/CertificationsSection";
import { ContactSection } from "@/components/portfolio/ContactSection";
import { Terminal } from "@/components/portfolio/Terminal";

export function PortfolioPage() {
  const [booted, setBooted] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);

  return (
    <>
      {!booted && <BootScreen onComplete={() => setBooted(true)} />}

      <div
        className="min-h-screen bg-[#050508] text-white"
        style={{ opacity: booted ? 1 : 0, transition: "opacity 0.8s ease" }}
      >
        <Navigation onOpenTerminal={() => setTerminalOpen(true)} />

        <main>
          <HeroSection onOpenTerminal={() => setTerminalOpen(true)} />
          <ExperienceSection />
          <ProjectsSection />
          <SkillsSection />
          <AboutSection />
          <CertificationsSection />
          <ContactSection />
        </main>

        <Terminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
      </div>
    </>
  );
}
