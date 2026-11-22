export type Problem = {
  id: string;
  topic: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

export const dailyProblems: Problem[] = [
  {
    id: "001",
    topic: "Order of operations",
    prompt: "What is 12 × 8 ÷ 6 + 4?",
    options: ["16", "20", "24", "28"],
    answer: "20",
    explanation:
      "12 × 8 = 96, then 96 ÷ 6 = 16, then 16 + 4 = 20. Multiplication and division happen before addition.",
  },
  {
    id: "002",
    topic: "Linear equations",
    prompt: "If 3x + 7 = 22, what is x?",
    options: ["3", "5", "7", "15"],
    answer: "5",
    explanation: "Subtract 7 from both sides to get 3x = 15, then divide both sides by 3 to get x = 5.",
  },
  {
    id: "003",
    topic: "Angles",
    prompt: "A triangle has angles of 42° and 61°. What is the third angle?",
    options: ["67°", "77°", "87°", "103°"],
    answer: "77°",
    explanation: "The angles in a triangle add up to 180°, so 180 − 42 − 61 = 77°.",
  },
  {
    id: "004",
    topic: "Slope",
    prompt: "What is the slope of the line through (2, 3) and (6, 11)?",
    options: ["1", "2", "4", "8"],
    answer: "2",
    explanation: "Slope is rise over run: (11 − 3) ÷ (6 − 2) = 8 ÷ 4 = 2.",
  },
];
