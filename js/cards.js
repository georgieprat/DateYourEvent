/**
 * CARDS — shared markup builder for the "ticket stub" card used in both
 * the swipe stack and the battle arena.
 */

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}

/**
 * Builds the inner HTML for a ticket card.
 * Returns a string of HTML — callers wrap it in their own container element.
 */
function buildTicketCardHTML(event) {
  const category = event.category || "Other";
  const dateLabel = formatDate(event.date);
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
        <div class="ticket-meta">
          ${dateLabel ? `<span><strong>${dateLabel}</strong>${event.time ? " · " + event.time : ""}</span>` : ""}
          ${event.location ? `<span>${event.location}</span>` : ""}
        </div>
        ${event.description ? `<p class="ticket-description">${event.description}</p>` : ""}
        ${event.price ? `<span class="ticket-price">${event.price}</span>` : ""}
      </div>
    </div>
  `;
}
