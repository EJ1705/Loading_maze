// Elements
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
const gameContent    = document.getElementById('gameContent');
const gameBtn        = document.getElementById('gameBtn'); // will be re-set
const victoryScreen  = document.querySelector('.victory-screen');
const victoryMessage = document.getElementById('victory-message');
const progress       = document.querySelector('.progress');
const triggers       = Array.from(document.querySelectorAll('.trigger'));

let username   = '';
let stuckStep  = 0;
let showTime   = 0;
let currentGame= 0;

// 1) Welcome → Loading
startBtn.addEventListener('click', () => {
  username = usernameInput.value.trim() || 'Traveler';
  welcomeScreen.classList.add('hidden');
  loadingScreen.classList.remove('hidden');
  startLoading();
});

// 2) Slow load to 27%, pause 5s → stuck modal
function startLoading() {
  let load = 0;
  const interval = setInterval(() => {
    load++;
    progress.style.width = load + '%';
    if (load >= 27) {
      clearInterval(interval);
      setTimeout(showStuckModal, 5000);
    }
  }, 100); // 100ms per 1%
}

// 2a) Stuck modal: impatient vs. patient
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
    setTimeout(() => hintModal.classList.remove('hidden'), 0);
  }
});

// 2b) Hint modal → click loader to reveal maze
hintBtn.addEventListener('click', () => {
  hintModal.classList.add('hidden');
  loadingScreen.addEventListener('click', revealMaze, { once: true });
});

// 3) Reveal maze & init games
function revealMaze() {
  loadingScreen.classList.add('hidden');
  mazeContainer.classList.remove('hidden');
  initGames(); //try
}

// 4) Games
function initGames() {
  const increments = (100 - 27) / triggers.length;

  // only first trigger active
  triggers.forEach((t,i) => t.style.pointerEvents = i===0 ? 'all':'none');

  triggers.forEach((t,i) => {
    t.addEventListener('click', () => {
      if (i !== currentGame) return;
      launchGame(i);
    });
  });

  function launchGame(i) {
    const templates = [
      // Game 1: Find the blue box
      `<p>Find and click the blue box!</p>
       <div id="blueBox" style="width:30px;height:30px;background:blue;cursor:pointer;margin:0 auto;"></div>`,
      // Game 2: Solve the riddle
      `<p>Solve: What has keys but can't open locks?</p>
       <input id="riddleIn" /><button id="riddleBtn">Submit</button>`,
      // Game 3: Drag circle to square
      `<p>Drag the circle into the square.</p>
       <div id="circle" draggable="true" style="width:30px;height:30px;border-radius:50%;background:red;"></div>
       <div id="square" style="width:50px;height:50px;background:green;margin-top:20px;"></div>`,
      // Game 4: Decode ROT13
      `<p>Decode: "Uryyb"</p>
       <input id="decIn" /><button id="decBtn">Go</button>`,
      // Game 5: Wait 3 seconds then click
      `<p>Wait for the button to enable...</p>
       <button id="waitBtn" disabled>Click me</button>`,
      // Game 6: Accept your fate
      `<p>Click to accept your fate.</p>
       <button id="acceptBtn">I Accept</button>`
    ];

    gameContent.innerHTML = templates[i];
    gameModal.classList.remove('hidden');

    // assign handlers
    switch(i) {
      case 0:
        document.getElementById('blueBox')
          .addEventListener('click', complete);
        break;
      case 1:
        document.getElementById('riddleBtn')
          .addEventListener('click', () => {
            if (document.getElementById('riddleIn').value.toLowerCase()==='piano') complete();
            else alert('Nope, try again.');
          });
        break;
      case 2:
        const circ = document.getElementById('circle');
        const sq   = document.getElementById('square');
        circ.addEventListener('dragstart', e=> e.dataTransfer.setData('text','ok'));
        sq.addEventListener('dragover', e=> e.preventDefault());
        sq.addEventListener('drop', e=> {
          if (e.dataTransfer.getData('text')==='ok') complete();
        });
        break;
      case 3:
        document.getElementById('decBtn')
          .addEventListener('click', () => {
            if (document.getElementById('decIn').value.toLowerCase()==='hello') complete();
            else alert('Still encoded.');
          });
        break;
      case 4:
        setTimeout(() => {
          const btn = document.getElementById('waitBtn');
          btn.disabled = false;
          btn.addEventListener('click', complete);
        }, 3000);
        break;
      case 5:
        document.getElementById('acceptBtn')
          .addEventListener('click', complete);
        break;
    }
  }

  function complete() {
    gameModal.classList.add('hidden');
    currentGame++;
    progress.style.width = 27 + increments * currentGame + '%';

    if (currentGame >= triggers.length) {
      mazeContainer.classList.add('hidden');
      victoryMessage.textContent =
        `Congrats, ${username}. You survived the maze.`;
      victoryScreen.classList.remove('hidden');
    } else {
      triggers.forEach((t,i) =>
        t.style.pointerEvents = i===currentGame ? 'all' : 'none'
      );
    }
  }
}
