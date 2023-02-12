import path from 'path'
import { cwd } from 'process'

export function getAbsolutePath(relativePath: string): string {
  return path.join(cwd(), relativePath)
}

export const isMac = process.platform === 'darwin'

export function timeStringToFloatMinutes(time: string): number {
  const hoursMinutesSeconds = time.split(/[.:]/)
  const hours = parseInt(hoursMinutesSeconds[0], 10)
  const minutes = hoursMinutesSeconds[1]
    ? parseInt(hoursMinutesSeconds[1], 10)
    : 0
  const seconds = hoursMinutesSeconds[2]
    ? parseInt(hoursMinutesSeconds[2], 10)
    : 0
  return hours * 60 + minutes + seconds / 60
}

export class LocalStorage {
  csvPath
  constructor() {}
}

export function sortAlphabetically(a, b) {
  return a === b ? 0 : a < b ? -1 : 1
}

export function sortCounterAlphabetically(a, b) {
  return a === b ? 0 : a > b ? -1 : 1
}
