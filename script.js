const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = themeToggle.querySelector(".visually-hidden");
const statusLine = document.querySelector(".availability-negative");
const statusStack = document.querySelector(".status-message-stack");
const showPersonality = new URLSearchParams(window.location.search).get("personality") === "on";
const statusOptions = [
  "Wizards wandering off mid-quest",
  "Coffee hiding inside nebulas",
  "Sand exceeding its designated boundaries",
  "Hyperspace bypass plans posted in a cellar",
  "Second breakfast being treated as optional",
  "Moons with suspiciously large exhaust ports",
  "Tauntauns with optimistic temperature ratings",
  "Mostly dead being mistaken for all dead",
  "Unusually large rodents",
  "Wormholes exceeding thirty-eight minutes",
  "Flute lessons delivered through alien probes",
  "Mandos making predictions at dinner",
  "Root beer becoming insidious",
  "Weyoun, Brunt, and Shran entering the same bar",
  "Green and Purple scarves deciding public policy",
  "Announcing the seventh chevron prematurely",
  "Gondolin appearing on public maps",
  "Carter blowing up another sun",
  "Parallel universes with unnecessary facial hair",
  "Sudden but inevitable betrayals"
];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
let statusQueue = [];
let currentStatus = "";
let statusTimer;

function shuffle(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function showNextStatus() {
  if (statusQueue.length === 0) {
    statusQueue = shuffle(statusOptions);

    if (statusQueue[0] === currentStatus) {
      [statusQueue[0], statusQueue[1]] = [statusQueue[1], statusQueue[0]];
    }
  }

  currentStatus = statusQueue.shift();
  statusStack.textContent = `Not open to ${currentStatus}`;
}

function pauseStatusCycle() {
  window.clearInterval(statusTimer);
  statusTimer = undefined;
}

function resumeStatusCycle() {
  if (!statusTimer && !document.hidden && !reducedMotion) {
    statusTimer = window.setInterval(showNextStatus, 6000);
  }
}

function setTheme(theme, persist = false) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeLabel.textContent = `Switch to ${theme === "dark" ? "light" : "dark"} mode`;
  document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#111b17" : "#b8bab0";

  if (persist) {
    try {
      localStorage.setItem("ktoll-theme", theme);
    } catch {
      // The control still works when storage is unavailable.
    }
  }
}

setTheme(document.documentElement.dataset.theme);

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme, true);
});

if (showPersonality) {
  document.documentElement.dataset.personality = "on";
  const funFont = document.createElement("link");
  funFont.rel = "stylesheet";
  funFont.href = "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap";
  document.head.append(funFont);

  statusLine.hidden = false;
  showNextStatus();
  resumeStatusCycle();

  statusLine.addEventListener("pointerenter", pauseStatusCycle);
  statusLine.addEventListener("pointerleave", resumeStatusCycle);
  statusLine.addEventListener("focusin", pauseStatusCycle);
  statusLine.addEventListener("focusout", resumeStatusCycle);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pauseStatusCycle();
    } else {
      resumeStatusCycle();
    }
  });
}
