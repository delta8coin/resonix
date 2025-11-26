'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductPage() {
  const [preOrderCount, setPreOrderCount] = useState(500);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* Product Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-800">
              <Image
                src="/medbed-pad.png"
                alt="Resonix MedBed Pad"
                fill
                className="object-contain p-8"
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-4">
              Resonix MedBed Pad
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              The world&apos;s first fully app-controlled biophoton + PEMF healing mat
            </p>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-5xl font-bold">$650</span>
                <span className="text-gray-500 line-through text-2xl">Regular Price</span>
              </div>
              <div className="bg-red-600 text-white px-4 py-2 rounded-lg inline-block mb-4">
                <span className="font-semibold">Pre-order: $499</span> – First {preOrderCount} units only
              </div>
            </div>

            {/* Key Features */}
            <div className="mb-8 p-6 bg-gray-900 rounded-xl border border-gray-800">
              <h3 className="text-xl font-semibold mb-4">Turn any bed into a real MedBed.</h3>
              <p className="text-gray-300 mb-4">While you sleep, the Resonix MedBed Pad bathes your body in:</p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Custom frequency tracks from the Resonix app (528 Hz, 174 Hz, 285 Hz, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Synchronized PEMF at brainwave and Schumann frequencies</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>1,024× amplified coherent biophoton field (independently measured)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Full 5G and EMF shielding for the deepest sleep possible</span>
                </li>
              </ul>
            </div>

            <p className="text-gray-400 mb-8">
              No subscriptions. No complicated controls. Just pair with your phone, choose your session, and wake up regenerated.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="flex-1 px-8 py-5 bg-red-600 text-white rounded-lg font-semibold text-lg uppercase tracking-wide transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-px">
                Pre-order – $499
              </button>
              <button className="flex-1 px-8 py-5 bg-transparent text-white border-2 border-white rounded-lg font-semibold text-lg uppercase tracking-wide transition-all hover:bg-white hover:text-black">
                Add to Cart – $650
              </button>
            </div>

            {/* Shipping Info */}
            <div className="text-sm text-gray-500 space-y-1">
              <p>Ships Q1 2026</p>
              <p>90-night guarantee • 3-year warranty</p>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mb-24">
          <h2 className="text-4xl font-semibold mb-8 text-center">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Physical Specs</h3>
              <ul className="space-y-2 text-gray-300">
                <li><span className="text-gray-500">Size:</span> 90 × 200 cm (fits any single/full mattress)</li>
                <li><span className="text-gray-500">Weight:</span> 6.8 kg</li>
                <li><span className="text-gray-500">Core:</span> 3.2 kg mineral matrix</li>
              </ul>
            </div>

            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">PEMF System</h3>
              <ul className="space-y-2 text-gray-300">
                <li><span className="text-gray-500">Coils:</span> 8 pure copper coils</li>
                <li><span className="text-gray-500">Frequency:</span> 1–30 Hz</li>
                <li><span className="text-gray-500">Intensity:</span> &lt;0.5 mT</li>
              </ul>
            </div>

            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Audio System</h3>
              <ul className="space-y-2 text-gray-300">
                <li><span className="text-gray-500">Transducers:</span> 4 × 40 mm acoustic</li>
                <li><span className="text-gray-500">Source:</span> Full Resonix app audio → body</li>
              </ul>
            </div>

            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Mineral Matrix Core</h3>
              <ul className="space-y-2 text-gray-300">
                <li><span className="text-gray-500">Shungite:</span> 40%</li>
                <li><span className="text-gray-500">Tourmaline:</span> 30%</li>
                <li><span className="text-gray-500">Quartz:</span> 20%</li>
                <li><span className="text-gray-500">Amethyst:</span> 10%</li>
                <li><span className="text-purple-400">Result:</span> 1,024× biophoton amplification</li>
              </ul>
            </div>

            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Connectivity & Power</h3>
              <ul className="space-y-2 text-gray-300">
                <li><span className="text-gray-500">Wireless:</span> Bluetooth 5.2</li>
                <li><span className="text-gray-500">Battery:</span> 10,000 mAh</li>
                <li><span className="text-gray-500">Runtime:</span> 30+ nights per charge</li>
                <li><span className="text-gray-500">Charging:</span> USB-C</li>
              </ul>
            </div>

            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Protection & Warranty</h3>
              <ul className="space-y-2 text-gray-300">
                <li><span className="text-gray-500">EMF Shield:</span> Full 5G/EMF (silver fabric)</li>
                <li><span className="text-gray-500">Warranty:</span> 3 years</li>
                <li><span className="text-gray-500">Trial:</span> 90-night sleep guarantee</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ or Additional Info */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-semibold mb-8 text-center">Why MedBed Pad?</h2>
          <div className="space-y-6">
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
              <h3 className="text-xl font-semibold mb-3">App-Controlled Healing</h3>
              <p className="text-gray-300">
                Connect via Bluetooth and choose from hundreds of healing frequencies. The pad automatically synchronizes PEMF pulses with your audio session for maximum coherence.
              </p>
            </div>

            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
              <h3 className="text-xl font-semibold mb-3">Scientifically Measured</h3>
              <p className="text-gray-300">
                Our mineral matrix core has been independently tested and shows 1,024× biophoton amplification compared to standard materials. This creates a coherent healing field while you sleep.
              </p>
            </div>

            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
              <h3 className="text-xl font-semibold mb-3">Complete EMF Protection</h3>
              <p className="text-gray-300">
                The integrated silver fabric layer provides full 5G and EMF shielding, ensuring your body can heal without electromagnetic interference during deep sleep.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-semibold mb-6">Ready to Transform Your Sleep?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <button className="flex-1 px-8 py-5 bg-red-600 text-white rounded-lg font-semibold text-lg uppercase tracking-wide transition-all hover:bg-red-700 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-px">
              Pre-order – $499
            </button>
            <button className="flex-1 px-8 py-5 bg-transparent text-white border-2 border-white rounded-lg font-semibold text-lg uppercase tracking-wide transition-all hover:bg-white hover:text-black">
              Add to Cart – $650
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-6">Ships Q1 2026 • 90-night guarantee • 3-year warranty</p>
        </div>
      </div>
    </div>
  );
}
