const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Function to resize canvas to fit parent
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // initial resize

// Modal elements
const modal = document.createElement("div");
modal.className = "modal";
document.body.appendChild(modal);

const modalContent = document.createElement("div");
modalContent.className = "modal-content";
modal.appendChild(modalContent);

const closeBtn = document.createElement("span");
closeBtn.className = "close";
closeBtn.innerHTML = "&times;";
modalContent.appendChild(closeBtn);

const artTitle = document.createElement("h2");
modalContent.appendChild(artTitle);

const artImage = document.createElement("img");
artImage.style.width = "100%";
artImage.style.borderRadius = "14px";
modalContent.appendChild(artImage);

// Close modal
closeBtn.onclick = () => modal.classList.remove("show");

// Player as a familiar/fairy
const player = {
  xRatio: 0.05, // relative x position (5% of canvas width)
  yRatio: 0.05, // relative y position
  widthRatio: 0.075, // 7.5% of canvas width
  heightRatio: 0.075,
  speedRatio: 0.005, // movement relative to canvas width
  img: new Image()
};
player.img.src = "img/familiar.png";

// Artworks
const arts = [
  { img: "img/vampire.PNG", xRatio: 0.25, yRatio: 0.15, widthRatio: 0.1, heightRatio: 0.1, title: "Vampire Couple" },
  { img: "img/Girl.PNG", xRatio: 0.5, yRatio: 0.2, widthRatio: 0.1, heightRatio: 0.1, title: "Fairy in Woods" },
  { img: "img/duo.PNG", xRatio: 0.75, yRatio: 0.5, widthRatio: 0.1, heightRatio: 0.1, title: "Couple Getting Ready in Mirror" },
  { img: "img/furry.PNG", xRatio: 0.2, yRatio: 0.7, widthRatio: 0.1, heightRatio: 0.1, title: "Magic Creature Walking On Water" },
  { img: "img/hvac.PNG", xRatio: 0.6, yRatio: 0.75, widthRatio: 0.1, heightRatio: 0.1, title: "Alien" },
  { img: "img/lady.png", xRatio: 0.45, yRatio: 0.5, widthRatio: 0.1, heightRatio: 0.1, title: "Nature Spirit on Rock" },
];

// Load artwork images
arts.forEach(a => {
  const img = new Image();
  img.src = a.img;
  a.imageObj = img;
});

// Key controls
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Collision detection
function isColliding(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

// Track which art has been shown
let lastTouchedArt = null;

// Floating animation variables
let floatOffset = 0;
let floatDirection = 1;

// Game loop
function gameLoop() {
  // Player dimensions based on canvas
  const playerWidth = player.widthRatio * canvas.width;
  const playerHeight = player.heightRatio * canvas.height;
  const playerSpeed = player.speedRatio * canvas.width;

  // Move player
  if (keys["ArrowUp"]) player.yRatio -= playerSpeed / canvas.height;
  if (keys["ArrowDown"]) player.yRatio += playerSpeed / canvas.height;
  if (keys["ArrowLeft"]) player.xRatio -= playerSpeed / canvas.width;
  if (keys["ArrowRight"]) player.xRatio += playerSpeed / canvas.width;

  // Floating effect
  floatOffset += 0.2 * floatDirection;
  if (floatOffset > 4 || floatOffset < -4) floatDirection *= -1;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw artworks
  arts.forEach(a => {
    const x = a.xRatio * canvas.width;
    const y = a.yRatio * canvas.height;
    const w = a.widthRatio * canvas.width;
    const h = a.heightRatio * canvas.height;
    a.x = x; a.y = y; a.width = w; a.height = h; // update for collision
    ctx.drawImage(a.imageObj, x, y, w, h);
  });

  // Draw player
  const playerX = player.xRatio * canvas.width;
  const playerY = player.yRatio * canvas.height + floatOffset;
  player.x = playerX; player.y = playerY; player.width = playerWidth; player.height = playerHeight;
  ctx.drawImage(player.img, playerX, playerY, playerWidth, playerHeight);

  // Check collisions for modal
  let touchedArt = null;
  arts.forEach(a => { if (isColliding(player, a)) touchedArt = a; });

  if (touchedArt && touchedArt !== lastTouchedArt) {
    artTitle.textContent = touchedArt.title;
    artImage.src = touchedArt.img;
    modal.classList.add("show");
    lastTouchedArt = touchedArt;
  }
  if (!touchedArt) lastTouchedArt = null;

  requestAnimationFrame(gameLoop);
}

gameLoop();
