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
    const card = document.createElement("div");
    card.className = "battle-card";
    card.dataset.eventId = event.id;
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Pick: ${event.title}`);
    card.innerHTML = buildTicketCardHTML(event);

    card.addEventListener("click", () => this.choose(event));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.choose(event);
      }
    });

    this.setupDescriptionToggle(card);

    return card;
  },

  // Lets the description collapse to a few lines with a "Show more" /
  // "Show less" toggle. If the text is short enough to fit without
  // folding, the toggle (and its fade) is hidden entirely.
  setupDescriptionToggle(card) {
    const wrap = card.querySelector(".ticket-description-wrap");
    const toggle = card.querySelector(".ticket-description-toggle");
    if (!wrap || !toggle) return;

    requestAnimationFrame(() => {
      if (wrap.scrollHeight <= wrap.clientHeight + 2) {
        wrap.classList.add("no-fold");
        toggle.classList.add("is-hidden");
      }
    });

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const expanded = wrap.classList.toggle("is-expanded");
      toggle.textContent = expanded ? "Show less" : "Show more";
      toggle.setAttribute("aria-expanded", String(expanded));
    });
  },

  choose(winnerEvent) {
    if (!this.currentPair) return;
    const [a, b] = this.currentPair;
    const loserEvent = a.id === winnerEvent.id ? b : a;

    // Quick visual feedback before moving on
    const cards = this.arenaEl.querySelectorAll(".battle-card");
    cards.forEach((card) => {
      if (card.dataset.eventId === winnerEvent.id) {
        card.classList.add("is-winner");
      } else {
        card.classList.add("is-loser");
      }
      card.classList.add("is-disabled");
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
