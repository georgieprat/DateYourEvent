/**
 * BATTLE — view 2. Shows two "liked" events side by side; the user taps
 * the one they'd rather attend. Results feed an Elo-style rating used
 * to build the final ranking.
 */

const Battle = {
  arenaEl: null,
  currentPair: null,

  init() {
    this.arenaEl = document.getElementById("battle-arena");

    document.getElementById("btn-finish-battle").addEventListener("click", () => {
      App.goToRanking();
    });
    document.getElementById("btn-battle-to-ranking").addEventListener("click", () => {
      App.goToRanking();
    });

    this.render();
  },

  render() {
    const liked = State.getLikedEvents();
    const empty = document.getElementById("battle-empty");
    const footer = document.querySelector(".battle-footer");
    const intro = document.querySelector("#view-battle .view-intro");
    const progressRow = document.querySelector("#view-battle .progress-row");

    if (liked.length < 2) {
      this.arenaEl.style.display = "none";
      footer.style.display = "none";
      intro.style.display = "none";
      progressRow.style.display = "none";
      empty.hidden = false;

      const h2 = empty.querySelector("h2");
      const p = empty.querySelector("p");
      if (liked.length === 0) {
        h2.textContent = "Nothing to compare";
        p.textContent = "You didn't mark any events as interested, so there's nothing to rank either.";
      } else {
        h2.textContent = "Just one pick — no contest";
        p.textContent = "You only marked one event as interested, so it goes straight to the top of your lineup.";
      }
      return;
    }

    this.arenaEl.style.display = "";
    footer.style.display = "";
    intro.style.display = "";
    progressRow.style.display = "";
    empty.hidden = true;

    State.extendBattleTarget();

    if (State.isBattleCapReached()) {
      App.goToRanking();
      return;
    }

    this.updateProgress();
    this.renderPair();
  },

  renderPair() {
    const pair = State.pickNextPair();
    this.currentPair = pair;
    this.arenaEl.innerHTML = "";

    if (!pair) return;

    const [left, right] = pair;

    const leftBtn = this.buildCardButton(left);
    const rightBtn = this.buildCardButton(right);

    const divider = document.createElement("div");
    divider.className = "battle-divider";
    divider.innerHTML = `<span class="line"></span><span class="vs">vs</span><span class="line"></span>`;

    this.arenaEl.appendChild(leftBtn);
    this.arenaEl.appendChild(divider);
    this.arenaEl.appendChild(rightBtn);
  },

  buildCardButton(event) {
    const btn = document.createElement("button");
    btn.className = "battle-card";
    btn.dataset.eventId = event.id;
    btn.innerHTML = buildTicketCardHTML(event);
    btn.addEventListener("click", () => this.choose(event));
    return btn;
  },

  choose(winnerEvent) {
    if (!this.currentPair) return;
    const [a, b] = this.currentPair;
    const loserEvent = a.id === winnerEvent.id ? b : a;

    // Quick visual feedback before moving on
    const buttons = this.arenaEl.querySelectorAll(".battle-card");
    buttons.forEach((btn) => {
      if (btn.dataset.eventId === winnerEvent.id) {
        btn.classList.add("is-winner");
      } else {
        btn.classList.add("is-loser");
      }
      btn.disabled = true;
    });

    State.recordBattleResult(winnerEvent.id, loserEvent.id);

    setTimeout(() => {
      this.updateProgress();
      if (State.isBattleCapReached()) {
        App.goToRanking();
      } else {
        this.renderPair();
      }
    }, 200);
  },

  updateProgress() {
    const total = State.data.battleTarget ?? State.recommendedBattleCount();
    const done = State.data.totalBattles;
    const pct = total === 0 ? 100 : Math.min(100, Math.round((done / total) * 100));
    document.getElementById("battle-progress-fill").style.width = pct + "%";
    document.getElementById("battle-progress-label").textContent =
      total === 0 ? `${done} done` : `${done} / ${total}`;
  }
};
