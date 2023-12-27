// Define HTML elements
const board = document.getElementById('game-board');

// Define game variables
let snake = [
  {x: 10, y: 10},
]

// Draw game map, snake, food, etc.
function draw() {
  board.innerHTML = '';
  drawSnake();
}

// Draw snake
function drawSnake() {
  // code to draw the snake
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake');
  });
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}