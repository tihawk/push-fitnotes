import 'material-icons'
import M from 'materialize-css'
import { MessageT, SettingsI } from '../util/interfaces'
import '../index.min.css'
import { Toast, updateValue } from '../util/renderer'

document.addEventListener('DOMContentLoaded', function () {
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
    const settings: SettingsI = response.data
    if (!settings.garminCredentials) {
      settings.garminCredentials = <SettingsI['garminCredentials']>{}
    }
    const usernameEl = document.getElementById('username') as HTMLInputElement
    usernameEl.value = settings.garminCredentials?.username || ''
    usernameEl.onchange = (e) =>
      updateValue(e, settings.garminCredentials, 'username')
    const passwordEl = document.getElementById('password') as HTMLInputElement
    passwordEl.value = settings.garminCredentials?.password || ''
    passwordEl.onchange = (e) =>
      updateValue(e, settings.garminCredentials, 'password')

    const saveButtonEl = document.getElementById('save-settings')
    saveButtonEl.onclick = (e) => saveSettings(settings)
  }
}

async function saveSettings(data: SettingsI) {
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
