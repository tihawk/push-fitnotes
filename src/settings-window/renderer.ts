import 'material-icons'
import M from 'materialize-css'
import { MessageT, SettingsT } from '../util/interfaces'
import '../index.min.css'
import { Toast, updateCheckbox, updateValue } from '../util/renderer'

document.addEventListener('DOMContentLoaded', function () {
  const elems = document.querySelectorAll('.tooltipped')
  const instances = M.Tooltip.init(elems)
  populateSettings()
})

async function populateSettings() {
  const response = await (<Promise<MessageT>>(
    window.electronAPI.getAllSettings()
  ))
  if (!response.success) {
    Toast.fire({
      title: response.message,
    })
  } else {
    const settings: SettingsT = response.data
    if (!settings.garminCredentials) {
      settings.garminCredentials = <SettingsT['garminCredentials']>{}
    }
    if (!settings.exportData) {
      settings.exportData = <SettingsT['exportData']>{}
    }
    const usernameEl = document.getElementById('username') as HTMLInputElement
    usernameEl.value = settings.garminCredentials?.username || ''
    usernameEl.onchange = (e) =>
      updateValue(e, settings.garminCredentials, 'username')
    const passwordEl = document.getElementById('password') as HTMLInputElement
    passwordEl.value = settings.garminCredentials?.password || ''
    passwordEl.onchange = (e) =>
      updateValue(e, settings.garminCredentials, 'password')

    const outputDirBtn = document.getElementById(
      'output-dir'
    ) as HTMLInputElement
    outputDirBtn.value =
      settings.exportData?.outputDir || 'Select an Export Directory'
    outputDirBtn.onclick = async (e) => {
      const response: MessageT = await window.electronAPI.selectExportDir()
      outputDirBtn.value = response.data
      settings.exportData.outputDir = response.data
    }

    const avgHrEl = document.getElementById('avg-heartrate') as HTMLInputElement
    avgHrEl.value = settings.exportData?.defaultAvgHeartrate?.toString()
    avgHrEl.onchange = (e) => {
      updateValue(e, settings.exportData, 'defaultAvgHeartrate')
    }

    const shouldGenerateHeartrateEl = document.getElementById(
      'heartrate-records'
    ) as HTMLInputElement
    shouldGenerateHeartrateEl.checked =
      settings.exportData?.shouldGenerateHeartrate
    shouldGenerateHeartrateEl.onchange = (e) => {
      updateCheckbox(e, settings.exportData, 'shouldGenerateHeartrate')
    }

    const defActiveTimeEl = document.getElementById(
      'active-time'
    ) as HTMLInputElement
    // @ts-ignore
    defActiveTimeEl.value = settings.exportData?.defaultActiveTime
    defActiveTimeEl.onchange = (e) =>
      updateValue(e, settings.exportData, 'defaultActiveTime')

    const defRestTimeEl = document.getElementById(
      'rest-time'
    ) as HTMLInputElement
    // @ts-ignore
    defRestTimeEl.value = settings.exportData?.defaultRestTime
    defRestTimeEl.onchange = (e) =>
      updateValue(e, settings.exportData, 'defaultRestTime')

    const saveButtonEl = document.getElementById('save-settings')
    saveButtonEl.onclick = (e) => saveSettings(settings)
  }
}

async function saveSettings(data: SettingsT) {
  for (const settingKey of Object.keys(data)) {
    const response: MessageT = await window.electronAPI.setSetting(
      settingKey,
      data[settingKey]
    )
    Toast.fire({
      icon: response.success ? 'success' : 'error',
      title: response.success ? 'Success!' : 'Failed!',
      text: response.message,
    })
  }
}
