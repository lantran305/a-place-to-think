export const STORAGE_KEY = "a-place-to-think-journal";

export const defaultIdeas = [
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

export const defaultQuestions = [
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

export const defaultTopics = [
  "Love",
  "People",
  "Growth"
];

export function loadState() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    );

    return saved || {
      journal: [],
      ideas: defaultIdeas,
      questions: defaultQuestions,
      topics: defaultTopics,
      articles: []
    };

  } catch {
    return {
      journal: [],
      ideas: defaultIdeas,
      questions: defaultQuestions,
      topics: defaultTopics,
      articles: []
    };
  }
}

export function saveState(state) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );
}

export function createId() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now());
}
