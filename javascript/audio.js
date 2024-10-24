const shootSound = new Audio('tiro.mp3');
const explosionSound = new Audio('explosao.mp3');
const backgroundMusic = new Audio('musica.wav');

// Ajuste o volume de cada som (entre 0.0 e 1.0)
shootSound.volume = 0.2;      // Volume do som de tiro
explosionSound.volume = 0.5;  // Volume do som de explosão
backgroundMusic.volume = 0.5; // Volume da música de fundo

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
