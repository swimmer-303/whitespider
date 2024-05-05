function UnityProgress(gameInstance, progress) {
  if (typeof gameInstance !== 'object' || gameInstance === null) {
    console.error('gameInstance is not a valid object');
    return;
  }

  if (typeof progress !== 'number' || progress < 0 || progress > 1) {
    console.error('progress is not a valid number between 0 and 1');
    return;
  }

  const splashScreenStyle = gameInstance.Module.splashScreenStyle;
  const container = gameInstance.container;

  if (!gameInstance.logo) {
    gameInstance.logo = createElementWithClass('div', `logo ${splashScreenStyle}`);
    container.appendChild(gameInstance.logo);
  }

  if (!gameInstance.progress) {
    gameInstance.progress = createElementWithClass('div', `progress ${splashScreenStyle}`);
    const empty = createElementWithClass('div', 'empty');
    const full = createElementWithClass('div', 'full');
    gameInstance.progress.appendChild(empty);
    gameInstance.progress.appendChild(full);
    container.appendChild(gameInstance.progress);
  }

  gameInstance.progress.full.style.width = `${progress * 100}%`;
  gameInstance.progress.empty.style.width = `${(1 - progress) * 100}%`;

  if (progress === 1) {
    gameInstance.logo.style.display = 'none';
    gameInstance.progress.style.display = 'none';
  } else {
    gameInstance.logo.style.display = '';
    gameInstance.progress.style.display = '';
  }
}

function createElementWithClass(tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = '';
  element.style.transition = 'width 0.5s ease';
  return element;
}
