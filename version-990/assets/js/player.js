import { H as Hls } from './hls.js';

export function initMoviePlayer(videoSrc) {
    var video = document.getElementById('movieVideo');
    var cover = document.getElementById('playerCover');
    var hlsInstance = null;

    if (!video || !videoSrc) {
        return;
    }

    function bindSource() {
        if (video.getAttribute('data-ready') === '1') {
            return;
        }

        video.setAttribute('data-ready', '1');

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = videoSrc;
            return;
        }

        if (Hls && Hls.isSupported()) {
            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(videoSrc);
            hlsInstance.attachMedia(video);
            return;
        }

        video.src = videoSrc;
    }

    function startPlayback() {
        bindSource();

        if (cover) {
            cover.classList.add('hidden');
        }

        var playResult = video.play();

        if (playResult && typeof playResult.catch === 'function') {
            playResult.catch(function () {});
        }
    }

    if (cover) {
        cover.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            startPlayback();
        }
    });

    video.addEventListener('play', function () {
        if (cover) {
            cover.classList.add('hidden');
        }
    });

    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
