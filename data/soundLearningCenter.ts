// Sound Learning Center - Comprehensive Educational Content

export interface LearningTopic {
  id: number;
  title: string;
  description: string;
  keyPoints: string[];
  resources: Resource[];
  relatedTopics?: string[];
}

export interface Resource {
  title: string;
  type: 'video' | 'article' | 'book' | 'course' | 'research';
  url?: string;
  author?: string;
  description: string;
}

export interface LearningSection {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  overview: string;
  topics: LearningTopic[];
}

// =============================================================================
// ACOUSTICS & PHYSICS OF SOUND
// =============================================================================
export const acousticsSection: LearningSection = {
  id: 'acoustics',
  title: 'Acoustics & Physics of Sound',
  subtitle: 'The Science of Sound Waves',
  icon: '🔊',
  overview: 'Acoustics is the branch of physics that deals with the study of mechanical waves in gases, liquids, and solids including vibration, sound, ultrasound, and infrasound. Understanding the physical properties of sound is fundamental to all other sound sciences.',
  topics: [
    {
      id: 1,
      title: 'Sound Wave Fundamentals',
      description: 'Sound is a mechanical wave that propagates through a medium by particle displacement. Unlike electromagnetic waves, sound requires a medium to travel through.',
      keyPoints: [
        'Sound waves are longitudinal waves with compressions and rarefactions',
        'Speed of sound varies by medium: ~343 m/s in air, ~1,480 m/s in water, ~5,120 m/s in steel',
        'Wavelength = Speed / Frequency (λ = v/f)',
        'Human hearing range: 20 Hz to 20,000 Hz',
        'Infrasound (<20 Hz) and ultrasound (>20,000 Hz) exist beyond human perception'
      ],
      resources: [
        {
          title: 'The Physics of Sound',
          type: 'course',
          author: 'MIT OpenCourseWare',
          description: 'Comprehensive physics course covering wave mechanics and acoustics',
          url: 'https://ocw.mit.edu/courses/physics/'
        },
        {
          title: 'Fundamentals of Acoustics',
          type: 'book',
          author: 'Kinsler, Frey, Coppens & Sanders',
          description: 'The definitive textbook on acoustics used in universities worldwide'
        },
        {
          title: 'Sound Waves Explained',
          type: 'video',
          description: 'Visual demonstration of how sound waves propagate through different media'
        }
      ],
      relatedTopics: ['Frequency & Pitch', 'Resonance', 'Wave Interference']
    },
    {
      id: 2,
      title: 'Frequency, Amplitude & Wavelength',
      description: 'The three fundamental properties that define any sound wave and determine what we hear.',
      keyPoints: [
        'Frequency (Hz) determines pitch - higher frequency = higher pitch',
        'Amplitude determines loudness - measured in decibels (dB)',
        'Wavelength is inversely proportional to frequency',
        'Middle C (C4) = 261.63 Hz with wavelength of ~1.3 meters',
        'Doubling frequency raises pitch by one octave'
      ],
      resources: [
        {
          title: 'The Physics Classroom - Sound Waves',
          type: 'article',
          description: 'Interactive lessons on frequency, wavelength, and amplitude relationships',
          url: 'https://www.physicsclassroom.com/class/sound'
        },
        {
          title: 'Understanding Audio',
          type: 'book',
          author: 'Daniel M. Thompson',
          description: 'Practical guide to sound principles for audio professionals'
        }
      ]
    },
    {
      id: 3,
      title: 'Resonance & Natural Frequencies',
      description: 'Every object has natural frequencies at which it vibrates most efficiently. When external vibrations match these frequencies, resonance occurs.',
      keyPoints: [
        'Resonance amplifies vibrations at specific frequencies',
        'Musical instruments are designed to resonate at desired frequencies',
        'The Tacoma Narrows Bridge collapse (1940) - famous resonance failure',
        'Human body organs have resonant frequencies (chest cavity: 50-60 Hz)',
        'Acoustic resonance is used in MRI machines and musical instruments'
      ],
      resources: [
        {
          title: 'Resonance: The Science of Sound',
          type: 'video',
          description: 'Documentary exploring resonance phenomena in nature and engineering'
        },
        {
          title: 'The Physics of Musical Instruments',
          type: 'book',
          author: 'Neville H. Fletcher & Thomas D. Rossing',
          description: 'Comprehensive analysis of how instruments produce sound through resonance'
        }
      ]
    },
    {
      id: 4,
      title: 'Harmonics & Overtones',
      description: 'Complex sounds contain multiple frequencies - a fundamental frequency plus harmonics that create timbre.',
      keyPoints: [
        'Harmonics are integer multiples of the fundamental frequency',
        'Timbre (tone color) is determined by harmonic content',
        'A violin and piano playing the same note sound different due to harmonics',
        'Fourier analysis decomposes complex sounds into component frequencies',
        'The harmonic series: f, 2f, 3f, 4f, 5f...'
      ],
      resources: [
        {
          title: 'Harmonics and Overtones',
          type: 'course',
          author: 'Coursera - Berklee',
          description: 'Music production course covering harmonic analysis'
        },
        {
          title: 'The Science of Sound',
          type: 'book',
          author: 'Thomas D. Rossing',
          description: 'Exploration of musical acoustics and psychoacoustics'
        }
      ]
    },
    {
      id: 5,
      title: 'Wave Interference & Beats',
      description: 'When two sound waves meet, they interfere with each other, creating patterns of constructive and destructive interference.',
      keyPoints: [
        'Constructive interference: waves add together, increasing amplitude',
        'Destructive interference: waves cancel out, reducing amplitude',
        'Beat frequency = |f1 - f2| (difference between two frequencies)',
        'Active noise cancellation uses destructive interference',
        'Room acoustics are heavily influenced by wave interference patterns'
      ],
      resources: [
        {
          title: 'Wave Interference Demonstration',
          type: 'video',
          description: 'Visual representation of constructive and destructive interference'
        },
        {
          title: 'Acoustic Absorbers and Diffusers',
          type: 'book',
          author: 'Trevor Cox & Peter D\'Antonio',
          description: 'Theory and applications of sound absorption and diffusion'
        }
      ]
    }
  ]
};

