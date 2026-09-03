import { loadState, saveState } from "./storage.js";

import {
  journalView,
  entryRow,
  bindJournalEvents
} from "./journal.js";

import { ideasView } from "./ideas.js";

import { questionsView } from "./questions.js";

import {
  topicsView,
  topicDetailView,
  bindTopicEvents
} from "./topics.js";

import {
  createThoughtModal,
  openThoughtModal
} from "./modal.js";


// ==============================
// GLOBAL STATE
// ==============================

export const state = loadState();

export let currentView = "home";

export let currentTopicIndex = null;


// ==============================
// NAVIGATION
// ==============================

export function setView(
  view,
  topicIndex = null
) {
  currentView = view;
  currentTopicIndex = topicIndex;

  render();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// ==============================
// HELPERS
// ==============================

export function escapeHTML(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


export function formatDate(dateString) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  ).format(new Date(dateString));
}


export function firstLine(text = "") {
  return (
    text
      .split("\n")
      .find(line => line.trim())
      ?.trim() || ""
  );
}


export function emptyState(
  title,
  text
) {
  return `
    <div class="empty">

      <strong>
        ${escapeHTML(title)}
      </strong>

      <span>
        ${escapeHTML(text)}
      </span>

    </div>
  `;
}


export function pageHeader(
  title,
  subtitle,
  buttonText = ""
) {
  return `
    <div class="section-heading">

      <div>

        <h1 class="page-title">
          ${escapeHTML(title)}
        </h1>

        <p class="page-subtitle">
          ${escapeHTML(subtitle)}
        </p>

      </div>

      ${
        buttonText
          ? `
            <button
              class="write-btn"
              id="pageAction"
            >
              ${escapeHTML(buttonText)}
            </button>
          `
          : ""
      }

    </div>
  `;
}


// ==============================
// HOME
// ==============================

function homeView() {

  const recent = [...state.journal]
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    )
    .slice(0, 5);


  return `

    <section class="hero">

      <div class="eyebrow">
        Private thinking journal
      </div>

      <h1>
        A Place to Think
      </h1>

      <p class="tagline">
        A quiet place for thoughts to unfold.
      </p>

    </section>


    <section class="quote">

      Writing is a way of making
      space inside my head.

    </section>


    <section class="section">

      <div class="section-heading">

        <div>

          <h2
            class="page-title"
            style="font-size:32px"
          >
            Recently
          </h2>

          <p class="page-subtitle">
            Small things worth keeping.
          </p>

        </div>


        <button
          class="text-link"
          data-view="journal"
        >
          View journal →
        </button>

      </div>


      ${
        recent.length
          ? `
            <div class="entries">

              ${recent
                .map(entryRow)
                .join("")}

            </div>
          `
          : emptyState(
              "Nothing written yet.",
              "Start with whatever is on your mind."
            )
      }

    </section>

  `;
}


// ==============================
// SAVE THOUGHT
// ==============================

export function saveThoughtData(
  title,
  content,
  mood
) {

  state.journal.push({

    id:
      crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now()),

    title,

    content,

    mood,

    date:
      new Date().toISOString()

  });


  saveState(state);

  setView("journal");
}


// ==============================
// RENDER
// ==============================

export function render() {

  const root =
    document.getElementById("app");


  document
    .querySelectorAll(".nav button")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.view ===
          currentView
      );

    });


  if (currentView === "home") {

    root.innerHTML =
      homeView();

  }


  if (currentView === "journal") {

    root.innerHTML =
      journalView();

  }


  if (currentView === "ideas") {

    root.innerHTML =
      ideasView();

  }


  if (currentView === "questions") {

    root.innerHTML =
      questionsView();

  }


  if (currentView === "topics") {

    root.innerHTML =
      topicsView();

  }


  if (
    currentView ===
    "topic-detail"
  ) {

    root.innerHTML =
      topicDetailView(
        currentTopicIndex
      );

  }


  bindEvents();
}


// ==============================
// EVENTS
// ==============================

function bindEvents() {


  // Navigation

  document
    .querySelectorAll("[data-view]")
    .forEach(button => {

      button.addEventListener(
        "click",
        event => {

          event.preventDefault();

          setView(
            button.dataset.view
          );

        }
      );

    });


  // Journal

  bindJournalEvents();


  // Topics

  bindTopicEvents();


  // New thought

  const action =
    document.getElementById(
      "pageAction"
    );


  if (action) {

    action.addEventListener(
      "click",
      openThoughtModal
    );

  }

}


// ==============================
// START APP
// ==============================

createThoughtModal();


const newThoughtButton =
  document.getElementById(
    "newThoughtBtn"
  );


if (newThoughtButton) {

  newThoughtButton.addEventListener(
    "click",
    openThoughtModal
  );

}


render();
