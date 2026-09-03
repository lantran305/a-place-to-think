import { escapeHTML, formatDate } from "./journal.js";

export function topicsView(state) {
  return `
    <div class="section-heading">
      <div><h1 class="page-title">Topics</h1><p class="page-subtitle">The things I keep coming back to.</p></div>
      <button class="write-btn" id="newTopicBtn" type="button">+ New topic</button>
    </div>
    <div class="topic-grid">
      ${state.topics.length ? state.topics.map((topic, index) => `
        <article class="topic-card">
          <button class="topic-main" data-open-topic="${index}" type="button">
            <h3>${escapeHTML(topic)}</h3><p>A space for thoughts connected to this topic.</p>
          </button>
          <div class="topic-actions">
            <button class="topic-edit" data-edit-topic="${index}" type="button">Edit</button>
            <button class="topic-delete" data-delete-topic="${index}" type="button" aria-label="Delete ${escapeHTML(topic)}">×</button>
          </div>
        </article>`).join("") : `<div class="empty"><strong>No topics yet.</strong><span>Create a topic to start collecting thoughts.</span></div>`}
    </div>
    <div class="section"><div class="quote">Thoughts become more interesting when they begin to connect.</div></div>`;
}

export function topicDetailView(state, index) {
  const topic = state.topics[index];
  if (!topic) return topicsView(state);
  const articles = (state.articles || []).filter(a => a.topic === topic).sort((a,b) => new Date(b.date) - new Date(a.date));
  return `
    <div class="section-heading">
      <div>
        <button class="back" id="backToTopics" type="button">← Topics</button>
        <h1 class="page-title">${escapeHTML(topic)}</h1>
        <p class="page-subtitle">A space for thoughts connected to this topic.</p>
      </div>
      <button class="write-btn" id="addArticleBtn" type="button">+ Add article</button>
    </div>
    ${articles.length ? `<div class="entries">${articles.map(article => `
      <button class="entry" data-article="${escapeHTML(article.id)}" type="button">
        <div class="date">${formatDate(article.date)}</div>
        <div><h3 class="entry-title">${escapeHTML(article.title || "Untitled article")}</h3><p class="entry-preview">${escapeHTML((article.content || "").replace(/\s+/g," ").slice(0,150))}</p></div>
        <div class="meta">article</div>
      </button>`).join("")}</div>` : `<div class="empty"><strong>Nothing here yet.</strong><span>Start writing something about this topic.</span></div>`}`;
}

export function renderArticle(article) {
  return `
    <article class="reading">
      <button class="back" id="backArticleBtn" type="button">← ${escapeHTML(article.topic)}</button>
      <div class="eyebrow">Topic</div>
      <h1>${escapeHTML(article.title || "Untitled article")}</h1>
      <div class="reading-date">${formatDate(article.date)}</div>
      <div class="reading-content">${escapeHTML(article.content)}</div>
    </article>`;
}
