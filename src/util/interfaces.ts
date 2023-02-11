export interface ConverterConfigI {
  csvFilename: string
  csvDir?: string
  outFitDir?: string
}

export interface GarminConnectorConfigI {
  outFitDir?: string
  username?: string
  password?: string
}

export type WorkoutT = {
  date: Date
  exercises: {
    fitnotesName: string
    fitName?: string
    sets: {
      reps: number
      weight: number
      time?: number
      restTime?: number
    }[]
  }[]
}
