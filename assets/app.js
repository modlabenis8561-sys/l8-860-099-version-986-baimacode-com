(function() {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function setupImages() {
        document.querySelectorAll('img').forEach(function(img) {
            function mark() {
                if (!img.naturalWidth) {
                    img.classList.add('image-missing');
                }
            }
            img.addEventListener('error', function() {
                img.classList.add('image-missing');
            });
            if (img.complete) {
                mark();
            }
        });
    }

    function setupMenu() {
        var button = document.querySelector('[data-menu-toggle]');
        var panel = document.querySelector('[data-mobile-panel]');
        if (!button || !panel) {
            return;
        }
        button.addEventListener('click', function() {
            panel.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function() {
                show(current + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        if (prev) {
            prev.addEventListener('click', function() {
                show(current - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function() {
                show(current + 1);
                start();
            });
        }
        dots.forEach(function(dot, index) {
            dot.addEventListener('click', function() {
                show(index);
                start();
            });
        });
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function setupSearch() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
        inputs.forEach(function(input) {
            var area = input.closest('main') ? input.closest('main').querySelector('[data-search-area]') : document;
            if (!area) {
                area = document;
            }
            var cards = Array.prototype.slice.call(area.querySelectorAll('[data-card]'));
            var empty = area.querySelector('[data-empty-state]');
            function apply() {
                var keyword = input.value.trim().toLowerCase();
                var visible = 0;
                cards.forEach(function(card) {
                    var haystack = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
                    var match = !keyword || haystack.indexOf(keyword) !== -1;
                    card.classList.toggle('is-filtered-out', !match);
                    if (match) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle('is-visible', visible === 0);
                }
            }
            input.addEventListener('input', apply);
            apply();
        });
    }

    function setupPlayer() {
        var video = document.querySelector('[data-player="video"]');
        var button = document.querySelector('[data-player="button"]');
        if (!video || typeof playbackUrl === 'undefined') {
            return;
        }
        var attached = false;
        var hlsInstance = null;

        function attach() {
            if (attached) {
                return;
            }
            attached = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = playbackUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(playbackUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = playbackUrl;
            }
        }

        function play() {
            attach();
            if (button) {
                button.classList.add('is-hidden');
            }
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function() {});
            }
        }

        if (button) {
            button.addEventListener('click', play);
        }
        video.addEventListener('click', function() {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener('play', function() {
            if (button) {
                button.classList.add('is-hidden');
            }
        });
        video.addEventListener('pause', function() {
            if (button && video.currentTime === 0) {
                button.classList.remove('is-hidden');
            }
        });
        window.addEventListener('beforeunload', function() {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    ready(function() {
        setupImages();
        setupMenu();
        setupHero();
        setupSearch();
        setupPlayer();
    });
})();
