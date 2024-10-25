// DOM Elements
const startBtn = document.getElementById("start-btn");
const dateInput = document.getElementById("date-input");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const messageEl = document.getElementById("message");
const themeToggle = document.getElementById("theme-toggle");
const fullscreenBtn = document.getElementById("fullscreen-btn");
const fullscreenIcon = document.getElementById("fullscreen-icon");
const currentDateEl = document.getElementById("current-date");
const currentTimeEl = document.getElementById("current-time");

// Event Listener for Start Button
startBtn.addEventListener("click", () => {
  const inputDate = dateInput.value;
  if (inputDate) {
    const targetDate = new Date(inputDate).getTime();
    if (isNaN(targetDate)) {
      showMessage("Please enter a valid date.");
      return;
    }
    if (targetDate < new Date().getTime()) {
      showMessage("Please select a future date.");
      return;
    }
    startCountdown(targetDate);
    clearMessage();
  } else {
    showMessage("Please select a date.");
  }
});

// Countdown Function
let countdownInterval;

function startCountdown(targetDate) {
  // Clear any existing countdown
  clearInterval(countdownInterval);

  countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      clearInterval(countdownInterval);
      document.getElementById("countdown").style.display = "none";
      showMessage("🎉 Countdown Finished! 🎉");
      return;
    }

    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update DOM
    animateNumber(daysEl, days);
    animateNumber(hoursEl, hours);
    animateNumber(minutesEl, minutes);
    animateNumber(secondsEl, seconds);
  }, 1000);
}

// Function to Animate Numbers
function animateNumber(element, value) {
  if (element.textContent != value) {
    element.textContent = value;
    element.classList.remove("animate");
    void element.offsetWidth; // Trigger reflow
    element.classList.add("animate");
  }
}

// Message Display Functions
function showMessage(msg) {
  messageEl.textContent = msg;
}

function clearMessage() {
  messageEl.textContent = "";
}

// Dark Mode Toggle
// Check for saved user preference, if any, on load of the website
document.addEventListener("DOMContentLoaded", () => {
  const hoursSegment = document.getElementById("hoursSegment");
  const minutesSegment = document.getElementById("minutesSegment");
  const secondsSegment = document.getElementById("secondsSegment");

  const toggleHours = document.getElementById("toggleHours");
  const toggleMinutes = document.getElementById("toggleMinutes");
  const toggleSeconds = document.getElementById("toggleSeconds");

  // Load visibility states from local storage
  const loadVisibility = () => {
    toggleHours.checked =
      JSON.parse(localStorage.getItem("showHours")) || false;
    toggleMinutes.checked =
      JSON.parse(localStorage.getItem("showMinutes")) || false;
    toggleSeconds.checked =
      JSON.parse(localStorage.getItem("showSeconds")) || false;

    hoursSegment.style.display = toggleHours.checked ? "block" : "none";
    minutesSegment.style.display = toggleMinutes.checked ? "block" : "none";
    secondsSegment.style.display = toggleSeconds.checked ? "block" : "none";
  };

  // Save visibility state to local storage
  const saveVisibility = () => {
    localStorage.setItem("showHours", toggleHours.checked);
    localStorage.setItem("showMinutes", toggleMinutes.checked);
    localStorage.setItem("showSeconds", toggleSeconds.checked);
  };

  // Event listeners for checkboxes
  toggleHours.addEventListener("change", () => {
    hoursSegment.style.display = toggleHours.checked ? "block" : "none";
    saveVisibility();
  });

  toggleMinutes.addEventListener("change", () => {
    minutesSegment.style.display = toggleMinutes.checked ? "block" : "none";
    saveVisibility();
  });

  toggleSeconds.addEventListener("change", () => {
    secondsSegment.style.display = toggleSeconds.checked ? "block" : "none";
    saveVisibility();
  });

  // Initial load
  loadVisibility();

  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "enabled") {
    document.body.classList.add("dark");
    themeToggle.checked = true;
  }

  // Initialize Current Date and Time
  updateCurrentDateTime();
  setInterval(updateCurrentDateTime, 1000);
});

// Toggle Dark Mode
themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.body.classList.add("dark");
    localStorage.setItem("darkMode", "enabled");
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("darkMode", "disabled");
  }
});

// Full-Screen Toggle Functionality
fullscreenBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    enterFullscreen(document.documentElement);
  } else {
    exitFullscreen();
  }
});

// Function to Enter Fullscreen
function enterFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    /* Safari */
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    /* IE11 */
    element.msRequestFullscreen();
  }
}

// Function to Exit Fullscreen
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE11 */
    document.msExitFullscreen();
  }
}

// Update Fullscreen Button Icon Based on State
document.addEventListener("fullscreenchange", updateFullscreenIcon);
document.addEventListener("webkitfullscreenchange", updateFullscreenIcon);
document.addEventListener("msfullscreenchange", updateFullscreenIcon);

function updateFullscreenIcon() {
  if (document.fullscreenElement) {
    // Change to 'Exit Fullscreen' icon
    fullscreenIcon.innerHTML = `
      <path d="M5 16h14v2H5v-2zm0-8h14v2H5V8zm0 4h10v2H5v-2z"/>
    `;
    fullscreenBtn.setAttribute("title", "Exit Fullscreen");
  } else {
    // Change to 'Enter Fullscreen' icon
    fullscreenIcon.innerHTML = `
      <path d="M7 14H5v5h5v-2H7v-3zm0-4h2V7h3V5H7v5zm10 0h-3V5h5v5h-2V10zm-2 9h-5v-2h5v2z"/>
    `;
    fullscreenBtn.setAttribute("title", "Enter Fullscreen");
  }
}

// New Function to Update Current Date and Time
function updateCurrentDateTime() {
  const now = new Date();

  // Options for date formatting
  const optionsDate = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Options for time formatting
  const optionsTime = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  const currentDate = now.toLocaleDateString(undefined, optionsDate);
  const currentTime = now.toLocaleTimeString(undefined, optionsTime);

  currentDateEl.textContent = `Date: ${currentDate}`;
  currentTimeEl.textContent = `Time: ${currentTime}`;
}
