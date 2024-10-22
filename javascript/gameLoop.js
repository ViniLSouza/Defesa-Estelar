function update() {
    // Atualiza a rotação do jogador com base nas teclas pressionadas
    if (leftKeyPressed) player.angle -= 0.015;   // Rotaciona para a esquerda
    if (rightKeyPressed) player.angle += 0.015;  // Rotaciona para a direita

    // Dispara balas se a barra de espaço estiver pressionada
    if (spaceKeyPressed) shootBullet();

    // Atualiza a posição das balas
    bullets.forEach(bullet => {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
    });

    // Atualiza a posição dos meteoros
    meteors.forEach(meteor => {
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
    });

    // Atualiza a posição das estrelas
    updateStars();  // Chama a função de atualização das estrelas

    // Verifica colisões
    checkCollisions();

    // Limpa o canvas antes de redesenhar
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha as estrelas no fundo
    drawStars();    // Chama a função de desenhar as estrelas

    // Desenha o jogador
    drawPlayer(player.x, player.y, player.radius, player.angle);

    // Desenha as balas
    ctx.fillStyle = 'red';
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    // Desenha os meteoros
    meteors.forEach(meteor => {
        ctx.fillStyle = 'rgb(120, 64, 8)';
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, meteor.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    // Atualiza a pontuação e o número de vidas na tela
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
}

// Função principal do loop do jogo
function gameLoop() {
    if (lives > 0 && gameRunning) {
        update();  // Atualiza o estado do jogo
        requestAnimationFrame(gameLoop);  // Continua o loop do jogo
    }
}

// Inicializa as estrelas antes de começar o jogo
createStars();
gameLoop();
// Gera meteoros a cada 1 segundo
setInterval(spawnMeteor, 2000);
