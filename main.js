console.log("Processo principal")

const { app, BrowserWindow, nativeTheme, Menu, ipcMain } = require('electron')
const { link } = require('node:fs')

const path = require('node:path')

//importação dos metodos conectar e desconectar(modulo de conexão)
const {conectar , desconectar} = require("./database.js")

// Importação do schema Clientes da camada model
const clientModel = require ('./src/models/Clientes.js')

// Janela principal
let win
const createWindow = () => {
    // a linha abaixo define o tema (claro ou escuro)
    nativeTheme.themeSource = 'light' //(dark ou light)
    win = new BrowserWindow({
        width: 800,
        height: 500,
        //autoHideMenuBar: true,
        //minimizable: false,
        resizable: false,
        modal: true,
        //ativação do preload
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // menu personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')

    ipcMain.on('client-window', () => {
        clientwindow()
    })
    ipcMain.on('os-window', () => {
        oswindow()
    })
}
//Fim da janela principal

// Janela Sobre
function aboutWindow(){
    nativeTheme.themeSource ='dark'
    //a linha abaixo obtém a janela principal
    const main = BrowserWindow.getFocusedWindow()
    let about
    //estabelecer uma relação hierarquica entre janelas
    if (main) {
      //criar a janela sobre
       about = new BrowserWindow({
        width: 360,
        height: 260,
        autoHideMenuBar: true,
        resizable:false,
        minimizable: false,
        parent: main,
        modal: true
       })
    }
    //carregar o documento html na janela
    about.loadFile('./src/views/sobre.html')
  }

  let client
  function clientwindow() {
      nativeTheme.themeSource = 'light'
      const main = BrowserWindow.getFocusedWindow()
      if(main) {
          client = new BrowserWindow({
              width: 1010,
              height: 820,
              autoHideMenuBar: true,
              resizable: false,
              parent: main,
              modal: true,
              webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
            
          })
      }
      client.loadFile('./src/views/cadastro.html')
      client.center()
  }


  let os
function oswindow() {
    nativeTheme.themeSource = 'light'
    const main = BrowserWindow.getFocusedWindow()
    if(main) {
        client = new BrowserWindow({
            width: 1010,
            height: 820,
            autoHideMenuBar: true,
            resizable: false,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    client.loadFile('./src/views/os.html')
    client.center()
}
// Iniciar a aplicação
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
//reduzir logs não critico
app.commandLine.appendSwitch('log-level', '3')

//iniciar a conexão com o banco de dados
ipcMain.on('db-connect', async (event) => {



let conectado = await conectar()

if(conectado){   
        setTimeout(() => {
            event.reply('db-status',"Conectado")
        },500)
        
}
})
// Importante !! Deconectar  do banco de dados quando a aplicação for encerrada
app.on('before-quit', () =>{
     desconectar()
})

// template do menu
const template = [
    {
        label: 'Cadastro',
        submenu: [
            {
                label: 'Clientes',
                click: () => clientwindow()
            },
            {
                label: 'OS',
                click: () => oswindow()
            },
            {
                type: 'separator'
            },
            
            {
                label: 'Sair',
                click: () => app.quit(),
                accelerator: 'Alt+F4'
            }
        ]
    },
    {
        label: 'Relatórios',
        submenu: [
            {
                label: 'Clientes'
              },
              {
                label: 'OS abertas'
              },
              {
                label: 'OS concluídas'
              }
        
    ]
    },    
    {
        label: 'Ferramentas',
        submenu: [
            {
                label: 'Aplicar zoom',
                role: 'zoomIn'
            },
            {
                label: 'Reduzir',
                role: 'zoomOut'
            },
            {
                label: 'Restaurar o zoom padrão',
                role: 'resetZoom'
            },
            {
                type: 'separator'
            },
            {
              label: 'Recarregar',
               role: 'reload'
            },
            {
                label: 'Ferramentas do desenvolvedor',
                role: 'toggleDevTools'
            }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Sobre',
                click: () => aboutWindow()
            }
        ]
    }
]

//======================================
//== CLIENTES CRUD CREATE

// recebimento do objeto que contem
ipcMain.on('new-client', async (event, client) => {
    // IMPORTANTE!! teste do passo dois
    console.log(client)
    // Cadastrar a estrutura de dados do banco de dados Mongodb
    //ATENÇÃO !! os atributos deve ser identicos ao modelo de dados clientes.js
    //
    try {
        //cria uma nova estrutura de dados usando classe  modelo
        const newClient = new clientModel({
            nomeCliente: client.nameCli,
            cpfCliente: client.cpfCli,
            emailCliente: client.emailCli,
            foneCliente: client.foneCli,
            enderecoCliente: client.addressCli
        })
         //salvar os dados Clientes no banco de dados
         await newClient.save()
    } catch (error) {
        console.log(error)
    } 
})

//== FIM - CLIENTES - CRUD CREATE