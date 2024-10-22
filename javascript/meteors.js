// Arrays para armazenar meteoros
const meteors = [];
// Velocidade inicial dos meteoros
let meteorSpeed = 1;
// Tamanho inicial dos meteoros
let meteorSize = 20;

// Função para gerar um meteoro que pode aparecer em qualquer lado da tela
function spawnMeteor() {
    let x, y;

    // Decide de qual lado o meteoro vai aparecer
    const side = Math.floor(Math.random() * 4);

    switch (side) {
        case 0: // Esquerda
            x = -meteorSize;
            y = Math.random() * canvas.height;
            break;
        case 1: // Direita
            x = canvas.width + meteorSize;
            y = Math.random() * canvas.height;
            break;
        case 2: // Topo
            x = Math.random() * canvas.width;
            y = -meteorSize;
            break;
        case 3: // Inferior
            x = Math.random() * canvas.width;
            y = canvas.height + meteorSize;
            break;
    }

    // Calcular a direção do meteoro em direção ao jogador
    const dx = player.x - x;
    const dy = player.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Normaliza as velocidades para que o meteoro vá na direção da nave
    const vx = (dx / distance) * meteorSpeed;
    const vy = (dy / distance) * meteorSpeed;

    // Adiciona o meteoro ao array de meteoros
    meteors.push({ x, y, vx, vy, radius: meteorSize });
}
