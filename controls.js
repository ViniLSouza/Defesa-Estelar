// Variáveis para rastrear o estado das teclas pressionadas
let leftKeyPressed = false;
let rightKeyPressed = false;
let spaceKeyPressed = false;

// Adiciona event listeners para detectar quando as teclas são pressionadas
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') leftKeyPressed = true;    // Tecla esquerda pressionada
    if (e.code === 'ArrowRight') rightKeyPressed = true;  // Tecla direita pressionada
    if (e.code === 'Space') spaceKeyPressed = true;       // Barra de espaço pressionada
});

// Adiciona event listeners para detectar quando as teclas são soltas
document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft') leftKeyPressed = false;   // Tecla esquerda solta
    if (e.code === 'ArrowRight') rightKeyPressed = false; // Tecla direita solta
    if (e.code === 'Space') {
        spaceKeyPressed = false;      // Barra de espaço solta
        
        // Reinicia o jogo ao pressionar a barra de espaço após o game over
        if (lives <= 0) {
            restartGame();
        }
    }
});
