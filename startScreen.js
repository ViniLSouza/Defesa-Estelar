// Função para mostrar a tela de início
function showStartScreen() {
    const startScreen = document.getElementById('start-screen');
    startScreen.classList.remove('hidden');
}

// Função para ocultar a tela de início e começar o jogo
function startGame() {
    const startScreen = document.getElementById('start-screen');
    startScreen.classList.add('hidden');
    playBackgroundMusic();
    gameLoop();
}

// Event listener para o botão de iniciar
document.getElementById('start-button').addEventListener('click', startGame);