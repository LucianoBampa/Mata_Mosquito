var altura = 0
var largura = 0
var vidas = 1
var tempo = 60

var mosquitosCapturados = 0
var pontuacaoFinal = 0

var criaMosquitoTempo = 2000

var nivel = window.location.search
nivel = nivel.replace('?', '')

if (nivel === 'facil') {
	criaMosquitoTempo = 3000
}
else if (nivel === 'normal') {
	criaMosquitoTempo = 2000
}
else if (nivel === 'dificil') {
	criaMosquitoTempo = 1300
}
else if (nivel === 'chucknorris') {
	criaMosquitoTempo = 900
}

function ajustaTamanhoPalcoJogo() {
	altura = window.innerHeight
	largura = window.innerWidth
}

ajustaTamanhoPalcoJogo()

var tempoInicial = new Date()

var cronometro = setInterval(function () {

	tempo -= 1

	if (tempo < 0) {

		clearInterval(cronometro)
		clearInterval(criaMosquito)

		pontuacaoFinal = mosquitosCapturados * 10

		gerarRelatorio()

		window.location.href = 'vitoria.html'

	} else {

		document.getElementById('cronometro').innerHTML = tempo

	}

}, 1000)

function posicaoRandomica() {

	if (document.getElementById('mosquito')) {

		document.getElementById('mosquito').remove()

		if (vidas > 3) {

			window.location.href = 'fim_de_jogo.html'

		} else {

			document.getElementById('v' + vidas).src = "imagens/coracao_vazio.png"

			vidas++

		}

	}

	var posicaoX = Math.floor(Math.random() * largura) - 90
	var posicaoY = Math.floor(Math.random() * altura) - 90

	posicaoX = posicaoX < 0 ? 0 : posicaoX
	posicaoY = posicaoY < 0 ? 0 : posicaoY

	var mosquito = document.createElement('img')
	mosquito.src = 'imagens/mosquito.png'
	mosquito.className = tamanhoAleatorio() + ' ' + ladoAleatorio()
	mosquito.style.left = posicaoX + 'px'
	mosquito.style.top = posicaoY + 'px'
	mosquito.style.position = 'absolute'
	mosquito.id = 'mosquito'

	mosquito.onclick = function () {

		mosquitosCapturados++
		this.remove()

	}

	document.body.appendChild(mosquito)

}

function tamanhoAleatorio() {

	var classe = Math.floor(Math.random() * 3)

	switch (classe) {

		case 0:
			return 'mosquito1'

		case 1:
			return 'mosquito2'

		case 2:
			return 'mosquito3'

	}

}

function ladoAleatorio() {

	var classe = Math.floor(Math.random() * 2)

	switch (classe) {

		case 0:
			return 'ladoA'

		case 1:
			return 'ladoB'

	}

}

function gerarRelatorio() {

	let tempoTotal = Math.floor((new Date() - tempoInicial) / 1000)

	let minutos = Math.floor(tempoTotal / 60)
	let segundos = tempoTotal % 60

	let tempoFormatado =
		String(minutos).padStart(2, '0') + ":" +
		String(segundos).padStart(2, '0')

	let relatorio = `
=====================================
        RELATÓRIO DE DESEMPENHO
=====================================

Aluno: ${localStorage.getItem("aluno")}
RA: ${localStorage.getItem("ra")}
Data: ${new Date().toLocaleString()}

Mosquitos capturados: ${mosquitosCapturados}
Dificuldade: ${nivel.toUpperCase()}
Aproveitamento: 100%
Tempo de Jogo: ${tempoFormatado}
Pontuação final: ${pontuacaoFinal} pontos

=====================================
`

	console.log(relatorio)

	enviarRelatorioAPI()

}

function enviarRelatorioAPI() {

	let dados = {

		aluno: localStorage.getItem("aluno"),
		ra: localStorage.getItem("ra"),
		jogo: "mata_mosquito",
		dificuldade: nivel,
		mosquitos: mosquitosCapturados,
		pontuacao: pontuacaoFinal,
		data: new Date().toISOString()

	}

	fetch("http://127.0.0.1:8000/api/client/sessoes/", {

		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(dados)

	})
		.then(res => res.json())
		.then(data => console.log("Relatório enviado:", data))
		.catch(erro => console.log("Erro ao enviar relatório:", erro))

}