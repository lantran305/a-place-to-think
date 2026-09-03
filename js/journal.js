export function entryTitle(entry) {
  return entry.title?.trim() || firstLine(entry.content) || "Untitled thought";
}

export function firstLine(text = "") {
  return text.split("\n").find(line => line.trim())?.trim() || "";
}

export function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export function entryRow(entry) {
  const preview = entry.content?.replace(/\s+/g, " ").trim().slice(0, 150) || "";
  return `
    <button class="entry" data-entry="${escapeHTML(entry.id)}" type="button">
      <div class="date">${formatDate(entry.date)}</div>
      <div>
        <h3 class="entry-title">${escapeHTML(entryTitle(entry))}</h3>
        <p class="entry-preview">${escapeHTML(preview)}</p>
      </div>
      <div class="meta">${entry.mood ? escapeHTML(entry.mood) : "thought"}</div>
    </button>`;
}

export function journalView(state) {
  const entries = [...state.journal].sort((a, b) => new Date(b.date) - new Date(a.date));
  return `
    <div class="section-heading">
      <div><h1 class="page-title">Journal</h1><p class="page-subtitle">Write it down.</p></div>
      <button class="write-btn" id="pageAction" type="button">+ New thought</button>
    </div>
    ${entries.length ? `<div class="entries">${entries.map(entryRow).join("")}</div>` : `
      <div class="empty"><strong>Your journal is empty.</strong><span>You don't need the right words. Just begin.</span></div>`}`;
}

export function renderEntry(entry) {
  return `
    <article class="reading">
      <button class="back" id="backBtn" type="button">← Back</button>
      <div class="eyebrow">Journal</div>
      <h1>${escapeHTML(entryTitle(entry))}</h1>
      <div class="reading-date">${formatDate(entry.date)}${entry.mood ? ` · ${escapeHTML(entry.mood)}` : ""}</div>
      <div class="reading-content">${escapeHTML(entry.content)}</div>
    </article>`;
}
