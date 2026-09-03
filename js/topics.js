import {
  state,
  currentTopicIndex,
  setView,
  escapeHTML,
  formatDate,
  emptyState
} from "./app.js";

import { saveState, createId } from "./storage.js";

import {
  openTopicModal,
  openArticleModal
} from "./modal.js";


export function topicsView() {
  return `
    <div class="section-heading">

      <div>
        <h1 class="page-title">Topics</h1>

        <p class="page-subtitle">
          The things I keep coming back to.
        </p>
      </div>

      <button
        class="write-btn"
        id="newTopicBtn"
      >
        + New topic
      </button>

    </div>


    <div class="topic-grid">

      ${
        state.topics.length
          ? state.topics.map((topic, index) => `
              
              <article class="topic-card">

                <div
                  class="topic-main"
                  data-open-topic="${index}"
                >

                  <h3>
                    ${escapeHTML(topic)}
                  </h3>

                  <p>
                    A space for thoughts connected to this topic.
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

            `).join("")
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


export function topicDetailView(index) {

  const topic = state.topics[index];

  if (!topic) {
    return topicsView();
  }

  const articles = (state.articles || [])
    .filter(article => article.topic === topic)
    .sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );


  return `
    <div class="section-heading">

      <div>

        <button
          class="back"
          id="backToTopics"
        >
          ← Topics
        </button>

        <h1 class="page-title">
          ${escapeHTML(topic)}
        </h1>

        <p class="page-subtitle">
          A space for thoughts connected to this topic.
        </p>

      </div>


      <button
        class="write-btn"
        id="addArticleBtn"
      >
        + Add article
      </button>

    </div>


    ${
      articles.length
        ? `
          <div class="entries">

            ${articles.map(article => `

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
                      article.title ||
                      "Untitled article"
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


                <div class="meta">
                  article
                </div>

              </button>

            `).join("")}

          </div>
        `
        : emptyState(
            "Nothing here yet.",
            "Start writing something about this topic."
          )
    }
  `;
}


function addTopic() {

  openTopicModal(
    (name, description) => {

      if (!name || !name.trim()) {
        return;
      }

      const topic = name.trim();


      if (
        state.topics.some(
          item =>
            item.toLowerCase() ===
            topic.toLowerCase()
        )
      ) {

        alert(
          "This topic already exists."
        );

        return;
      }


      state.topics.push(topic);


      if (!state.articles) {
        state.articles = [];
      }


      saveState(state);

      setView("topics");

    }
  );
}


function editTopic(index) {

  const oldName =
    state.topics[index];


  openTopicModal(
    (newName) => {

      if (
        !newName ||
        !newName.trim()
      ) {
        return;
      }

      const topic =
        newName.trim();


      if (
        state.topics.some(
          (item, i) =>
            item.toLowerCase() ===
              topic.toLowerCase() &&
            i !== index
        )
      ) {

        alert(
          "This topic already exists."
        );

        return;
      }


      state.topics[index] =
        topic;


      if (!state.articles) {
        state.articles = [];
      }


      state.articles.forEach(
        article => {

          if (
            article.topic ===
            oldName
          ) {

            article.topic =
              topic;

          }

        }
      );


      saveState(state);

      setView("topics");

    },
    oldName
  );
}


function deleteTopic(index) {

  const topic =
    state.topics[index];


  const confirmed =
    confirm(
      `Delete "${topic}"?\n\nArticles inside this topic will also be deleted.`
    );


  if (!confirmed) {
    return;
  }


  if (!state.articles) {
    state.articles = [];
  }


  state.articles =
    state.articles.filter(
      article =>
        article.topic !== topic
    );


  state.topics.splice(
    index,
    1
  );


  saveState(state);

  setView("topics");
}


function addArticle() {

  const topic =
    state.topics[
      currentTopicIndex
    ];


  if (!topic) {
    return;
  }


  openArticleModal(
    (title, content) => {

      if (
        !content ||
        !content.trim()
      ) {
        return;
      }


      if (!state.articles) {
        state.articles = [];
      }


      state.articles.push({

        id: createId(),

        topic,

        title:
          title.trim(),

        content:
          content.trim(),

        date:
          new Date()
            .toISOString()

      });


      saveState(state);


      setView(
        "topic-detail",
        currentTopicIndex
      );

    }
  );
}


function showArticle(id) {

  const article =
    (state.articles || [])
      .find(
        item =>
          item.id === id
      );


  if (!article) {
    return;
  }


  document.getElementById(
    "app"
  ).innerHTML = `

    <article class="reading">

      <button
        class="back"
        id="backArticleBtn"
      >
        ← ${escapeHTML(article.topic)}
      </button>


      <div class="eyebrow">
        Topic
      </div>


      <h1>
        ${escapeHTML(
          article.title ||
          "Untitled article"
        )}
      </h1>


      <div class="reading-date">
        ${formatDate(
          article.date
        )}
      </div>


      <div class="reading-content">
        ${escapeHTML(
          article.content
        )}
      </div>

    </article>

  `;


  document
    .getElementById(
      "backArticleBtn"
    )
    .addEventListener(
      "click",
      () => {

        setView(
          "topic-detail",
          currentTopicIndex
        );

      }
    );
}


export function bindTopicEvents() {

  const newTopicBtn =
    document.getElementById(
      "newTopicBtn"
    );


  if (newTopicBtn) {

    newTopicBtn.addEventListener(
      "click",
      addTopic
    );

  }


  document
    .querySelectorAll(
      "[data-edit-topic]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        event => {

          event.stopPropagation();


          editTopic(
            Number(
              button.dataset.editTopic
            )
          );

        }
      );

    });


  document
    .querySelectorAll(
      "[data-delete-topic]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        event => {

          event.stopPropagation();


          deleteTopic(
            Number(
              button.dataset.deleteTopic
            )
          );

        }
      );

    });


  document
    .querySelectorAll(
      "[data-open-topic]"
    )
    .forEach(element => {

      element.addEventListener(
        "click",
        () => {

          setView(
            "topic-detail",
            Number(
              element.dataset.openTopic
            )
          );

        }
      );

    });


  const addArticleBtn =
    document.getElementById(
      "addArticleBtn"
    );


  if (addArticleBtn) {

    addArticleBtn.addEventListener(
      "click",
      addArticle
    );

  }


  const backToTopics =
    document.getElementById(
      "backToTopics"
    );


  if (backToTopics) {

    backToTopics.addEventListener(
      "click",
      () => {

        setView(
          "topics"
        );

      }
    );

  }


  document
    .querySelectorAll(
      "[data-article]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          showArticle(
            button.dataset.article
          );

        }
      );

    });

}
