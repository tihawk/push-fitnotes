import { SettingsT, WorkoutT } from '../util/interfaces'
import { convertWorkouts, getExportDataSettings } from './renderer'
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

    const bulkConvertBtn: HTMLButtonElement = this.querySelector(
      'button[name=bulk-convert]'
    )
    bulkConvertBtn.innerText = `Convert Selected (${
      this.getSelectedWorkouts().length
    })`
    bulkConvertBtn.disabled = !this.getSelectedWorkouts().length
    bulkConvertBtn.onclick = (e) => this.handleBulkConvert(e)

    const bulkUploadBtn: HTMLButtonElement = this.querySelector(
      'button[name=bulk-upload]'
    )
    bulkUploadBtn.disabled = this.isUploadDisabled()
    bulkUploadBtn.innerText = `Upload Selected (${
      this.getSelectedWorkouts().filter((wo) => wo.meta.converted).length
    })`
    //uploadWorkoutBtn.onclick = (e) => this.handleUploadWorkout(e)
  }

  async handleBulkConvert(e) {
    const success = await convertWorkouts(this.getSelectedWorkouts())
    if (success) {
      this.workouts.forEach((wo) => {
        if (wo.meta.selected) wo.meta.converted = true
      })
    }
    this.render()
  }

  getSelectedWorkouts() {
    return this.workouts.filter((wo) => wo.meta.selected)
  }

  isUploadDisabled() {
    return this.getSelectedWorkouts().every(
      (wo) => !wo.meta.converted || wo.meta.uploaded
    )
  }
}

customElements.define('bulk-control-wrapper', BulkControl)
