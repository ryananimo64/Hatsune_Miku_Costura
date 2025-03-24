/**
 * Modulo de conexão com o banco de dados
 * Uso do framework mongoose
 */

//Importação do mongoose
const mongoose = require('mongoose')

// configuração do acesso ao banco de dados
// ip/link - autenticação
//Obs : Atlas(obter via compass)
//obs: Para criar um banco de dados personalizado basta escolhe um nome no final da string da url(ex:"dbclientes")
const url = 'mongodb+srv://senac:123senac@principal.zgg8g.mongodb.net/dbhatsune'

//criar uma variavel de apoio para Validação
let conectado = false

// método para conectar o banco de dados
// async executar a função de forma assíncrona
const conectar = async () =>{
    //Validação (se não tiver conectado, conectar)
    if(!conectado){
        //conectar com o banco de dados
        //try catch - tratamento de execuções
        try {
            await mongoose.connect(url) //conectar
            conectado = true // setar variavel
            console.log("MongoDB Conectado")
            return true
        } catch (error) {
            // se o codigo do error é 8000 (erro de autenticação)
            if(error.code = 8000){
                console.log("Erro de autenticação")
            }else{
             console.log(error)
            }
           
        }
    }
}

// método para desconectar o banco de dados

const desconectar = async () =>{
    //Validação (se estiver conectado, desconectar)
    if(conectado){
        // desconectar com o banco de dados
        try {
            await mongoose.connect(url) //conectar
            conectado = false // setar variavel
            console.log("MongoDB Desconectado")
            return true //banco de dados desconectado com sucesso
        } catch (error) {
            console.log(error)
        }
    }
}

// exporta para o main os metodos conectar e desconectar
module.exports = {conectar,desconectar}