// =============================================================================
// PSYCHOACOUSTICS
// =============================================================================
export const psychoacousticsSection: LearningSection = {
  id: 'psychoacoustics',
  title: 'Psychoacoustics',
  subtitle: 'How We Perceive Sound',
  icon: '👂',
  overview: 'Psychoacoustics is the scientific study of sound perception and audiology - how humans perceive various sounds. It bridges the gap between the physical properties of sound and the psychological experience of hearing.',
  topics: [
    {
      id: 6,
      title: 'Auditory Perception Basics',
      description: 'The process of hearing involves complex transformations from sound waves to neural signals to conscious perception.',
      keyPoints: [
        'Sound waves are funneled by the outer ear (pinna) into the ear canal',
        'The eardrum (tympanic membrane) converts air pressure to mechanical vibration',
        'The cochlea converts mechanical energy to electrical nerve impulses',
        'Basilar membrane performs frequency analysis (tonotopic organization)',
        'Auditory cortex processes and interprets neural signals'
      ],
      resources: [
        {
          title: 'An Introduction to the Psychology of Hearing',
          type: 'book',
          author: 'Brian C.J. Moore',
          description: 'The definitive textbook on psychoacoustics and auditory perception'
        },
        {
          title: 'How We Hear',
          type: 'video',
          description: 'Animated explanation of the auditory system from outer ear to brain'
        },
        {
          title: 'Auditory Neuroscience',
          type: 'course',
          author: 'edX - MIT',
          description: 'Online course covering the neuroscience of hearing'
        }
      ]
    },
    {
      id: 7,
      title: 'Pitch Perception',
      description: 'How we perceive pitch is more complex than simple frequency detection, involving multiple mechanisms and cognitive processing.',
      keyPoints: [
        'Place theory: different frequencies stimulate different cochlear locations',
        'Temporal theory: neural firing patterns encode frequency information',
        'Missing fundamental: we perceive pitch even without the fundamental frequency',
        'Perfect pitch (absolute pitch) is rare and involves genetic/training factors',
        'Pitch is logarithmic: equal frequency ratios sound like equal intervals'
      ],
      resources: [
        {
          title: 'The Psychology of Music',
          type: 'book',
          author: 'Diana Deutsch',
          description: 'Comprehensive coverage of music perception including pitch'
        },
        {
          title: 'Pitch Perception Research',
          type: 'research',
          description: 'Collection of peer-reviewed studies on pitch perception mechanisms'
        }
      ]
    },
    {
      id: 8,
      title: 'Loudness & the Decibel Scale',
      description: 'Perceived loudness is not linearly related to sound intensity - our ears are incredibly sensitive and use logarithmic compression.',
      keyPoints: [
        'Decibels (dB) use logarithmic scale: 10 dB increase = 10x intensity',
        'Threshold of hearing: 0 dB SPL (20 micropascals)',
        'Normal conversation: ~60 dB; Pain threshold: ~120 dB',
        'Fletcher-Munson curves show frequency-dependent loudness perception',
        'Loudness perception varies with frequency (equal-loudness contours)'
      ],
      resources: [
        {
          title: 'Sound & Hearing',
          type: 'book',
          author: 'Lawrence E. Kinsler',
          description: 'Classic text on acoustic measurement and perception'
        },
        {
          title: 'Understanding Decibels',
          type: 'article',
          description: 'Practical guide to the decibel scale and its applications'
        }
      ]
    },
    {
      id: 9,
      title: 'Binaural Hearing & Spatial Localization',
      description: 'Using two ears allows us to locate sounds in 3D space through interaural time and level differences.',
      keyPoints: [
        'Interaural Time Difference (ITD): sounds reach ears at different times',
        'Interaural Level Difference (ILD): head shadow creates intensity differences',
        'Head-Related Transfer Function (HRTF) shapes sound based on direction',
        'The cocktail party effect: selective attention in noisy environments',
        'Binaural beats occur when different frequencies are presented to each ear'
      ],
      resources: [
        {
          title: 'Spatial Hearing',
          type: 'book',
          author: 'Jens Blauert',
          description: 'Comprehensive treatment of sound localization and spatial perception'
        },
        {
          title: 'Binaural Audio Research',
          type: 'research',
          description: 'Studies on 3D audio and virtual acoustics'
        }
      ]
    },
    {
      id: 10,
      title: 'Auditory Illusions',
      description: 'Like optical illusions, auditory illusions reveal how our brain constructs perception from sensory input.',
      keyPoints: [
        'Shepard tone: endlessly ascending/descending pitch illusion',
        'McGurk effect: visual information alters speech perception',
        'Deutsch\'s scale illusion: brain reorganizes melodic patterns',
        'Phantom words: repeated sounds create perceived word patterns',
        'Tritone paradox: same interval heard as ascending or descending'
      ],
      resources: [
        {
          title: 'Musical Illusions and Phantom Words',
          type: 'book',
          author: 'Diana Deutsch',
          description: 'Fascinating exploration of auditory illusions and their causes'
        },
        {
          title: 'Auditory Illusions Collection',
          type: 'video',
          description: 'Demonstrations of famous auditory illusions with explanations'
        }
      ]
    },
    {
      id: 11,
      title: 'Masking & Critical Bands',
      description: 'Sounds can mask other sounds, and our perception is organized into frequency bands with limited resolution.',
      keyPoints: [
        'Critical bands: frequency ranges processed together (~24 bands)',
        'Simultaneous masking: loud sounds hide quieter sounds',
        'Temporal masking: sounds can be masked before and after a loud sound',
        'MP3 compression exploits masking to reduce file size',
        'Critical bandwidth increases with frequency'
      ],
      resources: [
        {
          title: 'Psychoacoustics: Facts and Models',
          type: 'book',
          author: 'Hugo Fastl & Eberhard Zwicker',
          description: 'Technical reference on psychoacoustic phenomena and models'
        },
        {
          title: 'Audio Compression Explained',
          type: 'article',
          description: 'How psychoacoustic masking enables lossy audio compression'
        }
      ]
    }
  ]
};

