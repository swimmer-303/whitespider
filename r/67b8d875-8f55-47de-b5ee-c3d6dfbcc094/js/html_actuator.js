class HTMLActuator {
  constructor() {
    this.tileContainer = document.querySelector(".tile-container");
    this.scoreContainer = document.querySelector(".score-container");
    this.bestContainer = document.querySelector(".best-container");
    this.messageContainer = document.querySelector(".game-message");
    this.sharingContainer = document.querySelector(".score-sharing");
    this.score = 0;
  }

  actuate(grid, metadata) {
    this.clearContainer(this.tileContainer);

    grid.cells.forEach((column) => {
      column.forEach((cell) => {
        if (cell) {
          this.addTile(cell);
        }
      });
    });

    this.updateScore(metadata.score);
    this.updateBestScore(metadata.bestScore);

    if (metadata.over) {
      this.message(false); // You lose
    } else if (metadata.won) {
      this.message(true); // You win!
    }
  }

  continue() {
    this.clearMessage();
  }

  clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  addTile(tile) {
    const wrapper = document.createElement("div");
    const inner = document.createElement("div");
    const position = tile.previousPosition || { x: tile.x, y: tile.y };
    const positionClass = this.positionClass(position);

    const classes = ["tile", `tile-${tile.value}`, positionClass];

    if (tile.value > 2048) {
      classes.push("tile-super");
    }

    wrapper.classList.add(...classes);

    inner.classList.add("tile-inner");
    inner.textContent = tile.value;

    if (tile.previousPosition) {
      requestAnimationFrame(() => {
        classes[2] = this.positionClass({ x: tile.x, y: tile.y });
        this.applyClasses(wrapper, classes);
      });
    } else if (tile.mergedFrom) {
      classes.push("tile-merged");
      wrapper.classList.add(...classes);

      tile.mergedFrom.forEach((merged) => {
        this.addTile(merged);
      });
    } else {
      classes.push("tile-new");
      wrapper.classList.add(...classes);
    }

    wrapper.appendChild(inner);
    this.tileContainer.appendChild(wrapper);
  }

  applyClasses(element, classes) {
    element.classList.add(...classes);
  }

  normalizePosition(position) {
    return { x: position.x + 1, y: position.y + 1 };
  }

  positionClass(position) {
    position = this.normalizePosition(position);
    return `tile-position-${position.x}-${position.y}`;
  }

  updateScore(score) {
    this.clearContainer(this.scoreContainer);

    const difference = score - this.score;
    this.score = score;

    this.scoreContainer.textContent = this.score;

    if (difference > 0) {
      const addition = document.createElement("div");
      addition.classList.add("score-addition");
      addition.textContent = `+${difference}`;

      this.scoreContainer.insertAdjacentHTML("beforeend", addition.outerHTML);
    }
  }

  updateBestScore(bestScore) {
    this.bestContainer.textContent = bestScore;
  }

  message(won) {
    const type = won ? "game-won" : "game-over";
    const messageText = won ? "You win!" : "Game over!";

    this.messageContainer.classList.add(type);
    this.messageContainer.querySelector("p").textContent = messageText;

    this.clearContainer(this.sharingContainer);
    this.sharingContainer.appendChild(this.scoreTweetButton());
    twttr.widgets.load();
  }

  clearMessage() {
    this.messageContainer.classList.remove("game-won");
    this.messageContainer.classList.remove("game-over");
  }

  scoreTweetButton() {
    const tweet = document.createElement("a");
    tweet.classList.add("twitter-share-button");
    tweet.setAttribute("href", "https://twitter.com/share");
    tweet.setAttribute("data-via", "3kh0");
    tweet.setAttribute("data-url", "http://git.io/lrmEpA");
    tweet.setAttribute("data-counturl", "http://3kh0.github.io/");
    tweet.textContent = "Tweet";

    const text = `I scored ${this.score} points at 1, a game where you join numbers to score high! #1game`;
    tweet.setAttribute("data-text", text);

    return tweet;
  }
}
