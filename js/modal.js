import { saveThoughtData } from "./app.js";

export function createThoughtModal() {
  if (document.getElementById("thoughtModal")) {
    return;
  }

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div
        class="modal hidden"
        id="thoughtModal"
        aria-hidden="true"
      >
        <div
          class="modal-overlay"
          data-close-modal
        ></div>

        <div class="modal-box">

          <button
            class="modal-close"
            data-close-modal
            aria-label="Close"
          >
            ×
          </button>

          <div class="eyebrow">
            Journal
          </div>

          <h2>
            New thought
          </h2>

          <input
            type="text"
            id="thoughtTitle"
            placeholder="Title"
            autocomplete="off"
          />

          <textarea
            id="thoughtContent"
            placeholder="Write whatever is on your mind..."
            rows="10"
          ></textarea>

          <input
            type="text"
            id="thoughtMood"
            placeholder="Mood (optional)"
            autocomplete="off"
          />

          <div class="modal-actions">

            <button
              class="text-link"
              data-close-modal
            >
              Cancel
            </button>

            <button
              class="write-btn"
              id="saveThoughtBtn"
            >
              Save thought
            </button>

          </div>

        </div>
      </div>
    `
  );

  document
    .querySelectorAll("[data-close-modal]")
    .forEach(element => {
      element.addEventListener(
        "click",
        closeThoughtModal
      );
    });

  document
    .getElementById("saveThoughtBtn")
    .addEventListener(
      "click",
      saveThought
    );
}


export function openThoughtModal() {
  const modal =
    document.getElementById("thoughtModal");

  if (!modal) {
    return;
  }

  modal.classList.remove("hidden");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document
    .getElementById("thoughtTitle")
    .focus();
}


export function closeThoughtModal() {
  const modal =
    document.getElementById("thoughtModal");

  if (!modal) {
    return;
  }

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
    document
      .getElementById("thoughtTitle")
      .value
      .trim();

  const content =
    document
      .getElementById("thoughtContent")
      .value
      .trim();

  const mood =
    document
      .getElementById("thoughtMood")
      .value
      .trim();

  if (!content) {
    document
      .getElementById("thoughtContent")
      .focus();

    return;
  }

  saveThoughtData(
    title,
    content,
    mood
  );

  closeThoughtModal();
}


document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {
      closeThoughtModal();
    }

  }
);
