console.log("Processo principal")

const { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, shell } = require('electron')
const { link } = require('node:fs')

const path = require('node:path')

//importação dos metodos conectar e desconectar(modulo de conexão)
const { conectar, desconectar } = require("./database.js")

const mongoose = require('mongoose')

// Importação do schema Clientes da camada model
const clientModel = require('./src/models/Clientes.js')

// Importação do pacote jspdf (npm i jspdf)
const { jspdf, default: jsPDF } = require('jspdf')

// Importação da biblioteca FS (nativa do JavaScript) para manipulação de arquivos (no caso arquvios pdf)
const fs = require('fs')

const prompt = require('electron-prompt')

const OSModel = require('./src/models/OS.js')
const Clientes = require('./src/models/Clientes.js')
const { error } = require('node:console')


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
function aboutWindow() {
    nativeTheme.themeSource = 'dark'
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
            resizable: false,
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
    if (main) {
        client = new BrowserWindow({
            width: 1010,
            height: 720,
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
    if (main) {
        client = new BrowserWindow({
            width: 1010,
            height: 720,
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

    if (conectado) {
        setTimeout(() => {
            event.reply('db-status', "Conectado")
        }, 500)

    }
})
// Importante !! Deconectar  do banco de dados quando a aplicação for encerrada
app.on('before-quit', () => {
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
                label: 'Clientes',
                click: () => relatorioClientes()
            },
            {
                label: 'OS abertas',
                click: () => relatorioOsAbertas()
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
            cepCliente: client.cepCli,
            logradouroCliente: client.logradouroCli,
            numeroCliente: client.numberCli,
            complementoCliente: client.complementCli,
            bairroCliente: client.neighborhoodClient,
            cidadeCliente: client.cityCli,
            ufCliente: client.ufCli
        })
        //salvar os dados Clientes no banco de dados
        await newClient.save()

    }
    catch {
        console.log(error)
    }
})

//== INICIO - OS - CRUD CREATE
ipcMain.on('new-os', async (event, OS) => {
    // IMPORTANTE!! teste do passo dois
    console.log(OS)
    // Cadastrar a estrutura de dados do banco de dados Mongodb
    //ATENÇÃO !! os atributos deve ser identicos ao modelo de dados clientes.js
    //
    try {
        //cria uma nova estrutura de dados usando classe  modelo
        const newOs = new OSModel({
            idCliente: OS.orderIdClie,
            NameCliente: OS.orderNameCli,
            PhoneCliente: OS.orderPhoneCli,
            statusOS: OS.orderStatus,
            tecidoOS: OS.orderType,
            problemaOS: OS.orderProblem,
            costureiraOS: OS.orderService,
            tamanhoOS: OS.orderSize,
            alturaOS: OS.orderHight,
            larguraOS: OS.orderWidth,
            acessorioOS: OS.orderacessori,
            precoOS: OS.orderPrice
        })
        //salvar os dados Clientes no banco de dados
        await newOs.save()
        // Mensagem de confirmação
        dialog.showMessageBox({
            //customização
            type: 'info',
            title: "Aviso",
            message: "OS gerada com sucesso",
            buttons: ['OK']
        }).then((result) => {
            //ação ao pressionar o botão (result = 0)
            if (result.response === 0) {
                //enviar um pedido para o renderizador limpar os campos e resetar as configurações pré definidas (rótulo 'reset-form' do preload.js
                event.reply('reset-form')
            }
        })
    } catch (error) {
        console.log(error)
    }
})

//== FIM - OS - CRUD CREATE

// ==========================================================
// ===== Relatório de Clientes ==============================

async function relatorioClientes() {
    try {
        // Passo 1: Consultar o banco de dados e obter a listagem de clientes cadastrados por ordem alfabética
        const CLientes = await clientModel.find().sort({ nomeCliente: 1 })
        // teste de recebimento da listagem de clientes
        console.log(CLientes)
        // Passo 2:Formatação do documento pdf
        // p - portrait | l - landscape | mm e a4 (folha)
        const doc = new jsPDF('p', 'mm', 'a4')

        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo2.png')
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })

        doc.addImage(imageBase64, 'PNG', 3, 6)
        // definir o tamanho da fonte (tamanho equivalente ao word)
        doc.setFontSize(16)
        // escrever um texto (título)
        doc.text("Relatório de clientes", 14, 35)//x, y (mm)
        // inserir a data atual no relatório
        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 165, 10)
        // variável de apoio na formatação
        let y = 45
        doc.text("Nome", 14, y)
        doc.text("Telefone", 80, y)
        doc.text("E-mail", 130, y)
        y += 5
        // desenhar uma linha
        doc.setLineWidth(0.5) // expessura da linha
        doc.line(10, y, 200, y) // 10 (inicio) ---- 200 (fim)
        // renderizar os clientes cadastrados no banco de dados
        y += 10
        CLientes.forEach((c) => {
            //adicionar outra pagina se a folha inteira for prenchida
            //a estrategia é saber o tamanho da folha
            // Folha a4 y = 290mm
            if (y > 280) {
                doc.addPage()
                y = 20
                doc.text("Nome", 14, y)
                doc.text("Telefone", 80, y)
                doc.text("E-mail", 130, y)
                y += 5
                doc.setLineWidth(0.5) // expessura da linha
                doc.line(10, y, 200, y) // 10 (inicio) ---- 200 (fim)
                y += 10

            }
            doc.text(c.nomeCliente, 14, y),
                doc.text(c.foneCliente, 80, y),
                doc.text(c.emailCliente || "N/A", 130, y)
            y += 10 //quebra de linha
        })

        const paginas = doc.internal.getNumberOfPages()
        for (let i = 1; i <= paginas; i++) {
            doc.setPage(i)
            doc.setFontSize(10)
            doc.text(`Pagina ${i} de ${paginas}`, 105, 290, { align: 'center' })
        }

        // Definir o caminho do arquivo temporário e nome do arquivo
        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'clientes.pdf')
        // salvar temporariamente o arquivo
        doc.save(filePath)
        // abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuário
        shell.openPath(filePath)
    } catch (error) {
        console.log(error)
    }
}

