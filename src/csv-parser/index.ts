import { parse } from 'csv-parse'
import { stringify } from 'csv-stringify/sync'
import path from 'path'
import fs from 'fs'
import { WorkoutT, FitNotesCSVRowT, CSVParserConfigI } from '../util/interfaces'
import { floatMinutesTommss, timeStringToFloatMinutes } from '../util'
import { finished } from 'stream/promises'
import { CSV_DIR } from '../util/constants'
import { FitConstants } from 'fit-encoder'

export class CSVParser {
  config: CSVParserConfigI = {
    csvFilePath: '',
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
      .createReadStream(path.resolve(this.config.csvFilePath))
      .pipe(parse({ columns: true }))
      .on('data', (row: any) => {
        if (!this.isValidRow(row)) {
          console.error('Not a valid csv row!')
          throw new Error(
            `Found an invalid row in csv: ${JSON.stringify(
              row
            )}. Cancelling CSV parsing.`
          )
        }
        const weightUnit: 'kgs' | 'lbs' = row['Weight Unit']
        const temp: WorkoutT = {
          meta: {
            selected: false,
            converted: false,
            uploaded: false,
            fitFilename: null,
          },
          date: new Date(row.Date + 'T19:00:00'),
          exercises: [
            {
              fitnotesName: row.Exercise,
              fitnotesCategory: row.Category,
              sets: [
                {
                  reps: row.Reps,
                  weight: row['Weight'],
                  unit:
                    weightUnit === 'kgs'
                      ? FitConstants.fit_base_unit.kilogram
                      : FitConstants.fit_base_unit.pound,
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

  isValidRow(row: FitNotesCSVRowT): row is FitNotesCSVRowT {
    return !!row.Date.match(/\d\d\d\d-\d\d-\d\d/).length && !!row.Exercise
  }

  static flattenData(workouts: WorkoutT[]): string {
    const data: FitNotesCSVRowT[] = []

    for (const workout of workouts) {
      for (const exercise of workout.exercises) {
        for (const set of exercise.sets) {
          const temp: FitNotesCSVRowT = {
            Date: workout.date.toISOString().split('T')[0],
            Exercise: exercise.fitnotesName,
            Category: exercise.fitnotesCategory,
            'Weight (kgs)': set.weight,
            Reps: set.reps,
            Time: set.time ? floatMinutesTommss(set.time) : '',
            'Distance Unit': '',
            Comment: '',
            Distance: undefined,
          }

          data.push(temp)
        }
      }
    }

    return stringify(data, {
      header: true,
      columns: {
        Date: 'Date',
        Exercise: 'Exercise',
        Category: 'Category',
        'Weight (kgs)': 'Weight (kgs)',
        Reps: 'Reps',
        Distance: 'Distance',
        'Distance Unit': 'Distance Unit',
        Time: 'Time',
        Comment: 'Comment',
      },
    })
  }
}
