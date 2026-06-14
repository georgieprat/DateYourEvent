/**
 * APP — wires everything together: loads state, decides which view to
 * show, and handles transitions between the three phases.
 */

const App = {
  init() {
    State.load();

    Swipe.init();
    Battle.init();
    Ranking.init();

    // Resume wherever the user left off, but skip phases that no
    // longer make sense (e.g. fewer than 2 liked events for battles).
    let phase = State.data.phase;
    if (phase === "battle" && State.getLikedEvents().length < 2) {
      phase = "ranking";
    }
    this.showView(phase, { render: true });
  },

  goToSwipe() {
    State.setPhase("swipe");
    Swipe.render();
    this.showView("swipe", { render: false });
  },

  goToBattle() {
    if (State.getLikedEvents().length < 2) {
      this.goToRanking();
      return;
    }
    State.setPhase("battle");
    Battle.render();
    this.showView("battle", { render: false });
  },

  goToRanking() {
    State.setPhase("ranking");
    Ranking.render();
    this.showView("ranking", { render: false });
  },

  showView(phase, { render }) {
    State.setPhase(phase);

    document.querySelectorAll(".view").forEach((el) => {
      el.classList.toggle("is-active", el.id === `view-${phase}`);
    });

    document.querySelectorAll(".step").forEach((el) => {
      const stepPhase = el.dataset.phase;
      const order = ["swipe", "battle", "ranking"];
      el.classList.remove("is-active", "is-done");
      if (stepPhase === phase) {
        el.classList.add("is-active");
      } else if (order.indexOf(stepPhase) < order.indexOf(phase)) {
        el.classList.add("is-done");
      }
    });

    if (render) {
      if (phase === "swipe") Swipe.render();
      if (phase === "battle") Battle.render();
      if (phase === "ranking") Ranking.render();
    }
  }
};

document.addEventListener("DOMContentLoaded", () => App.init());
