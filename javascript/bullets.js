// Arrays para armazenar balas
const bullets = [];
// Variáveis para controlar os disparos
const shootInterval = 500;  // Intervalo de tempo entre os disparos (em milissegundos)
let lastShotTime = 0;       // Tempo do último disparo

// Função para disparar uma bala
function shootBullet() {
    const now = Date.now();
    // Verifica se o intervalo de tempo necessário para disparar novamente passou
    if (now - lastShotTime > shootInterval) {
        // Cria uma nova bala e a adiciona ao array de balas
        bullets.push({
            x: player.x + Math.cos(player.angle) * player.radius,  // Posição X da bala
            y: player.y + Math.sin(player.angle) * player.radius,  // Posição Y da bala
            vx: Math.cos(player.angle) * 10,                      // Velocidade X da bala
            vy: Math.sin(player.angle) * 10,                      // Velocidade Y da bala
            radius: 5                                             // Raio da bala
        });
        // Atualiza o tempo do último disparo
        lastShotTime = now;
    }
}

function shootBullet() {
    const now = Date.now();
    if (now - lastShotTime > shootInterval) {
        bullets.push({
            x: player.x + Math.cos(player.angle) * player.radius,
            y: player.y + Math.sin(player.angle) * player.radius,
            vx: Math.cos(player.angle) * 10,
            vy: Math.sin(player.angle) * 10,
            radius: 5
        });
        lastShotTime = now;
        playShootSound();  // Toca o som de tiro
    }
}