// ====== Fim Relatório de Clientes ==================
// ===================================================

// ==========================================================
// ===== Relatório de Clientes ==============================

async function relatorioOsAbertas() {

    if(statusOS.value ="Aberta"){
        try {
            // Passo 1: Consultar o banco de dados e obter a listagem de clientes cadastrados por ordem alfabética
            const CLientes = await clientModel.find().sort({ nomeCliente: 1 })
            // teste de recebimento da listagem de clientes
            console.log(CLientes)
            // Passo 2:Formatação do documento pdf
            // p - portrait | l - landscape | mm e a4 (folha)
            const doc = new jsPDF('p', 'mm', 'a4')
    
            const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo2.png')
            const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
    
            doc.addImage(imageBase64, 'PNG', 3, 6)
            // definir o tamanho da fonte (tamanho equivalente ao word)
            doc.setFontSize(16)
            // escrever um texto (título)
            doc.text("Relatório de clientes", 14, 35)//x, y (mm)
            // inserir a data atual no relatório
            const dataAtual = new Date().toLocaleDateString('pt-BR')
            doc.setFontSize(12)
            doc.text(`Data: ${dataAtual}`, 165, 10)
            // variável de apoio na formatação
            let y = 45
            doc.text("Nome", 14, y)
            doc.text("Telefone", 80, y)
            doc.text("E-mail", 130, y)
            y += 5
            // desenhar uma linha
            doc.setLineWidth(0.5) // expessura da linha
            doc.line(10, y, 200, y) // 10 (inicio) ---- 200 (fim)
            // renderizar os clientes cadastrados no banco de dados
            y += 10
            CLientes.forEach((c) => {
                //adicionar outra pagina se a folha inteira for prenchida
                //a estrategia é saber o tamanho da folha
                // Folha a4 y = 290mm
                if (y > 280) {
                    doc.addPage()
                    y = 20
                    doc.text("Nome", 14, y)
                    doc.text("Telefone", 80, y)
                    doc.text("E-mail", 130, y)
                    y += 5
                    doc.setLineWidth(0.5) // expessura da linha
                    doc.line(10, y, 200, y) // 10 (inicio) ---- 200 (fim)
                    y += 10
    
                }
                doc.text(c.nomeCliente, 14, y),
                    doc.text(c.foneCliente, 80, y),
                    doc.text(c.emailCliente || "N/A", 130, y)
                y += 10 //quebra de linha
            })
    
            const paginas = doc.internal.getNumberOfPages()
            for (let i = 1; i <= paginas; i++) {
                doc.setPage(i)
                doc.setFontSize(10)
                doc.text(`Pagina ${i} de ${paginas}`, 105, 290, { align: 'center' })
            }
    
            // Definir o caminho do arquivo temporário e nome do arquivo
            const tempDir = app.getPath('temp')
            const filePath = path.join(tempDir, 'clientes.pdf')
            // salvar temporariamente o arquivo
            doc.save(filePath)
            // abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuário
            shell.openPath(filePath)
        } catch (error) {
            console.log(error)
        }
    }else{
        console.log(error)
    }
    
}

// ====== Fim Relatório de OS Abertas ==================
// ===================================================


