// Variables to store the auto move flag and time
let autoMoveFlag = false;
let autoMoveTime;

// Function to start auto move
function startAutoMove() {
  autoMoveFlag = true;
  autoMove();
}

// Function to auto move
function autoMove() {
  if (!autoMoveFlag) return;

  const direction = Math.floor(Math.random() * 4);
  GM.move(direction);
  setTimeout(autoMove, autoMoveTime);
}

// Function to stop auto move
function stopAutoMove() {
  autoMoveFlag = false;
}

// Function to handle the start/stop buttons
function handleAutoMoveButtons() {
  const startButton = document.getElementById("auto-move-run");
  const stopButton = document.getElementById("auto-move-stop");

  startButton.addEventListener("click", () => {
    const timeInput = document.getElementById("auto-move-input-time");
    const time = parseInt(timeInput.value);

    if (isNaN(time)) {
      alert("Please enter a valid number.");
      return;
    }

    autoMoveTime = time;

    if (!autoMoveFlag) {
      startAutoMove();
    }
  });

  stopButton.addEventListener("click", stopAutoMove);
}

// Request animation frame to add event listeners after the page loads
window.requestAnimationFrame(() => {
  handleAutoMoveButtons();
});
