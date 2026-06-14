/**
 * PLAN — view 4. Shows the events picked within the token budget,
 * generates a shareable text summary (copy or WhatsApp), and offers
 * a single .ics calendar download covering everything picked.
 */

const Plan = {
  init() {
    document.getElementById("btn-plan-back").addEventListener("click", () => {
      App.goToRanking();
    });
    document.getElementById("btn-copy-text").addEventListener("click", () => this.copyText());
    document.getElementById("btn-download-ics").addEventListener("click", () => this.downloadCalendar());

    this.render();
  },

  render() {
    const selected = State.getSelectedEvents();
    const listEl = document.getElementById("plan-list");
    const empty = document.getElementById("plan-empty");
    const shareSection = document.querySelector(".plan-share");
    const calendarSection = document.querySelector(".plan-calendar");

    listEl.innerHTML = "";

    if (selected.length === 0) {
      empty.hidden = false;
      listEl.style.display = "none";
      shareSection.style.display = "none";
      calendarSection.style.display = "none";
      return;
    }

    empty.hidden = true;
    listEl.style.display = "";
    shareSection.style.display = "";
    calendarSection.style.display = "";

    selected.forEach((event, index) => {
      listEl.appendChild(this.buildItem(event, index));
    });

    const shareText = this.buildShareText(selected);
    document.getElementById("plan-text").value = shareText;
    document.getElementById("btn-whatsapp").href = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  },

  buildItem(event, index) {
    const li = document.createElement("li");
    li.className = "plan-item";

    const dateLabel = formatDateSummary(event.date);
    const metaParts = [dateLabel, event.location].filter(Boolean);

    li.innerHTML = `
      <span class="plan-emoji" aria-hidden="true">${getCategoryEmoji(event.category)}</span>
      <div>
        <p class="plan-title">${event.title}</p>
        <div class="plan-meta">${metaParts.map((p) => `<span>${p}</span>`).join("")}</div>
      </div>
      <span class="plan-cost">${event.tokenCost || ""}</span>
    `;

    return li;
  },

  buildShareText(selected) {
    const lines = [];
    lines.push("🎁 My picks:");
    lines.push("");

    selected.forEach((event, i) => {
      lines.push(`${i + 1}. ${getCategoryEmoji(event.category)} ${event.title}`);
      const dateLabel = formatDatesForShare(event.date);
      if (dateLabel) lines.push(`   📅 ${dateLabel}`);
      if (event.location) lines.push(`   📍 ${event.location}`);
      lines.push("");
    });

    lines.push(`Total: ${State.getUsedTokens()} / ${TOKEN_BUDGET} 🪙`);
    return lines.join("\n");
  },

  copyText() {
    const textarea = document.getElementById("plan-text");

    const fallback = () => {
      textarea.select();
      try {
        document.execCommand("copy");
      } catch (e) {
        /* ignore */
      }
      textarea.blur();
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textarea.value).then(
        () => this.flashButton("btn-copy-text", "Copied!"),
        () => {
          fallback();
          this.flashButton("btn-copy-text", "Copied!");
        }
      );
    } else {
      fallback();
      this.flashButton("btn-copy-text", "Copied!");
    }
  },

  flashButton(id, text) {
    const btn = document.getElementById(id);
    const original = btn.dataset.label || btn.textContent;
    btn.dataset.label = original;
    btn.textContent = text;
    setTimeout(() => {
      btn.textContent = original;
    }, 1500);
  },

  downloadCalendar() {
    const selected = State.getSelectedEvents();
    if (selected.length === 0) return;
    downloadICS(selected, "my-plan.ics");
  }
};
