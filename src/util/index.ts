import path from 'path'

export function getAbsolutePath(relativePath: string): string {
  return path.join(__dirname, relativePath)
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

export function floatMinutesTommss(minutes: number): string {
  const sign = minutes < 0 ? '-' : ''
  const min = Math.floor(Math.abs(minutes))
  const sec = Math.floor((Math.abs(minutes) * 60) % 60)
  return sign + (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec
}

export class LocalStorage {
  csvPath: string
  constructor() {}
}

export function sortAlphabetically(a, b) {
  return a === b ? 0 : a < b ? -1 : 1
}

export function sortCounterAlphabetically(a, b) {
  return a === b ? 0 : a > b ? -1 : 1
}
