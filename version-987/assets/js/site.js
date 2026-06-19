(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var navButton = document.querySelector(".nav-toggle");
    var mobileNav = document.querySelector(".mobile-nav");
    if (navButton && mobileNav) {
      navButton.addEventListener("click", function () {
        var opened = mobileNav.classList.toggle("is-open");
        navButton.setAttribute("aria-expanded", opened ? "true" : "false");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    function nextSlide() {
      showSlide(current + 1);
    }

    if (slides.length) {
      document.querySelectorAll("[data-hero-next]").forEach(function (button) {
        button.addEventListener("click", function () {
          nextSlide();
        });
      });
      document.querySelectorAll("[data-hero-prev]").forEach(function (button) {
        button.addEventListener("click", function () {
          showSlide(current - 1);
        });
      });
      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
        });
      });
      timer = window.setInterval(nextSlide, 5200);
      var hero = document.querySelector(".hero");
      if (hero) {
        hero.addEventListener("mouseenter", function () {
          window.clearInterval(timer);
        });
        hero.addEventListener("mouseleave", function () {
          timer = window.setInterval(nextSlide, 5200);
        });
      }
    }

    var searchInput = document.querySelector("[data-search]");
    var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    var empty = document.getElementById("searchEmpty");
    var activeFilter = "all";

    function normalize(value) {
      return String(value || "").toLowerCase().trim();
    }

    function applySearch() {
      var query = normalize(searchInput ? searchInput.value : "");
      var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-tags"),
          card.textContent
        ].join(" "));
        var filterText = normalize(activeFilter);
        var matchedQuery = !query || haystack.indexOf(query) !== -1;
        var matchedFilter = filterText === "all" || haystack.indexOf(filterText) !== -1;
        var matched = matchedQuery && matchedFilter;
        card.style.display = matched ? "" : "none";
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle("is-visible", cards.length > 0 && visible === 0);
      }
    }

    if (searchInput) {
      searchInput.addEventListener("input", applySearch);
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (item) {
          item.classList.remove("active");
        });
        tab.classList.add("active");
        activeFilter = tab.getAttribute("data-filter") || "all";
        applySearch();
      });
    });
  });
})();

function initMoviePlayer(url) {
  var video = document.getElementById("moviePlayer");
  var cover = document.getElementById("playerCover");
  var trigger = document.getElementById("playTrigger");
  var prepared = false;

  if (!video || !url) {
    return;
  }

  function prepare() {
    if (prepared) {
      return;
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(url);
      hls.attachMedia(video);
      video.hlsInstance = hls;
    } else {
      video.src = url;
    }
    prepared = true;
  }

  function play() {
    prepare();
    if (cover) {
      cover.classList.add("is-hidden");
    }
    video.controls = true;
    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {});
    }
  }

  if (trigger) {
    trigger.addEventListener("click", play);
  }
  if (cover) {
    cover.addEventListener("click", play);
  }
  video.addEventListener("click", function () {
    if (video.paused) {
      play();
    }
  });
}
