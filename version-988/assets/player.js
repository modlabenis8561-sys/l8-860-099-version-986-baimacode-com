import { H as Hls } from "./hls-vendor-dru42stk.js";

export function createPlayer(streamUrl) {
  const video = document.getElementById("moviePlayer");
  const overlay = document.getElementById("playerOverlay");
  const stage = document.querySelector(".player-stage");
  if (!video || !overlay || !stage || !streamUrl) {
    return;
  }

  let hls = null;
  let attached = false;

  const attach = () => {
    if (attached) {
      return;
    }
    attached = true;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    } else {
      video.src = streamUrl;
    }
  };

  const start = () => {
    attach();
    stage.classList.add("is-playing");
    video.play().catch(() => {});
  };

  overlay.addEventListener("click", start);
  video.addEventListener("click", () => {
    if (video.paused) {
      start();
    }
  });
  video.addEventListener("play", () => {
    stage.classList.add("is-playing");
  });
  window.addEventListener("pagehide", () => {
    if (hls) {
      hls.destroy();
    }
  });
}
