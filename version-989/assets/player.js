(function () {
    function initPlayer(videoId, buttonId, streamUrl) {
        var video = document.getElementById(videoId);
        var button = document.getElementById(buttonId);
        var hls = null;
        var started = false;

        if (!video || !button || !streamUrl) {
            return;
        }

        function playVideo() {
            var result = video.play();

            if (result && typeof result.catch === "function") {
                result.catch(function () {});
            }
        }

        function start() {
            if (started) {
                playVideo();
                return;
            }

            started = true;
            button.classList.add("is-hidden");

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
                video.addEventListener("loadedmetadata", playVideo, { once: true });
                playVideo();
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (!data || !data.fatal) {
                        return;
                    }

                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    } else {
                        hls.destroy();
                    }
                });
                return;
            }

            video.src = streamUrl;
            playVideo();
        }

        button.addEventListener("click", start);
        video.addEventListener("click", function () {
            if (!started) {
                start();
            }
        });
    }

    window.initPlayer = initPlayer;
})();
