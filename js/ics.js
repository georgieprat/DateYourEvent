/**
 * ICS — builds a .ics (iCalendar) file from a list of events, so the
 * whole plan can be added to Calendar (iOS, Google, Outlook, ...) in
 * one go.
 *
 * Events with a single "date" become one VEVENT.
 * Events with multiple possible "date" entries become one VEVENT per
 * date, labeled "(option X of N)" so the recipient can pick one and
 * delete the rest.
 *
 * Times are written as floating local time (no timezone), which is
 * how most calendar apps interpret an .ics with no TZID -- they show
 * the event at that clock time in the device's own timezone.
 */

function pad2(n) {
  return String(n).padStart(2, "0");
}

function dateToICSDate(dateStr) {
  return dateStr.replace(/-/g, "");
}

function addDaysToICSDate(dateStr, days) {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`;
}

function dateTimeToICS(dateStr, timeStr) {
  const datePart = dateToICSDate(dateStr);
  const [hh, mm] = timeStr.split(":").map((p) => parseInt(p, 10) || 0);
  return `${datePart}T${pad2(hh)}${pad2(mm)}00`;
}

function addHoursToICSDateTime(icsDateTime, hours) {
  const y = +icsDateTime.slice(0, 4);
  const m = +icsDateTime.slice(4, 6) - 1;
  const d = +icsDateTime.slice(6, 8);
  const hh = +icsDateTime.slice(9, 11);
  const mi = +icsDateTime.slice(11, 13);
  const dt = new Date(y, m, d, hh, mi, 0);
  dt.setHours(dt.getHours() + hours);
  return `${dt.getFullYear()}${pad2(dt.getMonth() + 1)}${pad2(dt.getDate())}T${pad2(dt.getHours())}${pad2(dt.getMinutes())}00`;
}

function nowUTCStamp() {
  const d = new Date();
  return `${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}T${pad2(d.getUTCHours())}${pad2(d.getUTCMinutes())}${pad2(d.getUTCSeconds())}Z`;
}

function escapeICSText(str) {
  return String(str)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

const DEFAULT_DURATION_HOURS = 2;

/**
 * Builds the full .ics file content for a list of events.
 */
function buildICS(events) {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Lineup//Event Plan//EN", "CALSCALE:GREGORIAN"];
  const stamp = nowUTCStamp();

  events.forEach((event) => {
    const dates = Array.isArray(event.date) ? event.date.filter(Boolean) : [event.date].filter(Boolean);

    dates.forEach((dateStr, i) => {
      const multi = dates.length > 1;
      const summary = multi ? `${event.title} (option ${i + 1} of ${dates.length})` : event.title;

      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${event.id}-${i}@lineup-app`);
      lines.push(`DTSTAMP:${stamp}`);

      if (event.time) {
        const start = dateTimeToICS(dateStr, event.time);
        const end = addHoursToICSDateTime(start, DEFAULT_DURATION_HOURS);
        lines.push(`DTSTART:${start}`);
        lines.push(`DTEND:${end}`);
      } else {
        lines.push(`DTSTART;VALUE=DATE:${dateToICSDate(dateStr)}`);
        lines.push(`DTEND;VALUE=DATE:${addDaysToICSDate(dateStr, 1)}`);
      }

      lines.push(`SUMMARY:${escapeICSText(summary)}`);
      const location = getLocationForDate(event, i);
      if (location) lines.push(`LOCATION:${escapeICSText(location)}`);

      let description = event.description || "";
      if (event.price) description += (description ? "\n" : "") + `Price: ${event.price}`;
      if (multi) {
        description += (description ? "\n" : "") + `One of ${dates.length} possible dates -- pick one and delete the others.`;
      }
      if (description) lines.push(`DESCRIPTION:${escapeICSText(description)}`);

      lines.push("END:VEVENT");
    });
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

/**
 * Triggers a browser download of the .ics file for the given events.
 */
function downloadICS(events, filename) {
  const content = buildICS(events);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "lineup.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}
