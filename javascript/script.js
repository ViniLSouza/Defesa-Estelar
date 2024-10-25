const shootSound = new Audio('tiro.mp3');
const explosionSound = new Audio('explosao.mp3');
const backgroundMusic = new Audio('musica.wav');

// Ajuste o volume de cada som (entre 0.0 e 1.0)
shootSound.volume = 0.2;
explosionSound.volume = 0.5;
backgroundMusic.volume = 0.5;

// Funções para tocar os sons
function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

// Arrays para armazenar balas e meteoros
const bullets = [];
const meteors = [];

// Variáveis para o jogo
let score = 0;
let lives = 3;
let meteorSize = 60;
const minMeteorSize = 10;
let meteorSpeed = 1;
let nextSizeReductionScore = 150; // Próximo marco de pontos para redução de tamanho

// Intervalo de disparo
const shootInterval = 500;
let lastShotTime = 0;

// Configuração do canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Estados das teclas
let leftKeyPressed = false;
let rightKeyPressed = false;
let spaceKeyPressed = false;

// Inicialização da imagem do meteoro e da nave
const meteorImage = new Image();
meteorImage.src = 'meteoro.png';

const playerImage = new Image();
playerImage.src = 'nave.png';

// Objeto do jogador
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 30,
    angle: -Math.PI / 2,
    speed: 5
};

// Funções de evento para teclas
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') leftKeyPressed = true;
    if (e.code === 'ArrowRight') rightKeyPressed = true;
    if (e.code === 'Space') spaceKeyPressed = true;
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft') leftKeyPressed = false;
    if (e.code === 'ArrowRight') rightKeyPressed = false;
    if (e.code === 'Space') {
        spaceKeyPressed = false;
        if (lives <= 0) restartGame();
    }
});

// Função para disparar uma bala
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
        playSound(shootSound);
    }
}

// Função de colisão e atualização do jogo
function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        meteors.forEach((meteor, mIndex) => {
            const dx = bullet.x - meteor.x;
            const dy = bullet.y - meteor.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < bullet.radius + meteor.radius) {
                meteors.splice(mIndex, 1);
                bullets.splice(bIndex, 1);
                score += 10;
                playSound(explosionSound);
            }
        });
    });

    meteors.forEach((meteor, mIndex) => {
        const dx = meteor.x - player.x;
        const dy = meteor.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < meteor.radius + player.radius) {
            meteors.splice(mIndex, 1);
            lives -= 1;
            if (lives <= 0) {
                showGameOverScreen();
                return;
            }
        }

        if (
            meteor.x < -meteorSize ||
            meteor.x > canvas.width + meteorSize ||
            meteor.y < -meteorSize ||
            meteor.y > canvas.height + meteorSize
        ) {
            meteors.splice(mIndex, 1);
        }
    });
}

// Função de atualização do jogo
function update() {
    if (leftKeyPressed) player.angle -= 0.015;
    if (rightKeyPressed) player.angle += 0.015;
    if (spaceKeyPressed) shootBullet();

    bullets.forEach(bullet => {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
    });

    meteors.forEach(meteor => {
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;
    });

    updateStars();
    checkCollisions();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawPlayer();
    drawBullets();
    drawMeteors();

    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;

    adjustMeteorAttributes();
}

// Função principal do loop do jogo
function gameLoop() {
    if (lives > 0 && gameRunning) {
        update();
        requestAnimationFrame(gameLoop);
    }
}

// Funções de desenhar
function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);
    ctx.drawImage(playerImage, -player.radius, -player.radius, player.radius * 2, player.radius * 2);
    ctx.restore();
}

function drawBullets() {
    ctx.fillStyle = 'red';
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawMeteors() {
    meteors.forEach(meteor => {
        ctx.drawImage(meteorImage, meteor.x - meteor.radius, meteor.y - meteor.radius, meteor.radius * 2, meteor.radius * 2);
    });
}

// Funções para meteoros
function spawnMeteor() {
    let x, y;
    const side = Math.floor(Math.random() * 4);

    switch (side) {
        case 0:
            x = -meteorSize;
            y = Math.random() * canvas.height;
            break;
        case 1:
            x = canvas.width + meteorSize;
            y = Math.random() * canvas.height;
            break;
        case 2:
            x = Math.random() * canvas.width;
            y = -meteorSize;
            break;
        case 3:
            x = Math.random() * canvas.width;
            y = canvas.height + meteorSize;
            break;
    }

    const dx = player.x - x;
    const dy = player.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const vx = (dx / distance) * meteorSpeed;
    const vy = (dy / distance) * meteorSpeed;

    meteors.push({ x, y, vx, vy, radius: meteorSize });
}

// Ajuste dos atributos dos meteoros conforme a pontuação
function adjustMeteorAttributes() {
    // Verifica se atingiu a pontuação necessária para reduzir o tamanho dos meteoros
    if (score >= nextSizeReductionScore && meteorSize > minMeteorSize) {
        meteorSize = Math.max(minMeteorSize, meteorSize - 5); // Reduz o tamanho em 5 unidades
        nextSizeReductionScore += 150; // Atualiza a próxima pontuação para reduzir o tamanho
    }

    // Diminuir o tempo de criação de meteoros a cada 200 pontos
    if (score > 0 && score % 200 === 0) {
        clearInterval(meteorInterval);
        const newInterval = Math.max(500, 2000 - (score / 200) * 100); // Reduz o intervalo de criação
        meteorInterval = setInterval(spawnMeteor, newInterval);
    }
}

// Funções de inicialização e controle do jogo
function restartGame() {
    score = 0;
    lives = 3;
    meteorSize = 60;
    nextSizeReductionScore = 150; // Reinicia o controle da pontuação para redução de tamanho
    meteors.length = 0;
    bullets.length = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.angle = -Math.PI / 2;
    gameOverScreen.classList.add('hidden');
    gameLoop();
}

function showGameOverScreen() {
    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

document.getElementById('restart-button').addEventListener('click', restartGame);
document.getElementById('main-menu-button').addEventListener('click', goToMainMenu);

let gameRunning = false;
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
let meteorInterval = setInterval(spawnMeteor, 2000);

function goToMainMenu() {
    gameOverScreen.classList.add('hidden');
    showStartScreen();
    restartGame();
}

function showStartScreen() {
    const startScreen = document.getElementById('start-screen');
    startScreen.classList.remove('hidden');
}

function startGame() {
    const startScreen = document.getElementById('start-screen');
    startScreen.classList.add('hidden');
    gameRunning = true;
    playSound(backgroundMusic);
    restartGame();
}

document.getElementById('start-button').addEventListener('click', startGame);

// Estrelas de fundo
const stars = [];
const starCount = 100;
const starSpeed = 2;

function createStars() {
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1
        });
    }
}

function updateStars() {
    stars.forEach(star => {
        star.y += starSpeed;
        if (star.y > canvas.height) {
            star.x = Math.random() * canvas.width;
            star.y = 0;
        }
    });
}

function drawStars() {
    ctx.fillStyle = 'white';
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

createStars();
gameLoop();