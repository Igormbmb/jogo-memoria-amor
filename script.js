const memoryGame = document.querySelector('.memory-game');
const finalMessage = document.getElementById('final-message');
const acceptButton = document.getElementById('accept-button');
const declineButton = document.getElementById('decline-button');

const emojis = ['❤️', '🧡', '💛', '💚', '💙', '💜'];
const totalPairs = emojis.length; 

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
        // IMPORTANTE: REMOVEMOS AQUI QUALQUER CÓDIGO QUE ADICIONAVA A INTERROGAÇÃO
        // Nenhuma linha como 'backFace.textContent = "?";' deve estar aqui.

        card.appendChild(frontFace); 
        card.appendChild(backFace); 

        card.addEventListener('click', flipCard);
        memoryGame.appendChild(card); 
    });
}

function flipCard() {
    if (this.classList.contains('match')) return; 
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

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    // Adiciona a classe 'match'
    firstCard.classList.add('match');
    secondCard.classList.add('match');
    
    // Remove a classe 'flip' pois 'match' vai controlar a virada
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    matchedPairs++; 

    // O check da mensagem final será ajustado no Passo 3, mas por enquanto mantemos a lógica para teste
    if (matchedPairs === totalPairs) { 
        setTimeout(() => {
            finalMessage.classList.remove('hidden'); 
            memoryGame.style.display = 'none'; 
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
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false]; 
    [firstCard, secondCard] = [null, null]; 
}

const responseMessageDiv = document.createElement('div');
responseMessageDiv.style.marginTop = '20px';
responseMessageDiv.style.fontSize = '1.5em';
responseMessageDiv.style.color = '#8B0000'; 
responseMessageDiv.style.textAlign = 'center';
responseMessageDiv.style.opacity = '0'; 
responseMessageDiv.style.transition = 'opacity 0.8s ease-in-out'; 
finalMessage.appendChild(responseMessageDiv); 

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

createCards();
