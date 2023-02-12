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

export interface CSVParserConfigI {
  csvFilename: string
  csvDir?: string
}

export type WorkoutT = {
  meta: {
    selected: boolean
    converted: boolean
    uploaded: boolean
    fitFilename: string
  }
  date: Date
  exercises: {
    fitnotesName: string
    fitnotesCategory?: string
    fitName?: string
    sets: {
      reps: number
      weight: number
      time?: number
      restTime?: number
    }[]
  }[]
}

/* 
{
  Date: '2021-11-26',
  Exercise: 'Lat Pulldown',
  Category: 'Back',
  'Weight (kgs)': '30.0',
  Reps: '7',
  Distance: '',
  'Distance Unit': '',
  Time: '',
  Comment: ''
},
{
  Date: '2021-11-28',
  Exercise: 'Running (Outdoor)',
  Category: 'Cardio',
  'Weight (kgs)': '',
  Reps: '',
  Distance: '5.2',
  'Distance Unit': 'km',
  Time: '0:28:08',
  Comment: ''
},
 */
export type FitNotesCSVRowT = {
  Date: string
  Exercise: string
  Category: string
  'Weight (kgs)': number
  Reps: number
  Distance: number
  'Distance Unit': string
  Time: string
  Comment: string
}
