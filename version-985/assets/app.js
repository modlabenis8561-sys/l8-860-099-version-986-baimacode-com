(function() {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
        menuButton.addEventListener("click", function() {
            mobileNav.classList.toggle("is-open");
        });
    }

    document.querySelectorAll("[data-hero]").forEach(function(hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
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
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function() {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function(dot) {
            dot.addEventListener("click", function() {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });

        if (prev) {
            prev.addEventListener("click", function() {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function() {
                show(current + 1);
                start();
            });
        }

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    });

    document.querySelectorAll("[data-filter-panel]").forEach(function(panel) {
        var root = panel.parentElement;
        var input = panel.querySelector("[data-filter-input]");
        var typeSelect = panel.querySelector("[data-filter-type]");
        var yearSelect = panel.querySelector("[data-filter-year]");
        var genreSelect = panel.querySelector("[data-filter-genre]");
        var empty = panel.querySelector("[data-empty-state]");
        var cards = Array.prototype.slice.call(root.querySelectorAll(".searchable-card"));

        function normalize(value) {
            return String(value || "").trim().toLowerCase();
        }

        function apply() {
            var keyword = normalize(input && input.value);
            var type = typeSelect ? typeSelect.value : "";
            var year = yearSelect ? yearSelect.value : "";
            var genre = genreSelect ? genreSelect.value : "";
            var visible = 0;

            cards.forEach(function(card) {
                var searchText = normalize(card.getAttribute("data-search"));
                var cardType = card.getAttribute("data-type") || "";
                var cardYear = card.getAttribute("data-year") || "";
                var cardGenre = card.getAttribute("data-genre") || "";
                var matched = true;

                if (keyword && searchText.indexOf(keyword) === -1) {
                    matched = false;
                }

                if (type && cardType !== type) {
                    matched = false;
                }

                if (year && cardYear !== year) {
                    matched = false;
                }

                if (genre && cardGenre !== genre) {
                    matched = false;
                }

                card.hidden = !matched;
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        [input, typeSelect, yearSelect, genreSelect].forEach(function(control) {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });

        var params = new URLSearchParams(window.location.search);
        var q = params.get("q");
        if (q && input) {
            input.value = q;
        }

        apply();
    });
}());
