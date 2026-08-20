const themeToggle = document.querySelector(".theme-toggle");
const themeLabel = themeToggle.querySelector(".visually-hidden");
const resumeMenu = document.querySelector(".resume-menu");
const statusLine = document.querySelector(".availability-negative");
const statusStack = document.querySelector(".status-message-stack");
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
const statusMessages = statusOptions.map((status) => {
  const message = document.createElement("span");
  message.className = "status-message";
  message.textContent = status;
  message.dataset.status = status;
  return message;
});
let statusQueue = [];
let currentStatus = "";
let currentStatusMessage;
let statusTimer;

statusStack.replaceChildren(...statusMessages);

function shuffle(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function getNextStatus() {
  if (statusQueue.length === 0) {
    statusQueue = shuffle(statusOptions);

    if (statusQueue[0] === currentStatus) {
      [statusQueue[0], statusQueue[1]] = [statusQueue[1], statusQueue[0]];
    }
  }

  return statusQueue.shift();
}

function showNextStatus() {
  const nextStatus = getNextStatus();
  const nextStatusMessage = statusMessages.find((message) => message.dataset.status === nextStatus);

  if (reducedMotion || !currentStatusMessage) {
    currentStatusMessage?.classList.remove("is-active");
    nextStatusMessage.classList.add("is-active");
  } else {
    currentStatusMessage.classList.remove("is-active");
    nextStatusMessage.classList.add("is-active");
  }

  currentStatus = nextStatus;
  currentStatusMessage = nextStatusMessage;
}

function pauseStatusCycle() {
  window.clearInterval(statusTimer);
  statusTimer = undefined;
}

function resumeStatusCycle() {
  if (!statusTimer && !document.hidden) {
    statusTimer = window.setInterval(showNextStatus, 6000);
  }
}

function setTheme(theme, persist = false) {
  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeLabel.textContent = `Switch to ${theme === "dark" ? "light" : "dark"} mode`;
  document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#111b17" : "#dfded5";

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

document.addEventListener("pointerdown", (event) => {
  if (resumeMenu.open && !resumeMenu.contains(event.target)) {
    resumeMenu.open = false;
  }
});

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
