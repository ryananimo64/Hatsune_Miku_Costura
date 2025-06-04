const { contextBridge, ipcRenderer } = require('electron')
const Renderer = require('electron/renderer')
ipcRenderer.send('db-connect')

contextBridge.exposeInMainWorld('api', {
    clientwindow: () => ipcRenderer.send('client-window'),
    oswindow: () => ipcRenderer.send('os-window'),
    dbStatus: (message) => ipcRenderer.on('db-status',message),
    newClient: (client) => ipcRenderer.send('new-client',client),
    newOs: (OS) => ipcRenderer.send("new-os", OS),
    resetForm: (args) => ipcRenderer.on('reset-form', args),
    searchName: (Name) => ipcRenderer.send('search-name', Name) ,
    renderClient: (dataClient) => ipcRenderer.on('render-client', dataClient),
    validateSearch: () => ipcRenderer.send('validate-search'),
    setClient: (args) => ipcRenderer.on('set-client', args),
    deleteClient: (id) => ipcRenderer.send('delete-client',id),
    deleteOS: (idOS) => ipcRenderer.send('delete-os',idOS),
    updateClient: (client) => ipcRenderer.send('update-client',client),
    updateOS: (OS) => ipcRenderer.send('update-os',OS),
    searchOS: () => ipcRenderer.send('search-os'),
    searchClients: (clients) => ipcRenderer.send('search-clients',clients),
    listClients: (clients) => ipcRenderer.on('list-clients', clients),
    renderOS: (dataOS) => ipcRenderer.on('render-os',dataOS),
    printOS: () => ipcRenderer.send('print-os')
})