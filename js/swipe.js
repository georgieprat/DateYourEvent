/**
 * SWIPE — view 1. Renders a stack of ticket cards and lets the user
 * swipe right ("interested") or left ("pass"), via drag or buttons.
 */

const Swipe = {
  stackEl: null,
  cardEls: [], // currently rendered card elements, top card last in DOM order... actually first = top
  drag: null,

  init() {
    this.stackEl = document.getElementById("card-stack");

    document.getElementById("btn-pass").addEventListener("click", () => this.decide("out"));
    document.getElementById("btn-interested").addEventListener("click", () => this.decide("in"));
    document.getElementById("btn-undo").addEventListener("click", () => this.undo());
    document.getElementById("btn-to-battle").addEventListener("click", () => {
      App.goToBattle();
    });

    this.render();
  },

  render() {
    this.stackEl.innerHTML = "";
    this.updateProgress();

    const remaining = State.getRemainingEvents();
    const emptyState = document.getElementById("swipe-empty");
    const controls = document.querySelector(".swipe-controls");

    if (remaining.length === 0) {
      emptyState.hidden = false;
      controls.style.display = "none";
      this.setEmptyText();
      this.updateUndoButton();
      return;
    }

    emptyState.hidden = true;
    controls.style.display = "";

    // Render up to 3 cards, top card first in the stack visually but
    // we render the *next* cards first so the current card is on top (last child).
    const visible = remaining.slice(0, 3).reverse();

    visible.forEach((event, i) => {
      const isTop = i === visible.length - 1;
      const depth = visible.length - 1 - i; // 0 = top card

      const card = document.createElement("div");
      card.className = "swipe-card";
      card.dataset.eventId = event.id;
      card.style.transform = `translateY(${depth * 8}px) scale(${1 - depth * 0.03})`;
      card.style.zIndex = String(10 - depth);
      card.style.opacity = depth > 2 ? "0" : "1";

      card.innerHTML =
        buildTicketCardHTML(event) +
        `<div class="swipe-stamp stamp-yes">Going</div>` +
        `<div class="swipe-stamp stamp-no">Pass</div>`;

      if (isTop) {
        this.attachDragHandlers(card, event);
      }

      this.stackEl.appendChild(card);
    });

    this.updateUndoButton();
  },

  setEmptyText() {
    const liked = State.getLikedEvents().length;
    const total = EVENTS.length;
    const text = document.getElementById("swipe-empty-text");
    if (liked === 0) {
      text.textContent = `You went through all ${total} events but didn't mark any as interested. You can go back and undo a few, or restart.`;
      document.getElementById("btn-to-battle").textContent = "See my lineup";
    } else if (liked === 1) {
      text.textContent = `You're interested in 1 event out of ${total}. Since there's nothing to compare it against, we'll take you straight to your lineup.`;
      document.getElementById("btn-to-battle").textContent = "See my lineup";
    } else {
      text.textContent = `You're interested in ${liked} out of ${total} events. Next, we'll show them to you two at a time so you can pick your favorites.`;
      document.getElementById("btn-to-battle").textContent = "Start the battles";
    }
  },

  updateProgress() {
    const total = EVENTS.length;
    const done = Math.min(State.data.swipeIndex, total);
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    document.getElementById("swipe-progress-fill").style.width = pct + "%";
    document.getElementById("swipe-progress-label").textContent = `${done} / ${total}`;
  },

  updateUndoButton() {
    const btn = document.getElementById("btn-undo");
    btn.disabled = !State.canUndo();
    btn.style.opacity = State.canUndo() ? "1" : "0.35";
  },

  // ---- Decision handling -------------------------------------------------

  decide(decision) {
    const topCard = this.stackEl.querySelector(".swipe-card:last-child");
    if (!topCard || topCard.dataset.decided) return;
    topCard.dataset.decided = "true";

    const eventId = topCard.dataset.eventId;

    this.animateOut(topCard, decision);
    State.recordSwipe(eventId, decision);

    // Wait for the exit animation before re-rendering the stack
    setTimeout(() => this.render(), 220);
  },

  undo() {
    if (!State.canUndo()) return;
    State.undoLastSwipe();
    this.render();
  },

  animateOut(card, decision) {
    card.classList.add("dragging");
    requestAnimationFrame(() => {
      card.classList.remove("dragging");
      const x = decision === "in" ? window.innerWidth : -window.innerWidth;
      card.style.transform = `translate(${x}px, -40px) rotate(${decision === "in" ? 20 : -20}deg)`;
      card.style.opacity = "0";
    });
  },

  // ---- Drag handling -------------------------------------------------

  attachDragHandlers(card, event) {
    const onPointerDown = (e) => {
      this.drag = {
        startX: e.clientX,
        startY: e.clientY,
        card,
        moved: false
      };
      card.classList.add("dragging");
      card.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!this.drag || this.drag.card !== card) return;
      const dx = e.clientX - this.drag.startX;
      const dy = e.clientY - this.drag.startY;
      this.drag.moved = true;
      const rotate = dx * 0.08;
      card.style.transform = `translate(${dx}px, ${dy}px) rotate(${rotate}deg)`;

      const yesStamp = card.querySelector(".stamp-yes");
      const noStamp = card.querySelector(".stamp-no");
      const intensity = Math.min(Math.abs(dx) / 120, 1);
      if (dx > 0) {
        yesStamp.style.opacity = String(intensity);
        noStamp.style.opacity = "0";
      } else {
        noStamp.style.opacity = String(intensity);
        yesStamp.style.opacity = "0";
      }
    };

    const onPointerUp = (e) => {
      if (!this.drag || this.drag.card !== card) return;
      const dx = e.clientX - this.drag.startX;
      card.classList.remove("dragging");

      const threshold = 110;
      if (dx > threshold) {
        this.decide("in");
      } else if (dx < -threshold) {
        this.decide("out");
      } else {
        // Snap back
        card.style.transform = "";
        const yesStamp = card.querySelector(".stamp-yes");
        const noStamp = card.querySelector(".stamp-no");
        if (yesStamp) yesStamp.style.opacity = "0";
        if (noStamp) noStamp.style.opacity = "0";
      }
      this.drag = null;
    };

    card.addEventListener("pointerdown", onPointerDown);
    card.addEventListener("pointermove", onPointerMove);
    card.addEventListener("pointerup", onPointerUp);
    card.addEventListener("pointercancel", onPointerUp);
  }
};
