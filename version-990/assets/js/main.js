(function () {
    var navButton = document.querySelector('[data-nav-toggle]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (navButton && mobileMenu) {
        navButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('open');
        });
    }

    var carousels = document.querySelectorAll('[data-hero-carousel]');

    carousels.forEach(function (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        var index = 0;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === index);
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                showSlide(dotIndex);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }
    });

    var searchInput = document.querySelector('[data-search-input]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var emptyState = document.querySelector('[data-empty-state]');
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
    var activeFilter = 'all';

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function applyFilters() {
        var query = searchInput ? normalize(searchInput.value) : '';
        var visibleCount = 0;

        cards.forEach(function (card) {
            var haystack = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-meta'));
            var cardCategory = card.getAttribute('data-category') || '';
            var matchedKeyword = !query || haystack.indexOf(query) !== -1;
            var matchedCategory = activeFilter === 'all' || cardCategory === activeFilter;
            var visible = matchedKeyword && matchedCategory;

            card.style.display = visible ? '' : 'none';

            if (visible) {
                visibleCount += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle('show', visibleCount === 0);
        }
    }

    if (searchInput && cards.length) {
        searchInput.addEventListener('input', applyFilters);
    }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            activeFilter = button.getAttribute('data-filter') || 'all';
            filterButtons.forEach(function (item) {
                item.classList.toggle('active', item === button);
            });
            applyFilters();
        });
    });
})();