// =============================================================================
// NEUROSCIENCE OF MUSIC
// =============================================================================
export const neuroscienceSection: LearningSection = {
  id: 'neuroscience',
  title: 'Neuroscience of Music',
  subtitle: 'Music & The Brain',
  icon: '🧠',
  overview: 'Music neuroscience explores how the brain processes, produces, and responds to music. It reveals music\'s profound effects on neural plasticity, emotion, memory, and cognition.',
  topics: [
    {
      id: 12,
      title: 'How the Brain Processes Music',
      description: 'Music processing involves multiple brain regions working together in a complex network.',
      keyPoints: [
        'Auditory cortex: primary processing of sound features',
        'Frontal cortex: expectations, patterns, and musical syntax',
        'Limbic system: emotional responses to music',
        'Motor cortex: rhythm processing and movement coordination',
        'Cerebellum: timing and rhythm coordination',
        'Music engages more brain areas simultaneously than any other activity'
      ],
      resources: [
        {
          title: 'This Is Your Brain on Music',
          type: 'book',
          author: 'Daniel J. Levitin',
          description: 'Accessible introduction to music neuroscience for general readers'
        },
        {
          title: 'Musicophilia',
          type: 'book',
          author: 'Oliver Sacks',
          description: 'Stories of music and the brain from the famous neurologist'
        },
        {
          title: 'The Neuroscience of Music',
          type: 'video',
          description: 'Documentary on brain imaging studies of musical processing'
        }
      ]
    },
    {
      id: 13,
      title: 'Music & Emotion',
      description: 'Music has a unique ability to evoke strong emotions through multiple neural mechanisms.',
      keyPoints: [
        'Music activates the brain\'s reward system (dopamine release)',
        'Chills/frisson occur at emotionally peak moments',
        'Major keys typically sound happy; minor keys sound sad (culturally influenced)',
        'Music can induce the full range of human emotions',
        'Emotional responses involve both brainstem reflexes and learned associations',
        'The amygdala and nucleus accumbens are key emotion-processing regions'
      ],
      resources: [
        {
          title: 'Music and Emotion',
          type: 'book',
          author: 'Patrik N. Juslin & John A. Sloboda',
          description: 'Comprehensive academic treatment of musical emotions'
        },
        {
          title: 'Sweet Anticipation',
          type: 'book',
          author: 'David Huron',
          description: 'How music creates meaning through expectation and prediction'
        },
        {
          title: 'The Emotional Power of Music',
          type: 'research',
          description: 'Meta-analysis of studies on music-induced emotions'
        }
      ]
    },
    {
      id: 14,
      title: 'Music & Memory',
      description: 'Music has powerful connections to memory, including the ability to evoke vivid autobiographical memories.',
      keyPoints: [
        'Music can trigger vivid autobiographical memories (reminiscence bump)',
        'Musical memories are preserved in Alzheimer\'s disease',
        'Songs are easier to memorize than spoken text',
        'Background music can aid or impair learning depending on context',
        'The hippocampus links music to episodic memories',
        'Melody and lyrics are stored in different brain systems'
      ],
      resources: [
        {
          title: 'Memory and Music',
          type: 'research',
          author: 'Various researchers',
          description: 'Collection of studies on music-evoked autobiographical memories'
        },
        {
          title: 'Alive Inside',
          type: 'video',
          description: 'Documentary on music therapy for dementia patients'
        }
      ]
    },
    {
      id: 15,
      title: 'Musical Training & Brain Plasticity',
      description: 'Learning music causes measurable changes in brain structure and function.',
      keyPoints: [
        'Musicians have larger corpus callosum connecting hemispheres',
        'Auditory cortex is larger in musicians',
        'Motor cortex shows enhanced representation of trained movements',
        'Benefits transfer to non-musical cognitive abilities',
        'Early musical training has the largest effects',
        'Even adult beginners show brain changes with practice'
      ],
      resources: [
        {
          title: 'The Musician\'s Brain',
          type: 'book',
          author: 'Eckart Altenmüller',
          description: 'Comprehensive review of neuroplasticity in musicians'
        },
        {
          title: 'Music Training and Cognitive Development',
          type: 'research',
          description: 'Studies on cognitive benefits of musical training in children'
        }
      ]
    },
    {
      id: 16,
      title: 'Rhythm & Motor Systems',
      description: 'Rhythm perception is tightly coupled with motor systems - we feel rhythm in our bodies.',
      keyPoints: [
        'Beat perception involves motor planning areas even without movement',
        'Basal ganglia are crucial for rhythm and timing',
        'Rhythm can entrain neural oscillations',
        'Humans have unique ability to synchronize to a beat',
        'Groove: the pleasurable urge to move to music',
        'Rhythm therapy can help Parkinson\'s patients with movement'
      ],
      resources: [
        {
          title: 'The Neuroscience of Rhythm',
          type: 'course',
          description: 'Online course covering rhythm perception and production'
        },
        {
          title: 'Rhythm and Movement',
          type: 'research',
          description: 'Studies on motor-auditory coupling in rhythm processing'
        }
      ]
    },
    {
      id: 17,
      title: 'Language & Music',
      description: 'Music and language share neural resources and developmental pathways.',
      keyPoints: [
        'Both use hierarchical syntax and complex sound patterns',
        'Broca\'s area processes both musical and linguistic syntax',
        'Musical training improves speech perception and language learning',
        'Tone languages rely on pitch processing similar to music',
        'Singing can help stroke patients recover speech (melodic intonation therapy)',
        'Infants use similar mechanisms to learn music and language'
      ],
      resources: [
        {
          title: 'Music, Language, and the Brain',
          type: 'book',
          author: 'Aniruddh D. Patel',
          description: 'Landmark book on music-language connections in the brain'
        },
        {
          title: 'The Music Instinct',
          type: 'video',
          description: 'PBS documentary on music cognition and evolution'
        }
      ]
    }
  ]
};

