// --- ELEMENTS ---
const loginPage    = document.getElementById("loginPage");
const loadingPage  = document.getElementById("loadingPage");
const progressFill = document.getElementById("progressFill");
const mazeGrid     = document.getElementById("mazeGrid");
const loadingBar   = document.getElementById("loadingBar");
const popupMessage = document.getElementById("popupMessage");
const gameArea     = document.getElementById("gameArea");

// --- STATE ---
let userName       = "";
let popupShown     = false;
let mazeRevealed   = false;
let popupClickTime = 0;
let mazeIndex      = 0;

// corners at 100px grid blocks
const mazeCheckpoints = [
  { top:   0, left: 100 },
  { top: 100, left: 100 },
  { top: 100, left: 200 },
  { top: 200, left: 200 },
  { top: 200, left: 300 },
  { top: 300, left: 300 }
];

// --- HELPERS ---
function showPopup(text) {
  popupMessage.innerText = text;
  popupMessage.style.display = "block";
}

// --- LOGIN → LOADING ---
function startLoading() {
  userName = document.getElementById("username").value.trim();
  if (!userName) return alert("Enter your name!");

  loginPage.style.display   = "none";
  loadingPage.style.display = "block";
  animateLoadingBar();
}

// Phase 1: fill to 30%, then pop-ups
function animateLoadingBar() {
  let progress = 0;
  const maxProgress  = 30;
  const pxPerPercent = 600 / 100;

  const interval = setInterval(() => {
    if (progress < maxProgress) {
      progress += 2;
      progressFill.style.width = (progress * pxPerPercent) + "px";
    } else {
      clearInterval(interval);
      popupClickTime = Date.now();

      // after  5s → why stuck?
      setTimeout(() => {
        if (!popupShown) {
          showPopup("😐 Hey, wanna know why you're stuck? Click me.");
          popupShown = true;
        }
      }, 5000);

      // after 10s → hint
      setTimeout(() => {
        if (!mazeRevealed) showPopup("🤫 Hint: Something’s happening behind you...");
      }, 10000);

      // after 15s → foolish
      setTimeout(() => {
        if (!mazeRevealed) showPopup("😵‍💫 Veeru, this fool is an imbecile. Just drag the bar.");
      }, 15000);
    }
  }, 300);
}

// handle popup clicks
popupMessage.addEventListener("click", () => {
  const dt = Date.now() - popupClickTime;
  showPopup(dt < 2000 ? "😏 Whoa, eager much?" : "😂 Psych. Got you.");
  popupMessage.style.cursor = "default";
});

// reveal maze on first drag
loadingBar.addEventListener("dragstart", () => {
  if (!mazeRevealed) {
    mazeGrid.style.display = "block";
    mazeRevealed = true;
    showPopup("🧩 Maze revealed! Let’s go...");
    setTimeout(moveThroughMaze, 1000);
  }
});

// Phase 2: navigate grid corners + trigger dummy games
function moveThroughMaze() {
  if (mazeIndex >= mazeCheckpoints.length) {
    showPopup(`🎉 Congrats, ${userName}! You’ve finished.`);
    gameArea.innerHTML = `
      <h2>🎊 Well done, ${userName}!</h2>
      <p>You may now go back.</p>
      <button onclick="location.reload()">Restart</button>
    `;
    return;
  }

  const pt = mazeCheckpoints[mazeIndex];
  loadingBar.style.top  = pt.top  + "px";
  loadingBar.style.left = pt.left + "px";
  progressFill.style.width = pt.left + "px";  // keep fill behind

  showPopup(`Checkpoint ${mazeIndex+1}: Solve to continue`);
  gameArea.innerHTML = "";

  // Example mini-games:
  if (mazeIndex === 0) emojiMatchGame();
  else if (mazeIndex === 1) mathPuzzleGame();
  else if (mazeIndex === 2) colorMatchGame();
  else if (mazeIndex === 3) typingChallenge();
  else if (mazeIndex === 4) memoryFlipGame();
  else ticTacToeGame();

  mazeIndex++;
}

// --- MINI-GAMES ---
function emojiMatchGame() {
  gameArea.innerHTML = `
    <p>Match the emoji: 🐶</p>
    <button onclick="checkEmoji('🐱')">🐱</button>
    <button onclick="checkEmoji('🐶')">🐶</button>
    <button onclick="checkEmoji('🐭')">🐭</button>
  `;
}
function checkEmoji(ch) {
  if (ch==='🐶') nextGame(); else showPopup("❌ Try again!");
}

function mathPuzzleGame() {
  gameArea.innerHTML = `
    <p>7 + 5 = ?</p>
    <input type="number" id="mathAnswer">
    <button onclick="checkMath()">Submit</button>
  `;
}
function checkMath() {
  if (+document.getElementById("mathAnswer").value===12) nextGame();
  else showPopup("❌ Try again!");
}

function colorMatchGame() {
  gameArea.innerHTML = `
    <p>Click the color matching <span style="color:red;">Red</span></p>
    <button onclick="checkColor('blue')" style="background:blue;"></button>
    <button onclick="checkColor('red')"  style="background:red;"></button>
    <button onclick="checkColor('green')"style="background:green;"></button>
  `;
}
function checkColor(c) {
  if (c==='red') nextGame(); else showPopup("❌ Try again!");
}

function typingChallenge() {
  gameArea.innerHTML = `
    <p>Type the word: <strong>maze</strong></p>
    <input id="typeInput"><button onclick="checkTyping()">Go</button>
  `;
}
function checkTyping() {
  if (document.getElementById("typeInput").value.toLowerCase()==="maze")
    nextGame();
  else showPopup("❌ Try again!");
}

let firstPick = null;
function memoryFlipGame() {
  gameArea.innerHTML = `
    <p>Find the matching pair</p>
    <button onclick="checkMemory('A')">🧠</button>
    <button onclick="checkMemory('B')">🍎</button>
    <button onclick="checkMemory('A')">🧠</button>
  `;
}
function checkMemory(val) {
  if (!firstPick) {
    firstPick = val;
    showPopup("Pick one more...");
  } else {
    if (firstPick===val) nextGame();
    else { showPopup("❌ Nope"); firstPick=null; }
  }
}

function ticTacToeGame() {
  gameArea.innerHTML = `
    <p>Click center to win!</p>
    <div style="display:grid;grid-template:repeat(3,50px)/repeat(3,50px);gap:5px;">
      <button onclick="checkTic(false)">⬜</button>
      <button onclick="checkTic(true)">✅</button>
      <button onclick="checkTic(false)">⬜</button>
      <button onclick="checkTic(false)">⬜</button>
      <button onclick="checkTic(false)">⬜</button>
      <button onclick="checkTic(false)">⬜</button>
      <button onclick="checkTic(false)">⬜</button>
      <button onclick="checkTic(false)">⬜</button>
      <button onclick="checkTic(false)">⬜</button>
    </div>
  `;
}
function checkTic(win) {
  if (win) nextGame();
  else showPopup("❌ Try again!");
}

// proceed to next
function nextGame() {
  showPopup("✅ Correct!");
  setTimeout(moveThroughMaze, 1000);
}
