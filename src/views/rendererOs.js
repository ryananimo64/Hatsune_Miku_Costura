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
frmOs.addEventListener('submit', async (event) => {
    event.preventDefault()
 
 if (idClient.value === "") {
    api.validateClient()
} else {
    
    if (idOS.value === "") {
        
        
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
    
         
         api.newOs(OS)
    } else {
        
        
        
        const OS = {
            id_OS: idOS.value,
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
        
        
        api.updateOS(OS)
    }
}
})
const input = document.getElementById('inputSearchClient')

const suggestionList = document.getElementById('viewListSuggestion')

let idClient = document.getElementById('inputIdClient')
let nameClient = document.getElementById('inputNameClient')
let phoneClient = document.getElementById('inputPhoneClient')


let arrayClients = []


input.addEventListener('input', () =>{
    
    
    const search = input.value.toLowerCase() 
    api.searchClients()

    api.listClients((event,clients)=>{
        
        const dataClients = JSON.parse(clients)
        arrayClients = dataClients
        const results = arrayClients.filter(c =>
          c.nomeCliente  &&  c.nomeCliente.toLowerCase().includes(search)
        ).slice(0,10) 
        
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
function inputOS() {
    api.searchOS()
}
api.renderOS((event, dataOS) => {
    const os = JSON.parse(dataOS)
    idOS.value = os._id
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
function resetForm() {
    
    location.reload()
}
api.resetForm((args) => {
    resetForm()
})
function excluirOS() {
    api.deleteOS(idOS.value) 
}
function gerateOS(){
    api.printOS()
}