// =============================================================================
// MUSIC THEORY FUNDAMENTALS
// =============================================================================
export const musicTheorySection: LearningSection = {
  id: 'music-theory',
  title: 'Music Theory Fundamentals',
  subtitle: 'The Language of Music',
  icon: '🎼',
  overview: 'Music theory is the study of the practices and possibilities of music. It provides a framework for understanding how music works, from basic elements to complex compositions.',
  topics: [
    {
      id: 18,
      title: 'Pitch & Notation',
      description: 'The system for writing and reading musical pitches using staff notation.',
      keyPoints: [
        'Western music uses 12 pitches per octave (chromatic scale)',
        'Staff notation: 5 lines represent pitches',
        'Clefs (treble, bass, alto) set reference points',
        'Sharps (#) raise pitch; flats (b) lower pitch by a semitone',
        'A4 = 440 Hz (standard tuning reference)',
        'Octave equivalence: notes an octave apart share the same letter name'
      ],
      resources: [
        {
          title: 'Music Theory.net',
          type: 'course',
          description: 'Free interactive lessons on reading music notation',
          url: 'https://www.musictheory.net'
        },
        {
          title: 'Tonal Harmony',
          type: 'book',
          author: 'Stefan Kostka & Dorothy Payne',
          description: 'Standard university textbook for music theory'
        }
      ]
    },
    {
      id: 19,
      title: 'Scales & Modes',
      description: 'Scales are the building blocks of melody and harmony in music.',
      keyPoints: [
        'Major scale: W-W-H-W-W-W-H (whole and half steps)',
        'Natural minor: W-H-W-W-H-W-W',
        'Pentatonic scale: 5-note scale common in folk music worldwide',
        'Modes: Ionian, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian',
        'Blues scale adds "blue notes" for characteristic sound',
        'Different cultures use different scales (raga, maqam, etc.)'
      ],
      resources: [
        {
          title: 'The Complete Idiot\'s Guide to Music Theory',
          type: 'book',
          author: 'Michael Miller',
          description: 'Accessible introduction to music theory concepts'
        },
        {
          title: 'Scales and Modes Explained',
          type: 'video',
          description: 'Visual and audio demonstrations of all major scales and modes'
        }
      ]
    },
    {
      id: 20,
      title: 'Rhythm & Meter',
      description: 'The organization of music in time through patterns of strong and weak beats.',
      keyPoints: [
        'Beat: the basic unit of time in music',
        'Tempo: speed of the beat (measured in BPM)',
        'Meter: grouping of beats (4/4, 3/4, 6/8, etc.)',
        'Time signature: top number = beats per measure, bottom = beat value',
        'Syncopation: accents on unexpected beats',
        'Polyrhythm: multiple conflicting rhythms simultaneously'
      ],
      resources: [
        {
          title: 'Rhythm and Transforms',
          type: 'book',
          author: 'William A. Sethares',
          description: 'Mathematical approach to understanding rhythm'
        },
        {
          title: 'Rhythm Training',
          type: 'course',
          description: 'Interactive exercises for developing rhythm skills'
        }
      ]
    },
    {
      id: 21,
      title: 'Harmony & Chords',
      description: 'How multiple pitches combine to create harmony and chord progressions.',
      keyPoints: [
        'Intervals: the distance between two pitches',
        'Triads: 3-note chords (root, third, fifth)',
        'Seventh chords add another third on top',
        'Chord progressions create harmonic movement',
        'Roman numeral analysis: I, IV, V, vi, etc.',
        'Common progressions: I-IV-V-I, I-V-vi-IV, ii-V-I'
      ],
      resources: [
        {
          title: 'Hooktheory',
          type: 'course',
          description: 'Interactive tool for learning chord progressions',
          url: 'https://www.hooktheory.com'
        },
        {
          title: 'The Jazz Theory Book',
          type: 'book',
          author: 'Mark Levine',
          description: 'Comprehensive harmony text with jazz focus'
        }
      ]
    },
    {
      id: 22,
      title: 'Form & Structure',
      description: 'How music is organized into larger sections and complete compositions.',
      keyPoints: [
        'Phrase: musical sentence (typically 4-8 measures)',
        'Binary form (AB), Ternary form (ABA)',
        'Rondo: ABACADA...',
        'Sonata form: exposition, development, recapitulation',
        'Verse-chorus form in popular music',
        '12-bar blues: fundamental form in blues and rock'
      ],
      resources: [
        {
          title: 'Analyzing Classical Form',
          type: 'book',
          author: 'William E. Caplin',
          description: 'Detailed analysis of classical musical forms'
        },
        {
          title: 'Songwriting: Form & Structure',
          type: 'course',
          description: 'How to use form effectively in songwriting'
        }
      ]
    }
  ]
};

