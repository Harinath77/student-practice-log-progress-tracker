export interface CourseDetail {
  curriculum: string[];
  learningOutcomes: string[];
  faqs: { question: string; answer: string }[];
  galleryGradients: string[];
}

export const courseDetailsMap: Record<number, CourseDetail> = {
  1: {
    curriculum: [
      "Week 1-4: Introduction to Guitar, Tuning, and Basic Strumming patterns",
      "Week 5-8: Essential Open Chords (G, C, D, Em, Am) & Transitioning",
      "Week 9-12: Intro to Barre Chords, Rhythm Control, and Metronome Practice",
      "Week 13-16: Fingerstyle Techniques, Travis Picking, and Basic Melodies",
      "Week 17-20: Major/Minor Scales, Improvisation Patterns & Chord Progressions",
      "Week 24: Final Performance Coaching, Recital Preparation & Certification"
    ],
    learningOutcomes: [
      "Master standard tuning and fundamental chord shapes.",
      "Play along with basic pop, rock, and folk rhythm structures.",
      "Read tablature and execute fingerstyle fingerpicking arrangements.",
      "Understand basic music theory and scale structures for soloing."
    ],
    faqs: [
      {
        question: "Do I need to bring my own guitar to class?",
        answer: "No. The academy provides premium acoustic and electric guitars for use during class hours. However, having a guitar at home for daily practice is highly recommended."
      },
      {
        question: "Can I choose between acoustic and electric guitar?",
        answer: "Yes! The curriculum covers the foundations for both, and you can focus on your preferred instrument style as you progress."
      }
    ],
    galleryGradients: [
      "from-amber-500 to-amber-900",
      "from-orange-600 to-neutral-900",
      "from-yellow-500 to-amber-950"
    ]
  },
  2: {
    curriculum: [
      "Week 1-6: Keyboard Geography, Proper Posture & Finger Numbering",
      "Week 7-12: Basic Sight-Reading, Five-Finger Patterns & Treble/Bass Clefs",
      "Week 13-18: Two-Hand Coordination, Major Scales & Primary Triads",
      "Week 19-24: Intermediate Classical Repertoire & Dynamic Markings",
      "Week 25-30: Chord Inversions, Arpeggios & Introduction to Pedal Work",
      "Week 36: ABRSM/Trinity Preparatory Pieces & Performance Mock Recital"
    ],
    learningOutcomes: [
      "Develop solid double-hand coordination and finger strength.",
      "Read sheet music in both Treble and Bass clefs.",
      "Perform classical pieces by Bach, Beethoven, and modern composers.",
      "Prepare for global certified board exams (ABRSM/Trinity)."
    ],
    faqs: [
      {
        question: "Is this course suitable for students with zero prior piano experience?",
        answer: "Yes, this course starts with intermediate training elements but we customize lessons if you are a beginner piano student. We also recommend our Keyboard course for absolute beginners."
      },
      {
        question: "Do you teach classical or pop music?",
        answer: "We teach both! The foundational mechanics are classical-oriented, while the application pieces include modern pop, jazz, and cinematic themes."
      }
    ],
    galleryGradients: [
      "from-indigo-500 to-indigo-900",
      "from-cyan-600 to-neutral-900",
      "from-blue-500 to-indigo-950"
    ]
  },
  3: {
    curriculum: [
      "Week 1-4: Introduction to Digital Keyboards & Voice/Style Selection",
      "Week 5-8: Basic Chords, Hand Positions & Auto-Accompaniment Settings",
      "Week 9-12: Rhythm Styles, Metronome Syncing & Left-hand Chord Triggers",
      "Week 13-16: Synthesizer Controls, Pitch Bend & Sound-Design Foundations",
      "Week 17-20: Reading Lead Sheets, Playing Pop/Rock Melodies with Backing Tracks",
      "Week 24: Arranger Techniques, MIDI Concepts & Solo Stage Recital"
    ],
    learningOutcomes: [
      "Navigate digital synthesizer settings, layering, and split modes.",
      "Play melody and auto-accompaniment simultaneously.",
      "Configure synth controls, modulations, and sound design patches.",
      "Read and perform standard lead sheets."
    ],
    faqs: [
      {
        question: "What is the difference between Piano and Keyboard classes?",
        answer: "Piano classes focus on acoustic piano touch, sight-reading, and classical technique. Keyboard classes focus on digital sounds, synthesizers, rhythms, and modern arranger accompaniment."
      },
      {
        question: "Which keyboard should I buy for practice?",
        answer: "We recommend a 61-key touch-sensitive keyboard (like Yamaha PSR series or Casio CT-X) to get started."
      }
    ],
    galleryGradients: [
      "from-violet-500 to-violet-900",
      "from-purple-600 to-neutral-900",
      "from-fuchsia-500 to-violet-950"
    ]
  },
  4: {
    curriculum: [
      "Week 1-8: Violin Hold, Bow Grip, Posture & Open String Bowing Mechanics",
      "Week 9-16: First Position Finger Placement, Intonation Exercises & Clefs",
      "Week 17-24: Basic Scales (G, D, A Major) & Simple Melodic Repertoire",
      "Week 25-32: Bowing Dynamics (Legato, Staccato, Slurs) & Tone Development",
      "Week 33-40: Intermediate Position Shifts, Vibrato Intro & Ensemble Play",
      "Week 48: String Recital Performance & Advanced Board Exam Piece Audit"
    ],
    learningOutcomes: [
      "Maintain ergonomically correct violin and bow postures.",
      "Execute high pitch accuracy (intonation) without fingerboard tape.",
      "Perform classical repertoire with varied bowing techniques.",
      "Understand music notation specific to violin string structures."
    ],
    faqs: [
      {
        question: "Is violin difficult to learn as an adult?",
        answer: "Violin has a steeper learning curve initially, but with daily practice and our step-by-step guidance, students of all ages achieve beautiful intonation."
      },
      {
        question: "What size violin do I need?",
        answer: "We assist in measuring your arm length to determine the correct violin size (usually 4/4 full size for adults, and smaller sizes for younger students)."
      }
    ],
    galleryGradients: [
      "from-red-500 to-red-950",
      "from-rose-600 to-neutral-900",
      "from-pink-500 to-rose-950"
    ]
  },
  5: {
    curriculum: [
      "Week 1-4: Drum Kit Anatomy, Stick Grip (Matched/Traditional) & Basic Rhythms",
      "Week 5-8: Single and Double Stroke Rudiments, Foot Control on Bass Pedal",
      "Week 9-12: The 8-Beat Grooves, Quarter/Eighth Note Fills & Syncopation",
      "Week 13-16: Limb Independence, Four-Way Coordination & Accent Notes",
      "Week 17-20: Play Along with Songs, Metric Modulations & Genre Beats (Rock, Pop, Jazz)",
      "Week 24: Solo Drum Performance, Tempo Precision Testing & Recital"
    ],
    learningOutcomes: [
      "Read drum notation and lead drum sheets.",
      "Perform precise 4-way limb coordination grooves.",
      "Maintain rock-solid tempo control alongside a metronome.",
      "Improvise dynamic fills and transition smoothly between beats."
    ],
    faqs: [
      {
        question: "Does the academy have acoustic or electronic drums?",
        answer: "We use professional acoustic drum kits in our sound-proofed rooms, giving you real drum rebound and feel, as well as electronic kits for specific volume control."
      },
      {
        question: "Will the drum practice be too loud?",
        answer: "All our drum cabins are professionally soundproofed and acoustically treated, ensuring a comfortable environment for both learners and observers."
      }
    ],
    galleryGradients: [
      "from-rose-500 to-rose-900",
      "from-orange-600 to-neutral-900",
      "from-red-500 to-rose-950"
    ]
  },
  6: {
    curriculum: [
      "Week 1-2: Understanding Voice Registers, Proper Posture & Vocal Cords health",
      "Week 3-4: Breath Control, Diaphragmatic Support & Warm-up Exercises",
      "Week 5-6: Pitch Accuracy, Interval Tuning, Scales & Ear Training",
      "Week 7-8: Vowel Shaping, Articulation & Tone Resonance Matching",
      "Week 9-10: Mic Technique, Dynamic Volume Control & Stage Performance Prep",
      "Week 12: Individual Vocal Performance Recital & Audio Recording Session"
    ],
    learningOutcomes: [
      "Sing with precise pitch alignment and ear-training accuracy.",
      "Utilize proper breath support to sustain long vocal notes safely.",
      "Increase vocal range and transition smoothly between chest and head registers.",
      "Navigate stage presence and professional microphone handling."
    ],
    faqs: [
      {
        question: "Can anyone learn to sing, or is it purely natural talent?",
        answer: "Anyone can learn to sing! Singing relies on muscles, breath support, and ear training, all of which can be developed with consistent practice and professional feedback."
      },
      {
        question: "What styles of singing do you teach?",
        answer: "We focus on Western Pop, Soul, Rock, and contemporary light classical training, customizable to the student's preferences."
      }
    ],
    galleryGradients: [
      "from-emerald-500 to-emerald-900",
      "from-teal-600 to-neutral-900",
      "from-green-500 to-emerald-950"
    ]
  }
};
