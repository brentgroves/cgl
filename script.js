const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const cellSize = 10;
const rows = Math.floor(canvas.height / cellSize);
const cols = Math.floor(canvas.width / cellSize);

let grid = createEmptyGrid();
let generationCounter = 0;
const generationDisplay = document.getElementById("generation");

function createEmptyGrid() {
    const grid = new Array(rows);
    for (let i = 0; i < grid.length; i++) {
        grid[i] = new Array(cols).fill(0);
    }
    return grid;
}

function randomizeGrid() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = Math.random() > 0.5 ? 1 : 0;
        }
    }
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 1) {
                ctx.fillStyle = "#000";
                ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
        }
    }
}

function countAliveNeighbours(grid, x, y) {
    const neighbours = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    let count = 0;
    neighbours.forEach(([dx, dy]) => {
        const newX = x + dx;
        const newY = y + dy;
        if (newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
            count += grid[newX][newY];
        }
    });
    return count;
}

function advanceGenerations(generations) {
    for (let i = 0; i < generations; i++) {
        update(false);
    }
}

function update(updateCounter = true) {
    const nextGrid = createEmptyGrid();
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const aliveNeighbours = countAliveNeighbours(grid, i, j);
            const isAlive = grid[i][j] === 1;
            if (isAlive) {
                nextGrid[i][j] = aliveNeighbours === 2 || aliveNeighbours === 3 ? 1 : 0;
            } else {
                nextGrid[i][j] = aliveNeighbours === 3 ? 1 : 0;
            }
        }
    }
    grid = nextGrid;
    drawGrid();
    if (updateCounter) {
        generationCounter++;
        generationDisplay.textContent = generationCounter;
    }
}

let intervalId = null;
function startGame() {
    if (!intervalId) {
        intervalId = setInterval(() => {
            update();
        }, 100);
    }
}

function pauseGame() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}

// Start button
const startBtn = document.getElementById("startBtn");
startBtn.addEventListener("click", startGame);

// Pause button
const pauseBtn = document.getElementById("pauseBtn");
pauseBtn.addEventListener("click", pauseGame);

// Step button
const stepBtn = document.getElementById("stepBtn");
stepBtn.addEventListener("click", () => {
    pauseGame();
    update();
});

// Randomize button
const randomBtn = document.getElementById("randomBtn");
randomBtn.addEventListener("click", () => {
    pauseGame();
    randomizeGrid();
    generationCounter = 0;
    generationDisplay.textContent = generationCounter;
    advanceGenerations(2);
});

// Initialization
randomizeGrid();
advanceGenerations(2);
drawGrid();