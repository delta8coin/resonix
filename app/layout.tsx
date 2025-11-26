import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Turn Any Bed Into A MedBed",
  description: "Create personalized 7-chakra frequency journeys with Resonix. Synthesize healing audio using Solfeggio frequencies, scientific tuning, binaural beats, and ambient soundscapes powered by Tone.js.",
  keywords: "chakra, frequency, vibration, sound healing, solfeggio, 432 Hz, 528 Hz, meditation, binaural beats, chakra activation, sound synthesis, tone.js, medbed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
