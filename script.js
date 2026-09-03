const STORAGE_KEY = "a-place-to-think-journal";

const defaultIdeas = [
  {
    id: "idea-1",
    title: "Why do people need to be understood?",
    description: "A thought about understanding, validation and human connection.",
    status: "Exploring",
    thoughts: 0
  },
  {
    id: "idea-2",
    title: "What does it mean to grow up?",
    description: "A space for thoughts about change, responsibility and becoming.",
    status: "Developing",
    thoughts: 0
  }
];

const defaultQuestions = [
  {
    id: "question-1",
    question: "Can people truly change?",
    description: "A question that keeps returning in different forms.",
    status: "Open"
  },
  {
    id: "question-2",
    question: "What makes something meaningful?",
    description: "Still thinking about this.",
    status: "Exploring"
  }
];

const defaultTopics = [
  {
    name: "Love",
    description: "Thoughts about intimacy, attachment, and the ways we love."
  },
  {
    name: "People",
    description: "Observations about people, relationships, and human nature."
  },
  {
    name: "Growth",
    description: "Thoughts about change, becoming, and understanding myself."
  }
];

let state = loadState();
let currentView = "home";
let currentTopicIndex = null;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (saved) {
      const topics = (saved.topics || defaultTopics).map(topic => {
        if (typeof topic === "string") {
          const defaultTopic = defaultTopics.find(
            item => item.name === topic
          );

          return defaultTopic || {
            name: topic,
            description: "A space for thoughts connected to this topic."
          };
        }

        return topic;
      });

      return {
        journal: saved.journal || [],
        ideas: saved.ideas || defaultIdeas,
        questions: saved.questions || defaultQuestions,
        topics,
        articles: saved.articles || []
      };
    }
  } catch {}

  return {
    journal: [],
    ideas: defaultIdeas,
    questions: defaultQuestions,
    topics: defaultTopics,
    articles: []
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(dateString));
}

function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function firstLine(text = "") {
  return text.split("\n").find(line => line.trim())?.trim() || "";
}

function emptyState(title, text) {
  return `
    <div class="empty">
      <strong>${escapeHTML(title)}</strong>
      <span>${escapeHTML(text)}</span>
    </div>
  `;
}

function render() {
  const root = document.getElementById("app");

  document.querySelectorAll(".nav button").forEach(btn => {
    btn.classList.toggle(
      "active",
      btn.dataset.view === currentView
    );
  });

  if (currentView === "home") root.innerHTML = homeView();
  if (currentView === "journal") root.innerHTML = journalView();
  if (currentView === "ideas") root.innerHTML = ideasView();
  if (currentView === "questions") root.innerHTML = questionsView();
  if (currentView === "topics") root.innerHTML = topicsView();
  if (currentView === "topic-detail") {
    root.innerHTML = topicDetailView(currentTopicIndex);
  }

  bindViewEvents();
}

function pageHeader(title, subtitle, buttonText = "") {
  return `
    <div class="section-heading">
      <div>
        <h1 class="page-title">${escapeHTML(title)}</h1>
        <p class="page-subtitle">${escapeHTML(subtitle)}</p>
      </div>
      ${
        buttonText
          ? `<button class="write-btn" id="pageAction">${escapeHTML(buttonText)}</button>`
          : ""
      }
    </div>
  `;
}

function homeView() {
  const recent = [...state.journal]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return `
    <section class="hero">
      <div class="eyebrow">Private thinking journal</div>
      <h1>A Place to Think</h1>
      <p class="tagline">A quiet place for thoughts to unfold.</p>
    </section>

    <section class="quote">
      Writing is a way of making space inside my head.
    </section>

    <section class="section">
      <div class="section-heading">
        <div>
          <h2 class="page-title" style="font-size:32px">Recently</h2>
          <p class="page-subtitle">Small things worth keeping.</p>
        </div>
        <button class="text-link" data-view="journal">
          View journal →
        </button>
      </div>

      ${
        recent.length
          ? `<div class="entries">${recent.map(entry => entryRow(entry)).join("")}</div>`
          : emptyState(
              "Nothing written yet.",
              "Start with whatever is on your mind."
            )
      }
    </section>
  `;
}

