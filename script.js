const memoryGame = document.querySelector('.memory-game');
const finalMessage = document.getElementById('final-message');
const acceptButton = document.getElementById('accept-button');
const declineButton = document.getElementById('decline-button');

const emojis = ['❤️', '🧡', '💛', '💚', '💙', '💜'];
const totalPairs = emojis.length; // O número total de pares (6 neste caso)

let cards = [...emojis, ...emojis]; // Duplica os emojis para ter os pares

let hasFlippedCard = false; // Flag para saber se uma carta já foi virada
let lockBoard = false; // Flag para travar o tabuleiro durante as animações
let firstCard, secondCard; // Variáveis para armazenar as duas cartas viradas
let matchedPairs = 0; // Contador de pares encontrados

// Função para embaralhar as cartas
function shuffle() {
    cards.sort(() => Math.random() - 0.5); // Algoritmo simples para embaralhar um array
}

// Função para criar as cartas dinamicamente no HTML
function createCards() {
    shuffle(); // Embaralha as cartas antes de criá-las
    cards.forEach(emoji => {
        const card = document.createElement('div'); // Cria um elemento <div>
        card.classList.add('memory-card'); // Adiciona a classe CSS 'memory-card'

        const frontFace = document.createElement('div'); // Cria o div para a face frontal da carta
        frontFace.classList.add('front-face'); // Adiciona a classe CSS 'front-face'
        frontFace.textContent = emoji; // Define o emoji como conteúdo da face frontal

        const backFace = document.createElement('div'); // Cria o div para a face traseira da carta
        backFace.classList.add('back-face'); // Adiciona a classe CSS 'back-face'
        // IMPORTANTE: Não definimos textContent aqui para remover a interrogação
        // backFace.textContent = '?'; // LINHA REMOVIDA OU MANTIDA SEM CONTEÚDO

        card.appendChild(frontFace); // Adiciona a face frontal à carta
        card.appendChild(backFace); // Adiciona a face traseira à carta

        // Adiciona um "ouvinte de evento" para quando a carta for clicada, chamar a função 'flipCard'
        card.addEventListener('click', flipCard);
        memoryGame.appendChild(card); // Adiciona a carta ao contêiner do jogo
    });
}

// Função para virar uma carta
function flipCard() {
    // Se a carta já tem a classe 'match' (já é um par), não faz nada
    if (this.classList.contains('match')) return; 
    // Se o tabuleiro estiver travado (animação em andamento), não faz nada
    if (lockBoard) return;
    // Se a carta clicada for a mesma que a primeira carta virada, não faz nada
    if (this === firstCard) return;

    this.classList.add('flip'); // Adiciona a classe 'flip' para virar a carta visualmente

    if (!hasFlippedCard) {
        // É a primeira carta virada
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // É a segunda carta virada
    secondCard = this;
    checkForMatch(); // Verifica se as duas cartas formam um par
}

// Função para verificar se as duas cartas viradas são um par
function checkForMatch() {
    // Compara o conteúdo (emoji) da face frontal das duas cartas
    let isMatch = firstCard.querySelector('.front-face').textContent === secondCard.querySelector('.front-face').textContent;

    if (isMatch) {
        disableCards(); // Se for um par, desabilita as cartas
    } else {
        unflipCards(); // Se não for um par, desvira as cartas
    }
}

// Função para lidar com cartas que formam um par
function disableCards() {
    // Remove os event listeners para que as cartas não possam ser clicadas novamente
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    // Adiciona a classe 'match'. O CSS para '.memory-card.match' garante que a carta permaneça virada.
    firstCard.classList.add('match');
    secondCard.classList.add('match');
    
    // IMPORTANTE: Remover a classe 'flip' imediatamente após adicionar 'match'.
    // A classe 'match' no CSS agora é responsável por manter a virada.
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    matchedPairs++; // Incrementa a contagem de pares encontrados

    // Verifica se TODOS os pares foram encontrados
    if (matchedPairs === totalPairs) { // Compara com o número total de pares
        setTimeout(() => {
            finalMessage.classList.remove('hidden'); // Mostra a mensagem final
            memoryGame.style.display = 'none'; // Esconde o tabuleiro do jogo
        }, 1000); // Espera 1 segundo antes de mostrar a mensagem
    }

    resetBoard(); // Reseta o estado para a próxima jogada
}

// Função para desvirar cartas que não formam um par
function unflipCards() {
    lockBoard = true; // Trava o tabuleiro para evitar cliques enquanto as cartas desviram

    setTimeout(() => {
        firstCard.classList.remove('flip'); // Remove a classe 'flip' para desvirar a primeira carta
        secondCard.classList.remove('flip'); // Remove a classe 'flip' para desvirar a segunda carta
        resetBoard(); // Reseta o estado do tabuleiro
    }, 1500); // Espera 1.5 segundos antes de desvirar
}

// Função para resetar as variáveis de controle do tabuleiro
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false]; // Redefine hasFlippedCard e lockBoard para false
    [firstCard, secondCard] = [null, null]; // Limpa as referências das cartas viradas
}

// Elemento para exibir as mensagens personalizadas dos botões (criado e adicionado dinamicamente)
const responseMessageDiv = document.createElement('div');
responseMessageDiv.style.marginTop = '20px';
responseMessageDiv.style.fontSize = '1.5em';
responseMessageDiv.style.color = '#8B0000'; // Cor do texto da mensagem
responseMessageDiv.style.textAlign = 'center';
responseMessageDiv.style.opacity = '0'; // Começa invisível
responseMessageDiv.style.transition = 'opacity 0.8s ease-in-out'; // Efeito de transição para aparecer
finalMessage.appendChild(responseMessageDiv); // Adiciona a div dentro da mensagem final

// Evento para o botão "SIM!"
acceptButton.addEventListener('click', () => {
    responseMessageDiv.textContent = 'Então já vou começar a contar os minutos para te ver!'; // Mensagem de resposta
    responseMessageDiv.style.opacity = '1'; // Torna a mensagem visível
    acceptButton.disabled = true; // Desabilita o botão SIM
    declineButton.disabled = true; // Desabilita o botão Talvez
});

// Evento para o botão "Talvez em outro dia..."
declineButton.addEventListener('click', () => {
    responseMessageDiv.textContent = 'Certeza? Estou te dando uma chance, a escolha é sua!'; // Mensagem de resposta
    responseMessageDiv.style.opacity = '1'; // Torna a mensagem visível
    acceptButton.disabled = true; // Desabilita o botão SIM
    declineButton.disabled = true; // Desabilita o botão Talvez
});

createCards(); // Chama a função para criar as cartas e iniciar o jogo quando a página carrega
