# Frequency & Vibration - Next.js Netflix-Style Platform

A modern, fully-centered Netflix-style streaming platform for healing frequencies, sound therapy, and consciousness exploration with **real images and YouTube video playback**.

## 🎯 What's Built

✅ **Complete rebuild** with properly centered, responsive layout
✅ **Real images** - All 40+ frequency healing images migrated
✅ **YouTube video playback** - Click any card to watch videos
✅ **Modal player** - Full-screen video experience
✅ **40+ frequency videos** with descriptions

## ✨ Features

### Working Now:
- **Netflix-Style Design**: Beautiful hero banners with real backdrop images
- **Video Cards**: Real poster images, match scores, hover effects
- **Click to Play**: Modal popup with embedded YouTube player
- **Auto-play**: Videos start automatically in modal
- **Full Content**: 40+ healing frequency videos with descriptions
- **Fully Responsive**: Perfect on mobile, tablet, desktop
- **Fast Performance**: Next.js 14 optimizations

### Content Categories:
1. **Solfeggio Frequencies** (396Hz, 417Hz, 528Hz, 639Hz, 741Hz, etc.)
2. **Healing Frequencies** (852Hz, 963Hz, 174Hz, 285Hz, Schumann Resonance)
3. **Brainwave States** (Alpha, Theta, Delta, Gamma waves)
4. **Hemi-Sync & Monroe Institute** (Focus 10, 12, 15, 21, Gateway Process)
5. **Science of Sound** (Cymatics, Resonance, Physics)
6. **Sound Healing Practices** (Singing Bowls, Crystal Therapy, Gongs)
7. **Ancient Wisdom** (Tesla, Pythagoras, Royal Rife, Dr. Emoto)

## 🚀 Getting Started

```bash
npm run dev
```

Visit **http://localhost:3000**

## 📸 How It Works

1. **Browse** - Scroll through beautiful Netflix-style rows
2. **Click** - Any movie card to open the modal
3. **Watch** - YouTube video plays automatically
4. **Learn** - Read detailed descriptions about each frequency

## 📁 Project Structure

```
├── app/
│   ├── page.tsx              # Home with all content (WORKING!)
│   ├── frequencies/          # Frequencies page
│   ├── healing/              # Healing page
│   ├── research/             # Research page
│   └── resonix/              # Frequency lab (coming soon)
├── components/
│   ├── Navbar.tsx            # Fixed navigation
│   ├── HeroMovie.tsx         # Hero with real images ✅
│   ├── MovieRow.tsx          # Scrolling rows ✅
│   ├── MovieCard.tsx         # Real poster images ✅
│   ├── Modal.tsx             # YouTube video player ✅
│   └── Footer.tsx            # Site footer
├── data/
│   └── movies.ts             # 40+ videos with real data ✅
├── types/
│   └── movie.ts              # TypeScript types
└── public/
    └── images/               # 80+ real images (backdrop + poster) ✅
```

## 🎬 Video Integration

Each frequency has:
- **Backdrop image** (1920x1080) for hero banners
- **Poster image** (500x750) for cards
- **YouTube video ID** for playback
- **Full description** of healing properties
- **Match score** (based on popularity/effectiveness)

### Example:
```typescript
{
  title: "528 Hz - DNA Repair & Miracles",
  overview: "The 'Love Frequency' that repairs DNA...",
  video_id: "NllYXuy8FMk",
  poster_path: "/images/1279330-poster.jpeg",
  backdrop_path: "/images/1279330-backdrop.jpeg",
  vote_average: 9.7
}
```

## ✅ What's Done

- [x] Next.js project setup
- [x] Core layout components
- [x] Real images (40+ videos, 80+ images)
- [x] YouTube video playback
- [x] Modal player
- [x] Responsive design
- [x] Home page with all content

## 🚧 Still To Do

- [ ] Port Frequencies page with real content
- [ ] Port Healing page with real content
- [ ] Port Research page with real content
- [ ] Migrate Resonix frequency lab (audio synthesizer)
- [ ] Migrate FrequencyLab page
- [ ] Migrate Library page

## 🎨 Tech Stack

- **Next.js 14.2.18** - React framework (Node 18 compatible)
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 3** - Styling
- **Next/Image** - Optimized images
- **YouTube Embed API** - Video playback

## 📝 Notes

- All 40+ videos from old site are migrated
- Images are optimized through Next/Image
- Videos auto-play in modal (muted by YouTube policy)
- Click "Watch on YouTube" to open in new tab

## 🌟 The Difference

**Old Site:**
- Left-justified layout ❌
- Hard to maintain
- Layout constantly breaking

**New Site:**
- Perfectly centered ✅
- Real images & videos ✅
- Click to play ✅
- Professional Netflix design ✅
- Easy to maintain ✅

---

**Open http://localhost:3000 and click any frequency card to watch healing videos!**

*"If you want to find the secrets of the universe, think in terms of energy, frequency and vibration." — Nikola Tesla*
