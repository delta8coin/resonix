# Chakra Activation Song Builder - Testing Guide

## ✅ Integration Status: COMPLETE

All files successfully integrated into the Resonix/Frequency & Vibration Next.js app.

## Files Created

1. **lib/resonixChakraSynth.ts** - Complete Tone.js synthesis engine
2. **lib/wavExport.ts** - WAV file export utility
3. **components/ChakraActivator.tsx** - Full UI component
4. **app/chakra-activator/page.tsx** - Next.js page

## Navigation

- Added "Chakra Builder" link to main navigation bar
- Accessible at: `http://localhost:3000/chakra-activator`

## Testing Checklist

### Visual Tests (✓ Completed)
- [x] Page loads without errors
- [x] Gradient background (black → purple → black)
- [x] 7 chakra preview buttons with color-coded gradients
- [x] All UI controls render correctly
- [x] Navigation "Back to Lab" button present

### Functional Tests (To be performed in browser)

#### 1. Chakra Preview
- Click each of the 7 chakra buttons
- Should hear a 2-second tone at the corresponding frequency
- Button should show ring animation while playing
- Frequencies should match:
  - **Solfeggio**: 396, 417, 528, 639, 741, 852, 963 Hz
  - **Scientific**: 256, 288, 320, 341.3, 384, 426.7, 480 Hz

#### 2. Tuning System Toggle
- Switch between "Scientific" and "Solfeggio"
- Chakra frequencies should update in the UI
- Preview tones should play at new frequencies

#### 3. Instrument Selection
- Test all 5 instruments:
  - Piano (realistic with reverb)
  - Tibetan Singing Bowls (long, resonant)
  - Pure Sine Wave
  - Square Wave
  - Binaural Beats (shows extra controls)

#### 4. Binaural Beats Mode
- Select "Binaural Beats"
- Verify beat frequency slider appears (4-10 Hz)
- Verify carrier frequency slider appears (120-200 Hz)

#### 5. Duration Control
- Slide minutes per chakra (1-15)
- Verify "Total: X minutes" updates correctly (7 × minutes)

#### 6. Background Ambience
- Test all options: None, Rain, Ocean, Forest

#### 7. Volume Sweep Toggle
- Check/uncheck the volume sweep option

#### 8. Generate & Download
**Warning: This will generate a large audio file (30-90 minutes)**

- Click "Generate & Download"
- Progress bar should appear and update
- File should auto-download with format:
  `resonix-chakra-activation-[tuning]-[instrument]-[minutes]min.wav`
- Example: `resonix-chakra-activation-solfeggio-piano-7min.wav`

## Browser Compatibility

- ✅ **Chrome/Edge**: Full support expected
- ✅ **Firefox**: Full support expected
- ⚠️ **Safari**: Requires user interaction before audio (handled by Tone.start())

## Known Limitations

1. **File Size**: 7-15 min/chakra generates 49-105 minute files (~300-650 MB WAV)
2. **Generation Time**: Offline rendering may take 30-90 seconds for long tracks
3. **Memory**: Large generations require significant RAM

## Production Recommendations

1. Consider adding file size warning before generation
2. Add option to export as compressed MP3 (requires additional library)
3. Implement "Add to Resonix Timeline" feature (currently placeholder)
4. Add spectrogram preview using existing Resonix components

## Tone.js Features Used

- ✅ PolySynth for piano with custom ADSR
- ✅ FMSynth for Tibetan bowls with harmonicity
- ✅ Oscillators for sine/square/binaural
- ✅ MetalSynth for transition chimes
- ✅ Reverb & Chorus effects
- ✅ Noise + Filter for background ambience
- ✅ Offline rendering with progress callbacks
- ✅ Gain automation for volume sweep & crossfades

## Next Steps

To test the full generation:
1. Open browser to http://localhost:3000/chakra-activator
2. Start with minimal settings (1 min/chakra, Sine wave, No background)
3. Click "Generate & Download"
4. Verify 7-minute WAV downloads and plays correctly
5. Test with more complex settings (Piano, 7 min/chakra, Rain background)

---

**Server Status**: Running on http://localhost:3000
**No compilation errors detected**
**Ready for browser testing!**
