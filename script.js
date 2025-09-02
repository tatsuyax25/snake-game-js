// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');
const startButton = document.getElementById('start-button');
const gameOverOverlay = document.getElementById('game-over-overlay');
const finalScoreValue = document.getElementById('final-score-value');
const restartButton = document.getElementById('restart-button');

// Define game variables
const gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Performance optimization: track DOM elements
let snakeElements = [];
let foodElement = null;


// Draw game map, snake, food, etc.
// Performance optimized: differential rendering
function draw() {
  drawSnake();
  drawFood();
  updateScore();
}

// Draw snake with differential rendering
function drawSnake() {
  // Remove excess elements if snake got shorter
  while (snakeElements.length > snake.length) {
    const element = snakeElements.pop();
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
  
  // Add new elements if snake got longer
  while (snakeElements.length < snake.length) {
    const element = createGameElement('div', 'snake');
    board.appendChild(element);
    snakeElements.push(element);
  }
  
  // Update positions of existing elements
  snake.forEach((segment, index) => {
    setPosition(snakeElements[index], segment);
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

// Draw food with element reuse
function drawFood() {
  if (gameStarted) {
    if (!foodElement) {
      foodElement = createGameElement("div", "food");
      board.appendChild(foodElement);
    }
    setPosition(foodElement, food);
  } else if (foodElement && foodElement.parentNode) {
    foodElement.parentNode.removeChild(foodElement);
    foodElement = null;
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
    gameOver();
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
  
  // Highlight the pressed arrow key
  highlightArrowKey(event.key);
  
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

// Function to highlight arrow key when pressed
function highlightArrowKey(key) {
  const arrowKey = document.querySelector(`[data-key="${key}"]`);
  if (arrowKey) {
    arrowKey.classList.add('active');
    setTimeout(() => {
      arrowKey.classList.remove('active');
    }, 150);
  }
}

// Event listener for "Start Game" button click
startButton.addEventListener('click', () => {
  startGame();
});

// Event listener for "Restart" button click
restartButton.addEventListener('click', () => {
  hideGameOver();
  resetGame();
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
// Performance optimized: clean up DOM elements
function resetGame() {
  stopGame();
  
  // Clear DOM elements
  board.innerHTML = '';
  snakeElements = [];
  foodElement = null;
  
  snake = [{ x: 10, y: 10 }]; // Reset snake to starting position
  food = generateFood(); // Generate new food position
  direction = "right"; // Reset direction
  gameSpeedDelay = 200; // Reset speed
  updateScore(); // This already handles high score updates
}

// Function to update the score
// Added animation when score increases
function updateScore() {
  const currentScore = snake.length - 1;
  const previousScore = parseInt(score.textContent) || 0;
  
  score.textContent = currentScore.toString().padStart(3, '0');
  
  // Trigger animation if score increased
  if (currentScore > previousScore) {
    score.classList.remove('score-boost');
    // Force reflow to restart animation
    score.offsetHeight;
    score.classList.add('score-boost');
  }
  
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
  }
}

// Function to handle game over
function gameOver() {
  clearInterval(gameInterval);
  gameStarted = false;
  
  // Show final score in overlay
  const currentScore = snake.length - 1;
  finalScoreValue.textContent = currentScore.toString().padStart(3, '0');
  
  // Show game over overlay with animation
  gameOverOverlay.classList.add('show');
}

// Function to hide game over overlay
function hideGameOver() {
  gameOverOverlay.classList.remove('show');
}

// Function to stop the game
function stopGame() {
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

