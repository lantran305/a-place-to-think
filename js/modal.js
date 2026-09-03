let modal = null;
let mode = "thought";
let callback = null;

export function initModal() {
  if (document.getElementById("thoughtModal")) {
    modal = document.getElementById("thoughtModal");
    return;
  }

  document.body.insertAdjacentHTML("beforeend", `
    <div class="modal hidden" id="thoughtModal" aria-hidden="true">
      <div class="modal-backdrop" data-close-modal></div>
      <section class="editor" role="dialog" aria-modal="true" aria-labelledby="modalEyebrow">
        <div class="editor-top">
          <span id="modalEyebrow">NEW THOUGHT</span>
          <button class="close-btn" type="button" data-close-modal aria-label="Close">×</button>
        </div>
        <input id="modalTitle" class="title-input" type="text" autocomplete="off" />
        <textarea id="modalContent" class="content-input"></textarea>
        <input id="modalDescription" class="mood-input" type="text" autocomplete="off" />
        <div class="editor-bottom">
          <button class="text-link" type="button" data-close-modal>Cancel</button>
          <button class="save-btn" id="saveModalBtn" type="button">Save thought</button>
        </div>
      </section>
    </div>`);

  modal = document.getElementById("thoughtModal");
  modal.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", closeModal));
  document.getElementById("saveModalBtn").addEventListener("click", saveModal);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal(); });
}

function configure({ title, content, description, eyebrow, button, contentVisible = true, descriptionVisible = true, onSave }) {
  initModal();
  document.getElementById("modalEyebrow").textContent = eyebrow;
  const titleInput = document.getElementById("modalTitle");
  const contentInput = document.getElementById("modalContent");
  const descriptionInput = document.getElementById("modalDescription");
  titleInput.placeholder = title.placeholder || "";
  titleInput.value = title.value || "";
  contentInput.placeholder = content.placeholder || "";
  contentInput.value = content.value || "";
  descriptionInput.placeholder = description.placeholder || "";
  descriptionInput.value = description.value || "";
  contentInput.style.display = contentVisible ? "block" : "none";
  descriptionInput.style.display = descriptionVisible ? "block" : "none";
  document.getElementById("saveModalBtn").textContent = button;
  mode = "custom";
  callback = onSave;
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  titleInput.focus();
}

export function openThoughtModal(onSave) {
  configure({
    eyebrow: "NEW THOUGHT", button: "Save thought",
    title: { placeholder: "Give this thought a title (optional)" },
    content: { placeholder: "What is on your mind?" },
    description: { placeholder: "Mood (optional)" },
    onSave, contentVisible: true, descriptionVisible: true
  });
}

export function openTopicModal(onSave, name = "", description = "") {
  configure({
    eyebrow: name ? "EDIT TOPIC" : "NEW TOPIC", button: name ? "Save changes" : "Add topic",
    title: { placeholder: "Topic name", value: name },
    content: { placeholder: "" },
    description: { placeholder: "A short description (optional)", value: description },
    onSave, contentVisible: false, descriptionVisible: true
  });
}

export function openArticleModal(onSave) {
  configure({
    eyebrow: "NEW ARTICLE", button: "Save article",
    title: { placeholder: "Give this article a title" },
    content: { placeholder: "Write your thoughts or paste the article link here..." },
    description: { placeholder: "" },
    onSave, contentVisible: true, descriptionVisible: false
  });
}

function saveModal() {
  const title = document.getElementById("modalTitle").value.trim();
  const content = document.getElementById("modalContent").value.trim();
  const description = document.getElementById("modalDescription").value.trim();

  if (mode === "custom" && callback) {
    callback({ title, content, description });
  }
}

export function closeModal() {
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  callback = null;
}