// ==================================================
// ===========CRUD READ==============================
ipcMain.on('validate-search', () => {
    dialog.showMessageBox({
        type: 'warning',
        title: "Atenção!",
        message: "Preencha o campo de busca",
        buttons: ["OK"]
    })
})



ipcMain.on('search-name', async (event, name) => {
    console.log('Iniciando busca por:', name);
  
    if (!name) {
      dialog.showMessageBox({
        type: 'warning',
        title: 'Atenção!',
        message: 'Por favor, forneça um nome ou CPF para a busca.',
        buttons: ['OK'],
      });
      return;
    }
  
    try {
      const dataClient = await clientModel.find({
        $or: [
          { nomeCliente: new RegExp(name, 'i') },
          { cpfCliente: new RegExp(name, 'i') },
        ],
      });
  
      console.log('Dados encontrados:', dataClient);
  
      if (dataClient.length === 0) {
        dialog.showMessageBox({
          type: 'warning',
          title: 'Aviso',
          message: 'Cliente não cadastrado, deseja cadastrar?',
          defaultId: 0,
          buttons: ['Sim', 'Não'],
        }).then((result) => {
          if (result.response === 0) {
            event.reply('set-client');
          } else {
            event.reply('reset-form');
          }
        });
      } else {
        event.reply('render-client', JSON.stringify(dataClient));
      }
    } catch (error) {
      console.error('Erro ao buscar dados do cliente:', error);
      dialog.showMessageBox({
        type: 'error',
        title: 'Erro',
        message: 'Ocorreu um erro ao buscar os dados do cliente.',
        buttons: ['OK'],
      });
    }
  });

// ====== Fim CRUD READ ==============================
// ===================================================

// +==================================================
// ====== CRUD DELETE=================================
ipcMain.on('delete-client', async (event, id) => {
    console.log(id) //teste do passo 2
    try {
        // importante - confirmar a exclusão
        // client é o nome da variavel
        const { response } = await dialog.showMessageBox(client, {
            type: 'warning',
            title: "Atenção!!!",
            message: "Deseja excluir este cliente??\n Esta ação não poderá desfeita",
            buttons: ['Cancelar', 'Excluir']//[0,1] 
        })
        if (response === 1) {
            //Passo 3 - Excluir o registro do cliente

            const delClient = await clientModel.findByIdAndDelete(id)
            event.reply('reset-form')
        }
    } catch (error) {
        console.log(error)
    }
})
//======= FIM DO CRUD DELETE =========================
//====================================================

// +==================================================
// ====== CRUD DELETE=================================
ipcMain.on('delete-os', async (event, idOS) => {
    console.log(idOS) //teste do passo 2
    try {
        // importante - confirmar a exclusão
        // client é o nome da variavel
        const { response } = await dialog.showMessageBox(os, {
            type: 'warning',
            title: "Atenção!!!",
            message: "Deseja excluir este cliente??\n Esta ação não poderá desfeita",
            buttons: ['Cancelar', 'Excluir']//[0,1] 
        })
        if (response === 1) {
            //Passo 3 - Excluir o registro do cliente

            const delOS = await OSModel.findByIdAndDelete(idOS)
            event.reply('reset-form')
        }
    } catch (error) {
        console.log(error)
    }
})
//======= FIM DO CRUD DELETE =========================
//====================================================



// +==================================================
// ====== CRUD UPDATE=================================
ipcMain.on('update-client', async (event, client) => {
    console.log(client)
    try {
        //cria uma nova estrutura de dados usando classe  modelo
        const updateCliente = await clientModel.findByIdAndUpdate(
            client.idCli,
            {
                nomeCliente: client.nameCli,
                cpfCliente: client.cpfCli,
                emailCliente: client.emailCli,
                foneCliente: client.foneCli,
                cepCliente: client.cepCli,
                logradouroCliente: client.logradouroCli,
                numeroCliente: client.numberCli,
                complementoCliente: client.complementCli,
                bairroCliente: client.neighborhoodClient,
                cidadeCliente: client.cityCli,
                ufCliente: client.ufCli
            },
            {
                new:true
            }
    )
    //confirmação
   
        dialog.showMessageBox({
            type: 'warning',
            title: "Aviso",
            message: "Dados do cliente foi alterado",
            defaultId: 0,
            buttons: ['Ok']
        }).then((result => {
            if (result.response === 0) {
                //enviar ao renderizador um pedido para setar os campos(recotar dos campos e colar no campos)
                event.reply('reset-form')
            } 
        }))
    } catch (error) {
        console.log(error)
    }
})

//======= FIM DO CRUD UPDATE =========================
//====================================================


//************************************************************/
//*******************  Ordem de Serviço  *********************/
//************************************************************/


// ============================================================
// == Buscar OS ===============================================

