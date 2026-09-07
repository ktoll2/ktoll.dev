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

// The "ktoll-theme" key and the #111b17 / #b8bab0 theme-color pair below are
// also set by the pre-paint inline script in _includes/head.html; keep in sync.
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

function initHeadingPermalinks() {
  const headings = document.querySelectorAll(".post-content h2[id], .post-content h3[id]");

  headings.forEach((heading) => {
    const link = document.createElement("a");
    link.className = "heading-permalink";
    link.href = `#${heading.id}`;
    link.setAttribute("aria-label", `Link to this section: ${heading.textContent}`);

    const icon = document.createElement("span");
    icon.className = "button-icon button-icon-link";
    icon.setAttribute("aria-hidden", "true");
    link.append(icon);

    link.addEventListener("click", (event) => {
      event.preventDefault();
      history.replaceState(null, "", `#${heading.id}`);
      copyToClipboard(`${location.origin}${location.pathname}#${heading.id}`, link);
    });

    heading.append(link);
  });
}

function initReadingProgress() {
  const progressBar = document.querySelector(".reading-progress-bar");
  const postContent = document.querySelector(".post-content");

  if (!progressBar || !postContent) {
    return;
  }

  function updateProgress() {
    const { top, height } = postContent.getBoundingClientRect();
    const scrollable = height - window.innerHeight;
    const scrolled = scrollable > 0 ? Math.min(Math.max(-top, 0), scrollable) / scrollable : 0;

    progressBar.style.width = `${scrolled * 100}%`;
  }

  updateProgress();
  document.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}

let toastElement;
let toastTimeout;

function showToast(message, anchor) {
  if (!toastElement) {
    toastElement = document.createElement("div");
    toastElement.className = "toast";
    toastElement.setAttribute("role", "status");
    document.body.append(toastElement);
  }

  toastElement.textContent = message;

  const gap = 10;
  const anchorRect = anchor.getBoundingClientRect();
  const toastRect = toastElement.getBoundingClientRect();
  const left = Math.min(
    Math.max(anchorRect.left + anchorRect.width / 2 - toastRect.width / 2, gap),
    window.innerWidth - toastRect.width - gap
  );
  const top = anchorRect.top - toastRect.height - gap >= gap
    ? anchorRect.top - toastRect.height - gap
    : anchorRect.bottom + gap;

  toastElement.style.left = `${left}px`;
  toastElement.style.top = `${top}px`;
  toastElement.classList.add("is-visible");

  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => {
    toastElement.classList.remove("is-visible");
  }, 2400);
}

function copyToClipboard(text, anchor, onSuccess) {
  navigator.clipboard?.writeText(text).then(() => {
    showToast("Link copied to clipboard", anchor);
    onSuccess?.();
  }).catch(() => {
    // Clipboard blocked; any URL-hash update the caller made still stands.
  });
}

function copyLink(button, url) {
  if (!navigator.clipboard) {
    button.hidden = true;
    return;
  }

  copyToClipboard(url, button, () => {
    button.classList.add("is-confirmed");
    window.setTimeout(() => {
      button.classList.remove("is-confirmed");
    }, 2000);
  });
}

function buildShareLinks(title, url) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return {
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    hn: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`
  };
}

function closeShareMenu(panel) {
  panel.hidden = true;
  panel.closest(".share-menu")?.querySelector(".post-share")?.setAttribute("aria-expanded", "false");
}

function initShareActions() {
  document.querySelectorAll(".share-menu").forEach((menu) => {
    const shareButton = menu.querySelector(".post-share");
    const panel = menu.querySelector(".share-menu-panel");

    if (!shareButton || !panel) {
      return;
    }

    const links = buildShareLinks(shareButton.dataset.shareTitle, shareButton.dataset.shareUrl);

    panel.querySelectorAll("[data-network]").forEach((link) => {
      link.href = links[link.dataset.network];
    });

    shareButton.addEventListener("click", () => {
      if (navigator.share) {
        navigator.share({
          title: shareButton.dataset.shareTitle,
          url: shareButton.dataset.shareUrl
        }).catch(() => {
          // User cancelled, or share failed; the dropdown covers this on the next click.
        });
        return;
      }

      const isOpen = !panel.hidden;

      document.querySelectorAll(".share-menu-panel").forEach((otherPanel) => {
        if (otherPanel !== panel) {
          closeShareMenu(otherPanel);
        }
      });

      panel.hidden = isOpen;
      shareButton.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  document.addEventListener("pointerdown", (event) => {
    document.querySelectorAll(".share-menu-panel:not([hidden])").forEach((panel) => {
      if (!panel.closest(".share-menu")?.contains(event.target)) {
        closeShareMenu(panel);
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.querySelectorAll(".share-menu-panel:not([hidden])").forEach(closeShareMenu);
    }
  });

  document.querySelectorAll(".post-copy-link").forEach((copyButton) => {
    if (!navigator.clipboard) {
      copyButton.hidden = true;
      return;
    }

    copyButton.addEventListener("click", () => copyLink(copyButton, copyButton.dataset.copyUrl));
  });
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
initHeadingPermalinks();
initReadingProgress();
initShareActions();
initPostAnimations();
initPersonality();
