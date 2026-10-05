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

const monitoringVideo = document.querySelector(".monitoring-video");
const videoPlayButton = document.querySelector(".video-play");
if (monitoringVideo && videoPlayButton) {
  const screen = monitoringVideo.closest(".desktop-screen");
  videoPlayButton.addEventListener("click", async () => {
    try {
      await monitoringVideo.play();
    } catch {
      screen.classList.remove("is-playing");
    }
  });
  monitoringVideo.addEventListener("playing", () => {
    screen.classList.add("is-playing");
    if (document.activeElement === videoPlayButton) monitoringVideo.focus();
  });
  monitoringVideo.addEventListener("pause", () => screen.classList.remove("is-playing"));
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
