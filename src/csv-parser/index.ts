import { parse } from 'csv-parse'
import path from 'path'
import fs from 'fs'
import { cwd } from 'process'
import { WorkoutT, FitNotesCSVRowT, CSVParserConfigI } from '../util/interfaces'
import { timeStringToFloatMinutes } from '../util'
import { finished } from 'stream/promises'
import { CSV_DIR } from '../util/constants'

export class CSVParser {
  config: CSVParserConfigI = {
    csvFilename: '',
    csvDir: CSV_DIR,
  }
  logger
  constructor(config: CSVParserConfigI, logger) {
    this.config = { ...this.config, ...config }
    this.logger = logger
  }

  async parseData(): Promise<WorkoutT[]> {
    const result: WorkoutT[] = []
    const parser = fs
      .createReadStream(path.resolve(this.config.csvFilename))
      .pipe(parse({ columns: true }))
      .on('data', (row: FitNotesCSVRowT) => {
        const temp: WorkoutT = {
          date: new Date(row.Date),
          exercises: [
            {
              fitnotesName: row.Exercise,
              fitnotesCategory: row.Category,
              sets: [
                {
                  reps: row.Reps,
                  weight: row['Weight (kgs)'],
                  time: timeStringToFloatMinutes(row.Time),
                },
              ],
            },
          ],
        }

        const workoutIndex = this.findWorkoutIndex(result, temp)
        if (workoutIndex > -1) {
          const exerciseIndex = this.findExerciseIndex(
            result,
            workoutIndex,
            temp
          )
          if (exerciseIndex > -1) {
            result[workoutIndex].exercises[exerciseIndex].sets.push(
              ...temp.exercises[0].sets
            )
          } else {
            result[workoutIndex].exercises.push(...temp.exercises)
          }
        } else {
          result.push(temp)
        }
      })
      .on('end', function () {
        console.log('finished parsing csv')
        return result
      })
      .on('error', function (error) {
        console.log(error.message)
      })

    await finished(parser)
    return result
  }

  findWorkoutIndex(data: WorkoutT[], term: WorkoutT) {
    return data.findIndex(
      (el) => el.date.toISOString() === term.date.toISOString()
    )
  }

  findExerciseIndex(data: WorkoutT[], workoutIndex: number, term: WorkoutT) {
    return data[workoutIndex].exercises.findIndex(
      (el) => el.fitnotesName === term.exercises[0].fitnotesName
    )
  }
}
