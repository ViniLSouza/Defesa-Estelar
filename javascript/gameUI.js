// Seleciona os elementos da interface do usuário
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
// Variável para armazenar a pontuação do jogo
let score = 0;
// Variável para armazenar o número de vidas do jogador
let lives = 3;

// Função para exibir a tela de Game Over
function showGameOverScreen() {
    // Exibe a pontuação final na tela de Game Over
    finalScoreElement.textContent = score;
    // Exibe a tela de Game Over
    gameOverScreen.classList.remove('hidden');
}

// Função para reiniciar o jogo
function restartGame() {
    // Reseta as variáveis do jogo
    score = 0;
    lives = 3;
    meteorSize = 20;
    meteors.length = 0;
    bullets.length = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.angle = -Math.PI / 2;

    // Oculta a tela de Game Over
    gameOverScreen.classList.add('hidden');

    // Reinicia o loop do jogo
    gameLoop();
}

// Adiciona um event listener ao botão de reiniciar
restartButton.addEventListener('click', restartGame);

// Seleciona o botão de voltar para o menu principal
const mainMenuButton = document.getElementById('main-menu-button');

// Função para voltar ao menu principal
function goToMainMenu() {
    // Oculta a tela de Game Over
    gameOverScreen.classList.add('hidden');
    
    // Mostra a tela inicial
    showStartScreen();

    // Reseta as variáveis do jogo
    score = 0;
    lives = 3;
    meteorSize = 20;
    meteors.length = 0;
    bullets.length = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.angle = -Math.PI / 2;
}

// Adiciona um event listener ao botão de voltar ao menu principal
mainMenuButton.addEventListener('click', goToMainMenu);
