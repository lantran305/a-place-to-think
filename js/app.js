import { loadState, saveState, createId } from "./storage.js";
import { journalView, entryRow, entryTitle, renderEntry, formatDate, escapeHTML } from "./journal.js";
import { ideasView } from "./ideas.js";
import { questionsView } from "./questions.js";
import { topicsView, topicDetailView, renderArticle } from "./topics.js";
import { initModal, openThoughtModal, openTopicModal, openArticleModal, closeModal } from "./modal.js";

const state = loadState();
let currentView = "home";
let currentTopicIndex = null;

const root = document.getElementById("app");

function emptyState(title, text) {
  return `<div class="empty"><strong>${escapeHTML(title)}</strong><span>${escapeHTML(text)}</span></div>`;
}

function homeView() {
  const recent = [...state.journal].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,5);
  return `
    <section class="hero"><div class="eyebrow">Private thinking journal</div><h1>A Place to Think</h1><p class="tagline">A quiet place for thoughts to unfold.</p></section>
    <section class="quote">Writing is a way of making<br>space inside my head.</section>
    <section class="section">
      <div class="section-heading"><div><h2 class="page-title" style="font-size:32px">Recently</h2><p class="page-subtitle">Small things worth keeping.</p></div><button class="text-link" data-view="journal" type="button">View journal →</button></div>
      ${recent.length ? `<div class="entries">${recent.map(entryRow).join("")}</div>` : emptyState("Nothing written yet.", "Start with whatever is on your mind.")}
    </section>`;
}

function setView(view, topicIndex = null) {
  currentView = view;
  currentTopicIndex = topicIndex;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function render() {
  document.querySelectorAll(".nav button").forEach(btn => btn.classList.toggle("active", btn.dataset.view === currentView));
  if (currentView === "home") root.innerHTML = homeView();
  else if (currentView === "journal") root.innerHTML = journalView(state);
  else if (currentView === "ideas") root.innerHTML = ideasView(state);
  else if (currentView === "questions") root.innerHTML = questionsView(state);
  else if (currentView === "topics") root.innerHTML = topicsView(state);
  else if (currentView === "topic-detail") root.innerHTML = topicDetailView(state, currentTopicIndex);
  bindEvents();
}

function bindEvents() {
  document.querySelectorAll("[data-view]").forEach(el => el.addEventListener("click", e => {
    e.preventDefault();
    setView(el.dataset.view);
  }));

  document.querySelectorAll("[data-entry]").forEach(el => el.addEventListener("click", () => {
    const entry = state.journal.find(item => item.id === el.dataset.entry);
    if (!entry) return;
    root.innerHTML = renderEntry(entry);
    document.getElementById("backBtn")?.addEventListener("click", () => setView("journal"));
  }));

  document.getElementById("pageAction")?.addEventListener("click", () => openThoughtModal(saveThought));
  document.getElementById("newThoughtBtn")?.addEventListener("click", () => openThoughtModal(saveThought));
  document.getElementById("newTopicBtn")?.addEventListener("click", addTopic);
  document.getElementById("addArticleBtn")?.addEventListener("click", addArticle);
  document.getElementById("backToTopics")?.addEventListener("click", () => setView("topics"));

  document.querySelectorAll("[data-open-topic]").forEach(el => el.addEventListener("click", () => setView("topic-detail", Number(el.dataset.openTopic))));
  document.querySelectorAll("[data-edit-topic]").forEach(el => el.addEventListener("click", e => { e.stopPropagation(); editTopic(Number(el.dataset.editTopic)); }));
  document.querySelectorAll("[data-delete-topic]").forEach(el => el.addEventListener("click", e => { e.stopPropagation(); deleteTopic(Number(el.dataset.deleteTopic)); }));
  document.querySelectorAll("[data-article]").forEach(el => el.addEventListener("click", () => showArticle(el.dataset.article)));
}

function saveThought({ title, content, description: mood }) {
  if (!content) {
    alert("Please write something before saving.");
    return;
  }
  state.journal.push({ id: createId(), title, content, mood, date: new Date().toISOString() });
  saveState(state);
  closeModal();
  setView("journal");
}

function addTopic() {
  openTopicModal(({ title }) => {
    if (!title) { alert("Please enter a topic name."); return; }
    if (state.topics.some(t => t.toLowerCase() === title.toLowerCase())) { alert("This topic already exists."); return; }
    state.topics.push(title);
    saveState(state);
    closeModal();
    setView("topics");
  });
}

function editTopic(index) {
  const oldName = state.topics[index];
  openTopicModal(({ title }) => {
    if (!title) { alert("Please enter a topic name."); return; }
    if (state.topics.some((t,i) => i !== index && t.toLowerCase() === title.toLowerCase())) { alert("This topic already exists."); return; }
    state.topics[index] = title;
    (state.articles || []).forEach(article => { if (article.topic === oldName) article.topic = title; });
    saveState(state);
    closeModal();
    setView("topics");
  }, oldName);
}

function deleteTopic(index) {
  const topic = state.topics[index];
  if (!confirm(`Delete "${topic}"?\n\nArticles inside this topic will also be deleted.`)) return;
  state.topics.splice(index,1);
  state.articles = (state.articles || []).filter(article => article.topic !== topic);
  saveState(state);
  setView("topics");
}

function addArticle() {
  const topic = state.topics[currentTopicIndex];
  if (!topic) return;
  openArticleModal(({ title, content }) => {
    if (!content) { alert("Please write something before saving."); return; }
    state.articles.push({ id: createId(), topic, title, content, date: new Date().toISOString() });
    saveState(state);
    closeModal();
    setView("topic-detail", currentTopicIndex);
  });
}

function showArticle(id) {
  const article = (state.articles || []).find(a => a.id === id);
  if (!article) return;
  root.innerHTML = renderArticle(article);
  document.getElementById("backArticleBtn")?.addEventListener("click", () => setView("topic-detail", currentTopicIndex));
}

initModal();
render();
