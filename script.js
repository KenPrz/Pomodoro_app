const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const workDurationInput = document.getElementById("work-duration");
const breakDurationInput = document.getElementById("break-duration");
const headerTitle = document.getElementById("headerTitle");
const body = document.body;

let workDuration = parseInt(workDurationInput.value) * 60;
let breakDuration = parseInt(breakDurationInput.value) * 60;
let timeLeft = workDuration;
let isBreakTime = false;
let isTimerRunning = false;
let timerInterval;

function updateProgressBar() {
    const progressBar = document.querySelector(".progress-bar");
    const totalDuration = isBreakTime ? breakDuration : workDuration;
    const progressPercentage = ((totalDuration - timeLeft) / totalDuration) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    updateProgressBar();
}

function startWork() {
    isBreakTime = false;
    headerTitle.textContent = "Working"
    body.classList.remove('bg-green-900');
    timeLeft = workDuration;
    updateTimer();
    isTimerRunning = false; // Set to false before starting the break
    startButton.textContent = "Start"; // Change button text to "Start"
}

function startBreak() {
    isBreakTime = true;
    headerTitle.textContent = "Break Time!"
    body.classList.add('bg-green-900');
    timeLeft = breakDuration;
    updateTimer();
    isTimerRunning = true; // Start the break timer automatically
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimer();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            playNotificationSound(1);
            startWorkAfterBreak(); // Automatically start work timer after break
        }
    }, 1000);
    startButton.textContent = "Pause"; // Change button text to "Pause"
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
                    playNotificationSound(2);
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

function startWorkAfterBreak() {
    startWork(); // Start work timer
    startTimer(); // Automatically start the work timer
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



function playNotificationSound(num) {
    const upTone = document.getElementById("notification-sound1");
    const downTone = document.getElementById("notification-sound2");
    if(num==1){
        upTone.play();
    }else if(num==2){
        downTone.play();
    }
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
