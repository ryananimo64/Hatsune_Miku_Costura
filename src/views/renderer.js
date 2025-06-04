
function cliente() {

    api.clientwindow()
}

function os() {
    
    api.oswindow()
}

api.dbStatus((event,message) =>{
    if (message === "Conectado") {
        document.getElementById('dbstatus').src="../public/img/dbon.png"
    } else {    
        document.getElementById('dbstatus').src="../public/img/dboff.png"
    }
})