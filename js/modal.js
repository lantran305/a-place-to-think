import { saveThoughtData } from "./app.js";

let modalMode = "thought";
let modalCallback = null;

export function createThoughtModal() {
  if (document.getElementById("thoughtModal")) return;

  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal hidden" id="thoughtModal" aria-hidden="true">
      <div class="modal-overlay" data-close-modal></div>

      <div class="modal-box">

        <button class="modal-close" data-close-modal>×</button>

        <div class="eyebrow" id="modalEyebrow">
          NEW THOUGHT
        </div>

        <input
          type="text"
          id="modalTitle"
          class="modal-title-input"
          placeholder="Give this thought a title (optional)"
          autocomplete="off"
        >

        <textarea
          id="modalContent"
          class="modal-content-input"
          placeholder="What is on your mind?"
        ></textarea>

        <input
          type="text"
          id="modalDescription"
          class="modal-description-input"
          placeholder="Mood (optional)"
          autocomplete="off"
        >

        <div class="modal-actions">

          <button
            class="text-link"
            data-close-modal
          >
            Cancel
          </button>

          <button
            class="write-btn"
            id="saveModalBtn"
          >
            Save thought
          </button>

        </div>

      </div>
    </div>
  `);

  document
    .querySelectorAll("[data-close-modal]")
    .forEach(element => {
      element.addEventListener("click", closeModal);
    });

  document
    .getElementById("saveModalBtn")
    .addEventListener("click", saveModal);
}


export function openThoughtModal() {
  modalMode = "thought";
  modalCallback = null;

  setModalContent(
    "NEW THOUGHT",
    "Give this thought a title (optional)",
    "What is on your mind?",
    "Mood (optional)",
    "Save thought",
    "",
    "",
    true
  );

  showModal();
}


export function openTopicModal(
  callback,
  existingName = "",
  existingDescription = ""
) {
  modalMode = "topic";
  modalCallback = callback;

  setModalContent(
    existingName ? "EDIT TOPIC" : "NEW TOPIC",
    "Topic name",
    "",
    "A short description (optional)",
    existingName ? "Save changes" : "Add topic",
    existingName,
    existingDescription,
    false
  );

  showModal();
}


export function openArticleModal(callback) {
  modalMode = "article";
  modalCallback = callback;

  setModalContent(
    "NEW ARTICLE",
    "Give this article a title",
    "Write your thoughts or paste the article link here...",
    "",
    "Save article",
    "",
    "",
    true
  );

  showModal();
}


function setModalContent(
  eyebrow,
  titlePlaceholder,
  contentPlaceholder,
  descriptionPlaceholder,
  buttonText,
  titleValue = "",
  descriptionValue = "",
  showContent = true
) {
  document.getElementById("modalEyebrow").textContent =
    eyebrow;

  document.getElementById("modalTitle").placeholder =
    titlePlaceholder;

  document.getElementById("modalContent").placeholder =
    contentPlaceholder;

  document.getElementById("modalDescription").placeholder =
    descriptionPlaceholder;

  document.getElementById("saveModalBtn").textContent =
    buttonText;

  document.getElementById("modalTitle").value =
    titleValue;

  document.getElementById("modalContent").value =
    "";

  document.getElementById("modalDescription").value =
    descriptionValue;

  document.getElementById("modalContent").style.display =
    showContent ? "block" : "none";

  document.getElementById("modalDescription").style.display =
    descriptionPlaceholder ? "block" : "none";
}


function showModal() {
  const modal =
    document.getElementById("thoughtModal");

  modal.classList.remove("hidden");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document
    .getElementById("modalTitle")
    .focus();
}


export function closeModal() {
  const modal =
    document.getElementById("thoughtModal");

  if (!modal) return;

  modal.classList.add("hidden");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  modalCallback = null;
}


function saveModal() {
  const title =
    document
      .getElementById("modalTitle")
      .value
      .trim();

  const content =
    document
      .getElementById("modalContent")
      .value
      .trim();

  const description =
    document
      .getElementById("modalDescription")
      .value
      .trim();


  if (modalMode === "thought") {

    if (!content) {
      document
        .getElementById("modalContent")
        .focus();

      return;
    }

    saveThoughtData(
      title,
      content,
      description
    );

    closeModal();

    return;
  }


  if (modalMode === "topic") {

    if (!title) {
      document
        .getElementById("modalTitle")
        .focus();

      return;
    }

    if (modalCallback) {
      modalCallback(
        title,
        description
      );
    }

    closeModal();

    return;
  }


  if (modalMode === "article") {

    if (!content) {
      document
        .getElementById("modalContent")
        .focus();

      return;
    }

    if (modalCallback) {
      modalCallback(
        title,
        content
      );
    }

    closeModal();

    return;
  }
}


document.addEventListener(
  "keydown",
  event => {
    if (event.key === "Escape") {
      closeModal();
    }
  }
);
