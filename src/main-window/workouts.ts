import { WorkoutT } from '../util/interfaces'

export class Workouts extends HTMLElement {
  workouts: WorkoutT[]
  containerTemplateEl
  workoutTemplateEl
  exercisesTemplateEl
  setsTemplateEl
  shadow

  constructor(workouts) {
    super()

    this.workouts = workouts
    this.shadow = this.attachShadow({ mode: 'open' })

    // Get templates
    this.containerTemplateEl = document.getElementById(
      'container-template'
    ) as HTMLTemplateElement
    this.workoutTemplateEl = document.getElementById(
      'workout-template'
    ) as HTMLTemplateElement
    this.exercisesTemplateEl = document.getElementById(
      'exercises-template'
    ) as HTMLTemplateElement
    this.setsTemplateEl = document.getElementById(
      'sets-template'
    ) as HTMLTemplateElement

    this.render()
  }

  render() {
    // Clean shadow
    this.shadow.innerHTML = ''
    // Append container
    const containerNode = this.containerTemplateEl.content.cloneNode(true)
    this.shadow.appendChild(containerNode)
    const containerEl = this.shadow.lastElementChild

    // Append workouts
    for (const workout of this.workouts) {
      const workoutNode = this.workoutTemplateEl.content.cloneNode(true)
      containerEl.appendChild(workoutNode)
      const workoutEl = containerEl.lastElementChild

      workoutEl.querySelector('span.date').innerHTML = new Date(
        workout.date
      ).toLocaleDateString('de')
      // Append exercises for each workout
      const exercisesContainerEl = workoutEl.querySelector('div.exercises')
      for (const exercise of workout.exercises) {
        const exercisesNode = this.exercisesTemplateEl.content.cloneNode(true)
        exercisesContainerEl.appendChild(exercisesNode)
        const exerciseEl = exercisesContainerEl.lastElementChild

        // const p = exerEl.querySelector('p')
        // p.innerHTML = `${exercise.fitnotesName} but also known as ${exercise.fitName}`
        const csvNameEl: HTMLInputElement =
          exerciseEl.querySelector('input.csvName')
        csvNameEl.value = exercise.fitnotesName
        csvNameEl.onchange = (e) =>
          this.updateValue(e, exercise, 'fitnotesName', this.workouts)
        const fitNameEl: HTMLInputElement =
          exerciseEl.querySelector('input.fitName')
        fitNameEl.value = exercise.fitName?.toString()
        fitNameEl.onchange = (e) =>
          this.updateValue(e, exercise, 'fitName', this.workouts)

        // Append sets for each exercise
        const setsContainerEl = exerciseEl.querySelector('div.sets')
        for (const set of exercise.sets) {
          const setsNode = this.setsTemplateEl.content.cloneNode(true)
          setsContainerEl.appendChild(setsNode)
          const setEl = setsContainerEl.lastElementChild

          const weightEl: HTMLInputElement = setEl.querySelector('input.weight')
          weightEl.value = set.weight.toString()
          weightEl.onchange = (e) =>
            this.updateValue(e, set, 'weight', this.workouts)
          const repsEl: HTMLInputElement = setEl.querySelector('input.reps')
          repsEl.value = set.reps.toString()
          repsEl.onchange = (e) =>
            this.updateValue(e, set, 'reps', this.workouts)
          const timeEl: HTMLInputElement = setEl.querySelector('input.time')
          timeEl.value = set.time?.toString()
          timeEl.onchange = (e) =>
            this.updateValue(e, set, 'time', this.workouts)
          const restTimeEl: HTMLInputElement =
            setEl.querySelector('input.rest-time')
          restTimeEl.value = set.restTime?.toString()
          restTimeEl.onchange = (e) =>
            this.updateValue(e, set, 'restTime', this.workouts)
        }
      }
    }
  }

  updateValue(e: Event, object, key, more) {
    // @ts-ignore
    object[key] = e.target.value
    console.log(more)
    this.render()
  }
}
