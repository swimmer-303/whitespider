// stats.js r10 - https://github.com/mrdoob/stats.js

var Stats = function () {
  var timestamp = Date.now();
  var previousTimestamp = timestamp;
  var frameCount = 0;
  var fps = 0;
  var fpsMin = 0;
  var fpsMax = 0;
  var ms = 0;
  var msMin = 0;
  var msMax = 0;
  var frameTime = 0;
  var fpsInterval = 1000 / 60; // 60 FPS
  var fpsGraph = new Array(74);
  var fpsGraphIndex = 0;
  var msGraph = new Array(74);
  var msGraphIndex = 0;
  var statsEl = document.createElement("div");
  statsEl.id = "stats";
  statsEl.addEventListener("mousedown", function (event) {
    event.preventDefault();
    toggleDisplay(!statsEl.style.display);
  }, false);
  statsEl.style.cssText =
    "width:80px;opacity:0.9;cursor:pointer;display:none;";

  var fpsEl = document.createElement("div");
  fpsEl.id = "fps";
  fpsEl.style.cssText =
    "padding:0 0 3px 3px;text-align:left;background-color:#002;";
  statsEl.appendChild(fpsEl);

  var fpsTextEl = document.createElement("div");
  fpsTextEl.id = "fpsText";
  fpsTextEl.style.cssText =
    "color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px;";
  fpsTextEl.innerHTML = "FPS";
  fpsEl.appendChild(fpsTextEl);

  var fpsGraphEl = document.createElement("div");
  fpsGraphEl.id = "fpsGraph";
  fpsGraphEl.style.cssText =
    "position:relative;width:74px;height:30px;background-color:#0ff;";
  for (fpsEl.appendChild(fpsGraphEl); 74 > fpsGraphEl.children.length; ) {
    var spanEl = document.createElement("span");
    spanEl.style.cssText =
      "width:1px;height:30px;float:left;background-color:#113;";
    fpsGraphEl.appendChild(spanEl);
  }

  var msEl = document.createElement("div");
  msEl.id = "ms";
  msEl.style.cssText =
    "padding:0 0 3px 3px;text-align:left;background-color:#020;display:none;";
  statsEl.appendChild(msEl);

  var msTextEl = document.createElement("div");
  msTextEl.id = "msText";
  msTextEl.style.cssText =
    "color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px;";
  msTextEl.innerHTML = "MS";
  msEl.appendChild(msTextEl);

  var msGraphEl = document.createElement("div");
  msGraphEl.id = "msGraph";
  msGraphEl.style.cssText =
    "position:relative;width:74px;height:30px;background-color:#0f0;";
  for (msEl.appendChild(msGraphEl); 74 > msGraphEl.children.length; ) {
    var spanEl = document.createElement("span");
    spanEl.style.cssText =
      "width:1px;height:30px;float:left;background-color:#131;";
    msGraphEl.appendChild(spanEl);
  }

  function toggleDisplay(display) {
    statsEl.style.display = display ? "block" : "none";
  }

  this.domElement = statsEl;
  this.setMode = toggleDisplay;
  this.begin = function () {
    previousTimestamp = timestamp;
  };

  this.end = function () {
    timestamp = Date.now();
    frameTime = timestamp - previousTimestamp;
    frameCount++;

    if (frameTime >= fpsInterval) {
      fps = Math.round(1000 / (frameTime / frameCount));
      fpsMin = Math.min(fpsMin, fps);
      fpsMax = Math.max(fpsMax, fps);

      fpsTextEl.textContent = fps + " FPS (" + fpsMin + "-" + fpsMax + ")";
      var barHeight = Math.min(30, 30 - 30 * (fps / 100));
      fpsGraphEl.appendChild(fpsGraphEl.firstChild).style.height =
        barHeight + "px";

      ms = frameTime;
      msMin = Math.min(msMin, ms);
      msMax = Math.max(msMax, ms);

      var barHeight = Math.min(30, 30 - 30 * (ms / 200));
      msGraphEl.appendChild(msGraphEl.firstChild).style.height =
        barHeight + "px";

      previousTimestamp = timestamp;
      frameCount = 0;
    }

    msTextEl.textContent = ms + " MS (" + msMin + "-" + msMax + ")";

    fpsGraphIndex = (fpsGraphIndex + 1) % fpsGraph.length;
    fpsGraph[fpsGraphIndex] = frameTime;

    msGraphIndex = (msGraphIndex + 1) % msGraph.length;
    msGraph[msGraphIndex] = frameTime;

    return timestamp;
  };

  this.update = function () {
    this.end();
  };
};
