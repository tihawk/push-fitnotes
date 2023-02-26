import { FitExerciseCatSubcatT, FitNotesToFitDicT } from './interfaces'
import { FitConstants } from 'fit-encoder'

const exerciseCategory = FitConstants['exercise_category']

export function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value)
}

export function getNamesFromDictValue(input: FitExerciseCatSubcatT): {
  category: string
  subCategory: string
} {
  const result = { category: '', subCategory: '' } as {
    category: string
    subCategory: string
  }
  if (!input) {
    return result
  }

  result.category = getKeyByValue(
    FitConstants.exercise_category,
    input.category
  )

  if (!result.category) return result
  result.subCategory = getKeyByValue(
    FitConstants[`${result.category}_exercise_name`],
    input.subCategory
  )

  return result
}

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
  'Push Press': {
    category: FitConstants['exercise_category']['shoulder_press'],
    subCategory:
      FitConstants['shoulder_press_exercise_name']['barbell_push_press'],
  },
  // none?
  'Behind The Neck Barbell Press': {
    category: FitConstants['exercise_category']['shoulder_press'],
    subCategory:
      FitConstants['shoulder_press_exercise_name']['overhead_barbell_press'],
  },
  // maybe?
  'Hammer Strength Shoulder Press': {
    category: FitConstants['exercise_category']['shoulder_press'],
    subCategory:
      FitConstants['shoulder_press_exercise_name'][
        'smith_machine_overhead_press'
      ],
  },
  'Seated Dumbbell Lateral Raise': {
    category: FitConstants['exercise_category']['lateral_raise'],
    subCategory:
      FitConstants['lateral_raise_exercise_name']['seated_lateral_raise'],
  },
  // kinda
  'Lateral Machine Raise': {
    category: FitConstants['exercise_category']['shoulder_press'],
    subCategory:
      FitConstants['shoulder_press_exercise_name']['seated_lateral_raise'],
  },
  'Rear Delt Dumbbell Raise': {
    category: FitConstants['exercise_category']['lateral_raise'],
    subCategory:
      FitConstants['lateral_raise_exercise_name']['bent_over_lateral_raise'],
  },
  // not really
  'Rear Delt Machine Fly': {
    category: FitConstants['exercise_category']['flye'],
    subCategory: FitConstants['flye_exercise_name']['incline_dumbbell_flye'],
  },
  'Arnold Dumbbell Press': {
    category: FitConstants['exercise_category']['shoulder_press'],
    subCategory: FitConstants['shoulder_press_exercise_name']['arnold_press'],
  },
  'One-Arm Standing Dumbbell Press': {
    category: FitConstants['exercise_category']['shoulder_press'],
    subCategory:
      FitConstants['shoulder_press_exercise_name']['one_arm_push_press'],
  },
  'Cable Face Pull': {
    category: FitConstants['exercise_category']['row'],
    subCategory: FitConstants['row_exercise_name']['face_pull'],
  },
  // ye na ye
  'Log Press': {
    category: FitConstants['exercise_category']['shoulder_press'],
    subCategory:
      FitConstants['shoulder_press_exercise_name'][
        'barbell_front_squat_to_push_press'
      ],
  },
  'Smith Machine Overhead Press': {
    category: FitConstants['exercise_category']['shoulder_press'],
    subCategory:
      FitConstants['shoulder_press_exercise_name'][
        'smith_machine_overhead_press'
      ],
  },
  'Close Grip Barbell Bench Press': {
    category: FitConstants['exercise_category']['bench_press'],
    subCategory:
      FitConstants['bench_press_exercise_name'][
        'close_grip_barbell_bench_press'
      ],
  },
  'V-Bar Push Down': {
    category: FitConstants['exercise_category']['triceps_extension'],
    subCategory:
      FitConstants['triceps_extension_exercise_name']['triceps_pressdown'],
  },
  'Parallel Bar Triceps Dip': {
    category: FitConstants['exercise_category']['triceps_extension'],
    subCategory:
      FitConstants['triceps_extension_exercise_name']['body_weight_dip'],
  },
  'Lying Triceps Extension': {
    category: FitConstants['exercise_category']['triceps_extension'],
    subCategory:
      FitConstants['triceps_extension_exercise_name'][
        'lying_ez_bar_triceps_extension'
      ],
  },
  'Rope Push Down': {
    category: FitConstants['exercise_category']['triceps_extension'],
    subCategory:
      FitConstants['triceps_extension_exercise_name']['rope_pressdown'],
  },
  'Cable Overhead Triceps Extension': {
    category: FitConstants['exercise_category']['triceps_extension'],
    subCategory:
      FitConstants['triceps_extension_exercise_name'][
        'cable_overhead_triceps_extension'
      ],
  },
  'Dumbbell Overhead Triceps Extension': {
    category: FitConstants['exercise_category']['triceps_extension'],
    subCategory:
      FitConstants['triceps_extension_exercise_name'][
        'cable_overhead_triceps_extension'
      ],
  },
  'Ring Dip': {
    category: FitConstants['exercise_category']['lateral_raise'],
    subCategory: FitConstants['lateral_raise_exercise_name']['ring_dip'],
  },
  'Smith Machine Close Grip Bench Press': {
    category: FitConstants['exercise_category']['bench_press'],
    subCategory:
      FitConstants['bench_press_exercise_name']['smith_machine_bench_press'],
  },
  'Seated Incline Dumbbell Curl': {
    category: FitConstants['exercise_category']['curl'],
    subCategory:
      FitConstants['curl_exercise_name']['incline_dumbbell_biceps_curl'],
  },
  // well...
  'Seated Machine Curl': {
    category: FitConstants['exercise_category']['curl'],
    subCategory:
      FitConstants['curl_exercise_name']['seated_dumbbell_biceps_curl'],
  },
  'Dumbbell Hammer Curl': {
    category: FitConstants['exercise_category']['curl'],
    subCategory: FitConstants['curl_exercise_name']['dumbbell_hammer_curl'],
  },
  'Cable Curl': {
    category: FitConstants['exercise_category']['curl'],
    subCategory: FitConstants['curl_exercise_name']['cable_biceps_curl'],
  },
  'EZ-Bar Preacher Curl': {
    category: FitConstants['exercise_category']['curl'],
    subCategory: FitConstants['curl_exercise_name']['ez_bar_preacher_curl'],
  },
  'Dumbbell Concentration Curl': {
    category: FitConstants['exercise_category']['curl'],
    subCategory:
      FitConstants['curl_exercise_name'][
        'seated_alternating_dumbbell_biceps_curl'
      ],
  },
  'Dumbbell Preacher Curl': {
    category: FitConstants['exercise_category']['curl'],
    subCategory: FitConstants['curl_exercise_name']['one_arm_preacher_curl'],
  },
  'Incline Barbell Bench Press': {
    category: FitConstants['exercise_category']['bench_press'],
    subCategory:
      FitConstants['bench_press_exercise_name']['incline_barbell_bench_press'],
  },
  'Decline Barbell Bench Press': {
    category: FitConstants['exercise_category']['bench_press'],
    subCategory:
      FitConstants['bench_press_exercise_name']['decline_dumbbell_bench_press'],
  },
  'Incline Dumbbell Fly': {
    category: FitConstants['exercise_category']['flye'],
    subCategory: FitConstants['flye_exercise_name']['incline_dumbbell_flye'],
  },
  'Cable Crossover': {
    category: FitConstants['exercise_category']['flye'],
    subCategory: FitConstants['flye_exercise_name']['cable_crossover'],
  },
  // close enough
  'Incline Hammer Strength Chest Press': {
    category: FitConstants['exercise_category']['bench_press'],
    subCategory:
      FitConstants['bench_press_exercise_name']['incline_barbell_bench_press'],
  },
  // again close enough
  'Decline Hammer Strength Chest Press': {
    category: FitConstants['exercise_category']['bench_press'],
    subCategory:
      FitConstants['bench_press_exercise_name']['decline_dumbbell_bench_press'],
  },
  // nope
  'Seated Machine Fly': {
    category: FitConstants['exercise_category']['flye'],
    subCategory: FitConstants['flye_exercise_name']['dumbbell_flye'],
  },
  'Pull Up': {
    category: FitConstants['exercise_category']['pull_up'],
    subCategory: FitConstants['pull_up_exercise_name']['pull_up'],
  },
  'Chin Up': {
    category: FitConstants['exercise_category']['pull_up'],
    subCategory: FitConstants['pull_up_exercise_name']['close_grip_chin_up'],
  },
  // dunno
  'Neutral Chin Up': {
    category: FitConstants['exercise_category']['pull_up'],
    subCategory: FitConstants['pull_up_exercise_name']['close_grip_chin_up'],
  },
  // not at all
  'Pendlay Row': {
    category: FitConstants['exercise_category']['row'],
    subCategory: FitConstants['row_exercise_name']['reverse_grip_barbell_row'],
  },
  // close enough?
  'Hammer Strength Row': {
    category: FitConstants['exercise_category']['row'],
    subCategory: FitConstants['row_exercise_name']['seated_cable_row'],
  },
  'Seated Cable Row': {
    category: FitConstants['exercise_category']['row'],
    subCategory: FitConstants['row_exercise_name']['seated_cable_row'],
  },
  'T-Bar Row': {
    category: FitConstants['exercise_category']['row'],
    subCategory: FitConstants['row_exercise_name']['t_bar_row'],
  },
  'Barbell Shrug': {
    category: FitConstants['exercise_category']['shrug'],
    subCategory: FitConstants['shrug_exercise_name']['barbell_shrug'],
  },
  // na ya
  'Machine Shrug': {
    category: FitConstants['exercise_category']['shrug'],
    subCategory: FitConstants['shrug_exercise_name']['barbell_shrug'],
  },
  // nope
  'Straight-Arm Cable Pushdown': {
    category: FitConstants['exercise_category']['triceps_extension'],
    subCategory:
      FitConstants['triceps_extension_exercise_name']['triceps_pressdown'],
  },
  'Rack Pull': {
    category: FitConstants['exercise_category']['deadlift'],
    subCategory: FitConstants['deadlift_exercise_name']['rack_pull'],
  },
  'Good Morning': {
    category: FitConstants['exercise_category']['leg_curl'],
    subCategory: FitConstants['leg_curl_exercise_name']['good_morning'],
  },
  'Barbell Front Squat': {
    category: FitConstants['exercise_category']['squat'],
    subCategory: FitConstants['squat_exercise_name']['barbell_front_squat'],
  },
  'Leg Press': {
    category: FitConstants['exercise_category']['squat'],
    subCategory: FitConstants['squat_exercise_name']['leg_press'],
  },
  // not a machine. i'm getting tired
  'Leg Extension Machine': {
    category: FitConstants['exercise_category']['crunch'],
    subCategory: FitConstants['crunch_exercise_name']['leg_extensions'],
  },
  // not a machine
  'Seated Leg Curl Machine': {
    category: FitConstants['exercise_category']['leg_curl'],
    subCategory: FitConstants['leg_curl_exercise_name']['weighted_leg_curl'],
  },
  // not a machine
  'Standing Calf Raise Machine': {
    category: FitConstants['exercise_category']['calf_raise'],
    subCategory:
      FitConstants['calf_raise_exercise_name']['standing_calf_raise'],
  },
  'Donkey Calf Raise': {
    category: FitConstants['exercise_category']['calf_raise'],
    subCategory: FitConstants['calf_raise_exercise_name']['donkey_calf_raise'],
  },
  'Barbell Calf Raise': {
    category: FitConstants['exercise_category']['calf_raise'],
    subCategory: FitConstants['calf_raise_exercise_name']['donkey_calf_raise'],
  },
  // not at all
  'Glute-Ham Raise': {
    category: FitConstants['exercise_category']['leg_curl'],
    subCategory: FitConstants['leg_curl_exercise_name']['weighted_leg_curl'],
  },
  'Lying Leg Curl Machine': {
    category: FitConstants['exercise_category']['leg_curl'],
    subCategory: FitConstants['leg_curl_exercise_name']['weighted_leg_curl'],
  },
  'Stiff-Legged Deadlift': {
    category: FitConstants['exercise_category']['deadlift'],
    subCategory:
      FitConstants['deadlift_exercise_name']['barbell_straight_leg_deadlift'],
  },
  'Sumo Deadlift': {
    category: FitConstants['exercise_category']['deadlift'],
    subCategory: FitConstants['deadlift_exercise_name']['sumo_deadlift'],
  },
  'Seated Calf Raise Machine': {
    category: FitConstants['exercise_category']['calf_raise'],
    subCategory: FitConstants['calf_raise_exercise_name']['seated_calf_raise'],
  },
  'Ab-Wheel Rollout': {
    category: FitConstants['exercise_category']['core'],
    subCategory: FitConstants['core_exercise_name']['kneeling_ab_wheel'],
  },
  Crunch: {
    category: FitConstants['exercise_category']['crunch'],
    subCategory: FitConstants['crunch_exercise_name']['crunch'],
  },
  // not a machine
  'Crunch Machine': {
    category: FitConstants['exercise_category']['crunch'],
    subCategory: FitConstants['crunch_exercise_name']['crunch'],
  },
  // i guess
  'Decline Crunch': {
    category: FitConstants['exercise_category']['crunch'],
    subCategory: FitConstants['crunch_exercise_name']['reverse_crunch'],
  },
  'Dragon Flag': {
    category: FitConstants['exercise_category']['crunch'],
    subCategory:
      FitConstants['crunch_exercise_name']['reverse_crunch_on_a_bench'],
  },
  'Hanging Knee Raise': {
    category: FitConstants['exercise_category']['leg_raise'],
    subCategory: FitConstants['leg_raise_exercise_name']['hanging_knee_raise'],
  },
  'Hanging Leg Raise': {
    category: FitConstants['exercise_category']['leg_raise'],
    subCategory: FitConstants['leg_raise_exercise_name']['hanging_leg_raise'],
  },
  Plank: {
    category: FitConstants['exercise_category']['plank'],
    subCategory: FitConstants['plank_exercise_name']['plank'],
  },
  'Side Plank': {
    category: FitConstants['exercise_category']['plank'],
    subCategory: FitConstants['plank_exercise_name']['side_plank'],
  },
  // "Cycling": {
  //   "category": FitConstants['exercise_category']['core'],
  //   "subCategory": FitConstants['core_exercise_name']['rolling']
  // },
  // "Walking": {
  //   "category": FitConstants['exercise_category']['core'],
  //   "subCategory": FitConstants['core_exercise_name']['rolling']
  // },
  'Rowing Machine': {
    category: FitConstants['exercise_category']['core'],
    subCategory: FitConstants['core_exercise_name']['rowing_1'],
  },
  // "Stationary Bike": {
  //   "category": FitConstants['exercise_category']['crunch'],
  //   "subCategory": FitConstants['crunch_exercise_name']['rotational_lift']
  // },
  // "Swimming": {
  //   "category": FitConstants['exercise_category']['core'],
  //   "subCategory": FitConstants['core_exercise_name']['swimming']
  // },
  // "Running (Treadmill)": {
  //   "category": FitConstants['exercise_category']['pull_up'],
  //   "subCategory": FitConstants['pull_up_exercise_name']['hanging_hurdle']
  // },
  // "Running (Outdoor)": {
  //   "category": FitConstants['exercise_category']['pull_up'],
  //   "subCategory": FitConstants['pull_up_exercise_name']['hanging_hurdle']
  // },
  // "Elliptical Trainer": {
  //   "category": FitConstants['exercise_category']['calf_raise'],
  //   "subCategory": FitConstants['calf_raise_exercise_name']['3_way_calf_raise']
  // },
}
