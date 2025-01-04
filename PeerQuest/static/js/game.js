// Constants
const WINDOW_WIDTH = 1440;
const WINDOW_HEIGHT = 900;
const PLAYER_WIDTH = 80;
const PLAYER_HEIGHT = 40;
const BULLET_WIDTH = 10;
const BULLET_HEIGHT = 20;
const ENEMY_WIDTH = 80;
const ENEMY_HEIGHT = 40;
const PLAYER_SPEED = 300;
const BULLET_SPEED = 500;
const ENEMY_SPEED_BASE = 150;
const ENEMY_SPAWN_INTERVAL = 1;
const HEART_WIDTH = 40;
const HEART_HEIGHT = 40;

// Game state
let playerX = (WINDOW_WIDTH - PLAYER_WIDTH) / 2;
let playerY = WINDOW_HEIGHT - PLAYER_HEIGHT - 10;
let bullets = [];
let enemies = [];
let gameOver = false;
let score = 0;
let highestScore = 0;
let enemySpawnTimer = 0;
let enemySpeed = ENEMY_SPEED_BASE;
let lives = 3;
let lastTime = 0;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = WINDOW_WIDTH;
canvas.height = WINDOW_HEIGHT;

// Load images
const playerImg = new Image();
playerImg.src = "static/assets/player.png";

const bulletImg = new Image();
bulletImg.src = "static/assets/bullet.png";

const enemyImg = new Image();
enemyImg.src = "static/assets/enemy.png";

const heartImg = new Image();
heartImg.src = "static/assets/heart.png";

// Spawn a single enemy
function spawnEnemy() {
    const enemyX = Math.random() * (WINDOW_WIDTH - ENEMY_WIDTH);
    enemies.push({ x: enemyX, y: -ENEMY_HEIGHT });
}

// Fire 3 bullets
function fireBullet() {
    const offset = 25;
    bullets.push({ x: playerX + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2 - offset, y: playerY });
    bullets.push({ x: playerX + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2, y: playerY });
    bullets.push({ x: playerX + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2 + offset, y: playerY });
}

// Check collisions
function checkCollisions() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            if (
                bullet.x < enemy.x + ENEMY_WIDTH &&
                bullet.x + BULLET_WIDTH > enemy.x &&
                bullet.y < enemy.y + ENEMY_HEIGHT &&
                bullet.y + BULLET_HEIGHT > enemy.y
            ) {
                bullets.splice(i, 1);
                enemies.splice(j, 1);
                score++;
                if (score > highestScore) highestScore = score;
                break;
            }
        }
    }
}

// Reset game state
function resetGame() {
    gameOver = false;
    score = 0;
    lives = 3;
    bullets = [];
    enemies = [];
    enemySpeed = ENEMY_SPEED_BASE;
    playerX = (WINDOW_WIDTH - PLAYER_WIDTH) / 2;
    requestAnimationFrame(gameLoop);
}

// Game loop
function gameLoop(timestamp) {
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    ctx.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);

    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "40px Arial";
        ctx.fillText("Game Over", WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2 - 30);
        ctx.fillText("Score: " + score, WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2);
        ctx.fillText("Highest Score: " + highestScore, WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2 + 30);
        ctx.fillText("Click to Play Again", WINDOW_WIDTH / 2, WINDOW_HEIGHT / 2 + 70);
        return;
    }

    // Player movement
    if (keys["ArrowLeft"]) {
        playerX = Math.max(0, playerX - PLAYER_SPEED * deltaTime);
    }
    if (keys["ArrowRight"]) {
        playerX = Math.min(WINDOW_WIDTH - PLAYER_WIDTH, playerX + PLAYER_SPEED * deltaTime);
    }

    // Update bullets
    bullets.forEach((bullet, index) => {
        bullet.y -= BULLET_SPEED * deltaTime;
        if (bullet.y < 0) bullets.splice(index, 1);
    });

    // Spawn enemies
    enemySpawnTimer += deltaTime;
    if (enemySpawnTimer >= ENEMY_SPAWN_INTERVAL) {
        spawnEnemy();
        enemySpawnTimer = 0;
    }

    // Update enemies
    enemies.forEach((enemy, index) => {
        enemy.y += enemySpeed * deltaTime;
        if (enemy.y > WINDOW_HEIGHT) {
            enemies.splice(index, 1);
            lives--;
            if (lives <= 0) gameOver = true;
        }
    });

    // Check collisions
    checkCollisions();

    // Draw player
    ctx.drawImage(playerImg, playerX, playerY, PLAYER_WIDTH, PLAYER_HEIGHT);

    // Draw bullets
    bullets.forEach((bullet) => {
        ctx.drawImage(bulletImg, bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT);
    });

    // Draw enemies
    enemies.forEach((enemy) => {
        ctx.drawImage(enemyImg, enemy.x, enemy.y, ENEMY_WIDTH, ENEMY_HEIGHT);
    });

    // Draw score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    // Draw lives
    for (let i = 0; i < lives; i++) {
        ctx.drawImage(heartImg, 10 + i * (HEART_WIDTH + 10), 50, HEART_WIDTH, HEART_HEIGHT);
    }

    requestAnimationFrame(gameLoop);
}

// Input handling
const keys = {};
window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (e.key === " " && !gameOver) fireBullet();
});
window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

canvas.addEventListener("click", () => {
    if (gameOver) resetGame();
});

requestAnimationFrame(gameLoop);