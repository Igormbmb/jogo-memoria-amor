const memoryGame = document.querySelector('.memory-game'); // Pega a área onde as cartas vão ficar
const finalMessage = document.getElementById('final-message'); // Pega a mensagem final
const acceptButton = document.getElementById('accept-button'); // Botão SIM
const declineButton = document.getElementById('decline-button'); // Botão Talvez

// Os 6 pares de emojis de coração
const emojis = ['❤️', '🧡', '💛', '💚', '💙', '💜'];
// Duplicamos os emojis para formar os pares (total de 12 emojis)
let cards = [...emojis, ...emojis];

let hasFlippedCard = false; // Vê se já virou uma carta
let lockBoard = false; // Trava o tabuleiro enquanto as cartas viram ou desviram
let firstCard, secondCard; // Guarda as duas cartas viradas
let matchedPairs = 0; // Conta quantos pares foram encontrados

// Função para embaralhar as cartas
function shuffle() {
    cards.sort(() => Math.random() - 0.5); // Embaralha a ordem das cartas
}

// Função para criar as cartas na tela
function createCards() {
    shuffle(); // Primeiro, embaralha as cartas
    cards.forEach(emoji => {
        // Cria um elemento 'div' para cada carta
        const card = document.createElement('div');
        card.classList.add('memory-card'); // Adiciona a classe CSS 'memory-card'

        // Cria a frente da carta (o emoji)
        const frontFace = document.createElement('div');
        frontFace.classList.add('front-face');
        frontFace.textContent = emoji; // Coloca o emoji na frente da carta

        // Cria o verso da carta (o ponto de interrogação)
        const backFace = document.createElement('div');
        backFace.classList.add('back-face');
        backFace.textContent = '?'; // Coloca o ponto de interrogação no verso

        card.appendChild(frontFace); // Adiciona a frente à carta
        card.appendChild(backFace); // Adiciona o verso à carta

        // Adiciona um 'ouvinte de evento' para quando a carta for clicada
        card.addEventListener('click', flipCard);
        memoryGame.appendChild(card); // Adiciona a carta ao tabuleiro do jogo
    });
}

// Função para virar a carta
function flipCard() {
    // Se o tabuleiro estiver travado ou se a carta clicada já for a primeira virada, não faz nada
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip'); // Adiciona a classe 'flip' para virar a carta

    if (!hasFlippedCard) {
        // Primeira carta virada
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Segunda carta virada
    secondCard = this;
    checkForMatch(); // Verifica se as duas cartas formam um par
}

// Função para verificar se as cartas são um par
function checkForMatch() {
    // Compara o texto (emoji) da frente das duas cartas
    let isMatch = firstCard.querySelector('.front-face').textContent === secondCard.querySelector('.front-face').textContent;

    isMatch ? disableCards() : unflipCards(); // Se for um par, desabilita as cartas; se não, desvira
}

// Função para desabilitar cartas que formam um par
function disableCards() {
    firstCard.removeEventListener('click', flipCard); // Remove o clique da primeira carta
    secondCard.removeEventListener('click', flipCard); // Remove o clique da segunda carta

    // Adiciona a classe 'match' para uma animação extra
    firstCard.classList.add('match');
    secondCard.classList.add('match');

    matchedPairs++; // Incrementa a contagem de pares encontrados

    // Se todos os pares foram encontrados, mostra a mensagem final
    if (matchedPairs === emojis.length) {
        setTimeout(() => {
            finalMessage.classList.remove('hidden'); // Remove a classe 'hidden' para mostrar a mensagem
            memoryGame.style.display = 'none'; // Esconde o jogo
        }, 1000); // Espera um pouco antes de mostrar a mensagem
    }

    resetBoard(); // Reseta o tabuleiro para a próxima jogada
}

// Função para desvirar cartas que não formam um par
function unflipCards() {
    lockBoard = true; // Trava o tabuleiro para que o usuário não clique em outras cartas

    setTimeout(() => {
        firstCard.classList.remove('flip'); // Desvira a primeira carta
        secondCard.classList.remove('flip'); // Desvira a segunda carta
        resetBoard(); // Reseta o tabuleiro
    }, 1500); // Espera 1.5 segundos antes de desvirar
}

// Função para resetar o tabuleiro
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false]; // Reseta as variáveis de controle
    [firstCard, secondCard] = [null, null]; // Limpa as cartas viradas
}

// Eventos para os botões da mensagem final (apenas para exemplo, não fazem nada no código)
acceptButton.addEventListener('click', () => {
    alert('Que ótimo! Te encontro lá!');
    // Você pode redirecionar para outro lugar ou fazer algo mais aqui
});

declineButton.addEventListener('click', () => {
    alert('Ah, que pena! Quem sabe na próxima? 😉');
    // Você pode redirecionar ou fazer algo mais aqui
});


createCards(); // Inicia o jogo criando as cartas
