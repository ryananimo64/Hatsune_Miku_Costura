const foco = document.getElementById('searchClient')

document.addEventListener('DOMContentLoaded', () => {
    //foco na busca do cliente
    foco.focus()
})

// captura dos dados dos inputs do formulario (Passo 1: Fluxo)
let frmClient = document.getElementById('frmClient')
let nameClient = document.getElementById('inputNameClient')
let cpfClient = document.getElementById('inputCPFClient')
let emailClient = document.getElementById('inputEmailClient')
let foneClient = document.getElementById('inputPhoneClient')
let addressClient = document.getElementById('inputAddressClient')



//=====================================================
//==========CRUD CREATE/UPDATE=========================

//Evento associado ao botão submit(uso das validações em html)
frmClient.addEventListener('submit', async (event) => {
    //evitar o comportamento padrão do submit que é enviar os dados
    // do formulario e reiniciar o documento html
    event.preventDefault()

    console.log(nameClient.value,cpfClient.value,emailClient.value,foneClient.value,addressClient.value)

    const client = {
        nameCli: nameClient.value,
        cpfCli: cpfClient.value,
        emailCli: emailClient.value,
        foneCli: foneClient.value,
        addressCli: addressClient.value,
    }

     // Enviar ao main o objeto client- (Passo 2: Fluxo)
     api.newClient(client)
})

//==========FIM DO cRUD================================
//=====================================================