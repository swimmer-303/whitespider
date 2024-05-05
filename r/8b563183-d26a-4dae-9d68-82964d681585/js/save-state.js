function exportSaveState() {
  const state = {};

  if (
    gameState === 1 ||
    gameState === -1 ||
    (gameState === 0 && localStorage.getItem("saveState") !== null)
  ) {
    state = {
      hex: {
        ...MainHex,
        blocks: MainHex.blocks.map((a) => {
          return a.map((b) => {
            const descaledBlock = descaleBlock(b);
            return { ...descaledBlock };
          });
        }),
      },
      blocks: blocks.map((b) => {
        const descaledBlock = descaleBlock(b);
        return { ...descaledBlock };
      }),
      score,
      wavegen: waveone,
      gdx,
      gdy,
      comboTime: settings.comboTime,
    };
  }

  localStorage.setItem("highscores", JSON.stringify(highscores));

  return JSON.stringify(state);
}

function descaleBlock(b) {
  b.distFromHex /= settings.scale;
  return b;
}

function writeHighScores() {
  highscores.sort((a, b) => {
    a = parseInt(a, 10);
    b = parseInt(b, 10);
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });

  highscores = highscores.slice(0, 3);
  localStorage.setItem("highscores", JSON.stringify(highscores));
}

function clearSaveState() {
  localStorage.setItem("saveState", "{}");
}

function isStateSaved() {
  return (
    localStorage.getItem("saveState") !== "{}" &&
    localStorage.getItem("saveState") !== null
  );
}
