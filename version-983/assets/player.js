(function () {
  window.setupMoviePlayer = function (source) {
    var video = document.querySelector('[data-player-video]');
    var overlay = document.querySelector('[data-player-overlay]');
    var button = document.querySelector('[data-player-button]');
    var hls = null;
    var ready = false;

    if (!video || !overlay || !source) return;

    function attach() {
      if (ready) return;
      ready = true;
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal) return;
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
          } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            hls.destroy();
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        video.src = source;
      }
    }

    function start() {
      attach();
      overlay.classList.add('hidden');
      video.setAttribute('controls', 'controls');
      var playPromise = video.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {
          overlay.classList.remove('hidden');
        });
      }
    }

    overlay.addEventListener('click', start);
    if (button) {
      button.addEventListener('click', function (event) {
        event.stopPropagation();
        start();
      });
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
    window.addEventListener('beforeunload', function () {
      if (hls) hls.destroy();
    });
  };
}());
