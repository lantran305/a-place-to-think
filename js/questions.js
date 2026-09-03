import { escapeHTML } from "./journal.js";

export function questionsView(state) {
  return `
    <div class="section-heading"><div><h1 class="page-title">Questions</h1><p class="page-subtitle">Things I don't have answers to yet.</p></div></div>
    <div class="entries">
      ${state.questions.map(q => `
        <article class="list-item">
          <div class="date">${escapeHTML(q.status)}</div>
          <div><h3 class="item-title">${escapeHTML(q.question)}</h3><p class="item-description">${escapeHTML(q.description)}</p></div>
          <div class="meta">keep thinking</div>
        </article>`).join("")}
    </div>`;
}
