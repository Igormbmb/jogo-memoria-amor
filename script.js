const memoryGame = document.querySelector('.memory-game');
const finalMessage = document.getElementById('final-message');
const acceptButton = document.getElementById('accept-button');
const declineButton = document.getElementById('decline-button');

const emojis = ['❤️', '🧡', '💛', '💚', '💙', '💜'];
let cards = [...emojis, ...emojis];

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;

function shuffle() {
    cards.sort(() => Math.random() - 0.5);
}

function createCards() {
    shuffle();
    cards.forEach(emoji => {
        const card = document.createElement('div');
        card.classList.add('memory-card');

        const frontFace = document.createElement('div');
        frontFace.classList.add('front-face');
        frontFace.textContent = emoji;

        const backFace = document.createElement('div');
        backFace.classList.add('back-face');
        // REMOVIDO: Não colocamos mais a interrogação aqui
        // backFace.textContent = '?';

        card.appendChild(frontFace);
        card.appendChild(backFace);

        card.addEventListener('click', flipCard);
        memoryGame.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    let isMatch = firstCard.querySelector('.front-face').textContent === secondCard.querySelector('.front-face').textContent;

    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    // Adiciona a classe 'match' para que o CSS a mantenha virada
    firstCard.classList.add('match');
    secondCard.classList.add('match');

    // Remove a classe 'flip' pois 'match' já assume o controle da virada no CSS
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    matchedPairs++;

    if (matchedPairs === emojis.length) {
        setTimeout(() => {
            finalMessage.classList.remove('hidden');
            memoryGame.style.display = 'none'; // Esconde o jogo
        }, 1000);
    }

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1500); // Espera 1.5 segundos antes de desvirar
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Elemento para exibir as mensagens dos botões (será adicionado dinamicamente ao HTML)
const responseMessageDiv = document.createElement('div');
responseMessageDiv.style.marginTop = '20px';
responseMessageDiv.style.fontSize = '1.5em';
responseMessageDiv.style.color = '#8B0000'; // Cor para a mensagem de resposta
responseMessageDiv.style.textAlign = 'center';
responseMessageDiv.style.opacity = '0'; // Começa invisível
responseMessageDiv.style.transition = 'opacity 0.8s ease-in-out'; // Animação de aparição
finalMessage.appendChild(responseMessageDiv); // Adiciona a div à mensagem final

// Eventos para os botões da mensagem final
acceptButton.addEventListener('click', () => {
    responseMessageDiv.textContent = 'Então já vou começar a contar os minutos para te ver!';
    responseMessageDiv.style.opacity = '1'; // Torna a mensagem visível
    acceptButton.disabled = true; // Desabilita os botões após a escolha
    declineButton.disabled = true;
});

declineButton.addEventListener('click', () => {
    responseMessageDiv.textContent = 'Certeza? Estou te dando uma chance, a escolha é sua!';
    responseMessageDiv.style.opacity = '1'; // Torna a mensagem visível
    acceptButton.disabled = true; // Desabilita os botões após a escolha
    declineButton.disabled = true;
});

createCards(); // Inicia o jogo
