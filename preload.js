//arquivo de pre-recarregamento e reforço de segurança na
//comunicação entr processos (IPC)


//IMportação dos recursos do framework electron
//ContextBridge (segurança) ipcrenderer(comunicação)
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
    clientwindow: () => ipcRenderer.send('client-window'),
    oswindow: () => ipcRenderer.send('os-window')
})