import { escapeHTML } from "./journal.js";

export function ideasView(state) {
  return `
    <div class="section-heading"><div><h1 class="page-title">Ideas</h1><p class="page-subtitle">Thoughts I'm still thinking about.</p></div></div>
    <div class="entries">
      ${state.ideas.map(idea => `
        <article class="list-item">
          <div class="date">${escapeHTML(idea.status)}</div>
          <div><h3 class="item-title">${escapeHTML(idea.title)}</h3><p class="item-description">${escapeHTML(idea.description)}</p></div>
          <div class="meta">${idea.thoughts || 0} thoughts</div>
        </article>`).join("")}
    </div>`;
}
