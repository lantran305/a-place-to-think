export const STORAGE_KEY = "a-place-to-think-journal";

export const defaultIdeas = [
  { id: "idea-1", title: "Why do people need to be understood?", description: "A thought about understanding, validation and human connection.", status: "Exploring", thoughts: 0 },
  { id: "idea-2", title: "What does it mean to grow up?", description: "A space for thoughts about change, responsibility and becoming.", status: "Developing", thoughts: 0 }
];

export const defaultQuestions = [
  { id: "question-1", question: "Can people truly change?", description: "A question that keeps returning in different forms.", status: "Open" },
  { id: "question-2", question: "What makes something meaningful?", description: "Still thinking about this.", status: "Exploring" }
];

export const defaultTopics = ["Love", "People", "Growth"];

export function createId() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function freshState() {
  return {
    journal: [],
    ideas: structuredClone(defaultIdeas),
    questions: structuredClone(defaultQuestions),
    topics: [...defaultTopics],
    articles: []
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();

    const saved = JSON.parse(raw);
    const base = freshState();

    return {
      journal: Array.isArray(saved.journal) ? saved.journal : base.journal,
      ideas: Array.isArray(saved.ideas) ? saved.ideas : base.ideas,
      questions: Array.isArray(saved.questions) ? saved.questions : base.questions,
      topics: Array.isArray(saved.topics) ? saved.topics : base.topics,
      articles: Array.isArray(saved.articles) ? saved.articles : base.articles
    };
  } catch (error) {
    console.error("Could not load saved data:", error);
    return freshState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
