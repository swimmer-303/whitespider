"use strict";
(async () => {
  await new Promise((resolve) => {
    const timer = setInterval(() => {
      if (document.readyState === "complete") {
        clearInterval(timer);
        resolve();
      }
    }, 50);
  });

  const urlParams = new URLSearchParams(window.location.search);
  const url = urlParams.get("url") || "/";
  const name = urlParams.get("name") || "";
  const bios = urlParams.get("bios") || "";
  const type = urlParams.get("type") || "";

  window.stop();
  window.focus();

  if (url === "/") window.history.replaceState(void 0, "", "/");
  if (name.length > 0) document.title = `${name} - WhiteSpider`;

  /**
   * @param {string} url
   */
  async function loadJS(url) {
    return new Promise((resolve, reject) => {
      const elem = document.createElement("script");
      elem.type = "text/javascript";
      elem.src = url;
      elem.async = true;
      elem.defer = true;
      elem.addEventListener("load", resolve);
      elem.addEventListener("error", (event) => {
        reject(new Error(`Error loading ${url}: ${event.message}`));
      });
      document.body.appendChild(elem);
    });
  }

  if (!["flash", "dos", "emu", "").includes(type)) {
    console.error(`Invalid type: ${type}`);
    return;
  }

  switch (type) {
    case "flash":
      {
        await loadJS("/lib/ruffle/ruffle.js");
        const rp = window.RufflePlayer;
        rp.config = Object.create(null);
        const frame = rp.newest().createPlayer();
        document.body.appendChild(frame);
        await frame.load({
          url: url,
          wmode: "opaque",
          scale: "showAll",
          quality: "best",
          autoplay: "auto",
          logLevel: "warn",
          letterbox: "on",
          openUrlMode: "confirm",
          upgradeToHttps: true,
          warnOnUnsupportedContent: true,
        });
      }
      break;
    case "dos":
      {
        await loadJS("lib/jsdos/js-dos.js");
        const frame = document.createElement("div");
        document.body.appendChild(frame);
        window.emulators.pathPrefix = "/lib/jsdos/";
        window.Dos(frame).run(url);
        document.body.removeChild(frame);
      }
      break;
    case "emu":
      {
        await loadJS("lib/emulatorjs/emulator.min.js");
        const emulatorContainer = document.createElement("div");
        document.body.appendChild(emulatorContainer);
        new window.EmulatorJS(
          `${emulatorContainer.outerHTML}`,
          {
            system: urlParams.get("core") || "",
            gameUrl: url,
            biosUrl: bios,
            dataPath: "/lib/emulatorjs/",
            gameName: name,
            startOnLoad: true,
          },
          emulatorContainer
        );
        document.body.removeChild(emulatorContainer);
      }
      break;
    default:
      {
        const frame = document.createElement("embed");
        frame.type = "text/plain";
        frame.width = "1024";
        frame.height = "768";
        frame.src = url;
        document.body.appendChild(frame);
        setTimeout(() => {
          document.body.removeChild(frame);
          window.focus();
          if (url.startsWith("blob:")) URL.revokeObjectURL(url);
          if (bios.startsWith("blob:")) URL.revokeObjectURL(bios);
        }, 5000);
      }
      break;
  }
})();
