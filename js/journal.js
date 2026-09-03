import { state } from "./app.js";
import {
  escapeHTML,
  formatDate,
  firstLine,
  emptyState
} from "./app.js";

export function entryRow(entry) {
  const title =
    entry.title?.trim() ||
    firstLine(entry.content) ||
    "Untitled thought";

  const preview =
    entry.content?.replace(/\s+/g, " ").slice(0, 150) || "";

  return `
    <button
      class="entry"
      data-entry="${entry.id}"
      style="width:100%;background:none;border:0;text-align:left"
    >
      <div class="date">
        ${formatDate(entry.date)}
      </div>

      <div>
        <h3 class="entry-title">
          ${escapeHTML(title)}
        </h3>

        <p class="entry-preview">
          ${escapeHTML(preview)}
        </p>
      </div>

      <div class="meta">
        ${entry.mood ? escapeHTML(entry.mood) : "thought"}
      </div>
    </button>
  `;
}

export function journalView() {
  const entries = [...state.journal]
    .sort(
      (a, b) =>
        new Date(b.date) - new Date(a.date)
    );

  return `
    <div class="section-heading">
      <div>
        <h1 class="page-title">Journal</h1>
        <p class="page-subtitle">Write it down.</p>
      </div>

      <button
        class="write-btn"
        id="pageAction"
      >
        + New thought
      </button>
    </div>

    ${
      entries.length
        ? `
          <div class="entries">
            ${entries.map(entryRow).join("")}
          </div>
        `
        : emptyState(
            "Your journal is empty.",
            "You don't need the right words. Just begin."
          )
    }
  `;
}

export function showEntry(id) {
  const entry = state.journal.find(
    item => item.id === id
  );

  if (!entry) return;

  document.getElementById("app").innerHTML = `
    <article class="reading">

      <button
        class="back"
        id="backBtn"
      >
        ← Back
      </button>

      <div class="eyebrow">
        Journal
      </div>

      <h1>
        ${
          escapeHTML(
            entry.title?.trim() ||
            firstLine(entry.content) ||
            "Untitled thought"
          )
        }
      </h1>

      <div class="reading-date">
        ${formatDate(entry.date)}
        ${
          entry.mood
            ? " · " + escapeHTML(entry.mood)
            : ""
        }
      </div>

      <div class="reading-content">
        ${escapeHTML(entry.content)}
      </div>

    </article>
  `;

  document
    .getElementById("backBtn")
    .addEventListener("click", () => {
      location.reload();
    });
}

export function bindJournalEvents() {
  document
    .querySelectorAll("[data-entry]")
    .forEach(button => {

      button.addEventListener("click", () => {
        showEntry(
          button.dataset.entry
        );
      });

    });
}
