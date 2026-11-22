import { useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { topics } from "../data/topics";

export function TopicTabs() {
  const [active, setActive] = useState(topics[0].id);
  const topic = topics.find((item) => item.id === active) ?? topics[0];

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const current = topics.findIndex((item) => item.id === active);
    const offset = event.key === "ArrowRight" ? 1 : topics.length - 1;
    const next = topics[(current + offset) % topics.length];
    setActive(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  }

  return (
    <div className="explorer">
      <div className="explorer-tabs" role="tablist" aria-label="Sample problems by topic">
        {topics.map((item) => (
          <button
            key={item.id}
            id={`tab-${item.id}`}
            className="explorer-tab"
            type="button"
            role="tab"
            aria-selected={item.id === active}
            aria-controls={`panel-${item.id}`}
            tabIndex={item.id === active ? 0 : -1}
            onClick={() => setActive(item.id)}
            onKeyDown={onKeyDown}
          >
            <span aria-hidden="true">{item.symbol}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div
        className="explorer-panel"
        role="tabpanel"
        id={`panel-${topic.id}`}
        aria-labelledby={`tab-${topic.id}`}
        key={topic.id}
      >
        <div className="explorer-question">
          <p className="mono-label">Try this one</p>
          <h3>{topic.question}</h3>
        </div>
        <details className="reveal-answer">
          <summary>Show the working</summary>
          <p className="explorer-answer">{topic.answer}</p>
          <p>{topic.working}</p>
        </details>
        <p className="explorer-why">{topic.why}</p>
        <Link className="class-link" to="/classes">
          Find the class that covers this
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
