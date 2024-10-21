// Função para verificar colisões e atualizar o estado do jogo
function checkCollisions() {
    // Verificação de colisão entre balas e meteoros
    bullets.forEach((bullet, bIndex) => {
        meteors.forEach((meteor, mIndex) => {
            const dx = bullet.x - meteor.x;
            const dy = bullet.y - meteor.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Se houver colisão, remove a bala e o meteoro, aumenta a pontuação e ajusta o tamanho dos meteoros
            if (distance < bullet.radius + meteor.radius) {
                meteors.splice(mIndex, 1);   // Remove o meteoro
                bullets.splice(bIndex, 1);   // Remove a bala
                score += 10;                 // Aumenta a pontuação
                meteorSize = Math.max(10, meteorSize - 1);  // Diminui o tamanho dos meteoros (aumentando a dificuldade)
                playExplosionSound();  // Toca o som de explosão
            }
        });
    });

    // Verificação de colisão entre meteoro e jogador
    meteors.forEach((meteor, mIndex) => {
        const dx = meteor.x - player.x;
        const dy = meteor.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Se o meteoro colidir com o jogador, perde uma vida
        if (distance < meteor.radius + player.radius) {
            meteors.splice(mIndex, 1);  // Remove o meteoro
            lives -= 1;                 // Reduz uma vida do jogador
            // Se as vidas acabarem, o jogo termina
            if (lives <= 0) {
                showGameOverScreen();
                return;  // Pausa o loop do jogo
            }
        }

        // Verifica se o meteoro ultrapassou a tela
        if (meteor.x < -meteorSize || meteor.x > canvas.width + meteorSize || 
            meteor.y < -meteorSize || meteor.y > canvas.height + meteorSize) {
            meteors.splice(mIndex, 1);  // Remove o meteoro da tela
        }
    });
}
