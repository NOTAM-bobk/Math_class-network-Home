export type Level = "middle" | "high" | "college" | "contest";

export type Tint = "lime" | "sky" | "coral" | "pink" | "sun" | "indigo";

export type MathClass = {
  slug: string;
  name: string;
  level: Level;
  levelLabel: string;
  symbol: string;
  tint: Tint;
  blurb: string;
  units: number;
  topics: string[];
  sample: { question: string; answer: string };
};

export const levels: { id: "all" | Level; label: string }[] = [
  { id: "all", label: "All levels" },
  { id: "middle", label: "Middle school" },
  { id: "high", label: "High school" },
  { id: "college", label: "College" },
  { id: "contest", label: "Contest math" },
];

export const classes: MathClass[] = [
  {
    slug: "pre-algebra",
    name: "Pre-Algebra",
    level: "middle",
    levelLabel: "Middle school",
    symbol: "x",
    tint: "lime",
    blurb: "Fractions, ratios, negative numbers, and the first taste of solving for an unknown.",
    units: 10,
    topics: [
      "Fractions and decimals",
      "Ratios and proportions",
      "Negative numbers",
      "Order of operations",
      "Intro to variables",
    ],
    sample: {
      question: "Simplify: 3 + 4 × 2",
      answer: "11 — multiplication happens before addition, so 4 × 2 = 8, then 3 + 8 = 11.",
    },
  },
  {
    slug: "algebra-1",
    name: "Algebra I",
    level: "high",
    levelLabel: "High school",
    symbol: "∞",
    tint: "sky",
    blurb: "Linear equations, functions, systems, and getting comfortable with variables.",
    units: 12,
    topics: [
      "Linear equations",
      "Graphing lines",
      "Systems of equations",
      "Functions and notation",
      "Word problems",
    ],
    sample: {
      question: "Solve 3x + 7 = 22",
      answer: "x = 5 — subtract 7 from both sides to get 3x = 15, then divide by 3.",
    },
  },
  {
    slug: "geometry",
    name: "Geometry",
    level: "high",
    levelLabel: "High school",
    symbol: "△",
    tint: "coral",
    blurb: "Triangles, circles, transformations, and proofs that actually make sense.",
    units: 11,
    topics: [
      "Triangles and congruence",
      "Circle theorems",
      "Similarity",
      "Transformations",
      "Coordinate geometry",
    ],
    sample: {
      question: "A triangle has angles of 42° and 61°. What is the third angle?",
      answer: "77° — the angles in a triangle add up to 180°, and 180 − 42 − 61 = 77.",
    },
  },
  {
    slug: "trigonometry",
    name: "Trigonometry",
    level: "high",
    levelLabel: "High school",
    symbol: "√",
    tint: "pink",
    blurb: "Angles, the unit circle, identities — and why sine shows up everywhere.",
    units: 8,
    topics: [
      "SOH CAH TOA",
      "The unit circle",
      "Graphs of sine and cosine",
      "Identities",
      "Bearings and applications",
    ],
    sample: {
      question: "What is sin 30°?",
      answer: "1/2 — on the unit circle, 30° gives the point (√3/2, 1/2), and sine is the y-coordinate.",
    },
  },
  {
    slug: "pre-calculus",
    name: "Pre-Calculus",
    level: "high",
    levelLabel: "High school",
    symbol: "sin",
    tint: "sun",
    blurb: "Polynomials, exponentials, logs, and the limits idea that calculus leans on.",
    units: 9,
    topics: [
      "Polynomials",
      "Exponentials and logs",
      "Sequences and series",
      "Conic sections",
      "A first look at limits",
    ],
    sample: {
      question: "What is log₂ 8?",
      answer: "3 — 2 raised to the power of 3 is 8, so log base 2 of 8 is 3.",
    },
  },
  {
    slug: "calculus-1",
    name: "Calculus I",
    level: "college",
    levelLabel: "College",
    symbol: "∫",
    tint: "indigo",
    blurb: "Limits, derivatives, and the whole business of measuring change.",
    units: 10,
    topics: [
      "Limits",
      "The derivative",
      "Differentiation rules",
      "Applications of derivatives",
      "A first look at integrals",
    ],
    sample: {
      question: "Differentiate f(x) = x³ − 4x",
      answer: "f′(x) = 3x² − 4 — bring the power down and reduce it by one, term by term.",
    },
  },
  {
    slug: "statistics-data",
    name: "Statistics & Data",
    level: "college",
    levelLabel: "College",
    symbol: "□",
    tint: "sky",
    blurb: "Distributions, sampling, and how to read a claim without being fooled by it.",
    units: 7,
    topics: [
      "Describing data",
      "Probability",
      "Distributions",
      "Sampling",
      "Interpreting studies",
    ],
    sample: {
      question: "What is the mean of 4, 8, 6 and 10?",
      answer: "7 — the total is 28 and there are 4 values, so 28 ÷ 4 = 7.",
    },
  },
  {
    slug: "number-theory",
    name: "Number Theory",
    level: "contest",
    levelLabel: "Contest math",
    symbol: "♛",
    tint: "lime",
    blurb: "Primes, divisibility, modular arithmetic, and problems with unfairly neat answers.",
    units: 6,
    topics: [
      "Divisibility",
      "Primes and factorisation",
      "Modular arithmetic",
      "Diophantine equations",
      "Writing a clean proof",
    ],
    sample: {
      question: "How many positive divisors does 36 have?",
      answer: "9 — 36 = 2² × 3², so the count is (2 + 1)(2 + 1) = 9.",
    },
  },
];

export function getClass(slug?: string): MathClass | undefined {
  return classes.find((item) => item.slug === slug);
}

export function relatedClasses(current: MathClass, count = 3): MathClass[] {
  const sameLevel = classes.filter((item) => item.slug !== current.slug && item.level === current.level);
  const rest = classes.filter((item) => item.slug !== current.slug && item.level !== current.level);
  return [...sameLevel, ...rest].slice(0, count);
}