function entryRow(entry) {
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
      <div class="date">${formatDate(entry.date)}</div>

      <div>
        <h3 class="entry-title">${escapeHTML(title)}</h3>
        <p class="entry-preview">${escapeHTML(preview)}</p>
      </div>

      <div class="meta">
        ${entry.mood ? escapeHTML(entry.mood) : "thought"}
      </div>
    </button>
  `;
}

function journalView() {
  const entries = [...state.journal].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return `
    ${pageHeader("Journal", "Write it down.", "+ New thought")}

    ${
      entries.length
        ? `<div class="entries">${entries.map(entry => entryRow(entry)).join("")}</div>`
        : emptyState(
            "Your journal is empty.",
            "You don't need the right words. Just begin."
          )
    }
  `;
}

function ideasView() {
  return `
    ${pageHeader("Ideas", "Thoughts I'm still thinking about.")}

    <div class="entries">
      ${state.ideas
        .map(
          idea => `
            <article class="list-item">
              <div class="date">${escapeHTML(idea.status)}</div>

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
          `
        )
        .join("")}
    </div>
  `;
}

function questionsView() {
  return `
    ${pageHeader("Questions", "Things I don't have answers to yet.")}

    <div class="entries">
      ${state.questions
        .map(
          q => `
            <article class="list-item">
              <div class="date">${escapeHTML(q.status)}</div>

              <div>
                <h3 class="item-title">
                  ${escapeHTML(q.question)}
                </h3>

                <p class="item-description">
                  ${escapeHTML(q.description)}
                </p>
              </div>

              <div class="meta">keep thinking</div>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

/* ---------- TOPICS ---------- */

function topicsView() {
  return `
    <div class="section-heading">
      <div>
        <h1 class="page-title">Topics</h1>
        <p class="page-subtitle">
          The things I keep coming back to.
        </p>
      </div>

      <button class="write-btn" id="newTopicBtn">
        + New topic
      </button>
    </div>

    <div class="topic-grid">
      ${
        state.topics.length
          ? state.topics
              .map(
                (topic, index) => `
                  <article class="topic-card">

                    <div
                      class="topic-main"
                      data-open-topic="${index}"
                    >
                      <h3>${escapeHTML(topic.name)}</h3>

                      <p>
                        ${escapeHTML(
                          topic.description ||
                            "A space for thoughts connected to this topic."
                        )}
                      </p>
                    </div>

                    <div class="topic-actions">
                      <button
                        class="topic-edit"
                        data-edit-topic="${index}"
                      >
                        Edit
                      </button>

                      <button
                        class="topic-delete"
                        data-delete-topic="${index}"
                      >
                        ×
                      </button>
                    </div>

                  </article>
                `
              )
              .join("")
          : emptyState(
              "No topics yet.",
              "Create a topic to start collecting thoughts."
            )
      }
    </div>

    <div class="section">
      <div class="quote">
        Thoughts become more interesting when they begin to connect.
      </div>
    </div>
  `;
}

function topicDetailView(index) {
  const topic = state.topics[index];

  if (!topic) {
    currentView = "topics";
    return topicsView();
  }

  const topicName = topic.name;

  const articles = (state.articles || [])
    .filter(article => article.topic === topicName)
    .sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

  return `
    <div class="section-heading">

      <div>
        <button class="back" id="backToTopics">
          ← Topics
        </button>

        <h1 class="page-title">
          ${escapeHTML(topicName)}
        </h1>

        <p class="page-subtitle">
          ${escapeHTML(
            topic.description ||
              "Thoughts and writing connected to this topic."
          )}
        </p>
      </div>

      <button class="write-btn" id="addArticleBtn">
        + Add article
      </button>

    </div>

    ${
      articles.length
        ? `
          <div class="entries">
            ${articles
              .map(
                article => `
                  <button
                    class="entry"
                    data-article="${article.id}"
                    style="width:100%;background:none;border:0;text-align:left"
                  >
                    <div class="date">
                      ${formatDate(article.date)}
                    </div>

                    <div>
                      <h3 class="entry-title">
                        ${escapeHTML(
                          article.title || "Untitled article"
                        )}
                      </h3>

                      <p class="entry-preview">
                        ${escapeHTML(
                          article.content
                            .replace(/\s+/g, " ")
                            .slice(0, 150)
                        )}
                      </p>
                    </div>

                    <div class="meta">article</div>
                  </button>
                `
              )
              .join("")}
          </div>
        `
        : emptyState(
            "Nothing here yet.",
            "Start writing something about this topic."
          )
    }
  `;
}

/* ---------- NEW TOPIC MODAL ---------- */

function createTopicModal() {
  if (document.getElementById("topicModal")) return;

  const modal = document.createElement("div");

  modal.id = "topicModal";
  modal.className = "modal hidden";
  modal.setAttribute("aria-hidden", "true");

  modal.innerHTML = `
    <div
      class="modal-backdrop"
      data-close-topic
    ></div>

    <div class="modal-card">

      <div class="modal-top">
        <div class="eyebrow">NEW TOPIC</div>

        <button
          class="modal-close"
          data-close-topic
          type="button"
        >
          ×
        </button>
      </div>

      <input
        id="topicName"
        class="thought-title"
        type="text"
        placeholder="Give this topic a name"
        autocomplete="off"
      />

      <input
        id="topicDescription"
        class="thought-description"
        type="text"
        placeholder="A short description (optional)"
        autocomplete="off"
      />

      <div
        class="modal-footer"
        style="display:flex;justify-content:flex-end;gap:24px"
      >
        <button
          class="text-link"
          data-close-topic
          type="button"
        >
          Cancel
        </button>

        <button
          class="write-btn"
          id="saveTopicBtn"
          type="button"
        >
          Create topic
        </button>
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  modal
    .querySelectorAll("[data-close-topic]")
    .forEach(button => {
      button.addEventListener(
        "click",
        closeTopicModal
      );
    });

  document
    .getElementById("saveTopicBtn")
    .addEventListener("click", saveTopic);

  document
    .getElementById("topicName")
    .addEventListener("keydown", e => {
      if (e.key === "Enter") saveTopic();
      if (e.key === "Escape") closeTopicModal();
    });
}

function addTopic() {
  createTopicModal();

  const modal =
    document.getElementById("topicModal");

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");

  document.getElementById("topicName").value = "";
  document.getElementById("topicDescription").value = "";

  setTimeout(() => {
    document.getElementById("topicName").focus();
  }, 50);
}

function closeTopicModal() {
  const modal =
    document.getElementById("topicModal");

  if (!modal) return;

  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function saveTopic() {
  const nameInput =
    document.getElementById("topicName");

  const descriptionInput =
    document.getElementById("topicDescription");

  const name = nameInput.value.trim();
  const description =
    descriptionInput.value.trim();

  if (!name) {
    nameInput.focus();
    return;
  }

  if (
    state.topics.some(
      topic =>
        topic.name.toLowerCase() ===
        name.toLowerCase()
    )
  ) {
    alert("This topic already exists.");
    return;
  }

  state.topics.push({
    name,
    description:
      description ||
      "A space for thoughts connected to this topic."
  });

  saveState();
  closeTopicModal();
  render();
}

/* ---------- EDIT TOPIC ---------- */

function editTopic(index) {
  const topic = state.topics[index];

  const newName = prompt(
    "Rename topic:",
    topic.name
  );

  if (!newName || !newName.trim()) return;

  const newTopicName = newName.trim();

  if (
    state.topics.some(
      (item, i) =>
        item.name.toLowerCase() ===
          newTopicName.toLowerCase() &&
        i !== index
    )
  ) {
    alert("This topic already exists.");
    return;
  }

  const oldName = topic.name;

  state.topics[index].name = newTopicName;

  if (state.articles) {
    state.articles.forEach(article => {
      if (article.topic === oldName) {
        article.topic = newTopicName;
      }
    });
  }

  saveState();
  render();
}

/* ---------- DELETE TOPIC ---------- */

function deleteTopic(index) {
  const topic = state.topics[index];
  const topicName = topic.name;

  const confirmed = confirm(
    `Delete "${topicName}"?\n\nArticles inside this topic will also be deleted.`
  );

  if (!confirmed) return;

  state.articles = (state.articles || []).filter(
    article => article.topic !== topicName
  );

  state.topics.splice(index, 1);

  saveState();

  currentView = "topics";
  currentTopicIndex = null;

  render();
}

/* ---------- NEW ARTICLE MODAL ---------- */

function createArticleModal() {
  if (document.getElementById("articleModal")) return;

  const modal = document.createElement("div");

  modal.id = "articleModal";
  modal.className = "modal hidden";
  modal.setAttribute("aria-hidden", "true");

  modal.innerHTML = `
    <div
      class="modal-backdrop"
      data-close-article
    ></div>

    <div class="modal-card">

      <div class="modal-top">
        <div class="eyebrow">NEW ARTICLE</div>

        <button
          class="modal-close"
          data-close-article
          type="button"
        >
          ×
        </button>
      </div>

      <input
        id="articleTitle"
        class="thought-title"
        type="text"
        placeholder="Give this article a title (optional)"
      />

      <textarea
        id="articleContent"
        class="thought-content"
        placeholder="What do you want to write?"
      ></textarea>

      <div class="modal-footer">
        <button
          class="write-btn"
          id="saveArticleBtn"
          type="button"
        >
          Save article
        </button>
      </div>

    </div>
  `;

  document.body.appendChild(modal);

  modal
    .querySelectorAll("[data-close-article]")
    .forEach(button => {
      button.addEventListener(
        "click",
        closeArticleModal
      );
    });

  document
    .getElementById("saveArticleBtn")
    .addEventListener("click", saveArticle);
}

function openArticleModal() {
  createArticleModal();

  const modal =
    document.getElementById("articleModal");

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");

  document.getElementById("articleTitle").value = "";
  document.getElementById("articleContent").value = "";

  setTimeout(() => {
    document
      .getElementById("articleTitle")
      .focus();
  }, 50);
}

function closeArticleModal() {
  const modal =
    document.getElementById("articleModal");

  if (!modal) return;

  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

function saveArticle() {
  const title =
    document.getElementById("articleTitle")
      .value.trim();

  const content =
    document.getElementById("articleContent")
      .value.trim();

  const topic =
    state.topics[currentTopicIndex];

  if (!content) {
    document
      .getElementById("articleContent")
      .focus();

    return;
  }

  if (!topic) return;

  if (!state.articles) {
    state.articles = [];
  }

  state.articles.push({
    id: createId(),
    topic: topic.name,
    title,
    content,
    date: new Date().toISOString()
  });

  saveState();
  closeArticleModal();
  render();
}

/* ---------- READING JOURNAL ---------- */

function showEntry(id) {
  const entry =
    state.journal.find(item => item.id === id);

  if (!entry) return;

  document.getElementById("app").innerHTML = `
    <article class="reading">

      <button class="back" id="backBtn">
        ← Back
      </button>

      <div class="eyebrow">Journal</div>

      <h1>
        ${escapeHTML(
          entry.title?.trim() ||
            firstLine(entry.content) ||
            "Untitled thought"
        )}
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
    .addEventListener("click", render);
}

/* ---------- READING ARTICLE ---------- */

function showArticle(id) {
  const article =
    state.articles.find(
      item => item.id === id
    );

  if (!article) return;

  document.getElementById("app").innerHTML = `
    <article class="reading">

      <button
        class="back"
        id="backArticleBtn"
      >
        ← ${escapeHTML(article.topic)}
      </button>

      <div class="eyebrow">
        ${escapeHTML(article.topic)}
      </div>

      <h1>
        ${escapeHTML(
          article.title || "Untitled article"
        )}
      </h1>

      <div class="reading-date">
        ${formatDate(article.date)}
      </div>

      <div class="reading-content">
        ${escapeHTML(article.content)}
      </div>

    </article>
  `;

  document
    .getElementById("backArticleBtn")
    .addEventListener("click", () => {
      render();
    });
}

/* ---------- EVENTS ---------- */

function bindViewEvents() {
  document
    .querySelectorAll("[data-view]")
    .forEach(button => {
      button.addEventListener("click", e => {
        e.preventDefault();

        currentView =
          button.dataset.view;

        currentTopicIndex = null;

        render();

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
    });

  document
    .querySelectorAll("[data-entry]")
    .forEach(button => {
      button.addEventListener("click", () => {
        showEntry(button.dataset.entry);
      });
    });

  document
    .querySelectorAll("[data-article]")
    .forEach(button => {
      button.addEventListener("click", () => {
        showArticle(
          button.dataset.article
        );
      });
    });

  const action =
    document.getElementById("pageAction");

  if (action) {
    action.addEventListener(
      "click",
      openModal
    );
  }

  const newTopicBtn =
    document.getElementById("newTopicBtn");

  if (newTopicBtn) {
    newTopicBtn.addEventListener(
      "click",
      addTopic
    );
  }

  document
    .querySelectorAll("[data-open-topic]")
    .forEach(button => {
      button.addEventListener("click", () => {
        currentTopicIndex =
          Number(
            button.dataset.openTopic
          );

        currentView = "topic-detail";

        render();

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      });
    });

  document
    .querySelectorAll("[data-edit-topic]")
    .forEach(button => {
      button.addEventListener("click", e => {
        e.stopPropagation();

        editTopic(
          Number(
            button.dataset.editTopic
          )
        );
      });
    });

  document
    .querySelectorAll("[data-delete-topic]")
    .forEach(button => {
      button.addEventListener("click", e => {
        e.stopPropagation();

        deleteTopic(
          Number(
            button.dataset.deleteTopic
          )
        );
      });
    });

  const backToTopics =
    document.getElementById(
      "backToTopics"
    );

  if (backToTopics) {
    backToTopics.addEventListener(
      "click",
      () => {
        currentView = "topics";
        currentTopicIndex = null;
        render();
      }
    );
  }

  const addArticleBtn =
    document.getElementById(
      "addArticleBtn"
    );

  if (addArticleBtn) {
    addArticleBtn.addEventListener(
      "click",
      openArticleModal
    );
  }
}

/* ---------- JOURNAL MODAL ---------- */

function openModal() {
  const modal =
    document.getElementById(
      "thoughtModal"
    );

  modal.classList.remove("hidden");
  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document
    .getElementById("thoughtTitle")
    .focus();
}

function closeModal() {
  const modal =
    document.getElementById(
      "thoughtModal"
    );

  modal.classList.add("hidden");
  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.getElementById(
    "thoughtTitle"
  ).value = "";

  document.getElementById(
    "thoughtContent"
  ).value = "";

  document.getElementById(
    "thoughtMood"
  ).value = "";
}

function saveThought() {
  const title =
    document.getElementById(
      "thoughtTitle"
    ).value.trim();

  const content =
    document.getElementById(
      "thoughtContent"
    ).value.trim();

  const mood =
    document.getElementById(
      "thoughtMood"
    ).value.trim();

  if (!content) {
    document
      .getElementById(
        "thoughtContent"
      )
      .focus();

    return;
  }

  state.journal.push({
    id: createId(),
    title,
    content,
    mood,
    date: new Date().toISOString()
  });

  saveState();

  closeModal();

  currentView = "journal";

  render();
}

/* ---------- GLOBAL ---------- */

document
  .getElementById("newThoughtBtn")
  .addEventListener(
    "click",
    openModal
  );

document
  .querySelectorAll(
    "[data-close-modal]"
  )
  .forEach(el => {
    el.addEventListener(
      "click",
      closeModal
    );
  });

document
  .getElementById("saveThoughtBtn")
  .addEventListener(
    "click",
    saveThought
  );

document.addEventListener(
  "keydown",
  e => {
    if (e.key !== "Escape") return;

    const topicModal =
      document.getElementById(
        "topicModal"
      );

    const articleModal =
      document.getElementById(
        "articleModal"
      );

    const thoughtModal =
      document.getElementById(
        "thoughtModal"
      );

    if (
      topicModal &&
      !topicModal.classList.contains(
        "hidden"
      )
    ) {
      closeTopicModal();
      return;
    }

    if (
      articleModal &&
      !articleModal.classList.contains(
        "hidden"
      )
    ) {
      closeArticleModal();
      return;
    }

    if (
      thoughtModal &&
      !thoughtModal.classList.contains(
        "hidden"
      )
    ) {
      closeModal();
    }
  }
);

render();
