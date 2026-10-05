const WHATSAPP_NUMBER = "5575999312633";
const WHATSAPP_MESSAGE = "Olá! Vi o site da Ultra Energy e gostaria de avaliar um projeto de energia solar.";

const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu-principal");
const toast = document.querySelector(".contact-toast");
const year = document.querySelector("#year");

if (year) year.textContent = String(new Date().getFullYear());

function setMenuOpen(open) {
  menu.classList.toggle("is-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
}

menuButton.addEventListener("click", () => {
  setMenuOpen(menuButton.getAttribute("aria-expanded") !== "true");
});

menu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuButton.focus();
  }
});

document.addEventListener("click", event => {
  if (menuButton.getAttribute("aria-expanded") === "true" &&
      !menu.contains(event.target) &&
      !menuButton.contains(event.target)) {
    setMenuOpen(false);
  }
});

window.matchMedia("(min-width: 981px)").addEventListener("change", event => {
  if (event.matches) setMenuOpen(false);
});

document.querySelectorAll(".whatsapp-link").forEach(link => {
  if (/^\d{12,13}$/.test(WHATSAPP_NUMBER)) {
    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.addEventListener("click", event => {
      event.preventDefault();
      toast.hidden = false;
      clearTimeout(window.contactToastTimeout);
      window.contactToastTimeout = setTimeout(() => { toast.hidden = true; }, 5000);
    });
  }
});

// The page stays visible until the observer is ready; unsupported browsers keep the static layout.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });

  revealItems.forEach(item => revealObserver.observe(item));
  document.documentElement.classList.add("motion-ready");

  reducedMotion.addEventListener?.("change", event => {
    if (!event.matches) return;
    revealObserver.disconnect();
    document.documentElement.classList.remove("motion-ready");
  });
}

// The opening screen waits for media, images and fonts, with an escape for slow services.
const pagePreloader = document.querySelector("#page-preloader");
const preloaderProgress = pagePreloader?.querySelector("progress");
const preloaderSkip = pagePreloader?.querySelector(".preloader-skip");
const preloaderTasks = [];
const openingContent = Array.from(document.body.children).filter(element =>
  element !== pagePreloader && element.tagName !== "SCRIPT"
);
if (document.documentElement.classList.contains("page-loading")) {
  openingContent.forEach(element => {
    element.inert = true;
    element.setAttribute("data-opening-inert", "");
  });
}
let completedTasks = 0;
let preloaderClosed = false;

function waitForOpening(promise) {
  const task = Promise.resolve(promise).catch(() => {}).then(() => {
    completedTasks += 1;
    if (preloaderProgress) preloaderProgress.value = completedTasks;
  });
  preloaderTasks.push(task);
}

function openSite() {
  if (preloaderClosed) return;
  preloaderClosed = true;
  clearTimeout(window.preloaderFailsafe);
  window.preloaderContentObserver?.disconnect();
  clearTimeout(skipTimeout);
  const restoreFocus = pagePreloader?.contains(document.activeElement);
  pagePreloader?.classList.add("is-leaving");
  document.documentElement.classList.remove("page-loading");
  openingContent.forEach(element => {
    element.inert = false;
    element.removeAttribute("data-opening-inert");
  });
  if (restoreFocus) document.querySelector(".skip-link")?.focus();
  setTimeout(() => pagePreloader?.remove(), reducedMotion.matches ? 0 : 250);
}

const skipTimeout = setTimeout(() => {
  if (preloaderSkip) preloaderSkip.hidden = false;
  const status = pagePreloader?.querySelector(".preloader-status");
  if (status) status.textContent = "Alguns conteúdos estão demorando. Você já pode entrar.";
}, 8000);
preloaderSkip?.addEventListener("click", openSite);

waitForOpening(Promise.all(Array.from(document.images, image => {
  image.loading = "eager";
  if (image.complete) return Promise.resolve();
  return new Promise(resolve => {
    image.addEventListener("load", resolve, { once: true });
    image.addEventListener("error", resolve, { once: true });
  });
})));
waitForOpening(document.fonts?.ready);

function trackMedia(host) {
  let settle;
  waitForOpening(new Promise(resolve => { settle = resolve; }));
  host.dataset.mediaState = "loading";
  return {
    finish() { host.dataset.mediaState = "ready"; settle(); },
    fail() { host.dataset.mediaState = "error"; settle(); }
  };
}

