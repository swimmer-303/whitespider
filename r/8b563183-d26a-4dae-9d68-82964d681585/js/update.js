// Remember to update the history function to show the respective iter speeds
function update(dt) {
  MainHex.dt = dt;

  if (gameState !== 1) return;

  waveone.update();
  checkAndUpdateTimeScored(MainHex, waveone, 1000);

  updateBlockDistFromHex(blocks, dt, settings.scale);
  checkAndConsolidateBlocks(MainHex.blocks);
  removeDeletedBlocks(MainHex.blocks);
  updateBlockSettledProperty(MainHex.blocks);
  checkAndRemoveBlocks(blocks);

  MainHex.ct += dt;
}

function checkAndUpdateTimeScored(mainObj, obj, interval) {
  if (mainObj.ct - obj.prevTimeScored > interval) {
    obj.prevTimeScored = mainObj.ct;
  }
}

function updateBlockDistFromHex(blocks, dt, scale) {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    if (!block.settled) {
      if (!block.initializing) block.distFromHex -= block.iter * dt * scale;
    } else if (!block.removed) {
      block.removed = 1;
    }
  }
}

function checkAndConsolidateBlocks(blocks) {
  for (let i = 0; i < blocks.length; i++) {
    for (let j = 0; j < blocks[i].length; j++) {
      const block = blocks[i][j];

      if (block.checked === 1) {
        consolidateBlocks(MainHex, block.attachedLane, block.getIndex());
        block.checked = 0;
      }
    }
  }
}

function removeDeletedBlocks(blocks) {
  for (let i = 0; i < blocks.length; i++) {
    let lowestDeletedIndex = 99;

    for (let j = 0; j < blocks[i].length; j++) {
      const block = blocks[i][j];

      if (block.deleted === 2) {
        blocks[i].splice(j, 1);
        blockDestroyed();

        if (j < lowestDeletedIndex) lowestDeletedIndex = j;
        j--;
      }
    }

    if (lowestDeletedIndex < blocks[i].length) {
      for (let j = lowestDeletedIndex; j < blocks[i].length; j++) {
        blocks[i][j].settled = 0;
      }
    }
  }
}

function updateBlockSettledProperty(blocks) {
  for (let i = 0; i < blocks.length; i++) {
    for (let j = 0; j < blocks[i].length; j++) {
      const block = blocks[i][j];

      if (!block.settled) {
        MainHex.doesBlockCollide(block, j, blocks[i]);
        block.distFromHex -= block.iter * dt * settings.scale;
      }
    }
  }
}

function checkAndRemoveBlocks(blocks) {
  for (let i = 0; i < blocks.length; i++) {
    for (let j = 0; j < blocks[i].length; j++) {
      const block = blocks[i][j];

      if (block.removed === 1) {
        blocks.splice(i, 1);
        i--;
        break;
      }
    }
  }
}
