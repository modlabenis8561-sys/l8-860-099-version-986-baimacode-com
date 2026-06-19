(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-main-nav]");

    if (menuButton && nav) {
      menuButton.addEventListener("click", function () {
        nav.classList.toggle("is-open");
      });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var current = 0;
      var timer = null;

      function show(index) {
        if (!slides.length) {
          return;
        }

        current = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });

        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
        }
      }

      if (prev) {
        prev.addEventListener("click", function () {
          show(current - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(current + 1);
          start();
        });
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          show(index);
          start();
        });
      });

      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
      show(0);
      start();
    }

    var searchInput = document.querySelector("[data-movie-search]");
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter-value]"));
    var status = document.querySelector("[data-filter-status]");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
    var activeFilter = "all";

    if (searchInput || filterButtons.length) {
      function textOf(card) {
        return [
          card.getAttribute("data-title"),
          card.getAttribute("data-type"),
          card.getAttribute("data-region"),
          card.getAttribute("data-year"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags"),
          card.textContent
        ].join(" ").toLowerCase();
      }

      function applyFilters() {
        var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = textOf(card);
          var matchedQuery = !query || haystack.indexOf(query) !== -1;
          var matchedFilter = activeFilter === "all" || haystack.indexOf(activeFilter.toLowerCase()) !== -1;
          var matched = matchedQuery && matchedFilter;

          card.hidden = !matched;

          if (matched) {
            visible += 1;
          }
        });

        if (status) {
          status.textContent = visible ? "" : "没有找到匹配影片";
        }
      }

      filterButtons.forEach(function (button) {
        if (button.getAttribute("data-filter-value") === "all") {
          button.classList.add("is-active");
        }

        button.addEventListener("click", function () {
          activeFilter = button.getAttribute("data-filter-value") || "all";

          filterButtons.forEach(function (item) {
            item.classList.toggle("is-active", item === button);
          });

          applyFilters();
        });
      });

      if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
      }
    }
  });
})();
