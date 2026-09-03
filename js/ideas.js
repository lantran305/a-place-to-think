import { state } from "./app.js";
import {
  pageHeader,
  escapeHTML
} from "./app.js";

export function ideasView() {
  return `
    ${pageHeader(
      "Ideas",
      "Thoughts I'm still thinking about."
    )}

    <div class="entries">

      ${state.ideas.map(idea => `
        <article class="list-item">

          <div class="date">
            ${escapeHTML(idea.status)}
          </div>

          <div>
            <h3 class="item-title">
              ${escapeHTML(idea.title)}
            </h3>

            <p class="item-description">
              ${escapeHTML(idea.description)}
            </p>
          </div>

          <div class="meta">
            ${idea.thoughts || 0} thoughts
          </div>

        </article>
      `).join("")}

    </div>
  `;
}
