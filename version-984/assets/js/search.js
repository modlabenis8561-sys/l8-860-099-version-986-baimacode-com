(function () {
    function escapeHtml(value) {
        return String(value).replace(/[&<>"]/g, function (char) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;'
            }[char];
        });
    }

    function render(items, query) {
        var target = document.querySelector('[data-search-results]');
        var count = document.querySelector('[data-search-count]');
        if (!target) {
            return;
        }
        var keyword = query.trim().toLowerCase();
        var results = keyword ? items.filter(function (item) {
            return item.text.toLowerCase().indexOf(keyword) >= 0;
        }).slice(0, 96) : items.slice(0, 48);
        if (count) {
            count.textContent = String(results.length);
        }
        target.innerHTML = results.map(function (item) {
            return '<article class="movie-card" data-card="' + escapeHtml(item.text) + '">' +
                '<a class="card-poster" href="' + escapeHtml(item.href) + '">' +
                '<img src="' + escapeHtml(item.cover) + '" alt="' + escapeHtml(item.title) + '">' +
                '<span class="badge">' + escapeHtml(item.category) + '</span>' +
                '<span class="score-badge">' + escapeHtml(item.rating) + '</span>' +
                '<span class="play-hover">▶</span>' +
                '</a>' +
                '<div class="card-body">' +
                '<h2 class="card-title"><a href="' + escapeHtml(item.href) + '">' + escapeHtml(item.title) + '</a></h2>' +
                '<p class="card-desc">' + escapeHtml(item.desc) + '</p>' +
                '<div class="card-meta"><span>' + escapeHtml(item.year) + '</span><span>' + escapeHtml(item.region) + '</span></div>' +
                '</div>' +
                '</article>';
        }).join('');
        target.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('error', function () {
                img.classList.add('image-missing');
            });
        });
    }

    function init() {
        var input = document.querySelector('[data-search-input]');
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        if (input) {
            input.value = query;
            input.addEventListener('input', function () {
                render(window.SEARCH_ITEMS || [], input.value);
            });
        }
        render(window.SEARCH_ITEMS || [], query);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}());
