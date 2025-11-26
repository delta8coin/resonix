export default function Footer() {
  return (
    <footer className="py-20 px-[4%] border-t border-gray-800/50 mt-24">
      {/* Logo */}
      <div className="text-center mb-16">
        <img
          src="/logo.png"
          alt="MedBed Logo"
          className="mx-auto h-24 w-auto"
        />
      </div>

      {/* Tesla Quote */}
      <div className="text-center mb-16 py-20 bg-frequency-purple/5">
        <blockquote className="text-2xl md:text-3xl italic leading-relaxed text-gray-200 mb-5">
          &quot;If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.&quot;
        </blockquote>
        <cite className="text-lg text-frequency-purple font-semibold not-italic">
          — Nikola Tesla
        </cite>
      </div>

      {/* Trademarks Section */}
      <div className="text-center py-8 border-t border-gray-800/50">
        <h4 className="text-base text-gray-200 font-semibold mb-4">Trademarks</h4>
        <div className="space-y-2 text-gray-500 text-sm">
          <p>Resonix™</p>
          <p>MedBed Spa™</p>
          <p>MedBed Capsule™</p>
          <p>MedBed Pets™</p>
          <p>MedBed Hospital™</p>
          <p>MedBed Pad™</p>
        </div>
        <p className="text-gray-600 text-xs mt-6">
          © 2025 All trademarks are the property of their respective owners.
        </p>
      </div>

      {/* Copyright */}
      <div className="text-center pt-4 border-t border-gray-800/50">
        <p className="text-gray-600 text-xs">
          © {new Date().getFullYear()} Frequency & Vibration. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
