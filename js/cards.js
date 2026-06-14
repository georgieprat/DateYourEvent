/**
 * CARDS — shared markup builder for the "ticket stub" card used in both
 * the swipe stack and the battle arena.
 *
 * "date" on an event can be either:
 *   - a single string:  "2026-07-15"
 *   - an array of strings: ["2026-08-06", "2026-10-18", ...]
 * Arrays are shown as a row of small date pills.
 *
 * "location" can be either:
 *   - a single string (or one-element array): same venue for every date
 *   - an array matching "date" in length: location[i] is the venue for date[i]
 * If an event has more than one distinct venue, the card shows the
 * first one plus a "+N more venues" badge (full list on hover/long-press).
 */

function parseDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

// Long form: "Mon, 6 Aug" — used for single-date events and the pills' title attr
function formatDate(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return dateStr || "";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}

// Short form: "6 Aug" or "6 Aug '27" if the year differs from the current year
function formatDateShort(dateStr) {
  const d = parseDate(dateStr);
  if (!d) return dateStr || "";
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: sameYear ? undefined : "2-digit"
  });
}

/**
 * Builds the "when" markup for a ticket card: either a single date line
 * or a row of date pills for multi-date events.
 */
function buildDateMarkup(event) {
  const date = event.date;

  if (Array.isArray(date)) {
    if (date.length === 0) return "";
    if (date.length === 1) return buildSingleDateLine(date[0], event.time);

    const pills = date
      .map((d) => `<span class="date-pill" title="${formatDate(d)}">${formatDateShort(d)}</span>`)
      .join("");

    return `
      <div class="date-pills-block">
        <span class="date-pills-label">${date.length} dates</span>
        <div class="date-pills-row">${pills}</div>
      </div>
    `;
  }

  return buildSingleDateLine(date, event.time);
}

function buildSingleDateLine(dateStr, time) {
  const dateLabel = formatDate(dateStr);
  if (!dateLabel) return "";
  return `<div class="ticket-meta"><span><strong>${dateLabel}</strong>${time ? " · " + time : ""}</span></div>`;
}

/**
 * Compact "when" summary for the ranking list — a single date, or
 * "N dates" for multi-date events.
 */
function formatDateSummary(date) {
  if (Array.isArray(date)) {
    if (date.length === 0) return "";
    if (date.length === 1) return formatDate(date[0]);
    return `${date.length} dates`;
  }
  return formatDate(date);
}

/**
 * Full date listing for share text — every date, comma separated,
 * so the recipient can see all the options.
 */
function formatDatesForShare(date) {
  if (Array.isArray(date)) {
    if (date.length === 0) return "";
    if (date.length === 1) return formatDate(date[0]);
    return date.map(formatDateShort).join(", ");
  }
  return formatDate(date);
}

const CATEGORY_EMOJI = {
  Music: "🎵",
  Comedy: "🎤",
  Theatre: "🎭",
  Art: "🎨",
  Sports: "⚽",
  Other: "🎟️"
};

function getCategoryEmoji(category) {
  return CATEGORY_EMOJI[category] || CATEGORY_EMOJI.Other;
}

/**
 * "location" on an event can be either:
 *   - a single string (or a one-element array): applies to every date
 *   - an array matching "date" in length: location[i] goes with date[i]
 *
 * Returns the venue that corresponds to a given date index.
 */
function getLocationForDate(event, index) {
  const location = event.location;
  if (Array.isArray(location)) {
    if (location.length <= 1) return location[0] || "";
    return location[index] !== undefined ? location[index] : location[0];
  }
  return location || "";
}

/**
 * Unique, order-preserving list of venues an event takes place at,
 * across all of its dates.
 */
function getUniqueLocations(event) {
  const location = event.location;
  if (Array.isArray(location)) {
    return [...new Set(location.filter(Boolean))];
  }
  return location ? [location] : [];
}

/**
 * Location line for a ticket card: shows the first venue, plus a small
 * "+N more venues" badge (full list in a tooltip) if the event happens
 * at more than one place depending on the date.
 */
function buildLocationMarkup(event) {
  const unique = getUniqueLocations(event);
  if (unique.length === 0) return "";
  if (unique.length === 1) {
    return `<div class="ticket-meta"><span>${unique[0]}</span></div>`;
  }
  const extra = unique.length - 1;
  const tooltip = unique.join(" • ");
  return `<div class="ticket-meta"><span>${unique[0]}</span><span class="location-extra" title="${tooltip}">+${extra} more venue${extra > 1 ? "s" : ""}</span></div>`;
}

/**
 * Compact venue summary for the ranking and plan lists.
 */
function formatLocationSummary(event) {
  const unique = getUniqueLocations(event);
  if (unique.length === 0) return "";
  if (unique.length === 1) return unique[0];
  return `${unique[0]} +${unique.length - 1} more`;
}

/**
 * Builds the inner HTML for a ticket card.
 * Returns a string of HTML — callers wrap it in their own container element.
 */
function buildTicketCardHTML(event) {
  const category = event.category || "Other";
  const bgImage = event.image
    ? `style="background-image: url('${event.image}')"`
    : "";

  return `
    <div class="ticket-card">
      <div class="ticket-poster" data-category="${category}" ${bgImage}>
        <span class="ticket-category">${category}</span>
        <h2 class="ticket-title">${event.title}</h2>
      </div>
      <div class="ticket-perf"></div>
      <div class="ticket-stub">
        ${buildDateMarkup(event)}
        ${buildLocationMarkup(event)}
        ${event.description ? `<p class="ticket-description">${event.description}</p>` : ""}
        <div class="ticket-tags">
          ${event.tokenCost ? `<span class="ticket-token">${event.tokenCost}</span>` : ""}
        </div>
      </div>
    </div>
  `;
}
