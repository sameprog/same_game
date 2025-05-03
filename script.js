const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const cols = 10;
const rows = 15;
const blockSize = 32;
const imageCount = 4;
const images = [];

let board = [];
let score = 0;

// 画像読み込み
for (let i = 0; i < imageCount; i++) {
  const img = new Image();
  img.src = `img${i}.png`; // 例: img0.png〜img3.png
  images.push(img);
}

function initBoard() {
  board = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.floor(Math.random() * imageCount))
  );
  score = 0;
  document.getElementById("gameOver").style.display = "none";
  drawBoard();
  checkGameOver();
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  board.forEach((row, y) => {
    row.forEach((imgIndex, x) => {
      if (imgIndex !== null) {
        ctx.drawImage(
          images[imgIndex],
          x * blockSize,
          y * blockSize,
          blockSize,
          blockSize
        );
      }
    });
  });

  document.getElementById("score").textContent = score;
}

function getConnected(x, y, target, visited = {}) {
  if (
    x < 0 || x >= cols || y < 0 || y >= rows ||
    board[y][x] !== target || visited[`${x},${y}`]
  ) return [];

  visited[`${x},${y}`] = true;
  return [
    [x, y],
    ...getConnected(x + 1, y, target, visited),
    ...getConnected(x - 1, y, target, visited),
    ...getConnected(x, y + 1, target, visited),
    ...getConnected(x, y - 1, target, visited)
  ];
}

function removeAndCollapse(connected) {
  connected.forEach(([x, y]) => {
    board[y][x] = null;
  });

  for (let x = 0; x < cols; x++) {
    let col = [];
    for (let y = 0; y < rows; y++) {
      if (board[y][x] !== null) col.push(board[y][x]);
    }
    for (let y = rows - 1; y >= 0; y--) {
      board[y][x] =
