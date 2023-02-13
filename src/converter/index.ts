import { NodeAPI } from 'java'
import path from 'path'
import fs from 'fs'
import { getAbsolutePath } from '../util'
import { CSV_DIR, LIB_DIR, OUTFIT_DIR } from '../util/constants'
import { ConverterConfigI } from '../util/interfaces'
const java: NodeAPI = require('java')

java.classpath.push(
  path.join(getAbsolutePath(LIB_DIR), 'fitnotes2fit-1.0.3.jar')
)
java.classpath.push(path.join(getAbsolutePath(LIB_DIR), 'opencsv-4.0.jar'))
java.classpath.push(
  path.join(getAbsolutePath(LIB_DIR), 'garmin-fit-21.78.00.jar')
)
java.classpath.push(
  path.join(getAbsolutePath(LIB_DIR), 'commons-lang3-3.6.jar')
)
java.classpath.push(path.join(getAbsolutePath(LIB_DIR), 'commons-text-1.1.jar'))
java.classpath.push(
  path.join(getAbsolutePath(LIB_DIR), 'commons-beanutils-1.9.3.jar')
)
java.classpath.push(
  path.join(getAbsolutePath(LIB_DIR), 'commons-lang3-3.5.jar')
)
java.classpath.push(
  path.join(getAbsolutePath(LIB_DIR), 'commons-logging-1.2.jar')
)
java.classpath.push(
  path.join(getAbsolutePath(LIB_DIR), 'commons-collections-3.2.2.jar')
)

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
    logger(this.config)
  }

  convertToFitActivities(): any {
    const fileString = fs.readFileSync(
      path.resolve(__dirname, this.config.csvDir, this.config.csvFilePath),
      'utf8'
    )
    const javaByteArray = java.newArray(
      'byte',
      fileString.split('').map((c, i) => java.newByte(fileString.charCodeAt(i)))
    )
    const activities = java.callStaticMethodSync(
      'com.developination.fitnotes2fit.FitNotesParser.FitNotesParser',
      'parseFileNotesIntoActivities',
      javaByteArray
    )
    return activities

    // This code passes the filepath to java, which then loads the file itself:
    // const activities = java.callStaticMethodSync(
    //   'com.developination.fitnotes2fit.FitNotesParser.FitNotesParser',
    //   'parseFileNotesIntoActivities',
    //   path.resolve(__dirname, this.config.csvDir, this.config.csvFilename)
    // )
    // const numOfActivities = activities.sizeSync()
    // this.logger('numOfActivities:', numOfActivities)
    // return activities
  }

  static convertToFitActivities(csvString): any {
    const javaByteArray = java.newArray(
      'byte',
      csvString.split('').map((c, i) => java.newByte(csvString.charCodeAt(i)))
    )
    const activities = java.callStaticMethodSync(
      'com.developination.fitnotes2fit.FitNotesParser.FitNotesParser',
      'parseFileNotesIntoActivities',
      javaByteArray
    )
    return activities
  }

  writeActivitiesToFitFilesSync(activities): string[] {
    const numOfActivities = activities.sizeSync()
    this.logger('numOfActivities:', numOfActivities)
    const filenames: string[] = []

    for (let i = 0; i < numOfActivities; i++) {
      const activity = activities.getSync(i)
      const activityEncoder = java.newInstanceSync(
        'com.developination.fitnotes2fit.ActivityEncoder.ActivityEncoder',
        activity,
        java.newShort(105),
        java.newFloat(2.5)
      )
      java.callMethodSync(
        activityEncoder,
        'encodeActivity',
        this.config.outFitDir
      )

      const filename = java.callMethodSync(activity, 'getActivityName') + '.fit'
      filenames.push(filename)
    }
    return filenames
  }
}
