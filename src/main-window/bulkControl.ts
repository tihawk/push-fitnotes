import { SettingsT, WorkoutT } from '../util/interfaces'
import {
  convertWorkout,
  getExportDataSettings,
  uploadWorkout,
} from './renderer'
import {
  EXERCISE_TO_FIT_CATEGORY_MAP,
  getNamesFromDictValue,
} from '../util/FitCategoryMap'

export class BulkControl extends HTMLElement {
  workouts: WorkoutT[]
  bulkControlTemplateEl: HTMLTemplateElement
  constructor(workouts: WorkoutT[]) {
    super()

    this.workouts = workouts
    // Get template
    this.bulkControlTemplateEl = document.getElementById(
      'bulk-control-template'
    ) as HTMLTemplateElement

    this.render()
  }

  render() {
    // Clean element
    this.innerHTML = ''
    // Append container
    const bulkControlNode = this.bulkControlTemplateEl.content.cloneNode(true)
    this.appendChild(bulkControlNode)

    // Append bulk control buttons
    //    const bulkControlEl = this.lastElementChild

    //    const convertWorkoutBtn: HTMLButtonElement = bulkControlEl.querySelector(
    //      'button[name=bulk_convert]'
    //    )
    //    //convertWorkoutBtn.onclick = (e) => this.handleConvertWorkout(e)
    //
    //    const uploadWorkoutBtn: HTMLButtonElement = bulkControlEl.querySelector(
    //      'button[name=bulk_upload]'
    //    )
    //uploadWorkoutBtn.disabled =
    //  !this.workout.meta.converted || this.workout.meta.uploaded
    //uploadWorkoutBtn.onclick = (e) => this.handleUploadWorkout(e)
  }
}

customElements.define('bulk-control-wrapper', BulkControl)
