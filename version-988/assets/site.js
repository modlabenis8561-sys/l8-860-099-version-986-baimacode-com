import { movies } from "./search-data.js";

const bodyPrefix = document.body.dataset.linkPrefix || "";

function setupMobileMenu() {
  const toggle = document.querySelector("[data-mobile-toggle]");
  const panel = document.querySelector("[data-mobile-panel]");
  if (!toggle || !panel) {
    return;
  }
  toggle.addEventListener("click", () => {
    panel.classList.toggle("is-open");
  });
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function setupSuggestions() {
  document.querySelectorAll("[data-search-form]").forEach((form) => {
    const input = form.querySelector("[data-search-input]");
    const panel = form.querySelector("[data-suggestions]");
    const prefix = form.dataset.prefix || bodyPrefix;
    if (!input || !panel) {
      return;
    }
    const render = () => {
      const q = normalize(input.value);
      if (!q) {
        panel.classList.remove("is-open");
        panel.innerHTML = "";
        return;
      }
      const results = movies.filter((item) => {
        return normalize(item.title).includes(q) ||
          normalize(item.oneLine).includes(q) ||
          normalize(item.tags).includes(q) ||
          normalize(item.region).includes(q) ||
          normalize(item.type).includes(q);
      }).slice(0, 6);
      if (!results.length) {
        panel.classList.remove("is-open");
        panel.innerHTML = "";
        return;
      }
      panel.innerHTML = results.map((item) => `
        <a class="suggestion-link" href="${prefix}${item.url}">
          <img src="${prefix}${item.cover}" alt="${item.title}">
          <span><strong>${item.title}</strong><em>${item.region} · ${item.type} · ${item.year}</em></span>
        </a>
      `).join("");
      panel.classList.add("is-open");
    };
    input.addEventListener("input", render);
    input.addEventListener("focus", render);
    input.addEventListener("blur", () => {
      window.setTimeout(() => panel.classList.remove("is-open"), 160);
    });
  });
}

function setupHero() {
  const hero = document.querySelector("[data-hero]");
  if (!hero) {
    return;
  }
  const slides = [...hero.querySelectorAll("[data-hero-slide]")];
  const dots = [...hero.querySelectorAll("[data-hero-dot]")];
  const prev = hero.querySelector("[data-hero-prev]");
  const next = hero.querySelector("[data-hero-next]");
  let index = 0;
  const show = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  };
  prev?.addEventListener("click", () => show(index - 1));
  next?.addEventListener("click", () => show(index + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => show(i)));
  window.setInterval(() => show(index + 1), 5000);
}

function setupImages() {
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      img.style.opacity = "0";
    }, { once: true });
  });
}

setupMobileMenu();
setupSuggestions();
setupHero();
setupImages();
