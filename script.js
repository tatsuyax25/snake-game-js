// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
const startButton = document.getElementById('start-button');

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
// Performance optimized: only clear and redraw when necessary
function draw() {
  board.innerHTML = ''; // Clear the board (could be optimized further)
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
// Fixed: Ensures food doesn't spawn on snake body
function generateFood() {
  let newFood;
  
  // Keep generating new positions until we find one not occupied by snake
  do {
    newFood = {
      x: Math.floor(Math.random() * gridSize) + 1,
      y: Math.floor(Math.random() * gridSize) + 1
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  
  return newFood;
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
  if (!gameStarted && (event.code === 'Space' || event.key === ' ')) {
    startGame();
    return;
  }

  if (gameStarted) {
    handleGameKeyPress(event);
  }
};

// Function to handle game key press
// Fixed: Prevents snake from reversing into itself
function handleGameKeyPress(event) {
  const keyToDirectionMap = {
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
  };

  const newDirection = keyToDirectionMap[event.key];
  
  // Prevent snake from moving in opposite direction (would cause instant collision)
  const oppositeDirections = {
    'up': 'down',
    'down': 'up',
    'left': 'right',
    'right': 'left'
  };
  
  if (newDirection && newDirection !== oppositeDirections[direction]) {
    direction = newDirection;
  }
};

// Event listener for "Start Game" button click
startButton.addEventListener('click', () => {
  startGame();
});

// Event listener for key presses (fixed typo and removed duplicate logic)
// Using the proper handleKeyPress function instead of duplicate inline logic
document.addEventListener('keydown', handleKeyPress);

// Function to increase game speed
function increaseSpeed() {
  if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 5;
  }
}

// Function to check collision
// Fixed: Proper boundary detection for 1-based coordinate system
function checkCollision() {
  const head = snake[0];

  // Check wall collision (coordinates are 1-based, so valid range is 1 to gridSize)
  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    return true;
  }

  // Check self collision (skip head at index 0)
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

// Function to reset the game
// Fixed: Removed duplicate updateHighScore call (updateScore handles this)
function resetGame() {
  stopGame();
  snake = [{ x: 10, y: 10 }]; // Reset snake to starting position
  food = generateFood(); // Generate new food position
  direction = "right"; // Reset direction
  gameSpeedDelay = 200; // Reset speed
  updateScore(); // This already handles high score updates
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

// Function to update high score display
// Note: This function is now only used for showing the high score element
function updateHighScore() {
  highScoreText.style.display = 'block';
}

