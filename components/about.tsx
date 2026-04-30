import { Reveal } from "./reveal";
import { LetsTalkLink } from "./lets-talk-link";

const stats = [
  { num: "100%", label: "Custom Builds" },
  { num: "48hr", label: "Response Time" },
  { num: "∞", label: "Revisions" },
];

export default function About() {
  return (
    <section id="about">
      <div className="about-layout">
        <Reveal>
          <div className="section-header">
            <span className="section-num">// <span className="seq-num">03</span> / About</span>
            <h2 className="section-title">Built Unique.</h2>
          </div>
          <div className="about-body">
            <p>ARK Systems is a Sterling Heights, MI web agency focused on building digital products that actually perform. We don&apos;t do cookie-cutter. Every project is designed from the ground up to match your goals, your audience, and your brand.</p>
            <p>We work with everyone from solo entrepreneurs launching their first site to established businesses ready to modernize their online presence. If it lives on the internet, we can build it better.</p>
            <p>Fast turnaround, direct communication, and zero bloated agency overhead. Just solid work at a fair price.</p>
          </div>
          <LetsTalkLink />
        </Reveal>
        <Reveal delay={150} className="about-stats">
          {stats.map(s => (
            <div key={s.label} className="stat">
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
