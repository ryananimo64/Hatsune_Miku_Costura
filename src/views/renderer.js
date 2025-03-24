/**
 * processo de renderização
 * tela principal
 */

console.log("Processo de renderização")

function cliente() {
    //console.log('VAI CORITHIANS')
    //uso da api no
    api.clientwindow()
}

function os() {
    //console.log('VAI CORITHIANS')
    api.oswindow()
}

//troca do icone do banco de dados(usando o api do preload.js)
api.dbStatus((event,message) =>{
    console.log(message)
    if (message === "Conectado") {
        document.getElementById('dbstatus').src="../public/img/dbon.png"
    } else {    
        document.getElementById('dbstatus').src="../public/img/dboff.png"
    }
})