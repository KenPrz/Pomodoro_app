const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const workDurationInput = document.getElementById("work-duration");
const breakDurationInput = document.getElementById("break-duration");
const body = document.body;

let workDuration = parseInt(workDurationInput.value) * 60;
let breakDuration = parseInt(breakDurationInput.value) * 60;
let timeLeft = workDuration;
let isBreakTime = false;
let isTimerRunning = false;
let timerInterval;

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function startWork() {
    isBreakTime = false;
    body.classList.remove("bg-green-300");
    timeLeft = workDuration;
    updateTimer();
    isTimerRunning = false; // Set to false before starting the break
    startButton.textContent = "Start"; // Change button text to "Start"
}

function startBreak() {
    isBreakTime = true;
    body.classList.add("bg-green-300");
    timeLeft = breakDuration;
    updateTimer();
    isTimerRunning = false; // Set to false before starting the break
    startButton.textContent = "Start"; // Change button text to "Start"
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isTimerRunning = false;
    startButton.textContent = "Resume";
}

function resetTimer() {
    pauseTimer();
    isBreakTime = false;
    body.classList.remove("bg-green-300");
    timeLeft = workDuration;
    updateTimer();
    startButton.textContent = "Start";
}

function startTimer() {
    if (!isTimerRunning) {
        if (!timerInterval) {
            isTimerRunning = true;
            timerInterval = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimer();
                } else {
                    clearInterval(timerInterval);
                    timerInterval = null;
                    playNotificationSound();
                    if (isBreakTime) {
                        startWork();
                    } else {
                        startBreak();
                    }
                }
            }, 1000);
            startButton.textContent = "Pause"; // Change button text to "Pause"
        }
    } else {
        pauseTimer();
        startButton.textContent = "Resume"; // Change button text to "Resume"
    }
}

function playNotificationSound() {
    // Play a notification sound here
}

workDurationInput.addEventListener("change", () => {
    workDuration = parseInt(workDurationInput.value) * 60;
    if (!isTimerRunning) {
        if (!isBreakTime) {
            timeLeft = workDuration;
        }
        updateTimer();
    }
});

breakDurationInput.addEventListener("change", () => {
    breakDuration = parseInt(breakDurationInput.value) * 60;
    if (!isTimerRunning && isBreakTime) {
        timeLeft = breakDuration;
        updateTimer();
    }
});

startButton.addEventListener("click", startTimer);
resetButton.addEventListener("click", resetTimer);

updateTimer(); // Initialize the timer display
