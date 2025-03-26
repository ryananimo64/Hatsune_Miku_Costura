//arquivo de pre-recarregamento e reforço de segurança na
//comunicação entr processos (IPC)


//IMportação dos recursos do framework electron
//ContextBridge (segurança) ipcrenderer(comunicação)
const { contextBridge, ipcRenderer } = require('electron')

// Enviar ao main um pedido para conexão com o banco de dados e
//troca de icone no processo de renderização(index.html - renderer.html)
ipcRenderer.send('db-connect')


contextBridge.exposeInMainWorld('api', {
    clientwindow: () => ipcRenderer.send('client-window'),
    oswindow: () => ipcRenderer.send('os-window'),
    dbStatus: (message) => ipcRenderer.on('db-status',message),
    newClient: (client) => ipcRenderer.send('new-client',client),
    newOs: (OS) => ipcRenderer.send("new-os", OS)
})