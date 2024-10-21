const shootSound = new Audio('tiro.mp3');
const explosionSound = new Audio('explosao.mp3');
const backgroundMusic = new Audio('musica.wav');

// Função para tocar som de tiro
function playShootSound() {
    shootSound.currentTime = 0;
    shootSound.play();
}

// Função para tocar som de explosão
function playExplosionSound() {
    explosionSound.currentTime = 0;
    explosionSound.play();
}

// Função para tocar a música de fundo em loop
function playBackgroundMusic() {
    backgroundMusic.loop = true;
    backgroundMusic.play();
}
