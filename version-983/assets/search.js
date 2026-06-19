(function () {
  var form = document.querySelector('[data-search-form]');
  var input = document.querySelector('[data-search-page-input]');
  var resultBox = document.querySelector('[data-search-results]');
  var defaultTitle = document.querySelector('.search-default-title');
  var defaultGrid = document.querySelector('.search-default-grid');
  if (!form || !input || !resultBox || !window.SEARCH_MOVIES) return;

  var params = new URLSearchParams(window.location.search);
  var initial = params.get('q') || '';
  input.value = initial;

  function escapeText(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[char];
    });
  }

  function render(query) {
    var q = query.trim().toLowerCase();
    resultBox.innerHTML = '';
    if (!q) {
      if (defaultTitle) defaultTitle.style.display = '';
      if (defaultGrid) defaultGrid.style.display = '';
      return;
    }
    if (defaultTitle) defaultTitle.style.display = 'none';
    if (defaultGrid) defaultGrid.style.display = 'none';
    var matches = window.SEARCH_MOVIES.filter(function (movie) {
      var haystack = [movie.title, movie.year, movie.region, movie.type, movie.genre, movie.tags, movie.desc, movie.category].join(' ').toLowerCase();
      return haystack.indexOf(q) !== -1;
    }).slice(0, 80);
    if (!matches.length) {
      resultBox.innerHTML = '<div class="search-empty">没有找到相关内容，可以更换片名、地区、年份或题材关键词。</div>';
      return;
    }
    resultBox.innerHTML = matches.map(function (movie) {
      return '<article class="search-result-card"><img src="' + escapeText(movie.cover) + '" alt="' + escapeText(movie.title) + '" loading="lazy"><div><h3>' + escapeText(movie.title) + '</h3><p>' + escapeText(movie.desc) + '</p><div class="movie-meta">' + escapeText(movie.year) + ' · ' + escapeText(movie.region) + ' · ' + escapeText(movie.genre) + '</div></div><a class="primary-link" href="' + escapeText(movie.url) + '">观看</a></article>';
    }).join('');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var q = input.value.trim();
    var url = q ? 'search.html?q=' + encodeURIComponent(q) : 'search.html';
    window.history.replaceState(null, '', url);
    render(q);
  });

  input.addEventListener('input', function () {
    render(input.value);
  });

  render(initial);
}());
