// Array para armazenar as estrelas
const stars = [];
const starCount = 100; // Quantidade de estrelas na tela
const starSpeed = 2;   // Velocidade das estrelas

// Função para inicializar as estrelas
function createStars() {
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,  // Posição X aleatória
            y: Math.random() * canvas.height, // Posição Y aleatória
            radius: Math.random() * 2 + 1     // Tamanho da estrela
        });
    }
}

// Função para atualizar a posição das estrelas
function updateStars() {
    stars.forEach(star => {
        // Move a estrela para baixo
        star.y += starSpeed;

        // Se a estrela sair da tela, reposiciona-a no topo
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;  // Nova posição X aleatória
        }
    });
}

// Função para desenhar as estrelas no canvas
function drawStars() {
    ctx.fillStyle = 'white';
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}
