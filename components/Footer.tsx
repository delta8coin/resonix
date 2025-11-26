import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-20 px-[4%] border-t border-gray-800/50 mt-24">
      {/* Tesla Quote */}
      <div className="text-center mb-16 py-20 bg-frequency-purple/5">
        <blockquote className="text-2xl md:text-3xl italic leading-relaxed text-gray-200 mb-5">
          &quot;If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.&quot;
        </blockquote>
        <cite className="text-lg text-frequency-purple font-semibold not-italic">
          — Nikola Tesla
        </cite>
      </div>

      {/* Footer Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Frequencies */}
        <div>
          <h4 className="text-base text-gray-200 font-semibold mb-5">Frequencies</h4>
          <ul className="space-y-3 list-none">
            <li>
              <Link href="/frequencies/solfeggio" className="text-gray-500 text-sm hover:text-gray-200 transition-colors">
                Solfeggio Guide
              </Link>
            </li>
            <li>
              <Link href="/frequencies/432hz" className="text-gray-500 text-sm hover:text-gray-200 transition-colors">
                432 Hz Music
              </Link>
            </li>
            <li>
              <Link href="/frequencies/binaural" className="text-gray-500 text-sm hover:text-gray-200 transition-colors">
                Binaural Beats
              </Link>
            </li>
            <li>
              <Link href="/frequencies/faq" className="text-gray-500 text-sm hover:text-gray-200 transition-colors">
                Frequency FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Healing */}
        <div>
          <h4 className="text-base text-gray-200 font-semibold mb-5">Healing</h4>
          <ul className="space-y-3 list-none">
            <li>
              <Link href="/healing/sound-therapy" className="text-gray-500 text-sm hover:text-gray-200 transition-colors">
                Sound Therapy
              </Link>
            </li>
            <li>
              <Link href="/healing/chakra" className="text-gray-500 text-sm hover:text-gray-200 transition-colors">
                Chakra Healing
              </Link>
            </li>
            <li>
              <Link href="/healing/meditation" className="text-gray-500 text-sm hover:text-gray-200 transition-colors">
                Meditation Guide
              </Link>
            </li>
            <li>
              <Link href="/healing/sacred-geometry" className="text-gray-500 text-sm hover:text-gray-200 transition-colors">
                Sacred Geometry
              </Link>
            </li>
          </ul>
        </div>

        {/* Research */}
        <div>
          <h4 className="text-base text-gray-200 font-semibold mb-5">Research</h4>
          <ul className="space-y-3 list-none">
            <li>
              <Link href="/research/studies" className="text-gray-500 text-sm hover:text-gray-200 transition-colors">
                Research Studies
              </Link>
            </li>
            <li>
              <Link href="/research/hemi-sync" className="text-gray-500 text-sm hover:text-gray-200 transition-colors">
                Hemi-Sync Guide
              </Link>
            </li>
            <li>
              <Link href="/research/monroe" className="text-gray-500 text-sm hover:text-gray-200 transition-colors">
                Monroe Institute
              </Link>
            </li>
            <li>
              <Link href="/research/cymatics" className="text-gray-500 text-sm hover:text-gray-200 transition-colors">
                Cymatics
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-base text-gray-200 font-semibold mb-5">Company</h4>
          <ul className="space-y-3 list-none">
            <li>
              <Link href="/about" className="text-gray-500 text-sm hover:text-gray-200 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-500 text-sm hover:text-gray-200 transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-gray-500 text-sm hover:text-gray-200 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-gray-500 text-sm hover:text-gray-200 transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center pt-8 border-t border-gray-800/50">
        <p className="text-gray-600 text-xs">
          © {new Date().getFullYear()} Frequency & Vibration. All rights reserved.
        </p>
        <p className="text-gray-600 text-xs mt-2">
          2025 Trademarks: MedBed™ Spa • MedBed™ Capsule • MedBed™ Pets
        </p>
      </div>
    </footer>
  );
}
