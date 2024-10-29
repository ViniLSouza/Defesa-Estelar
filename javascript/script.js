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

const shootInterval = 500;
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
setInterval(spawnChicken, 65000);

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
                    playSound(chickenSound);
                }

                // Divisão dos meteoros
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
    if (leftKeyPressed) player.angle -= 0.035;
    if (rightKeyPressed) player.angle += 0.035;
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

function gameLoop() {
    if (lives > 0 && gameRunning) {
        update();
        requestAnimationFrame(gameLoop);
    } else {
        clearInterval(meteorInterval);
    }
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
    if (score >= nextSizeReductionScore && meteorSize > minMeteorSize) {
        meteorSize = Math.max(minMeteorSize, meteorSize - 5);

        meteorSpeed += 0.5;

        meteorSpawnTime = Math.max(minMeteorSpawnTime, meteorSpawnTime - 250);
        clearInterval(meteorInterval);
        meteorInterval = setInterval(spawnMeteor, meteorSpawnTime);

        nextSizeReductionScore += 150;
    }
}

function restartGame() {
    score = 0;
    lives = 3;
    meteorSize = 60;
    nextSizeReductionScore = 150;
    meteors.length = 0;
    bullets.length = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    player.angle = -Math.PI / 2;
    gameOverScreen.classList.add('hidden');
    gameRunning = true;

    clearInterval(meteorInterval);
    meteorInterval = setInterval(spawnMeteor, 2000);

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
let meteorInterval;

function goToMainMenu() {
    gameRunning = false;
    gameOverScreen.classList.add('hidden');
    showStartScreen();
    clearInterval(meteorInterval);
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
    meteorInterval = setInterval(spawnMeteor, 2000);
    restartGame();
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
