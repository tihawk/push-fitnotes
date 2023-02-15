import { FitNotesToFitDicT } from './interfaces'
import { FitConstants } from 'fit-encoder'

const exerciseCategory = FitConstants['exercise_category']

export const EXERCISE_TO_FIT_CATEGORY_MAP: FitNotesToFitDicT = {
  'Flat Barbell Bench Press': {
    category: exerciseCategory['bench_press'],
    subCategory:
      FitConstants['bench_press_exercise_name']['barbell_bench_press'],
  },
  'EZ-Bar Curl': {
    category: exerciseCategory['curl'],
    subCategory:
      FitConstants['curl_exercise_name']['standing_ez_bar_biceps_curl'],
  },
  'Overhead Press': {
    category: exerciseCategory['shoulder_press'],
    subCategory:
      FitConstants['shoulder_press_exercise_name']['overhead_barbell_press'],
  },
  'Cable Crunch': {
    category: exerciseCategory['crunch'],
    subCategory: FitConstants['crunch_exercise_name']['cable_crunch'],
  },
  'EZ-Bar Skullcrusher': {
    category: exerciseCategory['triceps_extension'],
    subCategory:
      FitConstants['triceps_extension_exercise_name'][
        'ez_bar_overhead_triceps_extension'
      ],
  },
  'Lat Pulldown': {
    category: exerciseCategory['pull_up'],
    subCategory: FitConstants['pull_up_exercise_name']['lat_pulldown'],
  },
  'Lateral Dumbbell Raise': {
    category: exerciseCategory['lateral_raise'],
    subCategory:
      FitConstants['lateral_raise_exercise_name'][
        'leaning_dumbbell_lateral_raise'
      ],
  },
  'Dumbbell Row': {
    category: exerciseCategory['row'],
    subCategory: FitConstants['row_exercise_name']['dumbbell_row'],
  },
  'Dumbbell Curl': {
    category: exerciseCategory['curl'],
    subCategory:
      FitConstants['curl_exercise_name'][
        'dumbbell_biceps_curl_with_static_hold'
      ],
  },
  'Dumbbell Skullcrusher': {
    category: exerciseCategory['triceps_extension'],
    subCategory:
      FitConstants['triceps_extension_exercise_name'][
        'dumbbell_lying_triceps_extension'
      ],
  },
  'Flat Dumbbell Fly': {
    category: exerciseCategory['flye'],
    subCategory: FitConstants['flye_exercise_name']['dumbbell_flye'],
  },
  'Incline Dumbbell Bench Press': {
    category: exerciseCategory['bench_press'],
    subCategory:
      FitConstants['bench_press_exercise_name']['incline_dumbbell_bench_press'],
  },
  'Barbell Glute Bridge': {
    category: exerciseCategory['hip_raise'],
    subCategory:
      FitConstants['hip_raise_exercise_name']['barbell_hip_thrust_on_floor'],
  },
  'Romanian Deadlift': {
    category: exerciseCategory['deadlift'],
    subCategory:
      FitConstants['deadlift_exercise_name']['barbell_straight_leg_deadlift'],
  },
  'Barbell Row': {
    category: exerciseCategory['row'],
    subCategory: FitConstants['row_exercise_name']['reverse_grip_barbell_row'],
  },
  'Bulgarian Split Squat': {
    category: exerciseCategory['lunge'],
    subCategory:
      FitConstants['lunge_exercise_name']['dumbbell_bulgarian_split_squat'],
  },
  Deadlift: {
    category: exerciseCategory['deadlift'],
    subCategory: FitConstants['deadlift_exercise_name']['barbell_deadlift'],
  },
  'Seated Dumbbell Press': {
    category: exerciseCategory['shoulder_press'],
    subCategory:
      FitConstants['shoulder_press_exercise_name'][
        'seated_dumbbell_shoulder_press'
      ],
  },
  'Barbell Curl': {
    category: exerciseCategory['curl'],
    subCategory: FitConstants['curl_exercise_name']['barbell_biceps_curl'],
  },
  'Barbell Squat': {
    category: exerciseCategory['squat'],
    subCategory: FitConstants['squat_exercise_name']['barbell_back_squat'],
  },
  'One-legged Hip Thrust': {
    category: exerciseCategory['hip_raise'],
    subCategory:
      FitConstants['hip_raise_exercise_name']['weighted_single_leg_hip_raise'],
  },
  'Front Dumbbell Raise': {
    category: exerciseCategory['lateral_raise'],
    subCategory: FitConstants['lateral_raise_exercise_name']['front_raise'],
  },
  'Dumbbell Calf Raise': {
    category: exerciseCategory['calf_raise'],
    subCategory:
      FitConstants['calf_raise_exercise_name'][
        'single_leg_standing_dumbbell_calf_raise'
      ],
  },
  'Dumbbell Lunges': {
    category: exerciseCategory['lunge'],
    subCategory: FitConstants['lunge_exercise_name']['dumbbell_lunge'],
  },
  'Side Lying External Rotation': {
    category: exerciseCategory['shoulder_stability'],
    subCategory:
      FitConstants['shoulder_stability_exercise_name'][
        'lying_external_rotation'
      ],
  },
  'Full Can Exercise': {
    category: exerciseCategory['shoulder_stability'],
    subCategory:
      FitConstants['shoulder_stability_exercise_name']['standing_l_raise'],
  },
  'Flat Dumbbell Bench Press': {
    category: exerciseCategory['bench_press'],
    subCategory:
      FitConstants['bench_press_exercise_name']['dumbbell_bench_press'],
  },
  'Russian Twist': {
    category: exerciseCategory['core'],
    subCategory: FitConstants['core_exercise_name']['russian_twist'],
  },
  'Concentration Curl': {
    category: exerciseCategory['curl'],
    subCategory:
      FitConstants['curl_exercise_name']['seated_dumbbell_biceps_curl'],
  },
}
