// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
// const score = document.getElementById('score');
// const highScore = document.getElementById('highScore');

// Define game variables
const gridSize = 20;
let snake = [
  {x: 10, y: 10},
]
let food = generateFood();
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;


// Draw game map, snake, food, etc.
function draw() {
  board.innerHTML = '';
  drawSnake();
  drawFood();
}

// Draw snake
function drawSnake() {
  // code to draw the snake
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set position of the snake or food
function setPosition(element, position) {
  element.style.gridColumnStart = position.x;
  element.style.gridRowStart = position.y;
}

// Testing draw function
// draw();

// Draw food function
function drawFood() {
  // code to draw food
  const foodElement = createGameElement('div', 'food');
  setPosition(foodElement, food);
  board.appendChild(foodElement);
}

// Generate food
function generateFood() {
  // code to generate food
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return {x, y};
}

// Moving the snake
function moveSnake() {
  // code to move the snake
  const head = { ...snake[0] };
  switch (direction) {
    case 'right':
      head.x++;
      break;
    case 'left':
      head.x--;
      break;
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval); // Clear past interval
    gameInterval = setInterval(() => {
      moveSnake();
      // checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
}

// Testing move snake function
// setInterval(() => {
//   moveSnake();
//   draw();
// }, 200);

// Start game function
function startGame() {
  // code to start the game
  gameStarted = true; // Keep track of a running game.
  instructionText.style.display = 'none';
  logo.style.display = 'none';
  gameInterval = setInterval(() => {
    moveSnake();
    // checkCollision();
    draw();
  }, gameSpeedDelay);
}

// Keypress event listeners
function handleKeyPress(event) {
  // code to handle key press
  if (
    (!gameStarted && event.code === 'Space') || 
    (!gameStarted && event.key === ' ')
    ) {
    startGame();
  } else {
    switch (event.key) {
      case 'ArrowUp':
        if (direction !== 'down') direction = 'up';
        break;
      case 'ArrowDown':
        if (direction !== 'up') direction = 'down';
        break;
      case 'ArrowLeft':
        if (direction !== 'right') direction = 'left';
        break;
      case 'ArrowRight':
        if (direction !== 'left') direction = 'right';
        break;
    }
  }
};

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
  console.log(gameSpeedDelay);
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}