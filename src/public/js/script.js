

//let ano = document.getElementById('dataatualp')
//let anoatual = new Date().getFullYear()
//ano.innerHTML = anoatual

//data atualizada no rodapé
function obterdata() {
    const dataAtual = new Date()
    const options = {
    weekday : 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    }
    return dataAtual.toLocaleDateString('pt-BR', options)
}

//executar a função ao iniciar o aplicativo(janela principal)
document.getElementById('dataAtual').innerHTML = obterdata()