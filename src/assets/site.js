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

// Give integrations more time to load before the visitor reaches them.
function whenNear(element, load, rootMargin = "1200px 0px") {
  if (!element) return;
  if (!("IntersectionObserver" in window)) {
    load();
    return;
  }
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    observer.disconnect();
    load();
  }, { rootMargin });
  observer.observe(element);
}

// Each integration has its own status; the rest of the page stays usable.
function createMediaLoader(host, label, delayedMessage = "Está demorando um pouco. Use o link abaixo se preferir.") {
  const loader = document.createElement("div");
  loader.className = "media-loader";
  loader.setAttribute("role", "status");
  const indicator = document.createElement("span");
  indicator.className = "media-loader-indicator";
  indicator.setAttribute("aria-hidden", "true");
  const message = document.createElement("span");
  message.className = "media-loader-message";
  loader.append(indicator, message);
  host.append(loader);
  let timeout;

  function show(state, text) {
    clearTimeout(timeout);
    loader.hidden = false;
    message.textContent = text;
    host.dataset.mediaState = state;
    host.setAttribute("aria-busy", String(state === "loading"));
  }
  show("loading", label);
  return {
    start(text = label) {
      show("loading", text);
      timeout = setTimeout(() => show("delayed", delayedMessage), 20000);
    },
    finish() {
      clearTimeout(timeout);
      loader.hidden = true;
      host.dataset.mediaState = "ready";
      host.setAttribute("aria-busy", "false");
    },
    fail(text) { show("error", text); }
  };
}

const reelLoaders = [];
// These selected players use a 3:4 media area plus Instagram's fixed chrome.
document.querySelectorAll(".reel-card").forEach(card => {
  const embed = card.querySelector(".reel-embed");
  const loader = createMediaLoader(embed, "Carregando vídeo do Instagram…");
  reelLoaders.push(loader);
  const embedObserver = new MutationObserver(() => {
    const frame = embed.querySelector("iframe.instagram-media");
    if (!frame) return;
    embedObserver.disconnect();
    frame.addEventListener("load", () => loader.finish(), { once: true });
    frame.addEventListener("error", () => loader.fail("Não foi possível carregar. Abra o Reel pelo link abaixo."), { once: true });
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

whenNear(document.querySelector("#projetos"), () => {
  reelLoaders.forEach(loader => loader.start());
  const script = document.createElement("script");
  script.src = "https://www.instagram.com/embed.js";
  script.async = true;
  script.addEventListener("load", () => window.instgrm?.Embeds?.process());
  script.addEventListener("error", () => reelLoaders.forEach(loader => loader.fail("Não foi possível carregar. Abra o Reel pelo link abaixo.")));
  // The original links remain available if Instagram cannot be reached.
  document.body.append(script);
});

const locationMap = document.querySelector(".location-stage > iframe[data-src]");
if (locationMap) {
  const mapLoader = createMediaLoader(locationMap.parentElement, "Carregando localização…", "Está demorando um pouco. Use o botão Abrir rota se preferir.");
  locationMap.addEventListener("load", () => {
    if (locationMap.hasAttribute("src")) mapLoader.finish();
  });
  locationMap.addEventListener("error", () => mapLoader.fail("Mapa indisponível. Use o botão Abrir rota."), { once: true });
  whenNear(locationMap, () => {
    mapLoader.start();
    // The observer already defers this iframe; avoid a second native delay.
    locationMap.loading = "eager";
    locationMap.src = locationMap.dataset.src;
  });
}

const monitoringVideo = document.querySelector(".monitoring-video");
const videoPlayButton = document.querySelector(".video-play");
if (monitoringVideo && videoPlayButton) {
  const screen = monitoringVideo.closest(".desktop-screen");
  const videoLoader = createMediaLoader(screen, "Carregando prévia…", "Está demorando um pouco. Tente reproduzir novamente.");
  const poster = new Image();
  poster.addEventListener("load", () => {
    if (monitoringVideo.paused) videoLoader.finish();
  }, { once: true });
  poster.addEventListener("error", () => videoLoader.fail("Prévia indisponível. Toque em reproduzir."), { once: true });
  poster.src = monitoringVideo.poster;
  function prepareVideo() {
    if (monitoringVideo.hasAttribute("src")) return;
    monitoringVideo.preload = "metadata";
    monitoringVideo.src = monitoringVideo.dataset.src;
    monitoringVideo.load();
  }
  whenNear(document.querySelector("#monitoramento"), prepareVideo);
  monitoringVideo.addEventListener("pointerdown", prepareVideo, { once: true });
  videoPlayButton.addEventListener("click", async () => {
    prepareVideo();
    videoLoader.start("Preparando vídeo…");
    try {
      await monitoringVideo.play();
    } catch {
      videoLoader.fail("Toque em reproduzir para tentar novamente.");
      screen.classList.remove("is-playing");
    }
  });
  monitoringVideo.addEventListener("playing", () => {
    videoLoader.finish();
    screen.classList.add("is-playing");
    if (document.activeElement === videoPlayButton) monitoringVideo.focus();
  });
  monitoringVideo.addEventListener("waiting", () => {
    if (!monitoringVideo.paused) videoLoader.start("Carregando vídeo…");
  });
  monitoringVideo.addEventListener("canplay", () => videoLoader.finish());
  monitoringVideo.addEventListener("error", () => videoLoader.fail("Vídeo indisponível. Tente reproduzir novamente."));
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
