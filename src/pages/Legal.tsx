import { Link } from "react-router-dom";
import { useSeo } from "../lib/seo";
import "../legal.css";

type LegalKind = "terms" | "privacy";

type LegalSection = {
  heading: string;
  body: string[];
  link?: { label: string; href: string };
};

type LegalPage = {
  title: string;
  kicker: string;
  lead: string;
  sections: LegalSection[];
};

const REPO = "https://github.com/NOTAM-bobk/Math_class-network-Home";

const PAGES: Record<LegalKind, LegalPage> = {
  terms: {
    title: "Terms of Service",
    kicker: "Plain terms",
    lead: "The short version: browse freely, play and watch on the sites that host those things, and be decent to the people in the rooms.",
    sections: [
      {
        heading: "Using mathclass.network",
        body: [
          "This site is a free, peer-led network for people learning maths. You can look around the classes, games and videos without an account, and there is nothing to pay.",
        ],
      },
      {
        heading: "Games and videos",
        body: [
          "Search results point at games.mathclass.uk and videos.mathclass.uk. Those are separate sites with their own content and rules, so opening a result leaves this site and that site's terms apply.",
        ],
      },
      {
        heading: "Posting in the rooms",
        body: [
          "Post your own working, and credit anything you did not write. No harassment, spam, or deliberately wrong answers passed off as help.",
        ],
      },
      {
        heading: "Provided as it is",
        body: [
          "The network is run by students. Rooms, links and catalogues can change or break, and the site comes with no warranty that everything is correct or always available.",
        ],
      },
      {
        heading: "Changes to these terms",
        body: [
          "These terms will be updated as the network grows. The date at the top of this page shows the last change.",
        ],
      },
      {
        heading: "Questions",
        body: ["If something here is unclear, open an issue on the project repository."],
        link: { label: "Math_class-network-Home on GitHub", href: REPO },
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    kicker: "What is collected",
    lead: "The short version: there is no account, no analytics and no advertising here, and most searches never leave your browser.",
    sections: [
      {
        heading: "What this page stores",
        body: [
          "The start page does not ask you to sign in, sets no cookies of its own, and loads no analytics, advertising or tracking scripts. Browsing it leaves nothing stored about you on our side.",
        ],
      },
      {
        heading: "How search works",
        body: [
          "Game results come from a catalogue bundled with the site, so game searches are answered entirely in your browser. Video searches send the words you type to the public catalogue at v3-cinemeta.strem.io to fetch matching titles, the same service videos.mathclass.uk uses.",
        ],
      },
      {
        heading: "Following a result",
        body: [
          "Games and videos are hosted on other math_class sites. Once you open one, that site's own privacy policy covers whatever it collects.",
        ],
      },
      {
        heading: "Changes to this policy",
        body: [
          "If the site starts collecting anything new, this page will say so before it happens. The date at the top shows the last change.",
        ],
      },
      {
        heading: "Questions",
        body: ["If you want to know how something works, ask on the project repository."],
        link: { label: "Math_class-network-Home on GitHub", href: REPO },
      },
    ],
  },
};

export default function Legal({ kind }: { kind: LegalKind }) {
  const page = PAGES[kind];

  useSeo({
    title: `${page.title} — MathClass Network`,
    description: page.lead,
    path: `/${kind}`,
  });

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="kicker">
            <span>Legal</span> {page.kicker}
          </p>
          <h1>{page.title}</h1>
          <p className="lead">{page.lead}</p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <div className="legal">
            <p className="legal-updated">Last updated 27 November 2026</p>

            {page.sections.map((section) => (
              <section className="legal-block" key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.link ? (
                  <p>
                    <a href={section.link.href}>{section.link.label}</a>
                  </p>
                ) : null}
              </section>
            ))}

            <p className="legal-back">
              <Link to="/">Back to the start page</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
