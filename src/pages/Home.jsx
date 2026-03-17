import { useEffect, useState } from "react";

import Hero from "../sections/Hero";
import PromoSection from "../sections/PromoSection";
import Bio from "../sections/Bio";
import NoteSection from "../sections/NoteSection";

function Home() {
  return (
    <>
      <Hero />

      <PromoSection />

      <NoteSection
        noteId={2}
        title="Bergamotto di Calabria"
        subtitle="Vibrazioni agrumate e freschezza senza tempo. Scopri l'eleganza luminosa del Bergamotto autentico."
      />

      <Bio />
    </>
  );
}

export default Home;
