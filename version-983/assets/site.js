(function () {
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  document.addEventListener('error', function (event) {
    if (event.target && event.target.tagName === 'IMG') {
      event.target.classList.add('is-hidden-image');
    }
  }, true);

  var slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    var current = 0;
    var show = function (index) {
      current = index % slides.length;
      if (current < 0) current = slides.length - 1;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    };
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(parseInt(dot.getAttribute('data-slide'), 10) || 0);
      });
    });
    if (slides.length > 1) {
      window.setInterval(function () {
        show(current + 1);
      }, 5600);
    }
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
  panels.forEach(function (panel) {
    var input = panel.querySelector('[data-filter-input]');
    var year = panel.querySelector('[data-filter-year]');
    var type = panel.querySelector('[data-filter-type]');
    var grid = document.querySelector('[data-filter-grid]');
    if (!grid) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
    var apply = function () {
      var q = input ? input.value.trim().toLowerCase() : '';
      var y = year ? year.value : '';
      var t = type ? type.value : '';
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-title') + ' ' + card.getAttribute('data-category') + ' ' + card.getAttribute('data-region') + ' ' + card.getAttribute('data-year')).toLowerCase();
        var ok = (!q || text.indexOf(q) !== -1) && (!y || card.getAttribute('data-year') === y) && (!t || text.indexOf(t.toLowerCase()) !== -1);
        card.style.display = ok ? '' : 'none';
      });
    };
    [input, year, type].forEach(function (el) {
      if (el) el.addEventListener('input', apply);
      if (el) el.addEventListener('change', apply);
    });
  });
}());
