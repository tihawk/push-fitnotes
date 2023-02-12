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
import 'materialize-css'
import Swal from 'sweetalert2'

let workouts: WorkoutT[]

window.electronAPI.onLoadedCSVData((e, message) => {
  workouts = message.data
  const workoutsEl = new Workouts(workouts)
  document.body.appendChild(workoutsEl)
})

window.electronAPI.onDisplayMessage((e, message) => {
  Swal.fire(message)
})
