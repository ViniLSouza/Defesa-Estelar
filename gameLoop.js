// Função para atualizar o estado do jogo
function update() {
    // Ajusta a rotação do jogador com base nas teclas pressionadas
    if (leftKeyPressed) player.angle -= 0.015;   // Rotaciona para a esquerda
    if (rightKeyPressed) player.angle += 0.015;  // Rotaciona para a direita

    // Dispara balas se a barra de espaço estiver pressionada
    if (spaceKeyPressed) shootBullet();

    // Movimenta as balas
    bullets.forEach(bullet => {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
    });
    
    // Movimenta os meteoros
    meteors.forEach(meteor => {
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
    });

    // Verifica colisões
    checkCollisions();

    // Redesenha o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha o jogador
    drawPlayer(player.x, player.y, player.radius, player.angle);

    // Desenha as balas
    ctx.fillStyle = 'white';
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    // Desenha os meteoros
    meteors.forEach(meteor => {
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
    if (lives > 0) {
        update();  // Atualiza o estado do jogo
        requestAnimationFrame(gameLoop);  // Continua o loop do jogo
    }
}

// Inicia o loop do jogo
gameLoop();
// Gera meteoros a cada 1 segundo
setInterval(spawnMeteor, 2000);
