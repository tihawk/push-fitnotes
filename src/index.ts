import {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
  dialog,
  ipcMain,
} from 'electron'
import { Converter } from './converter'
import { GarminConnector } from './garmin-connector'
import { isMac, LocalStorage, sortAlphabetically } from './util'
import path from 'path'
import { CSVParser } from './csv-parser'
import { cwd } from 'process'
import { CSV_DIR } from './util/constants'
import { SweetAlertOptions } from 'sweetalert2'
import { WorkoutT } from './util/interfaces'

// a class to keep track of in-memory vars
const localStorage = new LocalStorage()

// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

let mainWindow
const createWindow = (): void => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1000,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      // sandbox: false,
      // nodeIntegration: true // https://stackoverflow.com/questions/60227586/ipcrenderer-not-receiving-message-from-main-process
      allowRunningInsecureContent: true,
    },
  })
  console.log(process.versions)
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()

  // Create menu from template
  const menu = Menu.buildFromTemplate(getMenuTemplate())
  Menu.setApplicationMenu(menu)

  // Listen to events
  ipcMain.handle('convert-workout', handleConvertWorkout)
  ipcMain.handle('upload-workout', handleUploadWorkout)
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

  return menuTemplate
}

// Create about window
function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    width: 500,
    height: 400,
    title: 'About Push Fitnotes',
  })

  aboutWindow.loadFile(path.join(__dirname, '../renderer/about/index.html'))
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

function handleLoadCSV() {
  selectCSV(loadCSV)
}

function handleQuickConvert() {
  selectCSV(convertCSV)
}

/* MAIN FUNCTIONS THAT DO STUFF */

function selectCSV(callback) {
  dialog
    .showOpenDialog({
      defaultPath: path.resolve(cwd(), CSV_DIR),
      properties: ['openFile'],
      filters: [{ name: 'CSV', extensions: ['csv'] }],
    })
    .then((res) => {
      console.log(res)
      if (!res.canceled) {
        if (res.filePaths.length) {
          localStorage.csvPath = res.filePaths[0]
          callback()
        }
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

function loadCSV() {
  const csvFilePath = localStorage.csvPath
  if (!csvFilePath) {
    console.error('No valid CSV target!')
    return
  }

  const csvParser = new CSVParser({ csvFilePath: csvFilePath }, console.log)
  csvParser.parseData().then((res) => {
    mainWindow.webContents.send('loaded-csv-data', {
      data: res,
    })
  })
}

function convertCSV() {
  const csvFilePath = localStorage.csvPath
  if (!csvFilePath) {
    console.error('No valid CSV target!')
    return
  }

  const converter = new Converter(
    {
      csvFilePath: csvFilePath,
    },
    console.log
  )

  const activities = converter.convertToFitActivities()
  const filenames = converter.writeActivitiesToFitFilesSync(activities)

  mainWindow.webContents.send('display-message', {
    title: 'Finished converting! The following files were created',
    html: /* html */ `<p>${filenames
      .sort(sortAlphabetically)
      .join(',<br/>')}</p>`,
  } as SweetAlertOptions)
}

function handleConvertWorkout(event, message: WorkoutT) {
  console.log(message)
  return 'bs'
}

function handleUploadWorkout(event, message: WorkoutT) {
  console.log(message)
  return message.meta.converted && message.meta.fitFilename
}

// function debug() {
//   const converter = new Converter(
//     { csvFilename: 'FitNotes_Export_2023_02_08_19_56_10.csv' },
//     console.log
//   )
//   const activities = converter.convertToFitActivities()
//   const filenames = converter.writeActivitiesToFitFiles(activities)

//   const uploader = new GarminConnector({}, console.log)
//   uploader.logIntoGarminConnect().then(() => {
//     for (const file of filenames) {
//       uploader.uploadActivity(file)
//     }
//   })
// }
