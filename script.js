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

const defaultTopics = ["Love", "People", "Growth"];

let state = loadState();
let currentView = "home";

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved || {
      journal: [],
      ideas: defaultIdeas,
      questions: defaultQuestions,
      topics: defaultTopics
    };
  } catch {
    return {
      journal: [],
      ideas: defaultIdeas,
      questions: defaultQuestions,
      topics: defaultTopics
    };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(dateString));
}

function escapeHTML(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function render() {
  const root = document.getElementById("app");
  document.querySelectorAll(".nav button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === currentView);
  });

  if (currentView === "home") root.innerHTML = homeView();
  if (currentView === "journal") root.innerHTML = journalView();
  if (currentView === "ideas") root.innerHTML = ideasView();
  if (currentView === "questions") root.innerHTML = questionsView();
  if (currentView === "topics") root.innerHTML = topicsView();
  bindViewEvents();
}

function homeView() {
  const recent = [...state.journal]
    .sort((a,b) => new Date(b.date) - new Date(a.date))
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
        <button class="text-link" data-view="journal">View journal →</button>
      </div>

      ${recent.length ? `
        <div class="entries">
          ${recent.map(entry => entryRow(entry)).join("")}
        </div>
      ` : emptyState("Nothing written yet.", "Start with whatever is on your mind.")}
    </section>
  `;
}

function entryRow(entry) {
  const title = entry.title?.trim() || firstLine(entry.content) || "Untitled thought";
  const preview = entry.content?.replace(/\s+/g, " ").slice(0, 150) || "";
  return `
    <button class="entry" style="width:100%;background:none;border:0;text-align:left"
            data-entry="${entry.id}">
      <div class="date">${formatDate(entry.date)}</div>
      <div>
        <h3 class="entry-title">${escapeHTML(title)}</h3>
        <p class="entry-preview">${escapeHTML(preview)}</p>
      </div>
      <div class="meta">${entry.mood ? escapeHTML(entry.mood) : "thought"}</div>
    </button>
  `;
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

function pageHeader(title, subtitle, buttonText = "") {
  return `
    <div class="section-heading">
      <div>
        <h1 class="page-title">${title}</h1>
        <p class="page-subtitle">${subtitle}</p>
      </div>
      ${buttonText ? `<button class="write-btn" id="pageAction">${buttonText}</button>` : ""}
    </div>
  `;
}

function journalView() {
  const entries = [...state.journal].sort((a,b) => new Date(b.date) - new Date(a.date));
  return `
    ${pageHeader("Journal", "Write it down.", "+ New thought")}
    ${entries.length
      ? `<div class="entries">${entries.map(entry => entryRow(entry)).join("")}</div>`
      : emptyState("Your journal is empty.", "You don't need the right words. Just begin.")
    }
  `;
}

function ideasView() {
  return `
    ${pageHeader("Ideas", "Thoughts I'm still thinking about.")}
    <div class="entries">
      ${state.ideas.map(idea => `
        <article class="list-item">
          <div class="date">${escapeHTML(idea.status)}</div>
          <div>
            <h3 class="item-title">${escapeHTML(idea.title)}</h3>
            <p class="item-description">${escapeHTML(idea.description)}</p>
          </div>
          <div class="meta">${idea.thoughts || 0} thoughts</div>
        </article>
      `).join("")}
    </div>
  `;
}

function questionsView() {
  return `
    ${pageHeader("Questions", "Things I don't have answers to yet.")}
    <div class="entries">
      ${state.questions.map(q => `
        <article class="list-item">
          <div class="date">${escapeHTML(q.status)}</div>
          <div>
            <h3 class="item-title">${escapeHTML(q.question)}</h3>
            <p class="item-description">${escapeHTML(q.description)}</p>
          </div>
          <div class="meta">keep thinking</div>
        </article>
      `).join("")}
    </div>
  `;
}

function topicsView() {
  return `
    <div class="section-heading">
      <div>
        <h1 class="page-title">Topics</h1>
        <p class="page-subtitle">The things I keep coming back to.</p>
      </div>

      <button class="write-btn" id="newTopicBtn">
        + New topic
      </button>
    </div>

    <div class="topic-grid">
      ${state.topics.map((topic, index) => `
        <article class="topic-card">
          <h3>${escapeHTML(topic)}</h3>

          <div class="topic-actions">
            <button
              class="topic-edit"
              data-edit-topic="${index}">
              Edit
            </button>

            <button
              class="topic-delete"
              data-delete-topic="${index}">
              ×
            </button>
          </div>
        </article>
      `).join("")}
    </div>

    <div class="section">
      <div class="quote">
        Thoughts become more interesting when they begin to connect.
      </div>
    </div>
  `;
}
function addTopic() {
  const name = prompt("Topic name:");
  if (!name || !name.trim()) return;
  const topic = name.trim();
  if (state.topics.includes(topic)) {
    alert("This topic already exists.");
    return;
  }
  state.topics.push(topic);
  saveState();
  render();
}
function editTopic(index) {
  const oldName = state.topics[index];
  const newName = prompt("Rename topic:", oldName);
  if (!newName || !newName.trim()) return;
  const topic = newName.trim();
  if (
    state.topics.some(
      (item, i) => item === topic && i !== index
    )
  ) {
    alert("This topic already exists.");
    return;
  }
  state.topics[index] = topic;
  saveState();
  render();
}
function deleteTopic(index) {
  const topic = state.topics[index];
  const confirmed = confirm(
    `Delete "${topic}"?`
  );
  if (!confirmed) return;
  state.topics.splice(index, 1);

  saveState();
  render();
}
function bindViewEvents() {
  const newTopicBtn = document.getElementById("newTopicBtn");

  if (newTopicBtn) {
    newTopicBtn.addEventListener("click", addTopic);
  }

  document.querySelectorAll("[data-edit-topic]").forEach(button => {
    button.addEventListener("click", () => {
      editTopic(Number(button.dataset.editTopic));
    });
  });
}

  document.querySelectorAll("[data-delete-topic]").forEach(button => {
    button.addEventListener("click", () => {
      deleteTopic(Number(button.dataset.deleteTopic));
    });
  });
function showEntry(id) {
  const entry = state.journal.find(item => item.id === id);
  if (!entry) return;

  document.getElementById("app").innerHTML = `
    <article class="reading">
      <button class="back" id="backBtn">← Back</button>
      <div class="eyebrow">Journal</div>
      <h1>${escapeHTML(entry.title?.trim() || firstLine(entry.content) || "Untitled thought")}</h1>
      <div class="reading-date">${formatDate(entry.date)}${entry.mood ? " · " + escapeHTML(entry.mood) : ""}</div>
      <div class="reading-content">${escapeHTML(entry.content)}</div>
    </article>
  `;

  document.getElementById("backBtn").addEventListener("click", render);
}

function bindViewEvents() {
  document.querySelectorAll("[data-view]").forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      currentView = button.dataset.view;
      render();
      window.scrollTo({top: 0, behavior: "smooth"});
    });
  });

  document.querySelectorAll("[data-entry]").forEach(button => {
    button.addEventListener("click", () => showEntry(button.dataset.entry));
  });

  const action = document.getElementById("pageAction");
  if (action) action.addEventListener("click", openModal);
}

function openModal() {
  const modal = document.getElementById("thoughtModal");
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.getElementById("thoughtTitle").focus();
}

function closeModal() {
  const modal = document.getElementById("thoughtModal");
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  document.getElementById("thoughtTitle").value = "";
  document.getElementById("thoughtContent").value = "";
  document.getElementById("thoughtMood").value = "";
}

function saveThought() {
  const title = document.getElementById("thoughtTitle").value.trim();
  const content = document.getElementById("thoughtContent").value.trim();
  const mood = document.getElementById("thoughtMood").value.trim();

  if (!content) {
    document.getElementById("thoughtContent").focus();
    return;
  }

  state.journal.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
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

document.getElementById("newThoughtBtn").addEventListener("click", openModal);
document.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeModal));
document.getElementById("saveThoughtBtn").addEventListener("click", saveThought);

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

render();
