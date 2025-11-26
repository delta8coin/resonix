'use client';

import Hero from '@/components/Hero';
import ContentRow from '@/components/ContentRow';
import { hemiSyncContent, scienceOfSound, ancientWisdom } from '@/data/content';

export default function ResearchPage() {
  return (
    <>
      <Hero
        title="Research & Ancient Wisdom"
        description="Explore the scientific research and ancient wisdom behind sound healing. From Monroe Institute's Hemi-Sync technology to Tesla's understanding of vibration, discover the evidence supporting frequency-based healing."
        matchScore={97}
        year="2024"
      />

      <div className="relative z-10 -mt-[150px] pb-16">
        <ContentRow title="Hemi-Sync & Monroe Institute" items={hemiSyncContent} />
        <ContentRow title="Science of Sound" items={scienceOfSound} />
        <ContentRow title="Ancient Wisdom & Research" items={ancientWisdom} />
      </div>
    </>
  );
}
