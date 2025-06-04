

const { app, BrowserWindow, nativeTheme, Menu, ipcMain, dialog, shell } = require('electron')
const { link } = require('node:fs')

const path = require('node:path')


const { conectar, desconectar } = require("./database.js")

const mongoose = require('mongoose')


const clientModel = require('./src/models/Clientes.js')


const jsPDF = require('jspdf').jsPDF
require('jspdf-autotable')


const fs = require('fs')

const prompt = require('electron-prompt')

const OSModel = require('./src/models/OS.js')
const Clientes = require('./src/models/Clientes.js')
const { error } = require('node:console')



let win
const createWindow = () => {

    nativeTheme.themeSource = 'light'
    win = new BrowserWindow({
        width: 800,
        height: 500,


        resizable: false,
        modal: true,

        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })


    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')

    ipcMain.on('client-window', () => {
        clientwindow()
    })
    ipcMain.on('os-window', () => {
        oswindow()
    })
}



function aboutWindow() {
    nativeTheme.themeSource = 'dark'

    const main = BrowserWindow.getFocusedWindow()
    let about

    if (main) {

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

app.commandLine.appendSwitch('log-level', '3')


ipcMain.on('db-connect', async (event) => {



    let conectado = await conectar()

    if (conectado) {
        setTimeout(() => {
            event.reply('db-status', "Conectado")
        }, 500)

    }
})

app.on('before-quit', () => {
    desconectar()
})


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
                click: () => relatorioOSPendentes()
            },
            {
                label: 'OS concluídas',
                click: () => relatorioOSFinalizadas()
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





ipcMain.on('new-client', async (event, client) => {




    try {

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

        await newClient.save()

    }
    catch {
    }
})


ipcMain.on('new-os', async (event, OS) => {




    try {

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

        await newOs.save()

        dialog.showMessageBox({

            type: 'info',
            title: "Aviso",
            message: "OS gerada com sucesso",
            buttons: ['OK']
        }).then((result) => {

            if (result.response === 0) {

                event.reply('reset-form')
            }
        })
    } catch (error) {
    }
})






async function relatorioClientes() {
    try {

        const CLientes = await clientModel.find().sort({ nomeCliente: 1 })
        const doc = new jsPDF('p', 'mm', 'a4')
        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo2.png')
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
        doc.addImage(imageBase64, 'PNG', 3, 6)
        doc.setFontSize(16)
        doc.text("Relatório de clientes", 14, 35)
        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 165, 10)
        let y = 45
        doc.text("Nome", 14, y)
        doc.text("Telefone", 80, y)
        doc.text("E-mail", 130, y)
        y += 5
        doc.setLineWidth(0.5)
        doc.line(10, y, 200, y)
        y += 10
        CLientes.forEach((c) => {
            if (y > 280) {
                doc.addPage()
                y = 20
                doc.text("Nome", 14, y)
                doc.text("Telefone", 80, y)
                doc.text("E-mail", 130, y)
                y += 5
                doc.setLineWidth(0.5)
                doc.line(10, y, 200, y)
                y += 10

            }
            doc.text(c.nomeCliente, 14, y),
                doc.text(c.foneCliente, 80, y),
                doc.text(c.emailCliente || "N/A", 130, y)
            y += 10
        })

        const paginas = doc.internal.getNumberOfPages()
        for (let i = 1; i <= paginas; i++) {
            doc.setPage(i)
            doc.setFontSize(10)
            doc.text(`Pagina ${i} de ${paginas}`, 105, 290, { align: 'center' })
        }
        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'clientes.pdf')
        doc.save(filePath)
        shell.openPath(filePath)
    } catch (error) {}
}
async function relatorioOSPendentes() {
    try {
        const osPendentes = await OSModel.find({ statusOS: { $ne: "Finalizada" } }).sort({ dataEntrada: 1 })

        const doc = new jsPDF('l', 'mm', 'a4')
        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo2.png')
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
        doc.addImage(imageBase64, 'PNG', 5, 8)
        doc.setFontSize(16)
        doc.text("Ordens de serviço pendentes", 14, 45)
        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 250, 15)


        const headers = [["Número da OS", "Entrada", "Cliente", "Telefone", "Status", "Tecido", "Defeito"]]

        const data = []

        for (const os of osPendentes) {
            let nome, telefone
            try {
                const cliente = await clientModel.findById(os.idCliente)
                nome = cliente.nomeCliente
                telefone = cliente.foneCliente
            } catch (error) {
            }

            data.push([
                os._id,
                new Date(os.dataEntrada).toLocaleDateString('pt-BR'),
                nome,
                telefone,
                os.statusOS,
                os.tecidoOS,
                os.problemaOS
            ])
        }

        doc.autoTable({
            head: headers,
            body: data,
            startY: 55,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [0, 120, 215] },
        })

        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'os-pendentes.pdf')
        doc.save(filePath)
        shell.openPath(filePath)
    } catch (error) {
    }
}
async function relatorioOSFinalizadas() {
    try {
        const osFinalizadas = await OSModel.find({ statusOS: "Finalizada" }).sort({ dataEntrada: 1 })

        const doc = new jsPDF('l', 'mm', 'a4')
        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo2.png')
        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
        doc.addImage(imageBase64, 'PNG', 5, 8)
        doc.setFontSize(16)

        doc.text("Ordens de serviço finalizadas", 14, 45)

        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 250, 15)

        const headers = [[
            "Número da OS", "Entrada", "Cliente", "Tecido",
            "Costureiro(a)", "Valor (R$)"
        ]]

        const data = []
        let totalGeral = 0

        for (const os of osFinalizadas) {
            let nomeCliente
            try {
                const cliente = await clientModel.findById(os.idCliente)
                nomeCliente = cliente.nomeCliente
            } catch (error) {
            }

            const valorOS = parseFloat(os.precoOS) || 0
            totalGeral += valorOS

            data.push([
                os._id.toString(),
                new Date(os.dataEntrada).toLocaleDateString('pt-BR'),
                nomeCliente,
                os.tecidoOS,
                os.costureiraOS,
                valorOS.toFixed(2)
            ])
        }


        doc.setFontSize(12)
        doc.setTextColor(0, 100, 0)
        doc.text(`Total geral: R$ ${totalGeral.toFixed(2)}`, 235, 50)
        doc.setTextColor(0, 0, 0)

        doc.autoTable({
            head: headers,
            body: data,
            startY: 55,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [0, 120, 215] },
        })

        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'os-finalizadas.pdf')
        doc.save(filePath)
        shell.openPath(filePath)
    } catch (error) {
    }
}
ipcMain.on('validate-search', () => {
    dialog.showMessageBox({
        type: 'warning',
        title: "Atenção!",
        message: "Preencha o campo de busca",
        buttons: ["OK"]
    })
})
ipcMain.on('search-name', async (event, name) => {

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
ipcMain.on('delete-client', async (event, id) => {
    try {


        const { response } = await dialog.showMessageBox(client, {
            type: 'warning',
            title: "Atenção!!!",
            message: "Deseja excluir este cliente??\n Esta ação não poderá desfeita",
            buttons: ['Cancelar', 'Excluir']
        })
        if (response === 1) {


            const delClient = await clientModel.findByIdAndDelete(id)
            event.reply('reset-form')
        }
    } catch (error) {
    }
})
ipcMain.on('delete-os', async (event, idOS) => {
    try {


        const { response } = await dialog.showMessageBox(os, {
            type: 'warning',
            title: "Atenção!!!",
            message: "Deseja excluir este cliente??\n Esta ação não poderá desfeita",
            buttons: ['Cancelar', 'Excluir']
        })
        if (response === 1) {


            const delOS = await OSModel.findByIdAndDelete(idOS)
            event.reply('reset-form')
        }
    } catch (error) {
    }
})
ipcMain.on('update-client', async (event, client) => {
    try {

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
                new: true
            }
        )


        dialog.showMessageBox({
            type: 'warning',
            title: "Aviso",
            message: "Dados do cliente foi alterado",
            defaultId: 0,
            buttons: ['Ok']
        }).then((result => {
            if (result.response === 0) {

                event.reply('reset-form')
            }
        }))
    } catch (error) {
    }
})
ipcMain.on('search-os', (event) => {

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

        if (result !== null) {

            if (mongoose.Types.ObjectId.isValid(result)) {
                try {
                    const dataOS = await OSModel.findById(result)
                    if (dataOS) {


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
ipcMain.on('search-clients', async (event) => {
    try {
        const clients = await clientModel.find().sort({ nomeCliente: 1 })

        event.reply('list-clients', JSON.stringify(clients))
    } catch (error) {
    }
})
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
        if (result !== null) {
            if (mongoose.Types.ObjectId.isValid(result)) {
                try {
                    const dataOS = await OSModel.findById(result)
                    if (dataOS && dataOS !== null) {
                        const dataClient = await clientModel.find({
                            _id: dataOS.idCliente
                        })

                        const doc = new jsPDF('p', 'mm', 'a4')
                        const imagePath = path.join(__dirname, 'src', 'public', 'img', 'logo2.png')
                        const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' })
                        doc.addImage(imageBase64, 'PNG', 5, 8)


                        doc.setFontSize(14)
                        doc.text("OS:", 14, 45)

                        doc.setLineWidth(0.1)
                        doc.line(10, 50, 200, 50)

                        doc.setFontSize(12)
                        dataClient.forEach((c) => {
                            doc.text("Cliente:", 14, 60)
                            doc.text(c.nomeCliente, 30, 60)
                            doc.text(c.foneCliente, 100, 60)
                            doc.text(c.emailCliente || "N/A", 150, 60)
                        })

                        doc.setFontSize(12)
                        doc.text("Status:", 14, 70)
                        doc.text(String(dataOS.statusOS), 29, 70)
                        doc.text("Descrição:", 60, 70)
                        doc.text(String(dataOS.problemaOS), 80, 70)

                        doc.line(10, 75, 200, 75)

                        doc.setFontSize(10)
                        const termo = `
Termo de Serviço e Garantia

*O serviço será executado conforme as especificações acordadas entre as partes.
*A entrega será feita na data combinada, salvo imprevistos devidamente comunicados.
*A retirada da peça deve ocorrer em até 30 dias após o prazo de entrega. Após este período, não nos responsabilizamos por perdas ou danos.
*Não nos responsabilizamos por tecidos frágeis, com manchas, desgastes ou danificações prévias.
*O cliente declara estar ciente das condições do serviço e concorda com os termos aqui descritos.`

                        doc.text(termo, 14, 85, { maxWidth: 180 })

                        const tempDir = app.getPath('temp')
                        const filePath = path.join(tempDir, 'os.pdf')
                        doc.save(filePath)
                        shell.openPath(filePath)
                    } else {
                        dialog.showMessageBox({
                            type: 'warning',
                            title: "Aviso!",
                            message: "OS não encontrada",
                            buttons: ['OK']
                        })
                    }
                } catch (error) {
                }
            } else {
                dialog.showMessageBox({
                    type: 'error',
                    title: "Atenção!",
                    message: "Código da OS inválido.\nVerifique e tente novamente.",
                    buttons: ['OK']
                })
            }
        }
    })
})
ipcMain.on('update-os', async (event, OS) => {


    try {

        const updateOS = await OSModel.findByIdAndUpdate(
            OS.id_OS,
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
                new: true
            }
        )

        dialog.showMessageBox({

            type: 'info',
            title: "Aviso",
            message: "Dados da OS alterados com sucesso",
            buttons: ['OK']
        }).then((result) => {

            if (result.response === 0) {

                event.reply('reset-form')
            }
        })
    } catch (error) {
    }
})