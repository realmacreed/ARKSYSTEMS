"use client";

import { useState } from "react";
import { Reveal } from "./reveal";

type BtnState = { text: string; disabled: boolean; style: React.CSSProperties };
const DEFAULT_BTN: BtnState = { text: "Send Message →", disabled: false, style: {} };

export default function Contact() {
  const [btn, setBtn] = useState<BtnState>(DEFAULT_BTN);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setBtn({ text: "Sending...", disabled: true, style: {} });
    try {
      const res = await fetch("https://formspree.io/f/mwvazowd", {
        method: "POST", body: new FormData(form), headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setBtn({ text: "Message Sent ✓", disabled: true, style: { background: "#10b981" } });
        form.reset();
        setTimeout(() => setBtn(DEFAULT_BTN), 3500);
      } else throw new Error();
    } catch {
      setBtn({ text: "Failed. Try Again", disabled: false, style: { background: "#ef4444" } });
      setTimeout(() => setBtn(DEFAULT_BTN), 3000);
    }
  }

  return (
    <section id="contact">
      <Reveal className="section-header">
        <span className="section-num">// <span className="seq-num">04</span> / Contact</span>
        <h2 className="section-title">Start a Project.</h2>
        <p className="section-sub">Tell us what you&apos;re building. We&apos;ll take it from there.</p>
      </Reveal>
      <div className="contact-layout">
        <Reveal className="contact-info">
          {[
            { label: "Email", value: "info@ark-techsystems.com" },
            { label: "Location", value: "Sterling Heights, MI" },
            { label: "Availability", value: "Currently accepting new clients" },
            { label: "Response Time", value: "Within 24–48 hours" },
          ].map(({ label, value }) => (
            <div key={label} className="contact-item">
              <div className="contact-label">{label}</div>
              <div className="contact-value">{value}</div>
            </div>
          ))}
        </Reveal>
        <Reveal delay={100}>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="name">Name</label>
                <input className="form-input" type="text" id="name" name="name" placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input className="form-input" type="email" id="email" name="email" placeholder="your@email.com" required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="subject">What do you need?</label>
              <input className="form-input" type="text" id="subject" name="subject" placeholder="e.g. New website, Shopify store, redesign..." />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="message">Tell us more</label>
              <textarea className="form-textarea" id="message" name="message" placeholder="Share details, timeline, budget, or questions..." required />
            </div>
            <button type="submit" className="btn-submit" disabled={btn.disabled} style={btn.style}>{btn.text}</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
