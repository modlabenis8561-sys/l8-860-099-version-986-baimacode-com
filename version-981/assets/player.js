(function () {
  function initMoviePlayer(streamUrl) {
    var shell = document.querySelector("[data-player]");

    if (!shell) {
      return;
    }

    var video = shell.querySelector("video");
    var playButton = shell.querySelector("[data-play]");
    var message = shell.querySelector("[data-player-message]");
    var loaded = false;
    var hls = null;

    function showMessage(text) {
      if (message) {
        message.textContent = text || "";
      }
    }

    function loadVideo() {
      if (loaded || !video || !streamUrl) {
        return;
      }

      loaded = true;

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.ERROR, function (_, data) {
          if (data && data.fatal) {
            showMessage("播放暂时不可用，请稍后再试");
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else {
        showMessage("播放暂时不可用，请稍后再试");
      }
    }

    function startVideo() {
      loadVideo();

      if (playButton) {
        playButton.classList.add("is-hidden");
      }

      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          if (playButton) {
            playButton.classList.remove("is-hidden");
          }
        });
      }
    }

    if (playButton) {
      playButton.addEventListener("click", startVideo);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (!loaded || video.paused) {
          startVideo();
        } else {
          video.pause();
        }
      });

      video.addEventListener("play", function () {
        if (playButton) {
          playButton.classList.add("is-hidden");
        }
      });
    }

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
