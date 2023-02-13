import path from 'path'
import { OUTFIT_DIR } from '../util/constants'
import { GarminConnectorConfigI } from '../util/interfaces'
import { GarminConnect } from 'garmin-connect'
import { GCCredentials } from 'garmin-connect/dist/garmin/GarminConnect'
import { app } from 'electron'

export class GarminConnector {
  config: GarminConnectorConfigI = {
    outFitDir: OUTFIT_DIR,
  }
  GCClient: GarminConnect
  logger

  constructor(config: GarminConnectorConfigI, logger) {
    this.config = { ...this.config, ...config }
    this.logger = logger
    logger(this.config)
    // Create a new Garmin Connect Client
    // Uses credentials from garmin.config.json or uses supplied params
    let credentials: GCCredentials = undefined
    this.config.username
      ? (credentials = {
          username: this.config.username,
          password: this.config.password,
        })
      : undefined
    this.GCClient = new GarminConnect(credentials)
  }

  async logIntoGarminConnect(): Promise<GarminConnect> {
    return await this.GCClient.login(this.config.username, this.config.password)
  }

  async uploadActivity(filename) {
    // In development the program is ran from a different folder from where java stores .fit files
    const filepath = path.resolve(
      process.env.NODE_ENV === 'development' ? process.cwd() : app.getAppPath(),
      this.config.outFitDir,
      filename
    )
    this.logger('attempting to upload', filepath)
    // @ts-ignore
    const upload = await this.GCClient.uploadActivity(filepath)
    this.logger(upload)
    return upload
  }
}
