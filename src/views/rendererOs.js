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




//=====================================================
//==========CRUD CREATE/UPDATE=========================

//Evento associado ao botão submit(uso das validações em html)
frmOs.addEventListener('submit', async (event) => {
    //evitar o comportamento padrão do submit que é enviar os dados
    // do formulario e reiniciar o documento html
    event.preventDefault()

    console.log(osStatus.value,typeOs.value,problemOS.value,serviceOS.value)

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

     // Enviar ao main o objeto client- (Passo 2: Fluxo)
     api.newOs(OS)
})

//==========FIM DO cRUD================================
//=====================================================


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

function inputOS(){
    api.searchOS()
}

//==========FIM DO CRUD OS BUSCAR================================
//===============================================================
