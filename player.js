// Objeto que representa o jogador
const player = {
    x: canvas.width / 2,    // Posição X do jogador (centro da tela)
    y: canvas.height / 2,   // Posição Y do jogador (centro da tela)
    radius: 20,             // Raio do jogador
    angle: -Math.PI / 2,    // Ângulo de direção do jogador (apontando para cima)
    speed: 5                // Velocidade de movimento do jogador
};

// Função para desenhar o jogador
function drawPlayer(x, y, size, angle) {
    ctx.fillStyle = 'white';
    ctx.beginPath();
    // Desenho do corpo do jogador
    ctx.moveTo(
        x + Math.cos(angle) * size,  // Vértice superior
        y + Math.sin(angle) * size
    );
    ctx.lineTo(
        x + Math.cos(angle + Math.PI * 2 / 3) * size,  // Vértice inferior esquerdo
        y + Math.sin(angle + Math.PI * 2 / 3) * size
    );
    ctx.lineTo(
        x + Math.cos(angle - Math.PI * 2 / 3) * size,  // Vértice inferior direito
        y + Math.sin(angle - Math.PI * 2 / 3) * size
    );
    ctx.closePath();
    ctx.fill();  // Preenche o triângulo

    // Desenho da linha na frente do jogador
    ctx.strokeStyle = 'red'; // Cor da linha
    ctx.lineWidth = 2;       // Largura da linha
    ctx.beginPath();
    ctx.moveTo(
        x + Math.cos(angle) * size,  // Ponta do triângulo
        y + Math.sin(angle) * size
    );
    ctx.lineTo(
        x + Math.cos(angle) * (size + 2000),  // Linha estendida na direção
        y + Math.sin(angle) * (size + 2000)
    );
    ctx.stroke();  // Desenha a linha
}
