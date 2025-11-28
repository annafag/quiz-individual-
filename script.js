const perguntas = [
    {
        pergunta: "Qual item é essencial para preparar a pele antes da maquiagem?",
        opcoes: ["Primer", "Iluminador", "Batom", "Bronzer"],
        correta: 0
    },
    {
        pergunta: "Qual é o item usado para esconder olheiras?",
        opcoes: ["Rímel", "Base", "Corretivo", "Sombra"],
        correta: 2
    },
    {
        pergunta: "Qual produto deixa os cílios maiores e mais definidos?",
        opcoes: ["Gloss", "Rímel", "Pó compacto", "Delineador"],
        correta: 1
    },
    {
        pergunta: "Qual produto dá cor às bochechas?",
        opcoes: ["Blush", "Primer", "Iluminador", "Lápis de olho"],
        correta: 0
    }
];

let indice = 0;
let pontos = 0;

function carregarPergunta() {
    document.getElementById("pergunta").innerText = perguntas[indice].pergunta;

    let opcoesDiv = document.getElementById("opcoes");
    opcoesDiv.innerHTML = "";

    perguntas[indice].opcoes.forEach((opcao, i) => {
        opcoesDiv.innerHTML += `
            <button class="opcao-btn" onclick="responder(${i})">${opcao}</button>
        `;
    });
}

function responder(opcaoSelecionada) {
    if (opcaoSelecionada === perguntas[indice].correta) {
        pontos++;
    }

    document.getElementById("proximo").style.display = "block";
}

function proximaPergunta() {
    indice++;

    if (indice < perguntas.length) {
        document.getElementById("proximo").style.display = "none";
        carregarPergunta();
    } else {
        mostrarResultado();
    }
}

function mostrarResultado() {
    document.getElementById("quiz-container").classList.add("hidden");
    document.getElementById("resultado").classList.remove("hidden");

    let msg = `Você acertou ${pontos} de ${perguntas.length} perguntas!`;
    document.getElementById("mensagemFinal").innerText = msg;
}

function reiniciar() {
    indice = 0;
    pontos = 0;

    document.getElementById("resultado").classList.add("hidden");
    document.getElementById("quiz-container").classList.remove("hidden");

    document.getElementById("proximo").style.display = "none";
    carregarPergunta();
}

// iniciar
carregarPergunta();
document.getElementById("proximo").style.display = "none";

