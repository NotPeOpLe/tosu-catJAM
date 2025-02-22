let realtimeBPM;
let currentBeatmap;
let catJAMEl = document.getElementById("catJAM");
let catJAM = catJAMEl.getAnimations()[0];
let ws;
let running = false;

const app = () => {
  ws = new WebSocket("ws://127.0.0.1:24050/websocket/v2");

  // connection failed retry
  ws.onerror = app;

  ws.onopen = () => {
    running = true;
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (realtimeBPM !== data.beatmap.stats.bpm.realtime) {
      realtimeBPM = data.beatmap.stats.bpm.realtime;
      catJAM.cancel(); // reset animation
      catJAM.updatePlaybackRate(realtimeBPM / 124);
      catJAM.play();
    }
  };
};

document.addEventListener("animationstart", () => {
  catJAM = catJAMEl.getAnimations()[0];

  if (!running) {
    app();
  }
});
