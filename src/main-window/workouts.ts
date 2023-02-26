import { initCollapsible, updateCheckbox } from '../util/renderer'
import { updateValue } from '../util/renderer'
import { WorkoutT } from '../util/interfaces'
import { convertWorkout, uploadWorkout } from './renderer'
import {
  EXERCISE_TO_FIT_CATEGORY_MAP,
  getNamesFromDictValue,
} from '../util/FitCategoryMap'

export class Workouts extends HTMLElement {
  workouts: WorkoutT[]
  containerTemplateEl: HTMLTemplateElement
  constructor(workouts: WorkoutT[]) {
    super()

    this.workouts = workouts
    // Get template
    this.containerTemplateEl = document.getElementById(
      'container-template'
    ) as HTMLTemplateElement

    this.render()
  }

  render() {
    // Clean element
    this.innerHTML = ''
    // Append container
    const containerNode = this.containerTemplateEl.content.cloneNode(true)
    this.appendChild(containerNode)

    // Append workouts
    const containerEl = this.lastElementChild
    for (const workout of this.workouts) {
      const workoutEl = new WorkoutElement(workout)
      containerEl.appendChild(workoutEl)
    }
  }
}

class WorkoutElement extends HTMLElement {
  workoutTemplateEl: HTMLTemplateElement
  workout: WorkoutT
  constructor(workout: WorkoutT) {
    super()

    this.workout = workout
    this.workoutTemplateEl = document.getElementById(
      'workout-template'
    ) as HTMLTemplateElement

    this.render()
  }

  render() {
    this.innerHTML = ''
    const workoutNode = this.workoutTemplateEl.content.cloneNode(true)
    this.appendChild(workoutNode)
    const workoutEl = this.lastElementChild

    workoutEl.querySelector('span.date').innerHTML = new Date(
      this.workout.date
    ).toLocaleDateString('de')

    const selectWorkoutCheckbox: HTMLInputElement = workoutEl.querySelector(
      'input.select-workout'
    )
    selectWorkoutCheckbox.checked = this.workout.meta.selected
    selectWorkoutCheckbox.onchange = (e) =>
      this.updateCheckbox(e, this.workout.meta, 'selected', this)

    const convertWorkoutBtn: HTMLButtonElement = workoutEl.querySelector(
      'button[name=convert]'
    )
    convertWorkoutBtn.onclick = (e) => this.handleConvertWorkout(e)

    const uploadWorkoutBtn: HTMLButtonElement = workoutEl.querySelector(
      'button[name=upload]'
    )
    uploadWorkoutBtn.disabled =
      !this.workout.meta.converted || this.workout.meta.uploaded
    uploadWorkoutBtn.onclick = (e) => this.handleUploadWorkout(e)

    // Append exercises for each workout
    const exercisesContainerEl = workoutEl.querySelector('div.exercises')
    for (const exercise of this.workout.exercises) {
      const exerciseEl = new ExerciseElement(exercise)
      exercisesContainerEl.appendChild(exerciseEl)
    }
  }

  updateCheckbox = updateCheckbox

  async handleConvertWorkout(e: Event) {
    e.stopPropagation()

    const filename = await convertWorkout(this.workout)
    this.workout.meta.converted = !!filename
    this.workout.meta.fitFilename = filename
    this.render()
    initCollapsible()
  }

  async handleUploadWorkout(e: Event) {
    e.stopPropagation()

    const success = await uploadWorkout(this.workout)
    this.workout.meta.uploaded = success
    this.render()
    initCollapsible()
  }
}

class ExerciseElement extends HTMLElement {
  exercisesTemplateEl: HTMLTemplateElement
  exercise: WorkoutT['exercises']['0']
  constructor(exercise: WorkoutT['exercises']['0']) {
    super()

    this.exercise = exercise
    this.exercisesTemplateEl = document.getElementById(
      'exercises-template'
    ) as HTMLTemplateElement

    this.render()
  }

  render() {
    this.innerHTML = ''
    const exercisesNode = this.exercisesTemplateEl.content.cloneNode(true)
    this.appendChild(exercisesNode)
    const exerciseEl = this.lastElementChild

    const csvNameEl: HTMLInputElement =
      exerciseEl.querySelector('input.csvName')
    csvNameEl.value = this.exercise.fitnotesName
    csvNameEl.onchange = (e) =>
      this.updateValue(e, this.exercise, 'fitnotesName', this)
    const fitNameEl: HTMLInputElement =
      exerciseEl.querySelector('input.fitName')
    fitNameEl.value = getNamesFromDictValue(
      EXERCISE_TO_FIT_CATEGORY_MAP[this.exercise.fitnotesName]
    ).subCategory //this.exercise.fitName?.toString()
    fitNameEl.onchange = (e) =>
      this.updateValue(e, this.exercise, 'fitName', this)

    // Append sets for each exercise
    const setsContainerEl = exerciseEl.querySelector('div.sets')
    for (const set of this.exercise.sets) {
      const test = new SetElement(set)
      setsContainerEl.appendChild(test)
    }
  }

  updateValue = updateValue
}

class SetElement extends HTMLElement {
  setsTemplateEl: HTMLTemplateElement
  set: WorkoutT['exercises']['0']['sets']['0']
  constructor(set: WorkoutT['exercises']['0']['sets']['0']) {
    super()

    this.set = set
    this.setsTemplateEl = document.getElementById(
      'sets-template'
    ) as HTMLTemplateElement

    this.render()
  }

  render() {
    this.innerHTML = ''
    const setsNode = this.setsTemplateEl.content.cloneNode(true)
    this.appendChild(setsNode)
    const setEl = this.lastElementChild

    const weightEl: HTMLInputElement = setEl.querySelector('input.weight')
    weightEl.value = this.set.weight.toString()
    weightEl.onchange = (e) => this.updateValue(e, this.set, 'weight', this)
    const repsEl: HTMLInputElement = setEl.querySelector('input.reps')
    repsEl.value = this.set.reps.toString()
    repsEl.onchange = (e) => this.updateValue(e, this.set, 'reps', this)
    const timeEl: HTMLInputElement = setEl.querySelector('input.time')
    timeEl.value = this.set.time?.toString()
    timeEl.onchange = (e) => this.updateValue(e, this.set, 'time', this)
    const restTimeEl: HTMLInputElement = setEl.querySelector('input.rest-time')
    restTimeEl.value = this.set.restTime?.toString()
    restTimeEl.onchange = (e) => this.updateValue(e, this.set, 'restTime', this)
  }

  updateValue = updateValue
}

customElements.define('workouts-wrapper', Workouts)
customElements.define('workout-workout', WorkoutElement)
customElements.define('workout-exercise', ExerciseElement)
customElements.define('workout-set', SetElement)
