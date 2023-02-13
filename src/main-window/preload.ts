// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { WorkoutT } from '../util/interfaces'

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // receive from main
  onGeneralIsLoading: (callback) => ipcRenderer.on('is-loading', callback),
  onLoadedCSVData: (callback) => ipcRenderer.on('loaded-csv-data', callback),
  onDisplayMessage: (callback) => ipcRenderer.on('display-message', callback),
  // two-way communication
  convertWorkout: (workout: WorkoutT) =>
    ipcRenderer.invoke('convert-workout', workout),
  uploadWorkout: (workout: WorkoutT) =>
    ipcRenderer.invoke('upload-workout', workout),
  getSetting: (key: string) => ipcRenderer.invoke('get-setting', key),
})
