import { useState } from "react";
import { dailyProblems } from "../data/problems";

export function ProblemCard() {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);

  const problem = dailyProblems[index];
  const solved = choice === problem.answer;

  function nextProblem() {
    setIndex((value) => (value + 1) % dailyProblems.length);
    setChoice(null);
  }

  const message =
    choice === null
      ? "Pick an answer — the working shows up once you do."
      : solved
        ? problem.explanation
        : "Not quite. Try another option; the reasoning is the point.";

  return (
    <aside className="notebook" aria-labelledby="daily-problem">
      <span className="notebook-tape" aria-hidden="true" />
      <div className="notebook-head">
        <span className="tag tag-lime">Daily problem</span>
        <span className="mono-label">
          {problem.topic} · {String(index + 1).padStart(2, "0")}/{String(dailyProblems.length).padStart(2, "0")}
        </span>
      </div>

      <h2 id="daily-problem" className="notebook-q">
        {problem.prompt}
      </h2>

      <div className="answers">
        {problem.options.map((option) => {
          const state = choice === option ? (option === problem.answer ? " is-correct" : " is-wrong") : "";
          return (
            <button
              key={option}
              type="button"
              className={`answer${state}`}
              onClick={() => setChoice(option)}
              disabled={solved}
            >
              {option}
            </button>
          );
        })}
      </div>

      <p className={solved ? "feedback is-good" : "feedback"} role="status" aria-live="polite">
        {message}
      </p>

      <div className="notebook-foot">
        <button type="button" className="link-btn" onClick={nextProblem}>
          Next problem
          <span aria-hidden="true">→</span>
        </button>
        <span className="mono-label">No account needed</span>
      </div>
    </aside>
  );
}
