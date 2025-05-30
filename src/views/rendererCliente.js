

// Buscar CEP
function buscarCEP() {
    //console.log("teste do evento blur")
    //armazenar o cep digitado na variável
    let cep = document.getElementById('inputCEPClient').value
    //console.log(cep) //teste de recebimento do CEP
    //"consumir" a API do ViaCEP
    let urlAPI = `https://viacep.com.br/ws/${cep}/json/`
    //acessando o web service par abter os dados
    fetch(urlAPI)
        .then(response => response.json())
        .then(dados => {
            //extração dos dados
            document.getElementById('inputAddressClient').value = dados.logradouro
            document.getElementById('inputNeighborhoodClient').value = dados.bairro
            document.getElementById('inputCityClient').value = dados.localidade
            document.getElementById('inputUFClient').value = dados.uf
        })
        .catch(error => console.log(error))
}

// Função para aplicar a máscara no CPF
function aplicarMascaraCPF(campo) {
    let cpf = campo.value.replace(/\D/g, "").slice(0, 11); // mantêm até 11 dígitos
    if (cpf.length > 9) {
        campo.value = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    } else if (cpf.length > 6) {
        campo.value = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (cpf.length > 3) {
        campo.value = cpf.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    } else {
        campo.value = cpf;
    }
}

// Função para validar CPF
function validarCPF() {
    const campo = document.getElementById('inputCPFClient');
    let cpf = campo.value.replace(/\D/g, "");

    // Validações: CPF inválido ou com todos os números iguais
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        campo.style.borderColor = "red";
        campo.style.color = "red";
        return false;
    }

    // Validação do primeiro dígito verificador
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto !== parseInt(cpf[9])) return mostrarErro(campo);

    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto !== parseInt(cpf[10])) return mostrarErro(campo);

    campo.style.borderColor = "green";
    campo.style.color = "green";
    return true;
}

// Função para exibir erro de CPF inválido
function mostrarErro(campo) {
    campo.style.borderColor = "red";
    campo.style.color = "red";
    return false;
}

// Adicionar eventos para CPF
const cpfInput = document.getElementById('inputCPFClient');
if (cpfInput) {
    cpfInput.addEventListener("input", () => aplicarMascaraCPF(cpfInput)); // Máscara ao digitar
    cpfInput.addEventListener("blur", validarCPF); // Validação ao perder o foco
}


// == Fim - validar CPF =======================================

// Vetor global que será usado na manipulação dos dados
let arrayClient = []


const foco = document.getElementById('searchClient')

document.addEventListener('DOMContentLoaded', () => {
    //foco na busca do cliente
    btnUpdate.disabled = true
    btnDelete.disabled = true
    foco.focus()
})
//==========================================================
//===============Manipulação da tecla enter=================


/* Função para manipular o evento da tecla enter
function teclaEnter(event){
    if (event.key === "Enter") {
        event.preventDefault() // ignorar o comportamento padrão
        // associar o enter a busca do cliente
        buscarCliente()
    }
}

//Função para restaurar o padrão da tecla enter(submit)
function restaurarEnter() {
    frmClient.removeEventListener('keydown', teclaEnter)
}

// "Escutar do evento tecla enter"
frmClient.addEventListener('keydown', teclaEnter)

//===============Fim da manipulação================
//=================================================*/


// captura dos dados dos inputs do formulario (Passo 1: Fluxo)
let frmClient = document.getElementById('frmClient')
let nameClient = document.getElementById('inputNameClient')
let cpfClient = document.getElementById('inputCPFClient')
let emailClient = document.getElementById('inputEmailClient')
let foneClient = document.getElementById('inputPhoneClient')
let cepClient = document.getElementById('inputCEPClient')
let logradouroClient = document.getElementById('inputAddressClient')
let numberClient = document.getElementById('inputNumberClient')
let complementClient = document.getElementById('inputComplementClient')
let neighborhoodClient = document.getElementById('inputNeighborhoodClient')
let cityClient = document.getElementById('inputCityClient')
let ufClient = document.getElementById('inputUFClient')
//captura do id do cliente (usado no update e no delete)
let id = document.getElementById('idClient')


//=====================================================
//==========CRUD CREATE/UPDATE=========================

