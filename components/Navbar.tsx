'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 px-[4%] flex items-center justify-between h-[68px] transition-all duration-400 ${
        scrolled
          ? 'bg-netflix-black'
          : 'bg-gradient-to-b from-black/70 via-black/10 to-transparent'
      }`}
    >
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold text-frequency-purple tracking-tight hover:opacity-80 transition-opacity">
          Frequency & Vibration
        </Link>
        <ul className="hidden md:flex gap-5 list-none">
          <li>
            <Link href="/" className="text-gray-200 text-sm font-medium hover:text-gray-400 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/frequencies" className="text-gray-200 text-sm font-medium hover:text-gray-400 transition-colors">
              Frequencies
            </Link>
          </li>
          <li>
            <Link href="/healing" className="text-gray-200 text-sm font-medium hover:text-gray-400 transition-colors">
              Healing
            </Link>
          </li>
          <li>
            <Link href="/meditation" className="text-gray-200 text-sm font-medium hover:text-gray-400 transition-colors">
              Meditation
            </Link>
          </li>
          <li>
            <Link href="/research" className="text-gray-200 text-sm font-medium hover:text-gray-400 transition-colors">
              Research
            </Link>
          </li>
          <li>
            <Link href="/learn" className="text-gray-200 text-sm font-medium hover:text-gray-400 transition-colors">
              Learn
            </Link>
          </li>
          <li>
            <Link href="/resonix" className="text-gray-200 text-sm font-medium hover:text-gray-400 transition-colors">
              Resonix
            </Link>
          </li>
          <li>
            <Link href="/library" className="text-gray-200 text-sm font-medium hover:text-gray-400 transition-colors">
              Library
            </Link>
          </li>
          <li>
            <Link href="/chakra-activator" className="text-gray-200 text-sm font-medium hover:text-gray-400 transition-colors">
              Chakra Builder
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex items-center gap-5 text-xl">
        <div className="cursor-pointer hover:opacity-70 transition-opacity">🔍</div>
        <div className="cursor-pointer hover:opacity-70 transition-opacity">🔔</div>
        <div className="cursor-pointer hover:opacity-70 transition-opacity">👤</div>
      </div>
    </nav>
  );
}
