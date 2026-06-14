/**
 * RANKING — view 3. Shows liked events sorted by their Elo rating,
 * styled like a festival lineup poster: headliners big at the top,
 * support acts smaller further down. Each item can also be ticked
 * on/off for the final plan, within the token budget.
 */

const Ranking = {
  listEl: null,

  init() {
    this.listEl = document.getElementById("ranking-list");

    document.getElementById("btn-to-plan").addEventListener("click", () => {
      App.goToPlan();
    });
    document.getElementById("btn-more-battles").addEventListener("click", () => {
      App.goToBattle();
    });
    document.getElementById("btn-restart").addEventListener("click", () => {
      if (confirm("Start over? This clears all your swipes, battle results, and picks.")) {
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
    const toPlanBtn = document.getElementById("btn-to-plan");
    const budgetBar = document.getElementById("budget-bar");

    this.listEl.innerHTML = "";

    if (ranked.length === 0) {
      empty.hidden = false;
      this.listEl.style.display = "none";
      moreBattlesBtn.style.display = "none";
      toPlanBtn.style.display = "none";
      budgetBar.style.display = "none";
      return;
    }

    empty.hidden = true;
    this.listEl.style.display = "";
    moreBattlesBtn.style.display = ranked.length >= 2 ? "" : "none";
    toPlanBtn.style.display = "";
    budgetBar.style.display = "";

    ranked.forEach((event, index) => {
      this.listEl.appendChild(this.buildItem(event, index));
    });

    this.updateBudgetBar();
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

    const dateLabel = formatDateSummary(event.date);
    const metaParts = [];
    if (dateLabel) metaParts.push(dateLabel);
    if (event.location) metaParts.push(event.location);
    if (event.category) metaParts.push(event.category);

    const selected = State.isSelected(event.id);
    const affordable = State.canAfford(event);
    li.dataset.affordable = affordable ? "true" : "false";

    li.innerHTML = `
      <span class="ranking-rank">${rank}</span>
      <div>
        <span class="ranking-eyebrow">${eyebrow}</span>
        <p class="ranking-title">${event.title}</p>
        <div class="ranking-meta">${metaParts.map((p) => `<span>${p}</span>`).join("")}</div>
      </div>
      <label class="ranking-pick">
        <input type="checkbox" ${selected ? "checked" : ""} ${affordable ? "" : "disabled"} aria-label="Pick ${event.title}" />
        <span class="ranking-pick-cost">${event.tokenCost || ""}</span>
      </label>
    `;

    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener("change", () => {
      State.toggleSelected(event.id);
      this.render();
    });

    return li;
  },

  updateBudgetBar() {
    const used = State.getUsedTokens();
    const pct = Math.min(100, Math.round((used / TOKEN_BUDGET) * 100));
    const fill = document.getElementById("budget-fill");
    fill.style.width = pct + "%";
    fill.classList.toggle("is-full", used >= TOKEN_BUDGET);
    document.getElementById("budget-label").textContent = `${used} / ${TOKEN_BUDGET} 🪙`;
  }
};