//Evento associado ao botão submit(uso das validações em html)
frmClient.addEventListener('submit', async (event) => {
    //evitar o comportamento padrão do submit que é enviar os dados
    // do formulario e reiniciar o documento html
    event.preventDefault()

    console.log(nameClient.value, cpfClient.value, emailClient.value, foneClient.value, id.value)

    //estrategia usada para reutilizar o submit para criar um novo cliente ou alterar os dados de um cliente
    // se existir id significa que existe um cliente senão significa que é para adicionar um novo cliente
    if (id.value === "") {
        // executar o método para cadastra um cliente
        // CRIAR um objeto para armazenar os dados do cliente antes de enviar ao main
        const client = {
            nameCli: nameClient.value,
            cpfCli: cpfClient.value,
            emailCli: emailClient.value,
            foneCli: foneClient.value,
            cepCli: cepClient.value,
            logradouroCli: logradouroClient.value,
            numberCli: numberClient.value,
            complementCli: complementClient.value,
            neighborhoodClient: neighborhoodClient.value,
            cityCli: cityClient.value,
            ufClie: ufClient.value
        }


        // Enviar ao main o objeto client- (Passo 2: Fluxo)
        api.newClient(client)
    } else {
        // executar o metodo para alterar os dados do cliente
        // CRIAR um objeto para armazenar os dados do cliente antes de enviar ao main
        const client = {
            idCli: id.value,
            nameCli: nameClient.value,
            cpfCli: cpfClient.value,
            emailCli: emailClient.value,
            foneCli: foneClient.value,
            cepCli: cepClient.value,
            logradouroCli: logradouroClient.value,
            numberCli: numberClient.value,
            complementCli: complementClient.value,
            neighborhoodClient: neighborhoodClient.value,
            cityCli: cityClient.value,
            ufCli: ufClient.value
        }
        // Enviar ao main o objeto client- (Passo 2: Fluxo)
        api.updateClient(client)
    }


})

//==========FIM DO CRUD CREATE================================
//===========================================================

//=======================================================
//==========CRUD READ====================================
function buscarCliente() {
    let Name = document.getElementById('searchClient').value
    console.log(Name)//Teste passo 1
    if (Name === "") {
        api.validateSearch()
        foco.focus()
    } else {
        //console.log("TEST")

        api.searchName(Name)//
        //recebimento dos dados do cliente
        api.renderClient((event, dataClient) => {
            console.log(dataClient) // Teste do passo 5
            // Passo 6: renderizar o dados do clientes
            //Cria um vator global para manipulação dos dados
            // cirar uma constante para converter os dados recebidos(string) para o formato jason
            //usar o laço  forEach para percorre o vetor e setar os campos(caixas de texto) do formulario
            const dadosCliente = JSON.parse(dataClient)
            // atribuir ao vetor os dados do cliente
            arrayClient = dadosCliente
            //extrair os dados do cliente
            arrayClient.forEach((c) => {
                id.value = c._id,
                    nameClient.value = c.nomeCliente,
                    cpfClient.value = c.cpfCliente,
                    emailClient.value = c.emailCliente,
                    foneClient.value = c.foneCliente,
                    cepClient.value = c.cepCliente,
                    logradouroClient.value = c.logradouroCliente,
                    numberClient.value = c.numeroCliente,
                    complementClient.value = c.complementoClinte,
                    neighborhoodClient.value = c.bairroCliente,
                    cityClient.value = c.cidadeCliente,
                    ufClient.value = c.ufCliente

                btnCreate.disabled = true
                btnUpdate.disabled = false
                btnDelete.disabled = false
            });
        })
    }
}

//setar o cliente não cadastrado(recortar do campo de busca e colar no campo nome)
// setar o cliente não cadastrado (recortar do campo de busca e colar no campo nome)
api.setClient((args) => {
    let campoBusca = document.getElementById('searchClient').value.trim()

// Verifica se é CPF (somente números ou com máscara)
if (/^\d{11}$/.test(campoBusca) || /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(campoBusca)) {
    foco.value = "";
    cpfClient.focus();
    cpfClient.value = campoBusca;
}
// Verifica se é CNPJ (somente números ou com máscara)
else if (/^\d{14}$/.test(campoBusca) || /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(campoBusca)) {
    foco.value = "";
    cpfClient.focus();
    cpfClient.value = campoBusca;
}
// Senão, assume como nome
else {
    foco.value = "";
    nameClient.focus();
    nameClient.value = campoBusca;
}
})


//==========FIM DO CRUD READ=============================
//=======================================================


//=======================================================
//==========CRUD DELETE====================================
function excluirCliente() {
    console.log(id.value)// Passo 1 (receber do form o id)
    api.deleteClient(id.value) // Passo 2 (enviar o id para o main)
}

//==========FIM DO CRUD DELETE=============================
//=======================================================


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