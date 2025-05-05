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