ipcMain.on('search-os', (event) => {
    //console.log("teste: busca OS")
    prompt({
        title: 'Buscar OS',
        label: 'Digite o número da OS:',
        inputAttrs: {
            type: 'text'
        },
        type: 'input',        
        width: 400,
        height: 200
    }).then(async (result) => {
        // buscar OS pelo id (verificar formato usando o mongoose - importar no início do main)
        if (result !== null) {
            // Verificar se o ID é válido (uso do mongoose - não esquecer de importar)
            if (mongoose.Types.ObjectId.isValid(result)) {
                try {
                    const dataOS = await OSModel.findById(result)
                    if (dataOS) {
                        console.log(dataOS) // teste importante
                        // enviando os dados da OS ao rendererOS
                        // OBS: IPC só trabalha com string, então é necessário converter o JSON para string JSON.stringify(dataOS)
                        event.reply('render-os', JSON.stringify(dataOS))
                    } else {
                        dialog.showMessageBox({
                            type: 'warning',
                            title: "Aviso!",
                            message: "OS não encontrada",
                            buttons: ['OK']
                        })
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                dialog.showMessageBox({
                    type: 'error',
                    title: "Atenção!",
                    message: "Formato do número da OS inválido.\nVerifique e tente novamente.",
                    buttons: ['OK']
                })
            }
        }
    })
})

// == Fim - Buscar OS =========================================
// ============================================================

// ============================================================
// == Buscar OS CLIENTES ======================================

ipcMain.on('search-clients', async (event) =>{
    try{
        const clients = await clientModel.find().sort({nomeCliente: 1})
        //console.log(clients)
        event.reply('list-clients', JSON.stringify(clients))
    }catch(error){
        console.log(error)
    }
})

// == Fim - Buscar OS CLIENTES=================================
// ============================================================

// == IMPRIMIR OS =============================================
// ============================================================
ipcMain.on('print-os', async (event) => {
    prompt({
        title: 'Imprimir OS',
        label: 'Digite o número da OS:',
        inputAttrs: {
            type: 'text'
        },
        type: 'input',
        width: 400,
        height: 200
    }).then(async (result) => {
        // buscar OS pelo id (verificar formato usando o mongoose - importar no início do main)
        if (result !== null) {
            // Verificar se o ID é válido (uso do mongoose - não esquecer de importar)
            if (mongoose.Types.ObjectId.isValid(result)) {
                try {
                    // teste importante
                    //console.log("Imprimir OS")
                    const dataOS = await OSModel.findById(result)
                    if (dataOS && dataOS !== null) {
                        console.log(dataOS) // teste importante
                        // extrair os dados do cliente de acordo com o idCliete da OS vinculado a OS
                        const dataClient = await clientModel.find({
                            _id: dataOS.idCliente
                          });
                      
                          console.log(dataClient);
                          // Impressão (documento PDF) com os dadps da Os, do cliente e termos de serviço.
                          // Com os dados da OS e termos de serviço (uso do jspdf)
                      
                    } else {
                        dialog.showMessageBox({
                            type: 'warning',
                            title: "Aviso!",
                            message: "OS não encontrada",
                            buttons: ['OK']
                        })
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                dialog.showMessageBox({
                    type: 'error',
                    title: "Atenção!",
                    message: "Formato do número da OS inválido.\nVerifique e tente novamente.",
                    buttons: ['OK']
                })
            }
        }
    })
})



// == Fim - IMPRIMIR OS ========================================
// ============================================================



// +==================================================
// ====== CRUD UPDATE=================================
ipcMain.on('update-os', async (event, OS) => {
    console.log(OS)
    try {
        //cria uma nova estrutura de dados usando classe  modelo
        const updateOs = await OSModel.findByIdAndUpdate(
            OS.idOS,
            {
                statusOS: OS.orderStatus,
                tecidoOS: OS.orderType,
                problemaOS: OS.orderProblem,
                costureiraOS: OS.orderService,
                tamanhoOS: OS.orderSize,
                alturaOS: OS.orderHight,
                larguraOS: OS.orderWidth,
                acessorioOS: OS.orderacessori,
                precoOS: OS.orderPrice
            },
            {
                new:true
            }
    )
    //confirmação
   
        dialog.showMessageBox({
            type: 'warning',
            title: "Aviso",
            message: "Dados do cliente foi alterado",
            defaultId: 0,
            buttons: ['Ok']
        }).then((result => {
            if (result.response === 0) {
                //enviar ao renderizador um pedido para setar os campos(recotar dos campos e colar no campos)
                event.reply('reset-form')
            } 
        }))
    } catch (error) {
        console.log(error)
    }
})

//======= FIM DO CRUD UPDATE =========================
//====================================================