// =============================================================================
// MUSIC THERAPY & SOUND HEALING
// =============================================================================
export const musicTherapySection: LearningSection = {
  id: 'music-therapy',
  title: 'Music Therapy & Sound Healing',
  subtitle: 'Therapeutic Applications of Sound',
  icon: '💚',
  overview: 'Music therapy is an established health profession using music interventions to accomplish individualized goals. Sound healing encompasses various practices using sound vibrations for wellness.',
  topics: [
    {
      id: 23,
      title: 'Introduction to Music Therapy',
      description: 'Music therapy is a clinical and evidence-based practice using music to achieve therapeutic goals.',
      keyPoints: [
        'Board-certified music therapists (MT-BC) require specific training',
        'Goals include physical, emotional, cognitive, and social needs',
        'Both active (making music) and receptive (listening) methods used',
        'Individualized treatment plans based on assessment',
        'Used in hospitals, schools, mental health, and rehabilitation',
        'Evidence-based practice with growing research support'
      ],
      resources: [
        {
          title: 'American Music Therapy Association',
          type: 'article',
          description: 'Professional organization with resources and research',
          url: 'https://www.musictherapy.org'
        },
        {
          title: 'Music Therapy: An Introduction',
          type: 'book',
          author: 'William B. Davis et al.',
          description: 'Comprehensive textbook on music therapy practice'
        }
      ]
    },
    {
      id: 24,
      title: 'Neurologic Music Therapy',
      description: 'Application of music to cognitive, sensory, and motor dysfunctions due to neurologic disease.',
      keyPoints: [
        'Rhythmic Auditory Stimulation (RAS) for gait training',
        'Melodic Intonation Therapy (MIT) for aphasia',
        'Musical Neglect Training for attention disorders',
        'Evidence-based techniques developed from neuroscience',
        'Effective for stroke, Parkinson\'s, traumatic brain injury',
        'Rhythm can substitute for damaged motor timing systems'
      ],
      resources: [
        {
          title: 'Rhythm, Music, and the Brain',
          type: 'book',
          author: 'Michael H. Thaut',
          description: 'Scientific foundations of neurologic music therapy'
        },
        {
          title: 'Neurologic Music Therapy Training',
          type: 'course',
          description: 'Professional certification program in NMT techniques'
        }
      ]
    },
    {
      id: 25,
      title: 'Sound Healing Practices',
      description: 'Various traditions and modern practices using sound for healing and wellness.',
      keyPoints: [
        'Tibetan singing bowls create rich harmonics',
        'Tuning fork therapy uses specific frequencies',
        'Gong baths provide immersive sound experiences',
        'Vocal toning uses sustained vowel sounds',
        'Sound can induce relaxation response',
        'Limited scientific evidence but growing research interest'
      ],
      resources: [
        {
          title: 'The Healing Power of Sound',
          type: 'book',
          author: 'Mitchell L. Gaynor, MD',
          description: 'Oncologist\'s perspective on sound and healing'
        },
        {
          title: 'Sound Healing Research',
          type: 'research',
          description: 'Review of studies on various sound healing practices'
        }
      ]
    },
    {
      id: 26,
      title: 'Binaural Beats & Brainwave Entrainment',
      description: 'Using sound frequencies to influence brain activity patterns.',
      keyPoints: [
        'Binaural beats: different frequencies to each ear create perceived beat',
        'Frequency following response (FFR) entrains brain activity',
        'Delta (0.5-4 Hz): deep sleep; Theta (4-8 Hz): relaxation',
        'Alpha (8-13 Hz): calm alertness; Beta (13-30 Hz): active thinking',
        'Gamma (30+ Hz): higher cognition',
        'Research shows modest effects on anxiety and attention'
      ],
      resources: [
        {
          title: 'Binaural Beats Research Review',
          type: 'research',
          description: 'Meta-analysis of studies on binaural beat effects'
        },
        {
          title: 'Brainwave Entrainment Technology',
          type: 'article',
          description: 'Overview of audio-visual entrainment methods'
        }
      ]
    },
    {
      id: 27,
      title: 'Music for Anxiety & Stress Reduction',
      description: 'How music can reduce stress and anxiety through multiple mechanisms.',
      keyPoints: [
        'Music reduces cortisol and increases oxytocin',
        'Slow tempo (60-80 BPM) promotes relaxation',
        'Familiar music is more effective than unfamiliar',
        'Patient-selected music outperforms researcher-selected',
        'Music during medical procedures reduces anxiety',
        'Regular music listening can lower chronic stress'
      ],
      resources: [
        {
          title: 'Music and Medicine',
          type: 'research',
          description: 'Studies on music for perioperative anxiety'
        },
        {
          title: 'The Oxford Handbook of Music and the Brain',
          type: 'book',
          author: 'Michael H. Thaut & Donald A. Hodges',
          description: 'Comprehensive reference on music and brain research'
        }
      ]
    }
  ]
};