const reelLoaders = [];
// These selected players use a 3:4 media area plus Instagram's fixed chrome.
document.querySelectorAll(".reel-card").forEach(card => {
  const embed = card.querySelector(".reel-embed");
  const loader = trackMedia(embed);
  reelLoaders.push(loader);
  const embedObserver = new MutationObserver(() => {
    const frame = embed.querySelector("iframe.instagram-media");
    if (!frame) return;
    embedObserver.disconnect();
    frame.loading = "eager";
    frame.addEventListener("load", () => loader.finish(), { once: true });
    frame.addEventListener("error", () => loader.fail(), { once: true });
  });
  embedObserver.observe(embed, { childList: true, subtree: true });
  function reservePlayerHeight(width) {
    const height = `${Math.round((width - 2) * 4 / 3 + 179)}px`;
    if (card.style.getPropertyValue("--reel-embed-height") !== height) {
      card.style.setProperty("--reel-embed-height", height);
    }
  }
  reservePlayerHeight(card.getBoundingClientRect().width);
  if ("ResizeObserver" in window) {
    new ResizeObserver(entries => reservePlayerHeight(entries[0].contentRect.width)).observe(card);
  }
});

if (reelLoaders.length) {
  const script = document.createElement("script");
  script.src = "https://www.instagram.com/embed.js";
  script.async = true;
  script.addEventListener("load", () => window.instgrm?.Embeds?.process());
  script.addEventListener("error", () => reelLoaders.forEach(loader => loader.fail()));
  // The original links remain available if Instagram cannot be reached.
  document.body.append(script);
}

const locationMap = document.querySelector(".location-map");
if (locationMap) {
  const mapLoader = trackMedia(locationMap.parentElement);
  locationMap.addEventListener("load", () => {
    if (locationMap.hasAttribute("src")) mapLoader.finish();
  });
  locationMap.addEventListener("error", () => mapLoader.fail(), { once: true });
  if (locationMap.dataset.loaded === "true") mapLoader.finish();
}

const monitoringVideo = document.querySelector(".monitoring-video");
const videoPlayButton = document.querySelector(".video-play");
if (monitoringVideo && videoPlayButton) {
  const screen = monitoringVideo.closest(".desktop-screen");
  const videoLoader = trackMedia(screen);
  const poster = new Image();
  poster.addEventListener("load", () => {
    if (monitoringVideo.paused) videoLoader.finish();
  }, { once: true });
  poster.addEventListener("error", () => videoLoader.fail(), { once: true });
  poster.src = monitoringVideo.poster;
  waitForOpening(new Promise(resolve => {
    monitoringVideo.addEventListener("loadeddata", resolve, { once: true });
    monitoringVideo.addEventListener("error", resolve, { once: true });
  }));
  function prepareVideo() {
    if (monitoringVideo.hasAttribute("src")) return;
    monitoringVideo.preload = "auto";
    monitoringVideo.src = monitoringVideo.dataset.src;
    monitoringVideo.load();
  }
  prepareVideo();
  monitoringVideo.addEventListener("pointerdown", prepareVideo, { once: true });
  videoPlayButton.addEventListener("click", async () => {
    prepareVideo();
    try {
      await monitoringVideo.play();
    } catch {
      videoLoader.fail();
      screen.classList.remove("is-playing");
    }
  });
  monitoringVideo.addEventListener("playing", () => {
    videoLoader.finish();
    screen.classList.add("is-playing");
    if (document.activeElement === videoPlayButton) monitoringVideo.focus();
  });
  monitoringVideo.addEventListener("canplay", () => videoLoader.finish());
  monitoringVideo.addEventListener("error", () => videoLoader.fail());
  monitoringVideo.addEventListener("pause", () => {
    screen.classList.remove("is-playing");
    videoLoader.finish();
  });
  monitoringVideo.addEventListener("ended", () => screen.classList.remove("is-playing"));
}
const faqQuestions = document.querySelectorAll(".faq-question");
faqQuestions.forEach(question => {
  question.addEventListener("click", () => {
    const shouldOpen = question.getAttribute("aria-expanded") !== "true";
    faqQuestions.forEach(otherQuestion => {
      otherQuestion.setAttribute("aria-expanded", "false");
      otherQuestion.querySelector(".faq-indicator").textContent = "+";
      document.getElementById(otherQuestion.getAttribute("aria-controls")).hidden = true;
    });
    if (shouldOpen) {
      question.setAttribute("aria-expanded", "true");
      question.querySelector(".faq-indicator").textContent = "\u2212";
      document.getElementById(question.getAttribute("aria-controls")).hidden = false;
    }
  });
});

const spotlightMedia = window.matchMedia("(min-width: 681px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
document.querySelectorAll(".solution-card").forEach(card => {
  card.addEventListener("pointermove", event => {
    if (!spotlightMedia.matches) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--spotlight-x", (event.clientX - rect.left) + "px");
    card.style.setProperty("--spotlight-y", (event.clientY - rect.top) + "px");
  });
  card.addEventListener("pointerleave", () => {
    card.style.removeProperty("--spotlight-x");
    card.style.removeProperty("--spotlight-y");
  });
});

if (preloaderProgress) preloaderProgress.max = preloaderTasks.length;
Promise.allSettled(preloaderTasks).then(openSite);
// Reuse the early watchdog so a blocked external player cannot trap the visitor.
window.openUltraEnergy = openSite;
