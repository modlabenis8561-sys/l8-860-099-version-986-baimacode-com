import { movies } from "./search-data.js";

const params = new URLSearchParams(window.location.search);
const query = String(params.get("q") || "").trim();
const title = document.querySelector("[data-search-title]");
const count = document.querySelector("[data-search-count]");
const resultsBox = document.querySelector("[data-search-results]");

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function card(item) {
  return `
    <a class="movie-card" href="${item.url}">
      <span class="thumb poster-thumb">
        <img src="${item.cover}" alt="${item.title}" loading="lazy">
        <span class="play-symbol">▶</span>
        <span class="region-badge">${item.region}</span>
        <span class="year-badge">${item.year}</span>
      </span>
      <span class="card-title">${item.title}</span>
      <span class="card-meta"><b>★ ${item.rating}</b><em>${item.views} 热度</em></span>
    </a>
  `;
}

if (query) {
  const q = normalize(query);
  const results = movies.filter((item) => {
    return normalize(item.title).includes(q) ||
      normalize(item.oneLine).includes(q) ||
      normalize(item.tags).includes(q) ||
      normalize(item.region).includes(q) ||
      normalize(item.type).includes(q) ||
      normalize(item.genre).includes(q);
  });
  title.textContent = `搜索：${query}`;
  count.textContent = `找到 ${results.length} 个相关结果`;
  resultsBox.innerHTML = results.length ? results.map(card).join("") : `
    <div class="search-empty">
      <strong>没有找到相关影片</strong>
      <p>可以尝试输入其他片名、地区、年份或题材。</p>
    </div>
  `;
} else {
  resultsBox.innerHTML = movies.slice(0, 24).map(card).join("");
}
