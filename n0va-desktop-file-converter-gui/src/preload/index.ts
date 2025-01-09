import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  selectFolder: function (): Promise<string> {
    return ipcRenderer.invoke("selectFolder")
  },
  findN0vaCachePath: function (dir: string): Promise<string> {
    return ipcRenderer.invoke("findN0vaCachePath", dir)
  },
  extract: function (n0vaCachePath: string, savePath: string): Promise<boolean> {
    return ipcRenderer.invoke("extract", n0vaCachePath, savePath)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
