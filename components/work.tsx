"use client";

import { Reveal } from "./reveal";
import { navTo } from "@/lib/scroll";

const projects = [
  {
    tags: ["Shopify", "eCommerce", "Custom Theme"],
    title: "Longitude Marine",
    desc: "Custom Shopify theme for a marine parts distributor with a filterable catalog, call-to-order UX for out-of-stock items, and a mobile-first layout built for trade buyers.",
    href: "https://longitude-marine.myshopify.com",
    external: true,
  },
  {
    tags: ["HTML/CSS/JS", "Branding", "Landing Page"],
    title: "DallasExotics",
    desc: "High-impact landing page for a Dallas luxury car rental brand featuring editorial dark layout, custom animations, multilingual support, and a seamless mobile experience.",
    href: "https://dallasexotics.us",
    external: true,
  },
  {
    tags: ["Available"],
    title: "Your Project",
    desc: "Spot open. Every project we take on gets the same level of craft: strategic thinking, sharp execution, and direct communication from brief to launch.",
    href: "/contact",
    external: false,
  },
];

export default function Work() {
  return (
    <section id="work">
      <Reveal className="section-header">
        <span className="section-num">// <span className="seq-num">02</span> / Work</span>
        <h2 className="section-title">Recent Projects</h2>
        <p className="section-sub">A selection of work we&apos;re proud to put our name on.</p>
      </Reveal>
      <div className="work-grid">
        {projects.map((p, i) => (
          <Reveal key={p.title} delay={i * 100}>
            <div className="work-card">
              <div className="work-card-body">
                <div className="work-tags">{p.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
                <h3 className="work-title">{p.title}</h3>
                <p className="work-desc">{p.desc}</p>
                <a
                  href={p.href}
                  className="work-link"
                  {...(p.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : { onClick: (e) => { e.preventDefault(); navTo("contact"); history.pushState(null, "", "/contact"); } }
                  )}
                >
                  {p.external ? "View Project" : "Start a Project"} →
                </a>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
