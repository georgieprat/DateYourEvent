/**
 * STATE — central app state, persisted to localStorage.
 *
 * Shape of the persisted object:
 * {
 *   version: 1,
 *   phase: "swipe" | "battle" | "ranking",
 *   swipeIndex: number,                 // position in EVENTS during swipe phase
 *   decisions: { [eventId]: "in" | "out" },
 *   ratings:   { [eventId]: number },   // Elo-style rating, only for "in" events
 *   comparisons: { [eventId]: number }, // how many battles each event has been in
 *   lastPair: [eventId, eventId] | null,
 *   totalBattles: number
 * }
 */

const STORAGE_KEY = "event-swipe-app:v1";
const STARTING_RATING = 1000;
const K_FACTOR = 32;

const State = {
  data: null,

  load() {
    let saved = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw);
    } catch (e) {
      console.warn("Could not read saved state, starting fresh.", e);
    }

    if (saved && saved.version === 1) {
      this.data = saved;
    } else {
      this.data = {
        version: 1,
        phase: "swipe",
        swipeIndex: 0,
        decisions: {},
        ratings: {},
        comparisons: {},
        history: [],
        lastPair: null,
        totalBattles: 0
      };
    }
    return this.data;
  },

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn("Could not save state.", e);
    }
  },

  reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* ignore */
    }
    this.load();
  },

  // ---- Swipe phase helpers -------------------------------------------------

  recordSwipe(eventId, decision) {
    this.data.decisions[eventId] = decision; // "in" or "out"
    if (decision === "in") {
      this.data.ratings[eventId] = STARTING_RATING;
      this.data.comparisons[eventId] = 0;
    }
    this.data.history.push(eventId);
    this.data.swipeIndex += 1;
    this.save();
  },

  canUndo() {
    return this.data.history.length > 0;
  },

  undoLastSwipe() {
    if (!this.canUndo()) return;
    const lastId = this.data.history.pop();
    delete this.data.decisions[lastId];
    delete this.data.ratings[lastId];
    delete this.data.comparisons[lastId];
    this.data.swipeIndex -= 1;
    this.save();
  },

  getRemainingEvents() {
    return EVENTS.slice(this.data.swipeIndex);
  },

  isSwipeDone() {
    return this.data.swipeIndex >= EVENTS.length;
  },

  // ---- Battle phase helpers -------------------------------------------------

  getLikedEvents() {
    return EVENTS.filter((e) => this.data.decisions[e.id] === "in");
  },

  getRating(eventId) {
    return this.data.ratings[eventId] ?? STARTING_RATING;
  },

  getComparisonCount(eventId) {
    return this.data.comparisons[eventId] ?? 0;
  },

  // Pick the next pair of liked events to compare.
  // Prioritizes events with the fewest comparisons so far,
  // and avoids immediately repeating the last pair.
  pickNextPair() {
    const liked = this.getLikedEvents();
    if (liked.length < 2) return null;

    const sorted = [...liked].sort(
      (a, b) => this.getComparisonCount(a.id) - this.getComparisonCount(b.id)
    );

    const minCount = this.getComparisonCount(sorted[0].id);
    const leastCompared = sorted.filter(
      (e) => this.getComparisonCount(e.id) === minCount
    );

    // Candidate pool: the least-compared events, plus a few extras
    // so we have enough variety to pick a non-repeating, rating-close pair.
    const pool = leastCompared.length >= 2
      ? leastCompared
      : sorted.slice(0, Math.min(sorted.length, Math.max(4, leastCompared.length + 3)));

    let bestPair = null;
    let bestDiff = Infinity;

    for (let i = 0; i < pool.length; i++) {
      for (let j = i + 1; j < pool.length; j++) {
        const a = pool[i];
        const b = pool[j];
        const isLastPair =
          this.data.lastPair &&
          this.data.lastPair.includes(a.id) &&
          this.data.lastPair.includes(b.id);
        if (isLastPair && pool.length > 2) continue;

        const diff = Math.abs(this.getRating(a.id) - this.getRating(b.id));
        if (diff < bestDiff) {
          bestDiff = diff;
          bestPair = [a, b];
        }
      }
    }

    if (!bestPair) {
      // Fallback: any two distinct liked events
      const a = liked[Math.floor(Math.random() * liked.length)];
      let b;
      do {
        b = liked[Math.floor(Math.random() * liked.length)];
      } while (b.id === a.id && liked.length > 1);
      bestPair = [a, b];
    }

    // Randomize left/right placement so one side doesn't always "win" visually
    if (Math.random() < 0.5) bestPair.reverse();

    return bestPair;
  },

  recordBattleResult(winnerId, loserId) {
    const rWinner = this.getRating(winnerId);
    const rLoser = this.getRating(loserId);

    const expectedWinner = 1 / (1 + Math.pow(10, (rLoser - rWinner) / 400));
    const expectedLoser = 1 - expectedWinner;

    this.data.ratings[winnerId] = Math.round(rWinner + K_FACTOR * (1 - expectedWinner));
    this.data.ratings[loserId] = Math.round(rLoser + K_FACTOR * (0 - expectedLoser));

    this.data.comparisons[winnerId] = this.getComparisonCount(winnerId) + 1;
    this.data.comparisons[loserId] = this.getComparisonCount(loserId) + 1;

    this.data.lastPair = [winnerId, loserId];
    this.data.totalBattles += 1;
    this.save();
  },

  // Recommended minimum number of battles before the ranking is meaningful.
  recommendedBattleCount() {
    const n = this.getLikedEvents().length;
    if (n < 2) return 0;
    // Roughly: everyone gets compared a couple of times on average.
    return Math.max(n - 1, Math.ceil(n * 1.5));
  },

  // ---- Ranking phase helpers -------------------------------------------------

  getRankedEvents() {
    return [...this.getLikedEvents()].sort(
      (a, b) => this.getRating(b.id) - this.getRating(a.id)
    );
  },

  // ---- Phase transitions -------------------------------------------------

  setPhase(phase) {
    this.data.phase = phase;
    this.save();
  }
};
