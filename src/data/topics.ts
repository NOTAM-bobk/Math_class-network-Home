export type Topic = {
  id: string;
  label: string;
  symbol: string;
  question: string;
  answer: string;
  working: string;
  why: string;
};

export const topics: Topic[] = [
  {
    id: "algebra",
    label: "Algebra",
    symbol: "x",
    question: "Solve 2(x − 3) = 10",
    answer: "x = 8",
    working: "Divide both sides by 2 to get x − 3 = 5, then add 3 to both sides.",
    why: "Every later topic assumes you can rearrange an equation without losing a sign.",
  },
  {
    id: "geometry",
    label: "Geometry",
    symbol: "△",
    question: "A circle has radius 5. What is its area?",
    answer: "25π",
    working: "Area of a circle is πr², so π × 5² = 25π (about 78.5).",
    why: "Circle facts come back in trigonometry, calculus and every bearings question.",
  },
  {
    id: "calculus",
    label: "Calculus",
    symbol: "∫",
    question: "Differentiate f(x) = x³ − 4x",
    answer: "f′(x) = 3x² − 4",
    working: "Bring each power down as a multiplier, then reduce the power by one: 3x² − 4.",
    why: "Derivatives describe how anything changes — speed, cost, population, error.",
  },
  {
    id: "contest",
    label: "Contest",
    symbol: "♛",
    question: "How many positive divisors does 36 have?",
    answer: "9",
    working: "36 = 2² × 3². Add one to each exponent and multiply: (2 + 1)(2 + 1) = 9.",
    why: "Divisor counting is a first taste of how contest problems turn structure into shortcuts.",
  },
];
