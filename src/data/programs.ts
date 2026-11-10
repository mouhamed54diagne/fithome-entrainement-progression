export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export interface ProgramExerciseStep {
  id: string;
  name: string;
  sets: number;
  reps: string; // e.g. "12 reps" or "45 sec"
  isTimeBased: boolean;
  durationSeconds?: number;
  restSeconds: number;
  targetMuscle: string;
  description: string;
  tips: string[];
}

export interface DayWorkoutProgram {
  dayOfWeek: number; // 1 = Monday, 7 = Sunday
  dayNameFr: string; // Kept for backwards compatibility
  dayNameEn: string; // "Monday", "Tuesday", etc.
  title: string;
  shortDescription: string;
  isRest: boolean;
  estimatedDurationMinutes: number;
  estimatedCalories: number;
  exercises: ProgramExerciseStep[];
}

export interface LevelProgram {
  level: FitnessLevel;
  levelNameFr: string;
  levelNameEn: string;
  subtitle: string;
  description: string;
  days: DayWorkoutProgram[];
}

export const WORKOUT_PROGRAMS: Record<FitnessLevel, LevelProgram> = {
  beginner: {
    level: 'beginner',
    levelNameFr: 'Débutant',
    levelNameEn: 'Beginner',
    subtitle: 'Gentle Restart & Solid Foundations',
    description: 'A 7-day progressive home routine designed for beginners: learn proper form with zero equipment and tone your whole body safely.',
    days: [
      {
        dayOfWeek: 1,
        dayNameFr: 'Lundi',
        dayNameEn: 'Monday',
        title: 'Full Body Wake-Up',
        shortDescription: 'Complete bodyweight circuit to activate and awaken all major muscle groups.',
        isRest: false,
        estimatedDurationMinutes: 18,
        estimatedCalories: 110,
        exercises: [
          {
            id: 'b-squats',
            name: 'Bodyweight Squats',
            sets: 2,
            reps: '10 reps',
            isTimeBased: false,
            restSeconds: 45,
            targetMuscle: 'Thighs & Glutes',
            description: 'Hinge hips backward as if sitting down into a low chair.',
            tips: ['Keep heels flat on the floor', 'Chest up, eyes looking straight ahead']
          },
          {
            id: 'b-knee-pushups',
            name: 'Knee Push-Ups',
            sets: 2,
            reps: '8 reps',
            isTimeBased: false,
            restSeconds: 45,
            targetMuscle: 'Chest & Arms',
            description: 'Support weight on knees, bending elbows until chest nears the floor.',
            tips: ['Maintain a straight line from knees to shoulders', 'Do not arch lower back']
          },
          {
            id: 'b-glute-bridge',
            name: 'Glute Bridge',
            sets: 2,
            reps: '12 reps',
            isTimeBased: false,
            restSeconds: 40,
            targetMuscle: 'Glutes & Hamstrings',
            description: 'Lie on your back and drive hips up, squeezing glutes for 2 seconds at the top.',
            tips: ['Push firmly through your heels', 'Exhale as you raise your hips']
          },
          {
            id: 'b-plank',
            name: 'Forearm Plank',
            sets: 2,
            reps: '25 seconds',
            isTimeBased: true,
            durationSeconds: 25,
            restSeconds: 45,
            targetMuscle: 'Deep Core Muscles',
            description: 'Rest on forearms and toes, keeping your body perfectly straight.',
            tips: ['Draw belly button in toward spine', 'Breathe steadily without holding breath']
          }
        ]
      },
      {
        dayOfWeek: 2,
        dayNameFr: 'Mardi',
        dayNameEn: 'Tuesday',
        title: 'Rest & Gentle Recovery',
        shortDescription: 'Active rest day to allow muscle fibers to repair and re-energize.',
        isRest: true,
        estimatedDurationMinutes: 0,
        estimatedCalories: 0,
        exercises: []
      },
      {
        dayOfWeek: 3,
        dayNameFr: 'Mercredi',
        dayNameEn: 'Wednesday',
        title: 'Lower Body & Core',
        shortDescription: 'Targeted strengthening for legs, glutes, and midsection stability.',
        isRest: false,
        estimatedDurationMinutes: 20,
        estimatedCalories: 130,
        exercises: [
          {
            id: 'b-lunges',
            name: 'Gentle Forward Lunges',
            sets: 2,
            reps: '8 reps per leg',
            isTimeBased: false,
            restSeconds: 45,
            targetMuscle: 'Quads & Glutes',
            description: 'Take a controlled step forward, lowering the back knee toward the ground.',
            tips: ['Keep front knee aligned above ankle', 'Keep torso tall and vertical']
          },
          {
            id: 'b-squats-pulse',
            name: 'Controlled Tempo Squats',
            sets: 2,
            reps: '10 reps',
            isTimeBased: false,
            restSeconds: 45,
            targetMuscle: 'Quadriceps',
            description: 'Lower slowly for 3 seconds, pause briefly at the bottom, then rise.',
            tips: ['Control the downward descent', 'Engage glutes as you stand']
          },
          {
            id: 'b-bird-dog',
            name: 'Bird-Dog Stability',
            sets: 2,
            reps: '8 reps per side',
            isTimeBased: false,
            restSeconds: 30,
            targetMuscle: 'Back & Core Stability',
            description: 'On all fours, extend opposite arm and leg straight out.',
            tips: ['Keep hips level with the ground', 'Move with slow control']
          },
          {
            id: 'b-side-plank-knees',
            name: 'Knee Side Plank',
            sets: 2,
            reps: '20 seconds per side',
            isTimeBased: true,
            durationSeconds: 20,
            restSeconds: 40,
            targetMuscle: 'Obliques',
            description: 'Side plank on knees and forearm to strengthen waist stabilizers.',
            tips: ['Keep hips lifted high', 'Align neck with your spine']
          }
        ]
      },
      {
        dayOfWeek: 4,
        dayNameFr: 'Jeudi',
        dayNameEn: 'Thursday',
        title: 'Rest & Hydration',
        shortDescription: 'A day off to hydrate, stretch lightly, and prepare for the weekend.',
        isRest: true,
        estimatedDurationMinutes: 0,
        estimatedCalories: 0,
        exercises: []
      },
      {
        dayOfWeek: 5,
        dayNameFr: 'Vendredi',
        dayNameEn: 'Friday',
        title: 'Upper Body & Cardio Tone',
        shortDescription: 'Strengthen chest, back, and shoulders while raising heart rate gently.',
        isRest: false,
        estimatedDurationMinutes: 20,
        estimatedCalories: 125,
        exercises: [
          {
            id: 'b-incline-pushups',
            name: 'Incline Push-Ups (Wall or Couch)',
            sets: 2,
            reps: '10 reps',
            isTimeBased: false,
            restSeconds: 45,
            targetMuscle: 'Chest & Triceps',
            description: 'Hands elevated on a couch or sturdy table to focus on form.',
            tips: ['Keep full body rigid in one line', 'Smooth controlled breathing']
          },
          {
            id: 'b-chair-dips',
            name: 'Chair Dips (Bent Knees)',
            sets: 2,
            reps: '8 reps',
            isTimeBased: false,
            restSeconds: 45,
            targetMuscle: 'Triceps',
            description: 'Hands on chair edge, knees bent at 90 degrees, lower and press.',
            tips: ['Keep back close to the chair edge', 'Do not shrug shoulders']
          },
          {
            id: 'b-jumping-jacks-low',
            name: 'Low-Impact Step Jacks',
            sets: 2,
            reps: '40 seconds',
            isTimeBased: true,
            durationSeconds: 40,
            restSeconds: 30,
            targetMuscle: 'Cardio & Calves',
            description: 'Step one foot out to the side while raising arms overhead.',
            tips: ['Soft feet, steady rhythm', 'No joint impacts']
          },
          {
            id: 'b-deadbug',
            name: 'Dead Bug Abdominals',
            sets: 2,
            reps: '10 reps per side',
            isTimeBased: false,
            restSeconds: 30,
            targetMuscle: 'Core & Lower Abs',
            description: 'On your back, alternate extending opposite arm and leg without arching.',
            tips: ['Press lower back firmly into the floor', 'Move slowly with intention']
          }
        ]
      },
      {
        dayOfWeek: 6,
        dayNameFr: 'Samedi',
        dayNameEn: 'Saturday',
        title: 'Mobility, Flexibility & Stretch',
        shortDescription: 'Unwind muscular tensions, improve flexibility, and restore posture.',
        isRest: false,
        estimatedDurationMinutes: 15,
        estimatedCalories: 60,
        exercises: [
          {
            id: 'b-cat-cow',
            name: 'Cat-Cow Spinal Stretch',
            sets: 2,
            reps: '45 seconds',
            isTimeBased: true,
            durationSeconds: 45,
            restSeconds: 30,
            targetMuscle: 'Spine & Neck',
            description: 'Alternate gentle spinal flexion and extension synchronized with breathing.',
            tips: ['Inhale on arch, exhale on round', 'Fluid, smooth movements']
          },
          {
            id: 'b-child-pose',
            name: 'Child’s Pose Hold',
            sets: 2,
            reps: '45 seconds',
            isTimeBased: true,
            durationSeconds: 45,
            restSeconds: 30,
            targetMuscle: 'Back, Hips & Shoulders',
            description: 'Hips back onto heels, reach arms far forward, relax forehead to floor.',
            tips: ['Breathe deeply into ribcage', 'Release all muscle tension']
          },
          {
            id: 'b-hamstring-stretch',
            name: 'Seated Hamstring Stretch',
            sets: 2,
            reps: '30 seconds per side',
            isTimeBased: true,
            durationSeconds: 30,
            restSeconds: 20,
            targetMuscle: 'Hamstrings & Calves',
            description: 'Extend one leg forward and fold gently from the hips.',
            tips: ['Do not bounce', 'Keep spine long, reach with chest']
          }
        ]
      },
      {
        dayOfWeek: 7,
        dayNameFr: 'Dimanche',
        dayNameEn: 'Sunday',
        title: 'Complete Rest & Regeneration',
        shortDescription: 'Weekly rest day. Celebrate your consistency and recharge for next week.',
        isRest: true,
        estimatedDurationMinutes: 0,
        estimatedCalories: 0,
        exercises: []
      }
    ]
  },
  intermediate: {
    level: 'intermediate',
    levelNameFr: 'Intermédiaire',
    levelNameEn: 'Intermediate',
    subtitle: 'Fat Burn & Muscular Definition',
    description: 'Dynamic 7-day program featuring HIIT circuits, explosive bodyweight movements, and functional strength conditioning.',
    days: [
      {
        dayOfWeek: 1,
        dayNameFr: 'Lundi',
        dayNameEn: 'Monday',
        title: 'HIIT Cardio Ignition',
        shortDescription: 'High-energy cardio intervals to accelerate metabolism and calorie burn.',
        isRest: false,
        estimatedDurationMinutes: 22,
        estimatedCalories: 180,
        exercises: [
          {
            id: 'i-jumping-jacks',
            name: 'Dynamic Jumping Jacks',
            sets: 3,
            reps: '45 seconds',
            isTimeBased: true,
            durationSeconds: 45,
            restSeconds: 25,
            targetMuscle: 'Cardio & Calves',
            description: 'Jump wide while swinging arms overhead with steady tempo.',
            tips: ['Land softly on balls of feet', 'Maintain steady nasal-oral breath']
          },
          {
            id: 'i-mountain-climbers',
            name: 'Speed Mountain Climbers',
            sets: 3,
            reps: '40 seconds',
            isTimeBased: true,
            durationSeconds: 40,
            restSeconds: 30,
            targetMuscle: 'Core & Cardiovascular',
            description: 'In high plank, rapidly alternate driving knees toward your chest.',
            tips: ['Keep hips level with shoulders', 'Explosive drive']
          },
          {
            id: 'i-high-knees',
            name: 'High Knees Sprint in Place',
            sets: 3,
            reps: '35 seconds',
            isTimeBased: true,
            durationSeconds: 35,
            restSeconds: 30,
            targetMuscle: 'Hip Flexors & Cardio',
            description: 'Drive knees up to hip height at a swift running pace.',
            tips: ['Pump arms actively', 'Stay light on your toes']
          },
          {
            id: 'i-plank-hold',
            name: 'Solid Core Plank',
            sets: 3,
            reps: '45 seconds',
            isTimeBased: true,
            durationSeconds: 45,
            restSeconds: 30,
            targetMuscle: 'Full Core',
            description: 'Hold forearm plank with locked abs and glutes.',
            tips: ['Push floor away with elbows', 'Neutral spine']
          }
        ]
      },
      {
        dayOfWeek: 2,
        dayNameFr: 'Mardi',
        dayNameEn: 'Tuesday',
        title: 'Upper Body & Arms Sculpt',
        shortDescription: 'Chest, back, triceps, and deltoid hypertrophy training.',
        isRest: false,
        estimatedDurationMinutes: 24,
        estimatedCalories: 165,
        exercises: [
          {
            id: 'i-pushups',
            name: 'Classic Push-Ups',
            sets: 3,
            reps: '12 reps',
            isTimeBased: false,
            restSeconds: 45,
            targetMuscle: 'Pectorals & Triceps',
            description: 'Lower chest to floor with controlled 2-second eccentric phase.',
            tips: ['Elbows at 45 degrees from torso', 'Full range of motion']
          },
          {
            id: 'i-dips',
            name: 'Chair Tricep Dips',
            sets: 3,
            reps: '12 reps',
            isTimeBased: false,
            restSeconds: 45,
            targetMuscle: 'Triceps & Front Delts',
            description: 'Lower hips until elbows hit 90 degrees, press up with power.',
            tips: ['Keep back close to chair edge', 'Lock triceps at the peak']
          },
          {
            id: 'i-pike-pushups',
            name: 'Pike Push-Ups (Shoulders)',
            sets: 3,
            reps: '8 reps',
            isTimeBased: false,
            restSeconds: 50,
            targetMuscle: 'Deltoids & Traps',
            description: 'Hips elevated in inverted V shape, lower forehead toward floor.',
            tips: ['Target shoulder drive', 'Keep legs straight']
          },
          {
            id: 'i-diamond-knees',
            name: 'Close-Grip Push-Ups',
            sets: 2,
            reps: '8 reps',
            isTimeBased: false,
            restSeconds: 45,
            targetMuscle: 'Triceps Isolation',
            description: 'Hands close together beneath sternum.',
            tips: ['Elbows tracking backward', 'Squeeze chest at top']
          }
        ]
      },
      {
        dayOfWeek: 3,
        dayNameFr: 'Mercredi',
        dayNameEn: 'Wednesday',
        title: 'Rest & Active Walk',
        shortDescription: 'Midweek recovery: hydrate well and keep light movement going.',
        isRest: true,
        estimatedDurationMinutes: 0,
        estimatedCalories: 0,
        exercises: []
      },
      {
        dayOfWeek: 4,
        dayNameFr: 'Jeudi',
        dayNameEn: 'Thursday',
        title: 'Lower Body & Glute Power',
        shortDescription: 'Build strength, athletic stamina, and explosive leg drive.',
        isRest: false,
        estimatedDurationMinutes: 25,
        estimatedCalories: 190,
        exercises: [
          {
            id: 'i-jump-squats',
            name: 'Explosive Jump Squats',
            sets: 3,
            reps: '10 reps',
            isTimeBased: false,
            restSeconds: 50,
            targetMuscle: 'Quads & Power',
            description: 'Squat deep and explode vertically, landing softly back into a squat.',
            tips: ['Absorb landing through knees and hips', 'Keep chest proud']
          },
          {
            id: 'i-walking-lunges',
            name: 'Alternating Forward Lunges',
            sets: 3,
            reps: '12 reps per leg',
            isTimeBased: false,
            restSeconds: 45,
            targetMuscle: 'Glutes & Quads',
            description: 'Step forward into dynamic 90-degree lunges.',
            tips: ['Drive off front heel', 'Do not lean forward']
          },
          {
            id: 'i-glute-single-leg',
            name: 'Single-Leg Glute Bridge',
            sets: 3,
            reps: '10 reps per leg',
            isTimeBased: false,
            restSeconds: 40,
            targetMuscle: 'Gluteus Maximus & Hamstrings',
            description: 'Drive up on one foot with opposite leg extended in the air.',
            tips: ['Level hips at top', '2-second peak squeeze']
          },
          {
            id: 'i-wall-sit',
            name: 'Isometric Wall Sit',
            sets: 3,
            reps: '40 seconds',
            isTimeBased: true,
            durationSeconds: 40,
            restSeconds: 45,
            targetMuscle: 'Quad Endurance',
            description: 'Back flat against wall, thighs parallel to the floor.',
            tips: ['Knees at 90 degrees', 'Do not rest hands on knees']
          }
        ]
      },
      {
        dayOfWeek: 5,
        dayNameFr: 'Vendredi',
        dayNameEn: 'Friday',
        title: 'Core & Abdominal Circuit',
        shortDescription: 'Target rectus abdominis, obliques, and transverse core.',
        isRest: false,
        estimatedDurationMinutes: 20,
        estimatedCalories: 140,
        exercises: [
          {
            id: 'i-bicycle-crunches',
            name: 'Bicycle Crunches',
            sets: 3,
            reps: '16 reps total',
            isTimeBased: false,
            restSeconds: 35,
            targetMuscle: 'Obliques & Rectus Abdominis',
            description: 'Alternate touching opposite elbow to knee with rotation.',
            tips: ['Turn from torso, not neck', 'Extend opposite leg fully']
          },
          {
            id: 'i-side-plank',
            name: 'Full Side Plank',
            sets: 3,
            reps: '30 seconds per side',
            isTimeBased: true,
            durationSeconds: 30,
            restSeconds: 35,
            targetMuscle: 'Lateral Core & Obliques',
            description: 'Straight line from ankles to head on forearm.',
            tips: ['Keep hips high', 'Engage glutes']
          },
          {
            id: 'i-leg-raises',
            name: 'Lying Leg Raises',
            sets: 3,
            reps: '12 reps',
            isTimeBased: false,
            restSeconds: 40,
            targetMuscle: 'Lower Abdominals',
            description: 'Raise straight legs to 90 degrees, lower slowly without touching floor.',
            tips: ['Press lumbar spine flat to floor', 'Slow negative descent']
          },
          {
            id: 'i-hollow-hold',
            name: 'Hollow Body Hold',
            sets: 3,
            reps: '25 seconds',
            isTimeBased: true,
            durationSeconds: 25,
            restSeconds: 40,
            targetMuscle: 'Complete Core Bracing',
            description: 'Gymnastics hollow position with lower back pressed into ground.',
            tips: ['Toes pointed, arms by ears', 'Shallow steady breathing']
          }
        ]
      },
      {
        dayOfWeek: 6,
        dayNameFr: 'Samedi',
        dayNameEn: 'Saturday',
        title: 'Total Body Functional Circuit',
        shortDescription: 'Full-body metabolic conditioning to close out the workout week.',
        isRest: false,
        estimatedDurationMinutes: 22,
        estimatedCalories: 200,
        exercises: [
          {
            id: 'i-burpees',
            name: 'Dynamic Burpees',
            sets: 3,
            reps: '10 reps',
            isTimeBased: false,
            restSeconds: 50,
            targetMuscle: 'Full Body & Heart Rate',
            description: 'Drop to squat, jump to plank, jump in and explode up with hands raised.',
            tips: ['Fluid transition', 'Land on soft knees']
          },
          {
            id: 'i-pushup-rotation',
            name: 'Push-Up with T-Rotation',
            sets: 3,
            reps: '10 reps total',
            isTimeBased: false,
            restSeconds: 40,
            targetMuscle: 'Chest, Shoulders & Obliques',
            description: 'Push-up into a side plank rotation, reaching top arm to ceiling.',
            tips: ['Follow hand with eyes', 'Firm core support']
          },
          {
            id: 'i-skater-hops',
            name: 'Lateral Skater Hops',
            sets: 3,
            reps: '40 seconds',
            isTimeBased: true,
            durationSeconds: 40,
            restSeconds: 30,
            targetMuscle: 'Gluteus Medius & Balance',
            description: 'Bound side-to-side laterally landing smoothly on one foot.',
            tips: ['Reach opposite hand to foot', 'Absorb impact dynamically']
          }
        ]
      },
      {
        dayOfWeek: 7,
        dayNameFr: 'Dimanche',
        dayNameEn: 'Sunday',
        title: 'Total Rest & Stretching',
        shortDescription: 'Rest up, celebrate your effort, and replenish energy for next week.',
        isRest: true,
        estimatedDurationMinutes: 0,
        estimatedCalories: 0,
        exercises: []
      }
    ]
  },
  advanced: {
    level: 'advanced',
    levelNameFr: 'Avancé',
    levelNameEn: 'Advanced',
    subtitle: 'Maximum Intensity & Athletic Conditioning',
    description: 'High-octane training for experienced athletes: plyometrics, high-volume calisthenics, and brutal core challenges.',
    days: [
      {
        dayOfWeek: 1,
        dayNameFr: 'Lundi',
        dayNameEn: 'Monday',
        title: 'Chest & Push Overload',
        shortDescription: 'Extreme upper-body push volume with varied angles and tempos.',
        isRest: false,
        estimatedDurationMinutes: 28,
        estimatedCalories: 240,
        exercises: [
          {
            id: 'a-pushup-tempo',
            name: 'Explosive Clapping / Tempo Push-Ups',
            sets: 4,
            reps: '15 reps',
            isTimeBased: false,
            restSeconds: 45,
            targetMuscle: 'Pectorals & Explosive Power',
            description: 'Drive up with maximum force off the floor.',
            tips: ['Tense core like steel', 'Full chest extension']
          },
          {
            id: 'a-diamond-pushups',
            name: 'Diamond Push-Ups',
            sets: 4,
            reps: '12 reps',
            isTimeBased: false,
            restSeconds: 45,
            targetMuscle: 'Triceps & Inner Chest',
            description: 'Hands together forming a diamond shape under sternum.',
            tips: ['Elbows tight to ribs', 'Control the eccentric phase']
          },
          {
            id: 'a-pike-feet-elevated',
            name: 'Feet-Elevated Pike Push-Ups',
            sets: 4,
            reps: '10 reps',
            isTimeBased: false,
            restSeconds: 50,
            targetMuscle: 'Deltoids & Upper Traps',
            description: 'Feet on chair, hips high, lower head toward hands.',
            tips: ['Vertical pressing angle', 'Focus on shoulder drive']
          },
          {
            id: 'a-plank-to-pushup',
            name: 'Plank-to-Push-Up Transitions',
            sets: 4,
            reps: '14 reps',
            isTimeBased: false,
            restSeconds: 40,
            targetMuscle: 'Triceps & Core Stability',
            description: 'Alternate transitioning from forearms to palms smoothly.',
            tips: ['Minimize hip sway', 'Switch lead arm halfway']
          }
        ]
      },
      {
        dayOfWeek: 2,
        dayNameFr: 'Mardi',
        dayNameEn: 'Tuesday',
        title: 'Plyometric Leg Destroyer',
        shortDescription: 'Explosive lower-body jumps, unilateral squats, and pure quad burn.',
        isRest: false,
        estimatedDurationMinutes: 28,
        estimatedCalories: 260,
        exercises: [
          {
            id: 'a-jump-lunges',
            name: 'Jumping Split Lunges',
            sets: 4,
            reps: '16 reps total',
            isTimeBased: false,
            restSeconds: 50,
            targetMuscle: 'Quads, Glutes & Power',
            description: 'Explosively switch legs mid-air between lunges.',
            tips: ['Land softly on both feet', 'Stay tall through torso']
          },
          {
            id: 'a-pistol-assisted',
            name: 'Assisted Single-Leg Pistol Squats',
            sets: 4,
            reps: '8 reps per leg',
            isTimeBased: false,
            restSeconds: 50,
            targetMuscle: 'Unilateral Quad Strength',
            description: 'Squat deep on one leg with opposite leg extended straight forward.',
            tips: ['Heel stays planted', 'Use chair or wall for slight balance']
          },
          {
            id: 'a-tuck-jumps',
            name: 'Explosive Tuck Jumps',
            sets: 4,
            reps: '10 reps',
            isTimeBased: false,
            restSeconds: 45,
            targetMuscle: 'Cardio & Explosive Hip Flexion',
            description: 'Jump with maximum vertical height, pulling knees up to chest.',
            tips: ['Immediate elastic rebound on landing']
          },
          {
            id: 'a-single-leg-glute',
            name: 'Single-Leg Elevated Glute Bridge',
            sets: 4,
            reps: '12 reps per leg',
            isTimeBased: false,
            restSeconds: 40,
            targetMuscle: 'Hamstrings & Glute Peak',
            description: 'Foot elevated on chair, drive hips to full extension.',
            tips: ['Maximal glute contraction at top']
          }
        ]
      },
      {
        dayOfWeek: 3,
        dayNameFr: 'Mercredi',
        dayNameEn: 'Wednesday',
        title: 'Active Recovery & Hip Mobility',
        shortDescription: 'Gentle mobility session to optimize athletic recovery and joint health.',
        isRest: true,
        estimatedDurationMinutes: 0,
        estimatedCalories: 0,
        exercises: []
      },
      {
        dayOfWeek: 4,
        dayNameFr: 'Jeudi',
        dayNameEn: 'Thursday',
        title: 'Hardcore Core & Ab Shred',
        shortDescription: 'Advanced isometric holds, rotational torque, and core stability.',
        isRest: false,
        estimatedDurationMinutes: 24,
        estimatedCalories: 180,
        exercises: [
          {
            id: 'a-v-ups',
            name: 'Full V-Ups',
            sets: 4,
            reps: '14 reps',
            isTimeBased: false,
            restSeconds: 45,
            targetMuscle: 'Upper & Lower Abdominals',
            description: 'Simultaneously lift legs and torso to touch toes at top of V.',
            tips: ['Controlled negative lowering', 'Do not yank neck']
          },
          {
            id: 'a-side-plank-raises',
            name: 'Side Plank with Hip Dips',
            sets: 4,
            reps: '12 reps per side',
            isTimeBased: false,
            restSeconds: 35,
            targetMuscle: 'Obliques & Lateral Chain',
            description: 'From side plank, lower hip toward floor and drive high.',
            tips: ['Full range of motion', 'Keep torso stacked']
          },
          {
            id: 'a-plank-reach',
            name: 'Plank with Arm & Leg Reach',
            sets: 4,
            reps: '40 seconds',
            isTimeBased: true,
            durationSeconds: 40,
            restSeconds: 35,
            targetMuscle: 'Anti-Rotational Core',
            description: 'Hold high plank while extending opposite arm and leg.',
            tips: ['Zero hip tilting', 'Lock transverse abdominis']
          },
          {
            id: 'a-windshield-wipers',
            name: 'Lying Windshield Wipers',
            sets: 4,
            reps: '14 reps total',
            isTimeBased: false,
            restSeconds: 40,
            targetMuscle: 'Obliques & Rotational Power',
            description: 'Arms out wide, rotate straight legs side to side near floor.',
            tips: ['Keep shoulder blades glued to ground']
          }
        ]
      },
      {
        dayOfWeek: 5,
        dayNameFr: 'Vendredi',
        dayNameEn: 'Friday',
        title: 'Upper Back & Calisthenic Pull',
        shortDescription: 'Posterior chain endurance, isometric scapular pulls, and triceps.',
        isRest: false,
        estimatedDurationMinutes: 25,
        estimatedCalories: 200,
        exercises: [
          {
            id: 'a-superman-pulls',
            name: 'Superman Lat Pulls',
            sets: 4,
            reps: '15 reps',
            isTimeBased: false,
            restSeconds: 40,
            targetMuscle: 'Lats, Rhomboids & Erector Spinae',
            description: 'Lie on stomach, elevate chest and draw elbows back hard.',
            tips: ['Squeeze scapulae together', 'Keep gaze on floor']
          },
          {
            id: 'a-reverse-plank',
            name: 'Reverse Plank Hold',
            sets: 4,
            reps: '45 seconds',
            isTimeBased: true,
            durationSeconds: 45,
            restSeconds: 40,
            targetMuscle: 'Triceps, Posterior Chain & Glutes',
            description: 'Support body on palms facing forward, drive hips up high.',
            tips: ['Open chest wide', 'Keep body in clean straight line']
          },
          {
            id: 'a-dips-straight-leg',
            name: 'Chair Dips (Straight Legs)',
            sets: 4,
            reps: '15 reps',
            isTimeBased: false,
            restSeconds: 45,
            targetMuscle: 'Triceps Overload',
            description: 'Legs extended straight out on floor to increase resistance.',
            tips: ['Deep 90-degree descent', 'Powerful lockout']
          }
        ]
      },
      {
        dayOfWeek: 6,
        dayNameFr: 'Samedi',
        dayNameEn: 'Saturday',
        title: 'Extreme HIIT & Metabolic Burn',
        shortDescription: 'Final all-out conditioning sprint to maximize caloric expenditure.',
        isRest: false,
        estimatedDurationMinutes: 25,
        estimatedCalories: 270,
        exercises: [
          {
            id: 'a-burpees-hiit',
            name: 'Sprint Cadence Burpees',
            sets: 4,
            reps: '40 sec maximum effort',
            isTimeBased: true,
            durationSeconds: 40,
            restSeconds: 20,
            targetMuscle: 'Cardio & Full Body Explosiveness',
            description: 'Cycle reps without pausing throughout the interval.',
            tips: ['Manage your breathing rhythm']
          },
          {
            id: 'a-high-knees-sprint',
            name: 'High Knees Sprint',
            sets: 4,
            reps: '40 seconds',
            isTimeBased: true,
            durationSeconds: 40,
            restSeconds: 20,
            targetMuscle: 'Anaerobic Engine',
            description: 'Sprint knees to chest height with maximum turnover speed.',
            tips: ['Quick, punchy arm drives']
          },
          {
            id: 'a-mountain-climbers-cross',
            name: 'Cross-Body Mountain Climbers',
            sets: 4,
            reps: '40 seconds',
            isTimeBased: true,
            durationSeconds: 40,
            restSeconds: 20,
            targetMuscle: 'Obliques & Core Stamina',
            description: 'Drive right knee to left elbow and vice-versa with speed.',
            tips: ['Twist through lower torso']
          },
          {
            id: 'a-skater-jumps-power',
            name: 'Power Lateral Skaters',
            sets: 4,
            reps: '40 seconds',
            isTimeBased: true,
            durationSeconds: 40,
            restSeconds: 20,
            targetMuscle: 'Lateral Explosiveness & Calves',
            description: 'Broad side-to-side bounds, touching opposite hand to floor.',
            tips: ['Maximum push-off on every jump']
          }
        ]
      },
      {
        dayOfWeek: 7,
        dayNameFr: 'Dimanche',
        dayNameEn: 'Sunday',
        title: 'Full Rest & Muscle Regeneration',
        shortDescription: 'Congratulations on completing an intense week! Recover fully to come back stronger.',
        isRest: true,
        estimatedDurationMinutes: 0,
        estimatedCalories: 0,
        exercises: []
      }
    ]
  }
};
