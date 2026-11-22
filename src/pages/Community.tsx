import { Link } from "react-router-dom";
import { useSeo } from "../lib/seo";

const rooms = [
  {
    name: "Study hall",
    blurb: "Quiet co-working with a live question thread. Good for the nights you just need to start.",
    topics: ["Homework", "Notes", "Focus sessions"],
  },
  {
    name: "Homework help",
    blurb: "Post the exact step you are stuck on. Someone replies with the next nudge, not the answer.",
    topics: ["Algebra", "Geometry", "Calculus"],
  },
  {
    name: "Proof practice",
    blurb: "One proof a week, written out properly. Feedback on logic and notation, not just the result.",
    topics: ["Proofs", "Geometry", "Number theory"],
  },
  {
    name: "Contest corner",
    blurb: "Old contest problems, timed sets, and the good kind of arguing about the intended solution.",
    topics: ["AMC style", "Olympiad", "Problem swaps"],
  },
];

const rules = [
  {
    title: "No spoilers",
    body: "Give the next step before the full solution. Let people finish the thought themselves.",
  },
  {
    title: "Ask the small question",
    body: "\u201CThis is probably dumb\u201D is banned here. Every question is on topic.",
  },
  {
    title: "Explain, don't perform",
    body: "Show the reasoning. The cleverest answer is the one someone else can repeat.",
  },
  {
    title: "Keep it human",
    body: "No put-downs, no homework dumps, no selling anything. Report, don't escalate.",
  },
];

const sessions = [
  { day: "Mon", time: "6:00 pm", title: "Algebra clinic", note: "Equations, word problems, exam prep" },
  { day: "Wed", time: "7:00 pm", title: "Proof practice", note: "Bring a proof, leave with notes" },
  { day: "Fri", time: "5:30 pm", title: "Calculus problem hour", note: "Limits and derivatives, no judgement" },
  { day: "Sat", time: "10:00 am", title: "Contest warm-up", note: "Three problems, one hour, then solutions" },
];

const faqs = [
  {
    question: "Do I need an account?",
    answer:
      "Not to look around. The catalogue, sample problems and house rules are open. Posting in a room will need a name, and that is the only thing we will ask for.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes. The network is peer-led: students help each other, and nobody pays to ask a question.",
  },
  {
    question: "Is this a course?",
    answer:
      "No. There are no lectures to sit through and no grades. It is the class you are already taking, with other people in it.",
  },
  {
    question: "What if my level is not listed?",
    answer:
      "Start in the closest room and say so in your first post. Rooms split when there are enough people asking for the same thing.",
  },
];

export default function Community() {
  useSeo({
    title: "Community — MathClass Network",
    description:
      "Study rooms, house rules, weekly sessions and answers to common questions inside the MathClass Network.",
    path: "/community",
  });

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="kicker">
            <span>Community</span> The people
          </p>
          <h1>Rooms where it is fine to not get it yet.</h1>
          <p className="lead">
            Everyone here is in a math class right now. Rooms are organised by what you are working on, not
            by how good you are at it.
          </p>
        </div>
      </section>

      <section className="section section-tight" id="rooms">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="kicker">
                <span>01</span> The rooms
              </p>
              <h2>Four places to start.</h2>
            </div>
            <p>Pick the one that matches tonight&rsquo;s homework.</p>
          </div>

          <div className="room-grid">
            {rooms.map((room) => (
              <article className="room" key={room.name} data-reveal>
                <div className="room-head">
                  <h3>{room.name}</h3>
                  <span className="status">Peer-led</span>
                </div>
                <p>{room.blurb}</p>
                <ul className="room-topics">
                  {room.topics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
                <Link className="btn btn-ghost" to="/#start">
                  Join the room
                </Link>
              </article>
            ))}
          </div>

          <p className="note-bar">
            Rooms are part of the foundation build — the structure is ready, live sessions open as the
            network fills up.
          </p>
        </div>
      </section>

      <section className="section" id="rules">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="kicker">
                <span>02</span> House rules
              </p>
              <h2>How we keep it friendly.</h2>
            </div>
            <p>Four rules, no fine print. They keep the rooms useful for the person two weeks behind.</p>
          </div>

          <ul className="rules">
            {rules.map((rule) => (
              <li className="rule" key={rule.title} data-reveal>
                <h3>{rule.title}</h3>
                <p>{rule.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="sessions">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="kicker">
                <span>03</span> Weekly rhythm
              </p>
              <h2>Sessions on the calendar.</h2>
            </div>
            <p>Informal, drop-in, and recorded only if the room agrees.</p>
          </div>

          <div className="schedule">
            {sessions.map((session) => (
              <div className="slot" key={`${session.day}-${session.title}`}>
                <span className="slot-time">
                  {session.day} · {session.time}
                </span>
                <h3>{session.title}</h3>
                <span className="slot-note">{session.note}</span>
              </div>
            ))}
          </div>

          <p className="note-bar">
            Sample timetable for the foundation release. Times move once the first tutors are confirmed.
          </p>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="kicker">
                <span>04</span> Questions
              </p>
              <h2>The things people ask first.</h2>
            </div>
          </div>

          <div className="faq">
            {faqs.map((faq) => (
              <details className="faq-item" key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-wrap">
        <div className="wrap">
          <div className="cta-inner" data-reveal>
            <p className="eyebrow-pill">
              <span className="dot" aria-hidden="true" />
              Say hello
            </p>
            <h2>Bring your hardest question.</h2>
            <p>
              The best rooms are the ones where someone asks the thing everyone else was too shy to ask.
              Start with a class, then find your people.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-lime" to="/classes">
                Browse classes
              </Link>
              <Link className="btn btn-outline-light" to="/">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
