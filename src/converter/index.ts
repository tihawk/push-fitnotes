import path from 'path'
import fs from 'fs'
import {
  CSV_DIR,
  EXERCISE_TO_FIT_CATEGORY_MAP,
  OUTFIT_DIR,
} from '../util/constants'
import { ActivityT, ConverterConfigI, WorkoutT } from '../util/interfaces'
import { app } from 'electron'
import ActivityEncoder from './ActivityEncoder'

export class Converter {
  config: ConverterConfigI = {
    csvFilePath: '',
    csvDir: CSV_DIR,
    outFitDir: OUTFIT_DIR,
  }
  logger

  constructor(config: ConverterConfigI, logger) {
    this.config = { ...this.config, ...config }
    this.logger = logger
  }

  static convertToFitActivities(workouts: WorkoutT[]): ActivityT[] {
    const result: ActivityT[] = []
    let tempA: ActivityT
    let tempS: ActivityT['sets']['0']

    for (const workout of workouts) {
      tempA = {
        name: `Workout_${workout.date.toISOString()}`,
        startTime: workout.date,
        sets: [],
      }

      for (const exercise of workout.exercises) {
        const fitExerciseCode =
          EXERCISE_TO_FIT_CATEGORY_MAP[exercise.fitnotesName]

        if (!fitExerciseCode) {
          console.log(
            `Couldn\'t find a mapping for exercise ${exercise.fitnotesName}. Skipping.`
          )
          continue
        }

        for (const set of exercise.sets) {
          tempS = {
            ...fitExerciseCode,
            reps: set.reps,
            weight: set.weight,
            unit: set.unit,
            duration: set.time * 60,
            type: 1,
          }
          tempA.sets.push(tempS)
        }
      }
      result.push(tempA)
    }
    console.log(JSON.stringify(result))
    return result
  }

  writeActivitiesToFitFilesSync(activities: ActivityT[]): string[] {
    this.logger('numOfActivities:', activities.length)
    const filepaths: string[] = []

    for (const activity of activities) {
      const encodedActivity = new ActivityEncoder(activity)
      const filePath = path.resolve(
        this.config.outFitDir,
        `${activity.name.replace(/[:]/g, '_')}.fit`
      )
      fs.writeFileSync(filePath, Buffer.from(encodedActivity.getFile()), {
        flag: 'w',
      })
      filepaths.push(filePath)
    }
    return filepaths
  }
}
