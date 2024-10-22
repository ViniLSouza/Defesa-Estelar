// Objeto que representa o jogador
const player = {
    x: canvas.width / 2,    // Posição X do jogador (centro da tela)
    y: canvas.height / 2,   // Posição Y do jogador (centro da tela)
    radius: 30,             // Raio do jogador (usado para escala da imagem)
    angle: -Math.PI / 2,    // Ângulo de direção do disparo (apontando para cima inicialmente)
    visualAngle: 0,         // Ângulo visual da nave (não afeta o tiro)
    speed: 5                // Velocidade de movimento do jogador
};

// Carrega a imagem da nave
const playerImage = new Image();
playerImage.src = 'nave.png'; // Caminho para a imagem da nave

// Função para desenhar o jogador com a imagem
function drawPlayer(x, y, size, angle) {
    ctx.save(); // Salva o estado do contexto

    // Translada e rotaciona o contexto para a posição e ângulo corretos
    ctx.translate(x, y);
    ctx.rotate(angle); // Agora usa o 'visualAngle' para a rotação visual da nave

    // Desenha a imagem da nave, ajustando o tamanho conforme 'size'
    ctx.drawImage(playerImage, -size, -size, size * 2, size * 2); // Centraliza a imagem em (x, y)

    ctx.restore(); // Restaura o estado do contexto para evitar efeitos colaterais na próxima renderização
}
