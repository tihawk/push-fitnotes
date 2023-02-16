import {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
  dialog,
  ipcMain,
  session,
} from 'electron'
import { Converter } from './converter'
import { GarminConnector } from './garmin-connector'
import {
  isMac,
  LocalStorage,
  sortAlphabetically,
  sortCounterAlphabetically,
} from './util'
import path from 'path'
import { CSVParser } from './csv-parser'
import {
  CSV_DIR,
  OUTFIT_DIR,
  SETTINGS_EXPORT_DATA,
  SETTINGS_GARMIN_CREDENTIALS,
} from './util/constants'
import { SweetAlertOptions } from 'sweetalert2'
import {
  MessageT,
  setSettingsI as SetSettingsI,
  SettingsT,
  WorkoutT,
} from './util/interfaces'
import { GarminConnect } from 'garmin-connect'
import settings from 'electron-json-storage'

// a class to keep track of in-memory vars
const localStorage = new LocalStorage()

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string
// https://stackoverflow.com/questions/65582139/electron-forge-with-two-windows-how-to-render-the-second-window-electron-reac
declare const ABOUT_WEBPACK_ENTRY: string
declare const SETTINGS_WINDOW_WEBPACK_ENTRY: string
declare const SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

let mainWindow
const createWindow = (): void => {
  console.log(MAIN_WINDOW_WEBPACK_ENTRY)
  console.log(MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY)
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1000,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      // sandbox: false,
      // nodeIntegration: true, // https://stackoverflow.com/questions/60227586/ipcrenderer-not-receiving-message-from-main-process
      // allowRunningInsecureContent: true,
    },
  })
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()

  // Allow buymeacoffee cdn
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "script-src-elem 'self' https://cdnjs.buymeacoffee.com 'unsafe-inline'",
        ],
      },
    })
  })

  // Create menu from template
  const menu = Menu.buildFromTemplate(getMenuTemplate())
  Menu.setApplicationMenu(menu)

  // Listen to events
  ipcMain.handle('convert-workout', handleConvertWorkout)
  ipcMain.handle('upload-workout', handleUploadWorkout)
  ipcMain.handle('get-setting', handleGetSetting)
  ipcMain.handle('get-all-settings', handleGetAllSettings)
  ipcMain.handle('set-setting', handleSetSetting)
  ipcMain.handle('select-export-dir', handleSelectExportDir)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// Create Menu
function getMenuTemplate(): (MenuItemConstructorOptions | MenuItem)[] {
  // Menu
  const menuTemplate: (MenuItemConstructorOptions | MenuItem)[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Load CSV',
          click: handleLoadCSV,
          accelerator: 'CmdOrCtrl+O',
        },
        {
          label: 'Settings',
          click: createSettingsWindow,
          accelerator: 'CmdOrCtrl+P',
        },
        isMac ? { role: 'close' } : { role: 'quit' },
      ],
    },
    {
      label: 'Tools',
      submenu: [
        {
          label: 'Quick convert',
          toolTip: 'Select a csv to directly convert to .fit files',
          click: handleQuickConvert,
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: createAboutWindow,
        },
      ],
    },
  ]

  // Add mac menu
  isMac &&
    menuTemplate.unshift({
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    })

  // Remove help menu from Mac
  isMac && menuTemplate.pop()

  // Add devtools if in dev
  process.env.NODE_ENV === 'development' &&
    menuTemplate.push({
      label: 'Debug',
      submenu: [
        {
          label: 'Open dev tools',
          click: (menuItem, window) => window.webContents.openDevTools(),
          accelerator: 'CmdOrCtrl+Shift+I',
        },
      ],
    })

  return menuTemplate
}

// Create about window
function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    width: 500,
    height: 400,
    title: 'About Push Fitnotes',
    parent: mainWindow,
    modal: true,
    autoHideMenuBar: true,
  })
  aboutWindow.loadURL(ABOUT_WEBPACK_ENTRY)
}

