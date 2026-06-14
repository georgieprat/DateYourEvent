# Lineup — an event swiping app

A four-phase web app for deciding what to do — and what fits the budget:

1. **Swipe** — go through every event, left for "not interested", right for "interested".
2. **Battle** — events you liked are shown two at a time; pick the one you'd rather attend. Each pick adjusts an Elo-style rating.
3. **Lineup** — your liked events, ranked by rating, shown like a festival lineup poster (headliners at the top, smaller acts below). Tick the ones you want, within a 25-token budget.
4. **Plan** — the events you picked, with a ready-to-share text summary (copy or send via WhatsApp) and a one-click calendar (.ics) download covering everything.

Progress is saved in the browser's `localStorage`, so refreshing the page (or closing the tab) doesn't lose your swipes, battle results, or picks.

## File structure

```
index.html       # page structure, four <section class="view"> blocks
style.css         # all styling (ticket-card design, layout, responsive rules)
js/
  data.js         # EVENTS array — your event list lives here
  state.js        # localStorage persistence, Elo rating, pairing logic, token budget
  cards.js        # shared "ticket card" HTML builder + date/emoji helpers
  swipe.js        # phase 1: swipe stack + drag handling
  battle.js       # phase 2: head-to-head comparisons
  ranking.js      # phase 3: ranked "lineup" list + token-budget picker
  ics.js          # builds the downloadable .ics calendar file
  plan.js         # phase 4: share text + calendar download
  app.js          # ties it together, switches between views
```

## Replacing the sample events with your own list

Open `js/data.js`. Replace the `EVENTS` array with your own events. Each
event is an object like:

```js
{
  id: "evt-001",            // unique string, no spaces
  tokenCost: "12 🪙",        // how much of the 25-token budget this costs
  title: "Event name",
  category: "Music",         // Music | Comedy | Theatre | Art | Sports | Other
  date: "2026-07-15",         // YYYY-MM-DD, OR an array of dates (see below)
  time: "20:00",              // optional, "HH:MM"
  location: "Venue, City",
  price: "€28",               // optional, any string ("Free" works too)
  description: "Short blurb shown on the card.",
  image: ""                   // optional image URL; leave "" for a colored poster panel
}
```

The `category` value controls the color of the card's poster panel (see
the `--cat-*` variables at the top of `style.css` if you want to change
the colors or add new categories).

> Once you've exported your Excel sheet, the easiest path is to convert
> each row into one of these objects (e.g. with a small script, or by
> pasting the data into a spreadsheet-to-JSON tool) and paste the
> resulting array into `js/data.js`.

### Events with multiple possible dates

If an event runs on several dates and the person can pick whichever
suits them, set `date` to an array instead of a single string:

```js
date: ["2026-08-06", "2026-10-18", "2026-10-27", "2026-11-09"]
```

The card shows these as a row of small date pills (e.g. "6 Aug", "18
Oct", ...). The final calendar export adds **one event per date**,
labeled "(option 1 of 4)" etc., so the recipient can add them all and
delete the ones they don't end up choosing.

### Token budget

`tokenCost` controls how much of the 25-token budget (see `TOKEN_BUDGET`
in `js/state.js`) an event uses up in the Lineup phase. Only the leading
number is read, so `"12 🪙"`, `"12 tokens"`, or just `"12"` all work —
the emoji/text is just for display. Checkboxes for events that would
push the total over budget are disabled until something else is
deselected.

To change the budget itself (e.g. for a bigger or smaller gift), edit:

```js
const TOKEN_BUDGET = 25; // in js/state.js
```

## How the ranking works

- Every event you swipe right on starts at an Elo rating of 1000.
- In the battle phase, each pick updates both events' ratings (the
  winner gains points, the loser loses points — more points change
  hands when the "upset" is bigger).
- The app suggests pairing events that have been compared the least,
  and with similar ratings, so comparisons stay meaningful.
- The lineup is simply your liked events sorted by rating, high to low.
- "Refine with more battles" sends you back to phase 2 if you want more
  comparisons; "Start over" clears everything.

## The Plan phase

- "Plan my night" (on the Lineup screen) moves your ticked events to
  the Plan screen.
- The share text is pre-filled into a text box — "Copy text" copies it
  to the clipboard, or "Share on WhatsApp" opens WhatsApp (web or app)
  with the text pre-filled, ready to send.
- "Download calendar file" produces a single `.ics` file with every
  picked event. On iPhone/iPad, opening this file offers to add all the
  events to Calendar at once.

## Running locally

This is a static site — no build step. Just open `index.html` in a
browser, or serve the folder with any static server, e.g.:

```bash
python3 -m http.server
```

then visit `http://localhost:8000`.

## Deploying via GitHub Pages

1. Push `index.html`, `style.css`, and the `js/` folder to your repository.
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source** to "Deploy from a branch".
4. Choose your main branch and the `/ (root)` folder, then save.
5. GitHub will give you a URL like `https://<username>.github.io/<repo>/`
   — that's your live app.

Pages can take a minute or two to update after each push.

