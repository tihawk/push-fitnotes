// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { WorkoutT } from '../util/interfaces'

import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // Receive from main
  onGeneralIsLoading: (callback) => ipcRenderer.on('is-loading', callback),
  onLoadedCSVData: (callback) => ipcRenderer.on('loaded-csv-data', callback),
  onDisplayMessage: (callback) => ipcRenderer.on('display-message', callback),
  // Two-way communication
  convertWorkout: (workout: WorkoutT) =>
    ipcRenderer.invoke('convert-workout', workout),
  convertWorkouts: (workouts: WorkoutT[]) =>
    ipcRenderer.invoke('convert-workouts', workouts),
  uploadWorkout: (workout: WorkoutT) =>
    ipcRenderer.invoke('upload-workout', workout),
  getSetting: (key: string) => ipcRenderer.invoke('get-setting', key),
})
