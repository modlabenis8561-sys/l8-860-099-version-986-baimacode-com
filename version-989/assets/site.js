(function () {
    function onReady(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    onReady(function () {
        var menuButton = document.querySelector(".menu-toggle");
        var mobileNav = document.querySelector(".mobile-nav");

        if (menuButton && mobileNav) {
            menuButton.addEventListener("click", function () {
                mobileNav.classList.toggle("is-open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var prev = document.querySelector("[data-hero-prev]");
        var next = document.querySelector("[data-hero-next]");
        var activeIndex = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            activeIndex = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === activeIndex);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === activeIndex);
            });
        }

        function startTimer() {
            if (timer) {
                clearInterval(timer);
            }

            if (slides.length > 1) {
                timer = setInterval(function () {
                    showSlide(activeIndex + 1);
                }, 5200);
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
                startTimer();
            });
        });

        if (prev) {
            prev.addEventListener("click", function () {
                showSlide(activeIndex - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                showSlide(activeIndex + 1);
                startTimer();
            });
        }

        showSlide(0);
        startTimer();

        Array.prototype.slice.call(document.querySelectorAll("[data-search-panel]")).forEach(function (panel) {
            var targetSelector = panel.getAttribute("data-search-target");
            var root = targetSelector ? document.querySelector(targetSelector) : document;
            var input = panel.querySelector("[data-search-input]");
            var year = panel.querySelector("[data-year-filter]");
            var type = panel.querySelector("[data-type-filter]");
            var cards = root ? Array.prototype.slice.call(root.querySelectorAll(".movie-card, .ranking-card")) : [];
            var empty = panel.parentElement ? panel.parentElement.querySelector(".empty-state") : null;

            function normalize(value) {
                return String(value || "").toLowerCase().trim();
            }

            function applyFilter() {
                var keyword = normalize(input ? input.value : "");
                var yearValue = normalize(year ? year.value : "");
                var typeValue = normalize(type ? type.value : "");
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-type"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-tags")
                    ].join(" "));
                    var matchedKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                    var matchedYear = !yearValue || normalize(card.getAttribute("data-year")) === yearValue;
                    var matchedType = !typeValue || normalize(card.getAttribute("data-type")).indexOf(typeValue) !== -1;
                    var matched = matchedKeyword && matchedYear && matchedType;

                    card.style.display = matched ? "" : "none";

                    if (matched) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            if (input) {
                input.addEventListener("input", applyFilter);
            }

            if (year) {
                year.addEventListener("change", applyFilter);
            }

            if (type) {
                type.addEventListener("change", applyFilter);
            }
        });
    });
})();
