const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // receive from main
  // two-way communication
  getSetting: (key: string) => ipcRenderer.invoke('get-setting', key),
  getAllSettings: () => ipcRenderer.invoke('get-all-settings'),
  setSetting: (key: string, data: object) =>
    ipcRenderer.invoke('set-setting', { key, data }),
  selectExportDir: () => ipcRenderer.invoke('select-export-dir'),
})
