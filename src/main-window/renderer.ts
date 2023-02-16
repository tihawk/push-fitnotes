/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import '../index.min.css'
import { Workouts } from './workouts'
import { MessageT, SettingsT, WorkoutT } from '../util/interfaces'
import Swal from 'sweetalert2'
import M from 'materialize-css'
import 'material-icons'
import { NotificationElement } from './notification'
import { initCollapsible, Progress, Toast } from '../util/renderer'

document.addEventListener('DOMContentLoaded', function () {
  validateSettings()
  initCollapsible()
})

let workouts: WorkoutT[]

window.electronAPI.onGeneralIsLoading((e, message) => {
  Progress.fire({
    text: message.message,
  })
})

window.electronAPI.onLoadedCSVData((e, message) => {
  Toast.fire({
    text: message.message,
    icon: message.success ? 'success' : 'error',
  })
  workouts = message.data
  const workoutsEl = new Workouts(workouts)
  document.body.appendChild(workoutsEl)
  initCollapsible()
})

window.electronAPI.onDisplayMessage((e, message) => {
  Swal.fire(message)
})

export async function convertWorkout(workout: WorkoutT): Promise<string> {
  Progress.fire()
  const message: MessageT = await window.electronAPI.convertWorkout(workout)
  Toast.fire({
    icon: message.success ? 'success' : 'error',
    title: message.success ? 'Success!' : 'Failed!',
    text: message.success
      ? 'You can now upload your workout to Garmin Connect!'
      : message.message,
  })
  return message.data
}

export async function uploadWorkout(workout: WorkoutT): Promise<boolean> {
  Progress.fire()
  const message: MessageT = await window.electronAPI.uploadWorkout(workout)
  Swal.fire({
    icon: message.success ? 'success' : 'error',
    title: message.success ? 'Success!' : 'Failed!',
    html: message.message,
  })
  return message.success
}

async function validateSettings() {
  const { username, password } = await (<
    Promise<SettingsT['garminCredentials']>
  >window.electronAPI.getSetting('garminCredentials'))
  if (!username || !password) {
    const noGarminCredentialsNotification = new NotificationElement({
      level: 'warning',
      message:
        "You haven't set up your Garmin Credentials yet. You won't be able to upload any workouts to Garmin Connect, until you do. Go to File > Settings to set up your Garmin Connect credentials. Note, that these will be only stored locally, and won't be used for anything else beyond what this app provides as functionality.",
    })
  }
}
