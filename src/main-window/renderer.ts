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
import { WorkoutT } from '../util/interfaces'
import Swal from 'sweetalert2'
import M from 'materialize-css'
import 'material-icons'

document.addEventListener('DOMContentLoaded', function () {
  initCollapsible()
})

let workouts: WorkoutT[]

window.electronAPI.onLoadedCSVData((e, message) => {
  workouts = message.data
  const workoutsEl = new Workouts(workouts)
  document.body.appendChild(workoutsEl)
  initCollapsible()
})

window.electronAPI.onDisplayMessage((e, message) => {
  Swal.fire(message)
})

export function initCollapsible() {
  var elems = document.querySelectorAll('.collapsible')
  var instances = M.Collapsible.init(elems, { accordion: false })
}

export async function convertWorkout(
  workout: WorkoutT
): Promise<string | null> {
  const success: string = await window.electronAPI.convertWorkout(workout)
  Swal.fire({
    title: success ? 'Success!' : 'Failed!',
    text: success && 'You can now upload your workout to Garmin Connect!',
  })
  return success
}

export async function uploadWorkout(workout: WorkoutT): Promise<boolean> {
  const success: boolean = await window.electronAPI.uploadWorkout(workout)
  Swal.fire({
    title: success ? 'Success!' : 'Failed!',
    text: success && 'Your workout has been uploaded to Garmin Connect!',
  })
  return success
}