// =============================================================================
// AUDIO ENGINEERING
// =============================================================================
export const audioEngineeringSection: LearningSection = {
  id: 'audio-engineering',
  title: 'Audio Engineering',
  subtitle: 'Recording & Production Science',
  icon: '🎚️',
  overview: 'Audio engineering encompasses the technical aspects of recording, mixing, mastering, and reproducing sound. Understanding these principles helps in both creating and appreciating recorded music.',
  topics: [
    {
      id: 28,
      title: 'Digital Audio Fundamentals',
      description: 'How sound is converted to digital format and the implications for audio quality.',
      keyPoints: [
        'Sampling: measuring amplitude at regular intervals',
        'Sample rate: number of samples per second (44.1 kHz CD standard)',
        'Bit depth: precision of each sample (16-bit = 65,536 levels)',
        'Nyquist theorem: sample rate must be 2x highest frequency',
        'Aliasing occurs when frequencies exceed Nyquist limit',
        'Higher sample rate/bit depth = larger files, potentially better quality'
      ],
      resources: [
        {
          title: 'Digital Audio Explained',
          type: 'video',
          description: 'Clear explanation of sampling, bit depth, and digital audio'
        },
        {
          title: 'Principles of Digital Audio',
          type: 'book',
          author: 'Ken C. Pohlmann',
          description: 'Comprehensive technical reference on digital audio'
        }
      ]
    },
    {
      id: 29,
      title: 'Microphones & Recording',
      description: 'How microphones capture sound and techniques for quality recordings.',
      keyPoints: [
        'Dynamic mics: rugged, good for loud sources',
        'Condenser mics: sensitive, detailed high frequencies',
        'Ribbon mics: smooth, natural sound',
        'Polar patterns: cardioid, omnidirectional, figure-8',
        'Proximity effect: bass boost when close to mic',
        'Room acoustics significantly affect recordings'
      ],
      resources: [
        {
          title: 'Recording Engineer\'s Handbook',
          type: 'book',
          author: 'Bobby Owsinski',
          description: 'Practical guide to recording techniques'
        },
        {
          title: 'Microphone University',
          type: 'course',
          description: 'Free online resource for microphone education'
        }
      ]
    },
    {
      id: 30,
      title: 'Mixing Principles',
      description: 'The art and science of combining multiple audio tracks into a cohesive whole.',
      keyPoints: [
        'Balance: setting relative levels of tracks',
        'Panning: positioning sounds in stereo field',
        'EQ: adjusting frequency content of each track',
        'Compression: controlling dynamic range',
        'Reverb/delay: creating sense of space',
        'Automation: changing parameters over time'
      ],
      resources: [
        {
          title: 'Mixing Secrets for the Small Studio',
          type: 'book',
          author: 'Mike Senior',
          description: 'Practical mixing techniques for home studios'
        },
        {
          title: 'Pensado\'s Place',
          type: 'video',
          description: 'Video series with pro engineers discussing techniques'
        }
      ]
    },
    {
      id: 31,
      title: 'Sound Synthesis',
      description: 'Creating sounds electronically through various synthesis methods.',
      keyPoints: [
        'Subtractive synthesis: filter harmonics from oscillators',
        'FM synthesis: modulate frequency for complex timbres',
        'Wavetable synthesis: morph between waveforms',
        'Granular synthesis: manipulate tiny sound grains',
        'Physical modeling: simulate acoustic instruments',
        'ADSR envelope: Attack, Decay, Sustain, Release'
      ],
      resources: [
        {
          title: 'Synth Secrets',
          type: 'article',
          description: 'Classic Sound on Sound series on synthesis',
          url: 'https://www.soundonsound.com/series/synth-secrets'
        },
        {
          title: 'Welsh\'s Synthesizer Cookbook',
          type: 'book',
          author: 'Fred Welsh',
          description: 'Practical guide to programming synthesizer patches'
        }
      ]
    },
    {
      id: 32,
      title: 'Mastering & Delivery',
      description: 'The final stage of audio production before distribution.',
      keyPoints: [
        'Mastering optimizes audio for playback systems',
        'Loudness normalization: streaming platforms use LUFS',
        'Stereo width and imaging adjustments',
        'Final EQ and compression for cohesion',
        'Dithering when reducing bit depth',
        'Format considerations: streaming, vinyl, CD, etc.'
      ],
      resources: [
        {
          title: 'Mastering Audio',
          type: 'book',
          author: 'Bob Katz',
          description: 'The definitive book on mastering principles'
        },
        {
          title: 'iZotope Mastering Guide',
          type: 'article',
          description: 'Free comprehensive guide to modern mastering',
          url: 'https://www.izotope.com/en/learn/mastering.html'
        }
      ]
    }
  ]
};

