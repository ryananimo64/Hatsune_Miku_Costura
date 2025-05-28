const foco = document.getElementById('inputSearchClient');
 
 document.addEventListener('DOMContentLoaded', () => {
     foco.focus();
         btnUpdate.disabled = true
         btnDelete.disabled = true
});

let frmOs = document.getElementById('frmOs')
let osStatus = document.getElementById('osStatus')
let typeOs = document.getElementById('inputTypeOs')
let problemOS = document.getElementById('inputProblemOs')
let serviceOS = document.getElementById('inputServiceOs')
let sizeOS = document.getElementById('inputSizeOs')
let heightOS = document.getElementById('inputHightOS')
let widthOS = document.getElementById('inputWidthOS')
let acessoriOS = document.getElementById('inputAcessoriOs')
let priceOS = document.getElementById('inputPriceOs')
let dateOS = document.getElementById('inputDataClient')
let idOS = document.getElementById('inputNumberOs')




// ============================================================
// == CRUD Create/Update ======================================

//Evento associado ao botão submit (uso das validações do html)
frmOs.addEventListener('submit', async (event) => {
    //evitar o comportamento padrão do submit que é enviar os dados do formulário e reiniciar o documento html
    event.preventDefault()
    // validação do campo obrigatório 'idClient' (validação html não funciona via html para campos desativados)
    if (idClient.value === "") {
        api.validateClient()
    } else {
        // Teste importante (recebimento dos dados do formuláro - passo 1 do fluxo)
        console.log(idOS.value, idClient.value, statusOS.value, computer.value, serial.value, problem.value, obs.value, specialist.value, diagnosis.value, parts.value, total.value)
        if (idOS.value === "") {
            //Gerar OS
            //Criar um objeto para armazenar os dados da OS antes de enviar ao main
            const OS = {
                orderIdClie: idClient.value, 
                orderNameCli: nameClient.value,
                orderPhoneCli: phoneClient.value,
                orderStatus: osStatus.value,
                orderType: typeOs.value,
                orderProblem: problemOS.value,
                orderService: serviceOS.value,
                orderSize: sizeOS.value,
                orderHight: heightOS.value,
                orderWidth: widthOS.value,
                orderacessori: acessoriOS.value,
                orderPrice: priceOS.value
                }
        
             // Enviar ao main o objeto client- (Passo 2: Fluxo)
             api.newOs(OS)
        } else {
            //Editar OS
            //Gerar OS
            //Criar um objeto para armazenar os dados da OS antes de enviar ao main
            const OS = {
                orderStatus: osStatus.value,
                orderType: typeOs.value,
                orderProblem: problemOS.value,
                orderService: serviceOS.value,
                orderSize: sizeOS.value,
                orderHight: heightOS.value,
                orderWidth: widthOS.value,
                orderacessori: acessoriOS.value,
                orderPrice: priceOS.value
            }
            // Enviar ao main o objeto os - (Passo 2: fluxo)
            // uso do preload.js
            api.updateOS(OS)
        }
    }
})

// == Fim CRUD Create/Update ==================================
// ============================================================




//=====================================================
//============BUSCAR ESTILO GOOGLE=====================
// capturar os ids referente aos campos do nome
const input = document.getElementById('inputSearchClient')
//capturar o id do ul da lista de sugestão de clientes
const suggestionList = document.getElementById('viewListSuggestion')
// capturar os campos que vão ser preencidos
let idClient = document.getElementById('inputIdClient')
let nameClient = document.getElementById('inputNameClient')
let phoneClient = document.getElementById('inputPhoneClient')

// vetor usado na manipulação de dados
let arrayClients = []

//capturar em tempo real do input (digitação de caracteres na caixa de busca)
input.addEventListener('input', () =>{
    // passo 1: capturar o que for digitado na caixa de busca e converter
    // tudo para letras minusculas (auxilio ao filtro)
    const search = input.value.toLowerCase()
    console.log(search) // teste de apoio a logica
    api.searchClients()

    api.listClients((event,clients)=>{
        //console.log(clients)
        const dataClients = JSON.parse(clients)
        arrayClients = dataClients
        const results = arrayClients.filter(c =>
          c.nomeCliente  &&  c.nomeCliente.toLowerCase().includes(search)
        ).slice(0,10) // maximo 10 resultados
        //console.log(results)
        suggestionList.innerHTML = ""
        results.forEach(c => {
            const item = document.createElement('li')
            item.classList.add('list-group-item', 'list-group-item-action')
            item.textContent = c.nomeCliente
            
        suggestionList.appendChild(item)


        item.addEventListener('click', () =>{
            idClient.value = c._id
            nameClient.value = c.nomeCliente
            phoneClient.value = c.foneCliente

            input.value = ""
            suggestionList.innerHTML = ""
        })

        })
    })
})

document.addEventListener('click', (event) =>{
    if(!input.contains(event.target) && !suggestionList.contains(event.target)){
        suggestionList.innerHTML = ""
    }
})

//==========FIM DO CRUD================================
//=====================================================




//==============================================================
//===========FIM DO CRUD OS BUSCAR==============================

function inputOS() {
    api.searchOS()
}

api.renderOS((event, dataOS) => {
    console.log(dataOS)
    const os = JSON.parse(dataOS)
    // preencher os campos com os dados da OS
    idOS.value = os._id
    // formatar data:
    const data = new Date(os.dataEntrada)
    const formatada = data.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    })
    dateOS.value = formatada
    idClient.value = os.idCliente
    nameClient.value = os.NameCliente
    phoneClient.value = os.PhoneCliente
    osStatus.value = os.statusOS
    typeOs.value = os.tecidoOS
    problemOS.value = os.problemaOS
    serviceOS.value = os.costureiraOS
    sizeOS.value = os.tamanhoOS
    heightOS.value = os.alturaOS
    widthOS.value = os.larguraOS
    acessoriOS.value = os.acessorioOS
    priceOS.value = os.precoOS

    btnCreate.disabled = true
    btnSearch.disabled = true
    btnUpdate.disabled = false
    btnDelete.disabled = false
    inputSearchClient.disabled = true
})



//==========FIM DO CRUD OS BUSCAR================================
//===============================================================

// ============================================================
// == Reset form ==============================================

function resetForm() {
    // Limpar os campos e resetar o formulário com as configurações pré definidas
    location.reload()
}

// Recebimento do pedido do main para resetar o form
api.resetForm((args) => {
    resetForm()
})

// == Fim - reset form ========================================
// ============================================================

//=======================================================
//==========CRUD DELETE OS====================================
function excluirOS() {
    console.log(idOS.value)// Passo 1 (receber do form o id)
    api.deleteOS(idOS.value) // Passo 2 (enviar o id para o main)
}

//==========FIM DO CRUD DELETE OS=============================
//=======================================================


// == IMPRIMIR OS =============================================
// ============================================================
function gerateOS(){
    api.printOS()
}


// == Fim - IMPRIMIR OS ========================================
// ============================================================