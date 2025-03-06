const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startButton = document.getElementById('startButton');
const overlay = document.querySelector('.overlay');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const gridSize = 20;
const tileCount = Math.floor(canvas.width / gridSize);
let snake = [{ x: 10, y: 10 }];
let food = getRandomFoodPosition();
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameLoop;

startButton.addEventListener('click', startGame);
updateHighScoreDisplay();

function startGame() {
    snake = [{ x: 10, y: 10 }];
    food = getRandomFoodPosition();
    dx = 1;
    dy = 0;
    score = 0;
    updateScoreDisplay();
    overlay.style.opacity = '0';
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 500);
    gameLoop = setInterval(updateGame, 100);
}

function updateGame() {
    moveSnake();
    if (checkCollision()) {
        gameOver();
        return;
    }
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score++;
        updateScoreDisplay();
        snake.push({});
        food = getRandomFoodPosition();
    }
    drawGame();
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (snake.length > score + 1) {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];
    return (
        head.x < 0 || head.x >= tileCount ||
        head.y < 0 || head.y >= tileCount ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
}

function gameOver() {
    clearInterval(gameLoop);
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        updateHighScoreDisplay();
    }
    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 0);
    startButton.textContent = 'Retry';
}

function getRandomFoodPosition() {
    let position;
    do {
        position = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    } while (snake.some(segment => segment.x === position.x && segment.y === position.y));
    return position;
}

function drawGame() {
    ctx.fillStyle = 'rgba(22, 33, 62, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
        const gradient = ctx.createLinearGradient(
            segment.x * gridSize,
            segment.y * gridSize,
            (segment.x + 1) * gridSize,
            (segment.y + 1) * gridSize
        );
        gradient.addColorStop(0, '#00ffcc');
        gradient.addColorStop(1, '#00ccff');
        ctx.fillStyle = gradient;
        ctx.shadowColor = '#00ffcc';
        ctx.shadowBlur = 10;
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
    });

    // Draw food
    ctx.fillStyle = '#ff3366';
    ctx.shadowColor = '#ff3366';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
}

function updateScoreDisplay() {
    scoreElement.textContent = score;
}

function updateHighScoreDisplay() {
    highScoreElement.textContent = `Best: ${highScore}`;
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; }
    if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
    if (e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; }
    if (e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }
});

window.addEventListener('resize', () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});