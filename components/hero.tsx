"use client";

import { useState, useEffect, useRef } from "react";
import { navTo } from "@/lib/scroll";

const phrases = [
  "You run the business.",
  "We handle the digital.",
  "Your vision. Our code.",
  "Fast. Clean. Built to last.",
  "Sites that actually convert.",
];

function useTypewriter() {
  const [text, setText] = useState("");
  useEffect(() => {
    let phraseIdx = 0, charIdx = 0, deleting = false;
    let t: ReturnType<typeof setTimeout>;
    function type() {
      const phrase = phrases[phraseIdx];
      if (!deleting) {
        setText(phrase.slice(0, ++charIdx));
        if (charIdx === phrase.length) { deleting = true; t = setTimeout(type, 2400); return; }
      } else {
        setText(phrase.slice(0, --charIdx));
        if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
      }
      t = setTimeout(type, deleting ? 35 : 60);
    }
    t = setTimeout(type, 1000);
    return () => clearTimeout(t);
  }, []);
  return text;
}

const visionText = "Your Vision.";
const visionChars = [...visionText];

export default function Hero() {
  const text = useTypewriter();
  const [filling, setFilling] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const touchTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = hero.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      if (contentRef.current) contentRef.current.style.transform = `translate(${x * 14}px,${y * 10}px)`;
    };
    const onLeave = () => {
      if (contentRef.current) contentRef.current.style.transform = "";
    };
    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => { hero.removeEventListener("mousemove", onMove); hero.removeEventListener("mouseleave", onLeave); };
  }, []);

  return (
    <section id="hero" ref={heroRef}>
      <div className="hero-grid-bg" />
      <div className="hero-orb" />
      <div ref={contentRef} className="hero-content">
        <div className="hero-label">Sterling Heights, MI &nbsp;·&nbsp; Web Design &amp; Development</div>
        <h1
          className="hero-title"
          onMouseEnter={() => setFilling(true)}
          onMouseLeave={() => setFilling(false)}
          onTouchStart={() => { clearTimeout(touchTimer.current); setFilling(true); }}
          onTouchEnd={() => { touchTimer.current = setTimeout(() => setFilling(false), 600); }}
        >
          <span className="line-1">We Build</span>
          <span className={`line-2${filling ? " vision-filling" : ""}`} id="heroVision">
            {visionChars.map((ch, i) => (
              <span key={i} className="vc" style={{ "--vi": i } as React.CSSProperties}>
                {ch === " " ? " " : ch}
              </span>
            ))}
          </span>
        </h1>
        <div className="hero-terminal">
          <span className="prompt">&gt;</span>
          <span>{text}</span>
          <span className="cursor-blink" />
        </div>
        <div className="hero-ctas">
          <a href="/work" onClick={e => { e.preventDefault(); navTo("work"); history.pushState(null, "", "/work"); }} className="btn-primary">View Our Work</a>
          <a href="/contact" onClick={e => { e.preventDefault(); navTo("contact"); history.pushState(null, "", "/contact"); }} className="btn-outline">Get a Quote</a>
        </div>
      </div>
      <div className="scroll-indicator">
        <div className="scroll-line" />
        Scroll
      </div>
    </section>
  );
}