// =============================================================================
// HISTORICAL & CULTURAL PERSPECTIVES
// =============================================================================
export const culturalSection: LearningSection = {
  id: 'cultural',
  title: 'Historical & Cultural Perspectives',
  subtitle: 'Sound Across Time & Cultures',
  icon: '🌍',
  overview: 'Sound and music have played crucial roles in human cultures throughout history. Understanding these traditions provides context for modern sound science and reveals universal aspects of human musicality.',
  topics: [
    {
      id: 33,
      title: 'Ancient Sound Traditions',
      description: 'How ancient civilizations understood and used sound for healing, ritual, and communication.',
      keyPoints: [
        'Pythagoras: music of the spheres and harmonic ratios',
        'Egyptian temples designed for specific acoustic effects',
        'Aboriginal Australian didgeridoo: oldest wind instrument (~40,000 years)',
        'Greek modes believed to affect character and emotion',
        'Vedic chanting traditions with precise pitch and rhythm',
        'Ancient Chinese music theory based on cosmic principles'
      ],
      resources: [
        {
          title: 'The Origins of Music',
          type: 'book',
          author: 'Nils L. Wallin et al.',
          description: 'Evolutionary and cultural origins of music'
        },
        {
          title: 'Sound and Ritual',
          type: 'research',
          description: 'Studies on acoustic properties of ancient sacred sites'
        }
      ]
    },
    {
      id: 34,
      title: 'World Music Systems',
      description: 'Different cultures have developed unique approaches to organizing musical sound.',
      keyPoints: [
        'Indian raga: melodic frameworks with specific moods and times',
        'Arabic maqam: microtonal scales with quarter-tones',
        'Gamelan: Indonesian ensemble with bronze instruments',
        'African polyrhythm: complex interlocking rhythmic patterns',
        'Just intonation vs. equal temperament',
        'Oral traditions vs. written notation'
      ],
      resources: [
        {
          title: 'Worlds of Music',
          type: 'book',
          author: 'Jeff Todd Titon',
          description: 'Introduction to ethnomusicology and world music'
        },
        {
          title: 'Smithsonian Folkways',
          type: 'article',
          description: 'Archive of world music recordings and educational materials',
          url: 'https://folkways.si.edu'
        }
      ]
    },
    {
      id: 35,
      title: 'Evolution of Music Technology',
      description: 'How technology has transformed the creation, recording, and distribution of music.',
      keyPoints: [
        '1877: Edison\'s phonograph - first sound recording',
        '1920s: Electrical recording and radio broadcasting',
        '1948: Magnetic tape enables editing and multitrack',
        '1983: Digital audio with compact disc',
        '1990s: Home recording revolution with DAWs',
        '2000s: Streaming transforms distribution'
      ],
      resources: [
        {
          title: 'Capturing Sound',
          type: 'book',
          author: 'Mark Katz',
          description: 'How technology has changed music'
        },
        {
          title: 'Sound Recording Technology History',
          type: 'video',
          description: 'Documentary on the evolution of recording'
        }
      ]
    },
    {
      id: 36,
      title: 'Sacred Sound & Chanting',
      description: 'The use of sound in spiritual and religious practices across cultures.',
      keyPoints: [
        'Gregorian chant: monophonic sacred music of Western church',
        'Om: sacred syllable in Hindu and Buddhist traditions',
        'Sufi dhikr: repetitive chanting for divine remembrance',
        'Overtone singing: Tuvan and Mongolian techniques',
        'Gospel music: African-American sacred tradition',
        'Kirtan: call-and-response devotional chanting'
      ],
      resources: [
        {
          title: 'Sacred Sound',
          type: 'book',
          author: 'Ted Andrews',
          description: 'Exploration of sound in spiritual traditions'
        },
        {
          title: 'The Mystery of Overtone Singing',
          type: 'video',
          description: 'Documentary on Tuvan throat singing techniques'
        }
      ]
    },
    {
      id: 37,
      title: 'Music & Society',
      description: 'How music reflects and shapes social, political, and cultural movements.',
      keyPoints: [
        'Music as protest: civil rights, anti-war movements',
        'National anthems and identity formation',
        'Subcultures and musical genres (punk, hip-hop, etc.)',
        'Music industry economics and artist sustainability',
        'Globalization: fusion and cultural exchange',
        'Music education and cognitive development'
      ],
      resources: [
        {
          title: 'Music in Everyday Life',
          type: 'book',
          author: 'Tia DeNora',
          description: 'Sociological study of music\'s role in daily life'
        },
        {
          title: 'The Social Impact of Music',
          type: 'research',
          description: 'Studies on music and social cohesion'
        }
      ]
    }
  ]
};

// =============================================================================
// EXPORT ALL SECTIONS
// =============================================================================
export const allSections: LearningSection[] = [
  acousticsSection,
  psychoacousticsSection,
  neuroscienceSection,
  musicTheorySection,
  musicTherapySection,
  audioEngineeringSection,
  culturalSection
];

// Quick stats for the learning center
export const learningCenterStats = {
  totalSections: allSections.length,
  totalTopics: allSections.reduce((acc, section) => acc + section.topics.length, 0),
  totalResources: allSections.reduce((acc, section) =>
    acc + section.topics.reduce((topicAcc, topic) =>
      topicAcc + topic.resources.length, 0), 0)
};
