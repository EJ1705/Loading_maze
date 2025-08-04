console.log('🔌 script.js loaded');

const startBtn       = document.getElementById('start-btn');
const usernameInput  = document.getElementById('username');
const welcomeScreen  = document.querySelector('.welcome-screen');
const loadingScreen  = document.getElementById('loading-screen');
const stuckModal     = document.getElementById('stuckModal');
const stuckBtn       = document.getElementById('stuckBtn');
const stuckText      = document.getElementById('stuckText');
const hintModal      = document.getElementById('hintModal');
const hintBtn        = document.getElementById('hintBtn');
const mazeContainer  = document.querySelector('.maze-container');
const gameModal      = document.getElementById('gameModal');
const gameText       = document.getElementById('gameText');
const gameBtn        = document.getElementById('gameBtn');
const victoryScreen  = document.querySelector('.victory-screen');
const victoryMessage = document.getElementById('victory-message');
const progress       = document.querySelector('.progress');
const triggers       = Array.from(document.querySelectorAll('.trigger'));

let username   = '';
let stuckStep  = 0;
let showTime   = 0;

// 1) Start button
startBtn.addEventListener('click', () => {
  console.log('▶️ Enter clicked');
  username = usernameInput.value.trim() || 'Traveler';
  welcomeScreen.classList.add('hidden');
  loadingScreen.classList.remove('hidden');
  startLoading();
});

// 2) Fake load to 27% then pause
function startLoading() {
  let load = 0;
  const interval = setInterval(() => {
    load++;
    progress.style.width = `${load}%`;
    if (load >= 27) {
      clearInterval(interval);
      showStuckModal();
    }
  }, 30);
}

// 2a) Stuck modal
function showStuckModal() {
  stuckModal.classList.remove('hidden');
  showTime = Date.now();
}

stuckBtn.addEventListener('click', () => {
  if (stuckStep === 0) {
    const delta = Date.now() - showTime;
    stuckText.textContent = delta < 500
      ? "You're too impatient!"
      : "Psych! Got you!";
    stuckBtn.textContent = "OK";
    stuckStep = 1;
  } else {
    stuckModal.classList.add('hidden');
    setTimeout(() => hintModal.classList.remove('hidden'), 5000);
  }
});

// 2b) Hint modal
hintBtn.addEventListener('click', () => {
  hintModal.classList.add('hidden');
  loadingScreen.addEventListener('click', revealMaze, { once: true });
});

// 3) Reveal maze
function revealMaze() {
  loadingScreen.classList.add('hidden');
  mazeContainer.classList.remove('hidden');
  initMazeGames();
}

// 4) Mini-games
function initMazeGames() {
  const increments = (100 - 27) / triggers.length;
  let current = 0;
  const messages = [
    "Mini-game 1: Click the invisible button.",
    "Mini-game 2: Solve the riddle of the cursed emoji 🤔.",
    "Mini-game 3: Drag the chaos into order.",
    "Mini-game 4: Decode the meme matrix.",
    "Mini-game 5: Escape the pop-up prison.",
    "Mini-game 6: Accept your fate."
  ];

  // only first trigger active
  triggers.forEach((t, i) => t.style.pointerEvents = i === 0 ? 'all' : 'none');

  triggers.forEach((trigger, i) => {
    trigger.addEventListener('click', () => {
      if (i !== current) return;
      gameText.textContent = messages[i];
      gameModal.classList.remove('hidden');
    });
  });

  gameBtn.addEventListener('click', () => {
    gameModal.classList.add('hidden');
    current++;
    const newWidth = 27 + increments * current;
    progress.style.width = `${newWidth}%`;

    if (current >= triggers.length) {
      mazeContainer.classList.add('hidden');
      victoryMessage.textContent = 
        `Congrats, ${username}. You survived the maze.`;
      victoryScreen.classList.remove('hidden');
    } else {
      triggers.forEach((t, i) => 
        t.style.pointerEvents = i === current ? 'all' : 'none'
      );
    }
  });
}
