const WHATSAPP_NUMBER = "5575999312633";
const WHATSAPP_MESSAGE = "Olá! Vi o site da Ultra Energy e gostaria de avaliar um projeto de energia solar.";
const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu-principal");
const toast = document.querySelector(".contact-toast");
document.querySelector("#year").textContent = new Date().getFullYear();

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  menu.classList.toggle("is-open", open);
});
menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  menu.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
}));

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
