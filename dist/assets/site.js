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
const revealItems = document.querySelectorAll("[data-reveal], [data-phone-tilt]");

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

// The FAQ progressively enhances into a scroll-led sequence; without JavaScript it remains a readable list.
const faqSection = document.querySelector("#duvidas");
const faqSteps = Array.from(document.querySelectorAll("[data-faq-step]"));

if (faqSection && faqSteps.length && !reducedMotion.matches &&
    "IntersectionObserver" in window && "requestAnimationFrame" in window) {
  let frameId = null;
  let isTracking = false;
  let currentIndex = -1;

  function clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum);
  }

  function updateFaqSteps() {
    frameId = null;
    if (!isTracking) return;

    const compactLayout = window.matchMedia("(max-width: 980px)").matches;
    const viewportHeight = window.innerHeight;
    const focalPoint = viewportHeight * (compactLayout ? 0.48 : 0.5);
    const transitionRange = viewportHeight * (compactLayout ? 0.44 : 0.52);
    const travel = compactLayout ? 18 : 42;
    const minimumOpacity = compactLayout ? 0.46 : 0.22;
    let closestIndex = 0;
    let closestDistance = Infinity;

    faqSteps.forEach((step, index) => {
      const rect = step.getBoundingClientRect();
      const distance = (rect.top + rect.height / 2 - focalPoint) / transitionRange;
      const intensity = Math.min(Math.abs(distance), 1);
      const opacity = minimumOpacity + (1 - minimumOpacity) * (1 - intensity);

      step.style.setProperty("--faq-opacity", opacity.toFixed(3));
      step.style.setProperty("--faq-y", `${clamp(distance * travel, -travel, travel).toFixed(2)}px`);

      if (Math.abs(distance) < closestDistance) {
        closestDistance = Math.abs(distance);
        closestIndex = index;
      }
    });

    if (closestIndex !== currentIndex) {
      faqSteps.forEach((step, index) => {
        const current = index === closestIndex;
        step.classList.toggle("is-current", current);
        if (current) step.setAttribute("aria-current", "step");
        else step.removeAttribute("aria-current");
      });
      currentIndex = closestIndex;
    }
  }

  function scheduleFaqUpdate() {
    if (isTracking && frameId === null) frameId = requestAnimationFrame(updateFaqSteps);
  }

  function resetFaqMotion() {
    isTracking = false;
    faqSection.classList.remove("faq-motion-ready", "is-tracking");
    window.removeEventListener("scroll", scheduleFaqUpdate);
    window.removeEventListener("resize", scheduleFaqUpdate);
    if (frameId !== null) cancelAnimationFrame(frameId);
    faqSteps.forEach(step => {
      step.style.removeProperty("--faq-opacity");
      step.style.removeProperty("--faq-y");
      step.classList.remove("is-current");
      step.removeAttribute("aria-current");
    });
  }

  const faqObserver = new IntersectionObserver(entries => {
    isTracking = entries[0].isIntersecting;
    faqSection.classList.toggle("is-tracking", isTracking);
    if (isTracking) scheduleFaqUpdate();
  }, { rootMargin: "20% 0px 20% 0px" });

  faqSection.classList.add("faq-motion-ready");
  faqObserver.observe(faqSection);
  window.addEventListener("scroll", scheduleFaqUpdate, { passive: true });
  window.addEventListener("resize", scheduleFaqUpdate);
  scheduleFaqUpdate();

  reducedMotion.addEventListener?.("change", event => {
    if (!event.matches) return;
    faqObserver.disconnect();
    resetFaqMotion();
  });
}