// Create settings window
function createSettingsWindow() {
  const settingsWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Settings',
    parent: mainWindow,
    modal: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: SETTINGS_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  })
  settingsWindow.loadURL(SETTINGS_WINDOW_WEBPACK_ENTRY)
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

function handleLoadCSV() {
  selectCSV((filepath: string) =>
    loadCSV(filepath, (workouts: WorkoutT[]) => sendWorkoutsAsMessage(workouts))
  )
}

function handleQuickConvert() {
  selectCSV((filepath: string) =>
    loadCSV(filepath, (workouts: WorkoutT[]) => convertWorkouts(workouts))
  )
}

/* MAIN FUNCTIONS THAT DO STUFF */

function selectCSV(callback) {
  dialog
    .showOpenDialog({
      defaultPath: path.resolve(app.getAppPath(), CSV_DIR),
      properties: ['openFile'],
      filters: [{ name: 'CSV', extensions: ['csv'] }],
    })
    .then((res) => {
      console.log(res)
      if (!res.canceled) {
        if (res.filePaths.length) {
          callback(res.filePaths[0])
        }
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

function loadCSV(csvFilePath: string, callback) {
  if (!csvFilePath) {
    console.error('No valid CSV target!')
    return
  }

  mainWindow.webContents.send('is-loading', {
    success: true,
    message: 'Loading data from CSV',
  } as MessageT)

  const csvParser = new CSVParser({ csvFilePath: csvFilePath }, console.log)
  csvParser.parseData().then((res) => {
    callback(res)
  })
}

function sendWorkoutsAsMessage(data: WorkoutT[]) {
  mainWindow.webContents.send('loaded-csv-data', {
    success: true,
    message: 'Success!',
    data: data.sort(sortCounterAlphabetically),
  } as MessageT)
}

async function convertWorkouts(workouts: WorkoutT[]) {
  const outFitDir = await getOrCreateOutputDir()
  if (!outFitDir) {
    mainWindow.webContents.send('display-message', {
      title: "Can't save files!",
      html: 'An output folder has to be selected!',
    } as SweetAlertOptions)
  }
  mainWindow.webContents.send('is-loading', {
    success: true,
    message: 'Converting CSV file to FIT activities',
  } as MessageT)

  const converter = new Converter({ csvFilePath: '', outFitDir }, console.log)
  const activities = Converter.convertToFitActivities(workouts)
  const filenames = converter.writeActivitiesToFitFilesSync(activities)
  mainWindow.webContents.send('display-message', {
    title: 'Finished converting! The following files were created',
    html: /* html */ `<p>${filenames
      .sort(sortAlphabetically)
      .join(',<br/>')}</p>`,
  } as SweetAlertOptions)
}

async function handleConvertWorkout(
  event,
  message: WorkoutT
): Promise<MessageT> {
  const outFitDir = await getOrCreateOutputDir()
  if (!outFitDir) {
    return { success: false, message: 'An output folder has to be selected!' }
  }
  const converter = new Converter({ csvFilePath: '', outFitDir }, console.log)
  const activities = Converter.convertToFitActivities([message])
  const filenames = converter.writeActivitiesToFitFilesSync(activities)

  return { success: true, message: filenames[0], data: filenames[0] }
}

async function handleUploadWorkout(
  event,
  message: WorkoutT
): Promise<MessageT> {
  if (!message.meta?.fitFilename) {
    return { success: false, message: 'No .fit file specified for upload!' }
  }
  const garminCredentials = <SettingsT['garminCredentials']>(
    settings.getSync(SETTINGS_GARMIN_CREDENTIALS)
  )
  if (
    !garminCredentials ||
    !garminCredentials.username ||
    !garminCredentials.password
  ) {
    return { success: false, message: 'No Garmin credentials provided!' }
  }
  const response: MessageT = {
    success: true,
    message: '<p>Your workout has been uploaded to Garmin Connect!</p>',
  }
  const connector = new GarminConnector({ ...garminCredentials }, console.log)

  const gc: GarminConnect | void = await connector
    .logIntoGarminConnect()
    .catch((err) => {
      response.success = false
      response.message = "Couldn't log into Garmin Connect"
    })

  try {
    // login unsuccessful if no user hash
    if (!gc || !gc.userHash) {
      return { success: false, message: "Couldn't log into Garmin Connect" }
    }
  } catch (err) {
    console.error(err)
    return { success: false, message: "Couldn't log into Garmin Connect" }
  }

  const result = await connector
    .uploadActivity(message.meta.fitFilename)
    .then((res: any) => {
      if (!res.detailedImportResult.uploadId) {
        response.success = false
        response.message =
          "Failed uploading workout. Seems like it's a duplicate of another existing workout"
      } else {
        // uploadid is not the activityid ;(
        // response.message = response.message.concat(`<br/><a href="https://connect.garmin.com/modern/activity/${res.detailedImportResult.uploadId}">View workout here</a>`)
      }
    })
    .catch((err) => {
      response.success = false
      response.message = 'Failed uploading file'
    })

  return response
}

function handleGetSetting(event, message) {
  return settings.getSync(message)
}

async function handleGetAllSettings(event, message): Promise<MessageT> {
  const settingsGetAll = (): Promise<MessageT> => {
    return new Promise((resolve) => {
      settings.getAll((err, data) => {
        if (err) {
          resolve({
            success: false,
            message: err,
          })
        } else {
          resolve({
            success: true,
            message: 'Loaded settings',
            data,
          })
        }
      })
    })
  }
  return settingsGetAll()
}

async function handleSetSetting(
  event,
  message: SetSettingsI
): Promise<MessageT> {
  const settingsSet = (): Promise<MessageT> => {
    return new Promise((resolve) => {
      settings.set(message.key, message.data, (err) => {
        mainWindow.webContents.reload()
        if (err) {
          resolve({
            success: false,
            message: err,
          })
        } else {
          resolve({
            success: true,
            message: 'Settings successfully stored!',
          })
        }
      })
    })
  }
  return settingsSet()
}

async function handleSelectExportDir(event, message): Promise<MessageT> {
  const exportDataSettings = settings.getSync(
    SETTINGS_EXPORT_DATA
  ) as SettingsT['exportData']
  let outFitDir = exportDataSettings?.outputDir
  let response: MessageT = {
    success: true,
    message: 'Selected export directory',
  }
  await dialog
    .showOpenDialog({
      defaultPath: path.resolve(app.getAppPath(), OUTFIT_DIR),
      properties: ['openDirectory', 'createDirectory', 'promptToCreate'],
      message: 'Select an output directory for converted files',
    })
    .then((res) => {
      console.log(res)
      if (res.canceled) {
        response.success = false
        response.message = 'Failed to store export directory'
      } else {
        if (res.filePaths.length) {
          outFitDir = res.filePaths[0]
          settings.set(
            SETTINGS_EXPORT_DATA,
            { ...exportDataSettings, outputDir: outFitDir },
            (err) => {
              response.success = false
              response.message = 'Failed to store export directory'
            }
          )
          response.data = outFitDir
        }
      }
    })
    .catch((err) => {
      console.error(err)
    })
  console.log(outFitDir)
  return response
}

async function getOrCreateOutputDir() {
  const exportDataSettings = settings.getSync(
    SETTINGS_EXPORT_DATA
  ) as SettingsT['exportData']
  let outputDir = exportDataSettings?.outputDir
  console.log(outputDir)
  if (!outputDir) {
    await dialog
      .showOpenDialog({
        defaultPath: path.resolve(app.getAppPath(), OUTFIT_DIR),
        properties: ['openDirectory', 'createDirectory', 'promptToCreate'],
        message: 'Select an output directory for converted files',
      })
      .then((res) => {
        console.log(res)
        if (res.canceled) {
        } else {
          if (res.filePaths.length) {
            outputDir = res.filePaths[0]
            settings.set(
              SETTINGS_EXPORT_DATA,
              { ...exportDataSettings, outputDir },
              (err) => {
                console.error(err)
              }
            )
          }
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }
  console.log(outputDir)
  return outputDir
}
