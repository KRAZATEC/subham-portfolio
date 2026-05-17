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
import { OSDesktop } from "@/components/portfolio/OSDesktop";
import { AgentAssistant } from "@/components/portfolio/AgentAssistant";
import { CommandDashboard } from "@/components/portfolio/CommandDashboard";
import { NeuralUniverse } from "@/components/portfolio/NeuralUniverse";
import { MLOpsPipeline } from "@/components/portfolio/MLOpsPipeline";
import { ThreatSimulation } from "@/components/portfolio/ThreatSimulation";
import { TelemetrySection } from "@/components/portfolio/TelemetrySection";
import { LLMOrchestrator } from "@/components/portfolio/LLMOrchestrator";
import { GlobalNetworkMap } from "@/components/portfolio/GlobalNetworkMap";
import { SelfAwarenessEngine } from "@/components/portfolio/SelfAwarenessEngine";
import { AIMoodProvider } from "@/components/portfolio/AIMoodEngine";
import { IntelligenceFeed } from "@/components/portfolio/IntelligenceFeed";
import { RecruiterAnalysis } from "@/components/portfolio/RecruiterAnalysis";
import { DeveloperDNA } from "@/components/portfolio/DeveloperDNA";
import { ArchitectureReconstruction } from "@/components/portfolio/ArchitectureReconstruction";

export function PortfolioPage() {
  const [booted, setBooted] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [osOpen, setOsOpen] = useState(false);

  return (
    <AIMoodProvider>
      {!booted && <BootScreen onComplete={() => setBooted(true)} />}

      <div
        className="min-h-screen bg-[#050508] text-white"
        style={{ opacity: booted ? 1 : 0, transition: "opacity 0.8s ease" }}
      >
        <OSDesktop isOpen={osOpen} onClose={() => setOsOpen(false)} />
        <CommandDashboard />
        <AgentAssistant />
        <SelfAwarenessEngine />

        <Navigation
          onOpenTerminal={() => setTerminalOpen(true)}
          onOpenOS={() => setOsOpen(true)}
        />

        <main>
          <HeroSection onOpenTerminal={() => setTerminalOpen(true)} />
          <ExperienceSection />
          <ProjectsSection />
          <NeuralUniverse />
          <SkillsSection />
          <LLMOrchestrator />
          <MLOpsPipeline />
          <AboutSection />
          <ThreatSimulation />
          <TelemetrySection />
          <GlobalNetworkMap />
          <IntelligenceFeed />
          <ArchitectureReconstruction />
          <RecruiterAnalysis />
          <DeveloperDNA />
          <CertificationsSection />
          <ContactSection />
        </main>

        <Terminal isOpen={terminalOpen} onClose={() => setTerminalOpen(false)} />
      </div>
    </AIMoodProvider>
  );
}
