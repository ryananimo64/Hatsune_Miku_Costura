
const mongoose = require('mongoose')

const url = 'mongodb+srv://senac:123senac@principal.zgg8g.mongodb.net/dbhatsune'
let conectado = false

const conectar = async () =>{
    
    if(!conectado){
        try {
            await mongoose.connect(url) 
            conectado = true 
            return true
        } catch (error) {
            if(error.code = 8000){
            }else{}
        }
    }
}
const desconectar = async () =>{
    if(conectado){
        try {
            await mongoose.connect(url) 
            conectado = false 
            return true 
        } catch (error) {
        }
    }
}

module.exports = {conectar,desconectar}