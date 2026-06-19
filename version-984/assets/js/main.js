(function () {
    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    ready(function () {
        var toggle = document.querySelector('[data-menu-toggle]');
        var panel = document.querySelector('[data-mobile-panel]');
        if (toggle && panel) {
            toggle.addEventListener('click', function () {
                panel.classList.toggle('is-open');
            });
        }

        document.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('error', function () {
                img.classList.add('image-missing');
            });
        });

        document.querySelectorAll('[data-filter-input]').forEach(function (input) {
            var target = document.querySelector(input.getAttribute('data-filter-input'));
            if (!target) {
                return;
            }
            input.addEventListener('input', function () {
                var keyword = input.value.trim().toLowerCase();
                target.querySelectorAll('[data-card]').forEach(function (card) {
                    var text = card.getAttribute('data-card').toLowerCase();
                    card.style.display = text.indexOf(keyword) >= 0 ? '' : 'none';
                });
            });
        });

        var slider = document.querySelector('[data-hero-slider]');
        if (slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
            var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
            var current = 0;
            var timer = null;

            function show(index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle('is-active', i === current);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle('is-active', i === current);
                });
            }

            function start() {
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5200);
            }

            dots.forEach(function (dot, i) {
                dot.addEventListener('click', function () {
                    if (timer) {
                        window.clearInterval(timer);
                    }
                    show(i);
                    start();
                });
            });

            show(0);
            start();
        }
    });
}());
