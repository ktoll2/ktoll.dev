const reducedMotionQuery = matchMedia("(prefers-reduced-motion: reduce)");
const mobileMenuQuery = matchMedia("(max-width: 800px)");
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
  "Weyoun, Brunt, and Shran entering the same bar",
  "Green and Purple scarves deciding public policy",
  "Announcing the seventh chevron prematurely",
  "Gondolin appearing on public maps",
  "Carter blowing up another sun",
  "Parallel universes with unnecessary facial hair",
  "Sudden but inevitable betrayals"
];

function onMediaQueryChange(query, listener) {
  query.addEventListener("change", listener);
}

function initTheme() {
  const themeToggle = document.querySelector(".theme-toggle");
  const themeLabel = themeToggle?.querySelector(".visually-hidden");
  const themeColor = document.querySelector('meta[name="theme-color"]');

  if (!themeToggle || !themeLabel || !themeColor) {
    return;
  }

  function setTheme(theme, persist = false) {
    document.documentElement.dataset.theme = theme;
    themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
    themeLabel.textContent = `Switch to ${theme === "dark" ? "light" : "dark"} mode`;
    themeColor.content = theme === "dark" ? "#111b17" : "#b8bab0";

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
}

function initMobileMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNavigation = document.querySelector("#primary-navigation");

  if (!menuToggle || !primaryNavigation) {
    return;
  }

  function closeMobileMenu() {
    primaryNavigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = primaryNavigation.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  primaryNavigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMobileMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && primaryNavigation.classList.contains("is-open")) {
      closeMobileMenu();
      menuToggle.focus();
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (primaryNavigation.classList.contains("is-open") && !primaryNavigation.contains(event.target) && !menuToggle.contains(event.target)) {
      closeMobileMenu();
    }
  });

  onMediaQueryChange(mobileMenuQuery, closeMobileMenu);
}

function initPostOutline() {
  const postOutline = document.querySelector(".post-outline");
  const postOutlineList = document.querySelector(".post-outline-list");
  const postContent = document.querySelector(".post-content");

  if (!postOutline || !postOutlineList || !postContent) {
    return;
  }

  function createHeadingId(heading, index) {
    if (heading.id) {
      return heading.id;
    }

    const baseId = heading.textContent
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/[\s-]+/g, "-") || `section-${index + 1}`;
    let headingId = baseId;
    let suffix = 2;

    while (document.getElementById(headingId)) {
      headingId = `${baseId}-${suffix}`;
      suffix += 1;
    }

    heading.id = headingId;
    return headingId;
  }

  const headings = [...postContent.querySelectorAll("h2, h3")];

  if (headings.length === 0) {
    return;
  }

  let currentTopLevelItem;

  headings.forEach((heading, index) => {
    const item = document.createElement("li");
    const link = document.createElement("a");

    link.href = `#${createHeadingId(heading, index)}`;
    link.textContent = heading.textContent;
    item.append(link);

    if (heading.tagName === "H3" && currentTopLevelItem) {
      let nestedList = currentTopLevelItem.querySelector(".post-outline-list-nested");

      if (!nestedList) {
        nestedList = document.createElement("ol");
        nestedList.className = "post-outline-list-nested";
        currentTopLevelItem.append(nestedList);
      }

      nestedList.append(item);
      return;
    }

    postOutlineList.append(item);

    if (heading.tagName === "H2") {
      currentTopLevelItem = item;
    }
  });

  postOutline.hidden = false;
}

function initPostAnimations() {
  const animations = document.querySelectorAll(".post-animation");

  if (animations.length === 0) {
    return;
  }

  let observer = null;

  function playAnimation(animation) {
    animation.controls = false;
    animation.play().catch(() => {
      // Native controls let the reader start playback when the browser blocks it.
      animation.controls = true;
    });
  }

  function setPlayback() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    if (reducedMotionQuery.matches) {
      animations.forEach((animation) => {
        animation.pause();
        animation.currentTime = 0;
        animation.controls = true;
      });
      return;
    }

    // Only fetch/play each clip once it is near the viewport, so off-screen
    // videos don't front-load their full source on page load.
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          playAnimation(entry.target);
        } else {
          entry.target.pause();
        }
      });
    }, { rootMargin: "200px" });

    animations.forEach((animation) => observer.observe(animation));
  }

  setPlayback();
  onMediaQueryChange(reducedMotionQuery, setPlayback);
}

function initPersonality() {
  const statusLine = document.querySelector(".availability-negative");
  const statusStack = document.querySelector(".status-message-stack");
  const showPersonality = new URLSearchParams(window.location.search).get("personality") === "on";

  if (!showPersonality || !statusLine || !statusStack) {
    return;
  }

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
    if (!statusTimer && !document.hidden && !reducedMotionQuery.matches) {
      statusTimer = window.setInterval(showNextStatus, 6000);
    }
  }

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
  const updateStatusCycle = () => {
    if (reducedMotionQuery.matches) {
      pauseStatusCycle();
    } else {
      resumeStatusCycle();
    }
  };

  onMediaQueryChange(reducedMotionQuery, updateStatusCycle);
}

initTheme();
initMobileMenu();
initPostOutline();
initPostAnimations();
initPersonality();
