export interface ExerciseItem {
  id: string;
  name: string;
  category: 'strength' | 'core' | 'cardio' | 'hiit' | 'yoga';
  categoryLabel: string;
  targetMuscle: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  difficultyLabel: string;
  defaultDurationSeconds: number;
  defaultSets: number;
  caloriesPerMinute: number;
  description: string;
  instructions: string[];
  tips: string[];
}

export const EXERCISES: ExerciseItem[] = [
  {
    id: 'pompes-classiques',
    name: 'Standard Push-Ups',
    category: 'strength',
    categoryLabel: 'Strength',
    targetMuscle: 'Chest, Triceps, Shoulders',
    difficulty: 'intermediate',
    difficultyLabel: 'Intermediate',
    defaultDurationSeconds: 45,
    defaultSets: 3,
    caloriesPerMinute: 9,
    description: 'The classic bodyweight upper body exercise for chest and triceps power.',
    instructions: [
      'Place hands on the floor shoulder-width apart, body in a straight plank line.',
      'Bend your elbows in a controlled motion until your chest nearly touches the floor.',
      'Push firmly through your palms to return to the top position without locking elbows.'
    ],
    tips: [
      'Keep your core tight and glutes engaged throughout the entire movement.',
      'Do not let your lower back sag or arch.'
    ]
  },
  {
    id: 'squats-poids-du-corps',
    name: 'Bodyweight Squats',
    category: 'strength',
    categoryLabel: 'Strength',
    targetMuscle: 'Quadriceps, Glutes, Hamstrings',
    difficulty: 'beginner',
    difficultyLabel: 'Beginner',
    defaultDurationSeconds: 45,
    defaultSets: 3,
    caloriesPerMinute: 8,
    description: 'The fundamental bodyweight movement to tone your legs and glutes at home.',
    instructions: [
      'Stand with feet shoulder-width apart, toes pointing slightly outward.',
      'Hinge hips backward as if sitting down into a low chair.',
      'Lower until your thighs are parallel to the floor, then drive through heels to rise.'
    ],
    tips: [
      'Keep weight balanced on your heels and chest lifted tall.',
      'Ensure knees track in line with your toes, never caving inward.'
    ]
  },
  {
    id: 'gainage-planche',
    name: 'Standard Plank',
    category: 'core',
    categoryLabel: 'Core & Abs',
    targetMuscle: 'Transverse Abdominis, Rectus Abdominis, Lower Back',
    difficulty: 'beginner',
    difficultyLabel: 'Beginner',
    defaultDurationSeconds: 60,
    defaultSets: 3,
    caloriesPerMinute: 6,
    description: 'Isometric core hold for a flat, stable midsection and protected spine.',
    instructions: [
      'Rest on your forearms and toes with elbows directly below shoulders.',
      'Maintain a straight line from ankles through hips to your shoulders.',
      'Contract your abdominal muscles firmly and breathe evenly while holding.'
    ],
    tips: [
      'Do not pike your hips up or allow your lower back to dip.',
      'Push the ground away with your forearms to engage upper back stability.'
    ]
  },
  {
    id: 'fentes-alternées',
    name: 'Alternating Forward Lunges',
    category: 'strength',
    categoryLabel: 'Strength',
    targetMuscle: 'Quadriceps, Gluteus Maximus, Balance',
    difficulty: 'intermediate',
    difficultyLabel: 'Intermediate',
    defaultDurationSeconds: 45,
    defaultSets: 3,
    caloriesPerMinute: 8,
    description: 'Superb exercise for sculpting legs, hips, and dynamic pelvic balance.',
    instructions: [
      'Stand upright, step forward with one leg into a generous stride.',
      'Lower hips until both front and back knees form 90-degree angles.',
      'Push off the front heel to return to start, then repeat on the opposite leg.'
    ],
    tips: [
      'Front knee should stay directly above ankle, not extending past toes.',
      'Keep torso upright and shoulders relaxed.'
    ]
  },
  {
    id: 'burpees-cardio',
    name: 'Dynamic Burpees',
    category: 'hiit',
    categoryLabel: 'HIIT Fat Burn',
    targetMuscle: 'Full Body, Cardiovascular, Explosive Power',
    difficulty: 'advanced',
    difficultyLabel: 'Advanced',
    defaultDurationSeconds: 40,
    defaultSets: 4,
    caloriesPerMinute: 14,
    description: 'The ultimate calorie scorcher to boost metabolic rate and athletic endurance.',
    instructions: [
      'Stand tall, drop into a deep squat and place palms flat on the floor.',
      'Jump your feet backward into a strong push-up plank position.',
      'Jump feet forward to hands and explode upward with hands overhead.'
    ],
    tips: [
      'Land softly on the balls of your feet with knees relaxed.',
      'Maintain a steady pace rather than burning out in the first 10 seconds.'
    ]
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climbers',
    category: 'cardio',
    categoryLabel: 'Cardio',
    targetMuscle: 'Dynamic Core, Shoulders, Cardiovascular',
    difficulty: 'intermediate',
    difficultyLabel: 'Intermediate',
    defaultDurationSeconds: 45,
    defaultSets: 3,
    caloriesPerMinute: 11,
    description: 'Fast-paced running plank that hammers your abs while elevating heart rate.',
    instructions: [
      'Start in a high plank position with hands planted under shoulders.',
      'Drive one knee vigorously toward your chest, then quickly switch legs.',
      'Maintain a rhythmic, running motion with minimal hip bounce.'
    ],
    tips: [
      'Keep hips level with shoulders and avoid piking up into the air.',
      'Breathe rhythmically with each knee drive.'
    ]
  },
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    category: 'cardio',
    categoryLabel: 'Cardio',
    targetMuscle: 'Calves, Shoulders, Aerobic Engine',
    difficulty: 'beginner',
    difficultyLabel: 'Beginner',
    defaultDurationSeconds: 60,
    defaultSets: 3,
    caloriesPerMinute: 9,
    description: 'Ideal aerobic warm-up to elevate body temperature and burn quick calories.',
    instructions: [
      'Stand feet together with arms resting by your sides.',
      'Jump feet wide while swinging arms up overhead until hands nearly touch.',
      'Immediately reverse the motion and return to starting position smoothly.'
    ],
    tips: [
      'Land softly with slightly bent knees to absorb impact.',
      'Keep a continuous breathing rhythm throughout.'
    ]
  },
  {
    id: 'dips-sur-chaise',
    name: 'Chair Tricep Dips',
    category: 'strength',
    categoryLabel: 'Strength',
    targetMuscle: 'Triceps, Anterior Deltoids',
    difficulty: 'intermediate',
    difficultyLabel: 'Intermediate',
    defaultDurationSeconds: 45,
    defaultSets: 3,
    caloriesPerMinute: 7,
    description: 'Use any sturdy chair to isolate and tone the back of your arms.',
    instructions: [
      'Sit on the edge of a chair, gripping the seat next to your hips.',
      'Slide hips off the front edge with knees bent or legs extended.',
      'Bend elbows to lower hips until upper arms are nearly parallel to ground, then press up.'
    ],
    tips: [
      'Keep back close to the chair edge throughout the descent.',
      'Do not lower past 90 degrees to protect shoulder joints.'
    ]
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    category: 'strength',
    categoryLabel: 'Strength',
    targetMuscle: 'Glutes, Hamstrings, Lower Back',
    difficulty: 'beginner',
    difficultyLabel: 'Beginner',
    defaultDurationSeconds: 45,
    defaultSets: 3,
    caloriesPerMinute: 6,
    description: 'Low-impact targeted glute activation that protects and aligns the lower back.',
    instructions: [
      'Lie flat on your back, knees bent, feet flat on the floor near your glutes.',
      'Drive through heels to lift hips until knees, hips, and shoulders form a straight line.',
      'Squeeze glutes hard at the top for 2 seconds, then slowly lower.'
    ],
    tips: [
      'Do not overarch your lower back; drive the movement entirely with your glutes.',
      'Keep arms flat on the floor for lateral stability.'
    ]
  },
  {
    id: 'gainage-lateral',
    name: 'Side Plank',
    category: 'core',
    categoryLabel: 'Core & Abs',
    targetMuscle: 'Obliques, Gluteus Medius, Core Stability',
    difficulty: 'intermediate',
    difficultyLabel: 'Intermediate',
    defaultDurationSeconds: 40,
    defaultSets: 3,
    caloriesPerMinute: 6,
    description: 'Targets obliques and lateral stabilizers to tone waistline and enhance balance.',
    instructions: [
      'Lie on your side propped up on your forearm, elbow directly below shoulder.',
      'Lift hips so your body forms a straight diagonal line from head to ankles.',
      'Hold the position firmly, then switch to the other side.'
    ],
    tips: [
      'Do not let hips droop toward the floor.',
      'Drop your bottom knee to the floor for support if needed.'
    ]
  },
  {
    id: 'stretching-mobilite',
    name: 'Spine Mobility & Stretch',
    category: 'yoga',
    categoryLabel: 'Mobility & Recovery',
    targetMuscle: 'Spine, Hamstrings, Deep Breathing',
    difficulty: 'beginner',
    difficultyLabel: 'Beginner',
    defaultDurationSeconds: 60,
    defaultSets: 2,
    caloriesPerMinute: 4,
    description: 'Gentle active recovery routine focusing on spinal articulation and relaxation.',
    instructions: [
      'On all fours, alternate between rounding the back (Cat) and arching gently (Cow).',
      'Transition back into Child’s Pose with hips on heels and arms outstretched.',
      'Breathe deeply into your diaphragm, letting all muscular tension dissipate.'
    ],
    tips: [
      'Focus on slow, deep nasal inhalations and exhales.',
      'Move gently without forcing any tight joints.'
    ]
  }
];
