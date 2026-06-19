(function () {
    function setupPlayer(root) {
        var video = root.querySelector('video');
        var playLayer = root.querySelector('[data-play-layer]');
        if (!video) {
            return;
        }

        var source = video.getAttribute('data-src');
        var loaded = false;
        var hls = null;

        function load() {
            if (loaded || !source) {
                return;
            }
            loaded = true;
            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else {
                video.src = source;
            }
        }

        function play() {
            load();
            if (playLayer) {
                playLayer.classList.add('is-hidden');
            }
            var started = video.play();
            if (started && typeof started.catch === 'function') {
                started.catch(function () {
                    if (playLayer) {
                        playLayer.classList.remove('is-hidden');
                    }
                });
            }
        }

        if (playLayer) {
            playLayer.addEventListener('click', play);
        }
        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener('play', function () {
            if (playLayer) {
                playLayer.classList.add('is-hidden');
            }
        });
        video.addEventListener('pause', function () {
            if (playLayer && video.currentTime === 0) {
                playLayer.classList.remove('is-hidden');
            }
        });
        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            document.querySelectorAll('[data-player]').forEach(setupPlayer);
        });
    } else {
        document.querySelectorAll('[data-player]').forEach(setupPlayer);
    }
}());
