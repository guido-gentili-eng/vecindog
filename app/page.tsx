import Hero from '@/components/Hero';
import ActionCards from '@/components/ActionCards';
import HowItWorks from '@/components/HowItWorks';
import VolvieronACasa from '@/components/VolvieronACasa';
import TrustSection from '@/components/TrustSection';
import AdSlot from '@/components/AdSlot';

export default function HomePage() {
  return (
    <div className="pb-12 pt-3 md:pb-16 md:pt-5">
      {/* Bloque de decisión: hero + 4 acciones como una sola pantalla */}
      <div className="space-y-4 md:space-y-5">
        <Hero />
        <ActionCards />
      </div>

      {/* Resto de la home (más respiro entre secciones) */}
      <div className="mt-12 space-y-12 md:mt-20 md:space-y-20">
        <HowItWorks />

        {/* ── Slot publicitario entre secciones ── */}
        <AdSlot variant="leaderboard" />

        <VolvieronACasa />

        <TrustSection />
      </div>
    </div>
  );
}
