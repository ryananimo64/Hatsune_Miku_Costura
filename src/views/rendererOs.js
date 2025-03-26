

let frmOs = document.getElementById('frmOs')
let osStatus = document.getElementById('osStatus')
let typeOs = document.getElementById('inputTypeOs')
let problemOS = document.getElementById('inputProblemOs')
let serviceOS = document.getElementById('inputServiceOs')




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
        orderService: serviceOS.value
        }

     // Enviar ao main o objeto client- (Passo 2: Fluxo)
     api.newOs(OS)
})

//==========FIM DO cRUD================================
//=====================================================