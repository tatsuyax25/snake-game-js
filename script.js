// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');


// Define game variables
const gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;


// Draw game map, snake, food, etc.
function draw() {
  board.innerHTML = '';
  drawSnake();
  drawFood();
  updateScore();
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
  if (gameStarted) {
    const foodElement = createGameElement("div", "food");
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

// Function to generate food
function generateFood() {
  // code to generate food
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Function to move snake
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
  } else {
    snake.pop();
  }

  if (checkCollision()) {
    stopGame();
    resetGame();
  }

  draw();
}

// Testing move snake function
// setInterval(() => {
//   moveSnake();
//   draw();
// }, 200);

// Function to start the game
function startGame() {
  // code to start the game
  if (!gameStarted) {
    gameStarted = true; // Keep track of a running game.
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(moveSnake, gameSpeedDelay);
  }
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

// Event listener fo key presses
document.addEventListener('keydown', (event) => {
  if (event.key.startsWith('Arrow')) {
    direction = event.key.toLowerCase().replace('arrow', '');
  } else if (event.code === 'Space' && !gameStarted) {
    startGame();
  }
});

// Function to increase game speed
function increaseSpeed() {
  if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 5;
  }
}

// Function to check collision
function checkCollision() {
  // code to check collision
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    return true;
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

// Function to reset the game
function resetGame() {
  // code to reset the game
  snake = [{ x: 10, y: 10 }];
  direction = "right";
  gameSpeedDelay = 200;
  updateScore();
}

// Function to update the score
function updateScore() {
  // code to update the score
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, '0');
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
  }
}

// Function to stop the game
function stopGame() {
  // code to stop the game
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = 'block';
  logo.style.display = 'block';
}

function updateHighScore() {
  // code to update the high score
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
  }
  highScoreText.style.display = 'block';
}