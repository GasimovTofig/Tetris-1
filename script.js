const canvas = document.getElementById('board');
const context = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 20;

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let score = 0;

const TETROMINOS = [
    [[1, 1, 1, 1]], // I
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 1, 0], [0, 1, 1]], // S
    [[0, 1, 1], [1, 1, 0]], // Z
    [[1, 0, 0], [1, 1, 1]], // L
    [[0, 0, 1], [1, 1, 1]], // J
];

let currentTetromino;
let currentPosition;

function drawBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = 'white';
                context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

function drawTetromino() {
    currentTetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = 'red';
                context.fillRect((currentPosition.x + x) * BLOCK_SIZE, (currentPosition.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        });
    });
}

function mergeTetromino() {
    currentTetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[currentPosition.y + y][currentPosition.x + x] = 1;
            }
        });
    });
}

function removeFullRows() {
    board = board.filter(row => row.some(value => value === 0));
    const rowsToAdd = ROWS - board.length;
    for (let i = 0; i < rowsToAdd; i++) {
        board.unshift(Array(COLS).fill(0));
    }
    score += rowsToAdd;
    scoreDisplay.innerText = `Score: ${score}`;
}

function resetGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    score = 0;
    scoreDisplay.innerText = `Score: ${score}`;
    spawnTetromino();
}

function spawnTetromino() {
    const randomIndex = Math.floor(Math.random() * TETROMINOS.length);
    currentTetromino = { shape: TETROMINOS[randomIndex] };
    currentPosition = { x: Math.floor(COLS / 2) - 1, y: 0 };

    if (!isValidPosition()) {
        alert('Game Over!');
        resetGame();
    }
}

function isValidPosition() {
    return currentTetromino.shape.every
