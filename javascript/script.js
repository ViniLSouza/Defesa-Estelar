const shootSound = new Audio('tiro.mp3');
const explosionSound = new Audio('explosao.mp3');
const backgroundMusic = new Audio('musica.wav');
const chickenSound = new Audio('chicken.wav');

shootSound.volume = 0.2;
explosionSound.volume = 0.5;
backgroundMusic.volume = 0.5;
chickenSound.volume = 0.5;
backgroundMusic.loop = true;

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

const bullets = [];
const meteors = [];
let score = 0;
let lives = 3;
let meteorSize = 60;
const minMeteorSize = 10;
let meteorSpeed = 3;
let nextSizeReductionScore = 150;

const shootInterval = 350;
let lastShotTime = 0;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let leftKeyPressed = false;
let rightKeyPressed = false;
let spaceKeyPressed = false;

const meteorImage = new Image();
meteorImage.src = 'meteoro.png';

const playerImage = new Image();
playerImage.src = 'nave.png';

const chickenImage = new Image();
chickenImage.src = 'chicken.png';

function spawnChicken() {
    let x, y;
    const side = Math.floor(Math.random() * 4);

    switch (side) {
        case 0: x = -meteorSize; y = Math.random() * canvas.height; break;
        case 1: x = canvas.width + meteorSize; y = Math.random() * canvas.height; break;
        case 2: x = Math.random() * canvas.width; y = -meteorSize; break;
        case 3: x = Math.random() * canvas.width; y = canvas.height + meteorSize; break;
    }

    const dx = player.x - x;
    const dy = player.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const vx = (dx / distance) * meteorSpeed;
    const vy = (dy / distance) * meteorSpeed;

    meteors.push({ x, y, vx, vy, radius: meteorSize, isChicken: true });
}
setInterval(spawnChicken, 60000);

const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 30,
    angle: -Math.PI / 2,
    speed: 5
};

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') leftKeyPressed = true;
    if (e.code === 'ArrowRight') rightKeyPressed = true;
    if (e.code === 'Space') spaceKeyPressed = true;
    if (e.code === 'Escape') {
        gamePaused = !gamePaused;
        if (gamePaused) {
            showPauseScreen();
            backgroundMusic.pause();
            clearInterval(meteorInterval);
            clearInterval(chickenInterval);
        } else {
            hidePauseScreen();
            backgroundMusic.play();
            meteorInterval = setInterval(spawnMeteor, 2000);
            chickenInterval = setInterval(spawnChicken, 60000);
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft') leftKeyPressed = false;
    if (e.code === 'ArrowRight') rightKeyPressed = false;
    if (e.code === 'Space') {
        spaceKeyPressed = false;
        if (lives <= 0) restartGame();
    }
});

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

function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        meteors.forEach((meteor, mIndex) => {
            const dx = bullet.x - meteor.x;
            const dy = bullet.y - meteor.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < bullet.radius + meteor.radius) {
                if (meteor.isChicken) {
                    lives += 1;
                    powerUpActive = true;
                    powerUpDuration = 300; // 5 segundos a 60 FPS
                    meteorSpeed = 2;
                    playSound(powerUpSound);
                }

                if (meteor.splits > 0) {
                    const newRadius = meteor.radius / 2;
                    meteors.push(
                        { x: meteor.x, y: meteor.y, vx: -meteor.vx, vy: -meteor.vy, radius: newRadius, splits: meteor.splits - 1 },
                        { x: meteor.x, y: meteor.y, vx: meteor.vx, vy: meteor.vy, radius: newRadius, splits: meteor.splits - 1 }
                    );
                }

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
            if (!meteor.isChicken) {
                meteors.splice(mIndex, 1);
                lives -= 1;
                if (lives <= 0) {
                    showGameOverScreen();
                    return;
                }
            } else {
                meteors.splice(mIndex, 1);
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

function update() {
    if (gamePaused) return;

    if (leftKeyPressed) player.angle -= 0.04;
    if (rightKeyPressed) player.angle += 0.04;
    if (spaceKeyPressed) shootBullet();

    // Atualizar power-up
    if (powerUpActive) {
        powerUpDuration--;
        if (powerUpDuration <= 0) {
            powerUpActive = false;
            meteorSpeed = 3 + difficultyLevel;
        }
    }

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
    updateHighScore();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars();
    drawPlayer();
    drawBullets();
    drawMeteors();
    drawPowerUpStatus();

    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
    document.getElementById('difficulty').textContent = difficultyLevel;

    adjustMeteorAttributes();
}

const fps = 144; // Define a taxa de quadros para 15 FPS
const frameInterval = 1000 / fps;
let lastFrameTime = 0;

function gameLoop(currentTime) {
    const deltaTime = currentTime - lastFrameTime;
    
    if (deltaTime >= frameInterval) {
        lastFrameTime = currentTime;
        
        if (lives > 0 && gameRunning) {
            update(); // Executa a atualização do jogo
        } else {
            clearInterval(meteorInterval); // Encerra o spawn de meteoros caso o jogo termine
            return;
        }
    }
    
    requestAnimationFrame(gameLoop);
}


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
        if (meteor.isChicken) {
            ctx.drawImage(chickenImage, meteor.x - meteor.radius, meteor.y - meteor.radius, meteor.radius * 2, meteor.radius * 2);
        } else {
            ctx.drawImage(meteorImage, meteor.x - meteor.radius, meteor.y - meteor.radius, meteor.radius * 2, meteor.radius * 2);
        }
    });
}

