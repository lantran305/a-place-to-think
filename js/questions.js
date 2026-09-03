import { state } from "./app.js";
import {
  pageHeader,
  escapeHTML
} from "./app.js";

export function questionsView() {
  return `
    ${pageHeader(
      "Questions",
      "Things I don't have answers to yet."
    )}

    <div class="entries">

      ${state.questions.map(q => `
        <article class="list-item">

          <div class="date">
            ${escapeHTML(q.status)}
          </div>

          <div>
            <h3 class="item-title">
              ${escapeHTML(q.question)}
            </h3>

            <p class="item-description">
              ${escapeHTML(q.description)}
            </p>
          </div>

          <div class="meta">
            keep thinking
          </div>

        </article>
      `).join("")}

    </div>
  `;
}
