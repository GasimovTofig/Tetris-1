const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const tetrominoes = [
    [[1, 1, 1], [0, 1, 0]],  // T shape
    [[1, 1], [1, 1]],        // O shape
    [[1, 1, 0], [0, 1, 1]],  // S shape
    [[0, 1, 1], [1, 1, 0]],  // Z shape
    [[1, 1, 1, 1]],          // I shape
    [[1, 1, 1], [1, 0, 0]],  // L shape
    [[1, 1, 1], [0, 0, 1]],  // J shape
];

let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let currentPiece = randomPiece();
let currentPos = { x: 4, y: 0 };
let gameInterval;

function randomPiece() {
    const shape = tetrominoes[Math.floor(Math.random() * tetrominoes.length)];
    return { shape };
}

function drawBoard() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x] !== 0) {
                context.fillStyle = 'green';
                context.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function drawPiece() {
    const shape = currentPiece.shape;
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                context.fillStyle = 'red';
                context.fillRect((currentPos.x + x) * BLOCK_SIZE, (currentPos.y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function movePiece() {
    currentPos.y++;
    if (collides()) {
        currentPos.y--;
        placePiece();
        currentPiece = randomPiece();
        currentPos = { x: 4, y: 0 };
    }
}

function collides() {
    const shape = currentPiece.shape;
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                // Check if the block goes beyond the board
                if (currentPos.y + y >= ROWS || currentPos.x + x < 0 || currentPos.x + x >= COLS) {
                    return true;
                }
                // Check if the block collides with another block
                if (board[currentPos.y + y] && board[currentPos.y + y][currentPos.x + x]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function placePiece() {
    const shape = currentPiece.shape;
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
                board[currentPos.y + y][currentPos.x + x] = 1;  // Mark the board with the piece
            }
        }
    }
    clearLines();
}

function clearLines() {
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);  // Remove the filled line
            board.unshift(Array(COLS).fill(0));  // Add a new empty line at the top
        }
    }
}

function gameLoop() {
    drawBoard();
    drawPiece();
    movePiece();
}

function startGame() {
    gameInterval = setInterval(gameLoop, 500); // Adjust speed for how fast blocks drop
}

function stopGame() {
    clearInterval(gameInterval);
    alert('Game Over!');
}

// Add control keys for moving the piece
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        currentPos.x--;
        if (collides()) currentPos.x++;
    }
    if (event.key === 'ArrowRight') {
        currentPos.x++;
        if (collides()) currentPos.x--;
    }
    if (event.key === 'ArrowDown') {
        movePiece();
    }
    if (event.key === 'ArrowUp') {
        rotatePiece();
    }
});

function rotatePiece() {
    const shape = currentPiece.shape;
    const newShape = shape[0].map((_, index) => shape.map(row => row[index])).reverse();
    const previousShape = currentPiece.shape;
    currentPiece.shape = newShape;

    if (collides()) {
        currentPiece.shape = previousShape;  // Revert to previous shape if collision occurs
    }
}

startGame(); // Start the game when the page loads