function spawnMeteor() {
    let x, y;
    const side = Math.floor(Math.random() * 4);

    switch (side) {
        case 0: x = -meteorSize; y = Math.random() * canvas.height; break;
        case 1: x = canvas.width + meteorSize; y = Math.random() * canvas.height; break;
        case 2: x = Math.random() * canvas.width; y = -meteorSize; break;
        case 3: x = Math.random() * canvas.width; y = canvas.height + meteorSize; break;
    }

    const dx = player.x - x;
    const dy = player.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const vx = (dx / distance) * meteorSpeed;
    const vy = (dy / distance) * meteorSpeed;

    const splits = Math.random() < 0.30 ? 1 : 0;

    meteors.push({ x, y, vx, vy, radius: meteorSize, splits });
}

let meteorSpawnTime = 2000;
const minMeteorSpawnTime = 500;
let lastScoreCheck = 0;
function adjustMeteorAttributes() {
    if (score >= nextSizeReductionScore) {
        meteorSize = Math.max(minMeteorSize, meteorSize - 5);
        nextSizeReductionScore += 150;
        difficultyLevel++;
        document.getElementById('difficulty').textContent = difficultyLevel;
    }
}

function restartGame() {
    document.getElementById('game-over').classList.add('hidden');
    startGame();
}


function showGameOverScreen() {
    const gameOverScreen = document.getElementById('game-over');
    gameOverScreen.classList.remove('hidden');
    document.getElementById('final-score').textContent = score;
    document.getElementById('game-over-high-score').textContent = highScore;
    
    // Limpar intervalos e parar música
    clearInterval(meteorInterval);
    clearInterval(chickenInterval);
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

document.getElementById('restart-button').addEventListener('click', restartGame);
document.getElementById('main-menu-button').addEventListener('click', goToMainMenu);

let gameRunning = false;
const gameOverScreen = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
let meteorInterval;
let chickenInterval;

function goToMainMenu() {
    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('game-container').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    initializeHighScore();
    
    // Limpar intervalos e parar música
    clearInterval(meteorInterval);
    clearInterval(chickenInterval);
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
}

function showStartScreen() {
    const startScreen = document.getElementById('start-screen');
    startScreen.classList.remove('hidden');
}

function startGame() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-container').classList.remove('hidden');
    gameRunning = true;
    gamePaused = false;
    score = 0;
    lives = 3;
    difficultyLevel = 1;
    meteorSpeed = 3;
    meteorSize = 60;
    bullets.length = 0;
    meteors.length = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.angle = -Math.PI / 2;
    lastShotTime = 0;
    powerUpActive = false;
    powerUpDuration = 0;
    
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
    document.getElementById('difficulty').textContent = difficultyLevel;
    
    // Limpar intervalos existentes
    clearInterval(meteorInterval);
    clearInterval(chickenInterval);
    
    // Iniciar intervalos novamente
    meteorInterval = setInterval(spawnMeteor, 2000);
    chickenInterval = setInterval(spawnChicken, 60000);
    
    // Iniciar música
    backgroundMusic.currentTime = 0;
    backgroundMusic.play();
    
    requestAnimationFrame(gameLoop);
}

document.getElementById('start-button').addEventListener('click', startGame);

const stars = [];
function createStars() {
    for (let i = 0; i < 100; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1
        });
    }
}

function drawStars() {
    ctx.fillStyle = 'white';
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateStars() {
    stars.forEach(star => {
        star.y += 0.5;
        if (star.y > canvas.height) star.y = 0;
    });
}

createStars();
showStartScreen();

// Adicionar variáveis globais para novas funcionalidades
let gamePaused = false;
let highScore = localStorage.getItem('highScore') || 0;
let difficultyLevel = 1;
let powerUpActive = false;
let powerUpDuration = 0;

// Adicionar após as outras constantes de áudio
const powerUpSound = new Audio('chicken.wav');
powerUpSound.volume = 0.3;

// Adicionar após a função playSound
function updateHighScore() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('high-score').textContent = highScore;
    }
}

// Adicionar após as outras funções de desenho
function drawPowerUpStatus() {
    if (powerUpActive) {
        ctx.fillStyle = '#00ff00';
        ctx.font = '20px Orbitron';
        ctx.fillText(`Power-up ativo: ${Math.ceil(powerUpDuration / 60)}s`, 20, 80);
    }
}

// Adicionar após a função showGameOverScreen para mostrar high score
function showPauseScreen() {
    const pauseScreen = document.createElement('div');
    pauseScreen.id = 'pause-screen';
    pauseScreen.innerHTML = `
        <h2>Jogo Pausado</h2>
        <p>Pressione ESC para continuar</p>
    `;
    document.getElementById('game-container').appendChild(pauseScreen);
}

function hidePauseScreen() {
    const pauseScreen = document.getElementById('pause-screen');
    if (pauseScreen) {
        pauseScreen.remove();
    }
}

// Adicionar após as variáveis globais
function initializeHighScore() {
    highScore = localStorage.getItem('highScore') || 0;
    document.getElementById('high-score').textContent = highScore;
    document.getElementById('start-high-score').textContent = highScore;
}

// Adicionar chamada para inicializar o high score no início do jogo
initializeHighScore();
