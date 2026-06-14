/**
 * RANKING — view 3. Shows liked events sorted by their Elo rating,
 * styled like a festival lineup poster: headliners big at the top,
 * support acts smaller further down.
 */

const Ranking = {
  listEl: null,

  init() {
    this.listEl = document.getElementById("ranking-list");

    document.getElementById("btn-more-battles").addEventListener("click", () => {
      App.goToBattle();
    });
    document.getElementById("btn-restart").addEventListener("click", () => {
      if (confirm("Start over? This clears all your swipes and battle results.")) {
        State.reset();
        App.goToSwipe();
      }
    });

    this.render();
  },

  render() {
    const ranked = State.getRankedEvents();
    const empty = document.getElementById("ranking-empty");
    const moreBattlesBtn = document.getElementById("btn-more-battles");

    this.listEl.innerHTML = "";

    if (ranked.length === 0) {
      empty.hidden = false;
      this.listEl.style.display = "none";
      moreBattlesBtn.style.display = "none";
      return;
    }

    empty.hidden = true;
    this.listEl.style.display = "";
    moreBattlesBtn.style.display = ranked.length >= 2 ? "" : "none";

    ranked.forEach((event, index) => {
      this.listEl.appendChild(this.buildItem(event, index));
    });
  },

  buildItem(event, index) {
    const rank = index + 1;
    const li = document.createElement("li");
    li.className = "ranking-item";

    let tier = "support";
    let eyebrow = "On the bill";
    if (rank <= 2) {
      tier = "headliner";
      eyebrow = "Headliner";
    } else if (rank <= 5) {
      tier = "featured";
      eyebrow = "Featured";
    }

    li.dataset.tier = tier;

    const dateLabel = formatDate(event.date);
    const metaParts = [];
    if (dateLabel) metaParts.push(dateLabel);
    if (event.location) metaParts.push(event.location);
    if (event.category) metaParts.push(event.category);

    li.innerHTML = `
      <span class="ranking-rank">${rank}</span>
      <div>
        <span class="ranking-eyebrow">${eyebrow}</span>
        <p class="ranking-title">${event.title}</p>
        <div class="ranking-meta">${metaParts.map((p) => `<span>${p}</span>`).join("")}</div>
      </div>
    `;

    return li;
  }
};
