const memoryGame = document.querySelector('.memory-game');
const finalMessage = document.getElementById('final-message');
const acceptButton = document.getElementById('accept-button');
const declineButton = document.getElementById('decline-button');

const emojis = ['❤️', '🧡', '💛', '💚', '💙', '💜'];
const totalPairs = emojis.length; // Número total de pares a serem encontrados (6)

let cards = [...emojis, ...emojis]; // Duplica os emojis para ter os pares

let hasFlippedCard = false; // Se uma carta já foi virada
let lockBoard = false; // Se o tabuleiro está travado (durante animações)
let firstCard, secondCard; // Referências das duas cartas viradas
let matchedPairs = 0; // Contador de pares encontrados

function shuffle() {
    cards.sort(() => Math.random() - 0.5); // Embaralha as cartas
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
        // Nenhuma interrogação adicionada aqui no JavaScript

        card.appendChild(frontFace);
        card.appendChild(backFace);

        card.addEventListener('click', flipCard);
        memoryGame.appendChild(card);
    });
}

function flipCard() {
    // Impede cliques em cartas já pareadas ou durante animações
    if (this.classList.contains('match')) return;
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
    checkForMatch(); // Verifica se as cartas formam um par
}

function checkForMatch() {
    let isMatch = firstCard.querySelector('.front-face').textContent === secondCard.querySelector('.front-face').textContent;

    if (isMatch) {
        disableCards(); // Se for um par
    } else {
        unflipCards(); // Se não for um par
    }
}

function disableCards() {
    // Remove event listeners para que as cartas não possam ser clicadas novamente
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    // Adiciona a classe 'match' para que as cartas permaneçam viradas
    firstCard.classList.add('match');
    secondCard.classList.add('match');

    // Remove a classe 'flip' pois 'match' já garante a virada
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    matchedPairs++; // Incrementa o contador de pares encontrados

    // *** ESTA É A LÓGICA CRÍTICA PARA A MENSAGEM FINAL ***
    // Mostra a mensagem final SOMENTE QUANDO TODOS os pares forem encontrados
    if (matchedPairs === totalPairs) {
        setTimeout(() => {
            finalMessage.classList.remove('hidden'); // Remove a classe 'hidden'
            memoryGame.style.display = 'none'; // Esconde o tabuleiro do jogo
        }, 1000); // Espera 1 segundo para a animação da última virada
    }

    resetBoard(); // Reseta o estado para a próxima jogada
}

function unflipCards() {
    lockBoard = true; // Trava o tabuleiro

    setTimeout(() => {
        firstCard.classList.remove('flip'); // Desvira a primeira carta
        secondCard.classList.remove('flip'); // Desvira a segunda carta
        resetBoard(); // Reseta o estado
    }, 1500); // Espera 1.5 segundos antes de desvirar
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false]; // Reseta flags
    [firstCard, secondCard] = [null, null]; // Limpa cartas
}

// Elemento para exibir as mensagens dos botões (resposta SIM/NÃO)
const responseMessageDiv = document.createElement('div');
responseMessageDiv.style.marginTop = '20px';
responseMessageDiv.style.fontSize = '1.5em';
responseMessageDiv.style.color = '#8B0000';
responseMessageDiv.style.textAlign = 'center';
responseMessageDiv.style.opacity = '0'; // Começa invisível
responseMessageDiv.style.transition = 'opacity 0.8s ease-in-out';
finalMessage.appendChild(responseMessageDiv);

// Eventos para os botões SIM/NÃO
acceptButton.addEventListener('click', () => {
    responseMessageDiv.textContent = 'Então já vou começar a contar os minutos para te ver!';
    responseMessageDiv.style.opacity = '1';
    acceptButton.disabled = true;
    declineButton.disabled = true;
});

declineButton.addEventListener('click', () => {
    responseMessageDiv.textContent = 'Certeza? Estou te dando uma chance, a escolha é sua!';
    responseMessageDiv.style.opacity = '1';
    acceptButton.disabled = true;
    declineButton.disabled = true;
});

createCards(); // Inicializa o jogo ao carregar a página
