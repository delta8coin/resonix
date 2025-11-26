import { SACRED_FREQUENCIES } from '../../utils/audioProcessing';

interface FrequencyControlsProps {
  onRetuneRequest: (targetHz: number, preservePitch: boolean) => void;
  onAnalyzeRequest: () => void;
  onBinauralAdd: () => void;
  isProcessing: boolean;
  hasAudio: boolean;
}

export default function FrequencyControls({
  onRetuneRequest,
  onAnalyzeRequest,
  onBinauralAdd,
  isProcessing,
  hasAudio
}: FrequencyControlsProps) {
  console.log('FrequencyControls rendered', { hasAudio, isProcessing });

  const frequencyDescriptions: Record<string, string> = {
    '174 Hz': 'Pain Relief',
    '285 Hz': 'Cellular Healing',
    '396 Hz': 'Liberation',
    '417 Hz': 'Change',
    '432 Hz': 'Cosmic',
    '440 Hz': 'Standard',
    '444 Hz': 'Crystal',
    '528 Hz': 'Love',
    '639 Hz': 'Connection',
    '741 Hz': 'Awakening',
    '852 Hz': 'Intuition',
    '963 Hz': 'Divine',
  };

  return (
    <div className="glass p-6 rounded-xl space-y-6 sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <svg className="w-6 h-6 text-netflix-red" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
          </svg>
          Sacred Frequencies
        </h2>
        <p className="text-sm text-gray-400">
          Transform your audio with healing vibrations
        </p>
      </div>

      {/* Analysis Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Analysis
        </h3>
        <button
          type="button"
          onClick={(e) => {
            console.log('Button clicked in FrequencyControls', { hasAudio, isProcessing });
            e.preventDefault();
            e.stopPropagation();
            onAnalyzeRequest();
          }}
          onMouseDown={() => console.log('Mouse down on button')}
          onMouseUp={() => console.log('Mouse up on button')}
          className={`
            w-full px-4 py-3 rounded-lg
            font-medium text-sm
            transition-all duration-200
            ${hasAudio && !isProcessing
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analyze Frequency
          </div>
        </button>
      </div>

      {/* Quick Retune Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Quick Retune
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(SACRED_FREQUENCIES).map(([name, hz]) => (
            <button
              key={name}
              onClick={() => onRetuneRequest(hz, true)}
              disabled={!hasAudio || isProcessing}
              className={`
                group relative px-3 py-3 rounded-lg
                font-medium text-xs
                transition-all duration-200
                ${hasAudio && !isProcessing
                  ? 'bg-gray-800 hover:bg-netflix-red text-gray-300 hover:text-white border border-gray-700 hover:border-netflix-red shadow-md hover:shadow-lg hover:scale-105'
                  : 'bg-gray-900 text-gray-600 border border-gray-800 cursor-not-allowed'
                }
              `}
              title={frequencyDescriptions[name]}
            >
              <div className="space-y-1">
                <div className="font-bold">{hz} Hz</div>
                <div className="text-[10px] opacity-70">
                  {frequencyDescriptions[name]}
                </div>
              </div>

              {/* Hover glow effect */}
              {hasAudio && !isProcessing && (
                <div className="absolute inset-0 rounded-lg bg-netflix-red/0 group-hover:bg-netflix-red/10 transition-all duration-200" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Options */}
      <div className="space-y-3 pt-4 border-t border-gray-700">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Advanced
        </h3>

        <button
          onClick={onBinauralAdd}
          disabled={!hasAudio || isProcessing}
          className={`
            w-full px-4 py-3 rounded-lg
            font-medium text-sm
            transition-all duration-200 flex items-center justify-center gap-2
            ${hasAudio && !isProcessing
              ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-netflix-red'
              : 'bg-gray-900 text-gray-600 border border-gray-800 cursor-not-allowed'
            }
          `}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Binaural Layer
        </button>

        <button
          onClick={() => onRetuneRequest(432, false)}
          disabled={!hasAudio || isProcessing}
          className={`
            w-full px-4 py-3 rounded-lg
            font-medium text-sm
            transition-all duration-200 flex items-center justify-center gap-2
            ${hasAudio && !isProcessing
              ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-purple-500'
              : 'bg-gray-900 text-gray-600 border border-gray-800 cursor-not-allowed'
            }
          `}
          title="Pitch shift only, no tempo preservation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          432 Hz (Pitch Only)
        </button>
      </div>

      {/* Info Section */}
      <div className="pt-4 border-t border-gray-700 space-y-2">
        <div className="text-xs text-gray-500 space-y-1">
          <p className="flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-netflix-red" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>
              Select a region on the waveform, then right-click for more options
            </span>
          </p>
          <p className="flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-netflix-red" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>
              Pure retune preserves tempo; Pitch only changes speed
            </span>
          </p>
        </div>
      </div>

      {/* Processing indicator */}
      {isProcessing && (
        <div className="flex items-center justify-center gap-2 text-netflix-red animate-pulse">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-medium">Processing...</span>
        </div>
      )}
    </div>
  );
}
