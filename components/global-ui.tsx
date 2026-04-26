"use client";

import { useEffect, useRef, useState, useCallback } from "react";

function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ dotX: 0, dotY: 0, ringX: 0, ringY: 0 });

  useEffect(() => {
    pos.current = { dotX: innerWidth / 2, dotY: innerHeight / 2, ringX: innerWidth / 2, ringY: innerHeight / 2 };
    const onMove = (e: MouseEvent) => {
      pos.current.dotX = e.clientX;
      pos.current.dotY = e.clientY;
      if (dotRef.current) { dotRef.current.style.left = e.clientX + "px"; dotRef.current.style.top = e.clientY + "px"; }
    };
    document.addEventListener("mousemove", onMove);
    let raf: number;
    const animate = () => {
      pos.current.ringX += (pos.current.dotX - pos.current.ringX) * 0.12;
      pos.current.ringY += (pos.current.dotY - pos.current.ringY) * 0.12;
      if (ringRef.current) { ringRef.current.style.left = pos.current.ringX + "px"; ringRef.current.style.top = pos.current.ringY + "px"; }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (barRef.current) barRef.current.style.width = (scrollY / max * 100) + "%";
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <div ref={barRef} className="scroll-progress" />;
}

function AnimusScan() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    el.style.opacity = "1";
    el.style.transition = "top 1.6s cubic-bezier(0.4,0,0.2,1), opacity 0.4s";
    const t1 = setTimeout(() => {
      el.style.top = "100vh";
      setTimeout(() => { el.style.opacity = "0"; }, 1600);
    }, 200);
    return () => clearTimeout(t1);
  }, []);
  return <div ref={ref} className="animus-scan" />;
}

function AnimusData() {
  const [time, setTime] = useState("");
  const [seq, setSeq] = useState("MEM_SEQ_01 / ANIMUS v2.0.1");
  useEffect(() => {
    setTime("SYS " + new Date().toLocaleTimeString("en-GB"));
    const id = setInterval(() => setTime("SYS " + new Date().toLocaleTimeString("en-GB")), 1000);
    const handler = (e: Event) => setSeq((e as CustomEvent).detail);
    window.addEventListener("ark:seq", handler);
    return () => { clearInterval(id); window.removeEventListener("ark:seq", handler); };
  }, []);
  return (
    <div className="animus-data" aria-hidden="true">
      <div>LAT 42.5803° N / LNG 83.0302° W</div>
      <div>{seq}</div>
      <div>{time}</div>
    </div>
  );
}

function EagleVision() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "v" && e.key !== "V") return;
      clearTimeout(timer);
      document.body.classList.add("eagle-active");
      overlayRef.current?.classList.add("active");
      labelRef.current?.classList.add("active");
      window.dispatchEvent(new CustomEvent("ark:seq", { detail: "EAGLE VISION / SCANNING..." }));
      timer = setTimeout(() => {
        document.body.classList.remove("eagle-active");
        overlayRef.current?.classList.remove("active");
        labelRef.current?.classList.remove("active");
        window.dispatchEvent(new CustomEvent("ark:seq", { detail: "MEM_SEQ_01 / ANIMUS v2.0.1" }));
      }, 3000);
    };
    document.addEventListener("keydown", handler);
    return () => { document.removeEventListener("keydown", handler); clearTimeout(timer); };
  }, []);
  return (
    <>
      <div ref={overlayRef} className="eagle-overlay" />
      <div ref={labelRef} className="eagle-label">EAGLE VISION ACTIVE</div>
    </>
  );
}

function BgShapes() {
  const ref = useRef<HTMLDivElement>(null);
  const promoted = useRef(false);
  const idle = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const shapes = ref.current?.querySelectorAll<HTMLElement>(".shape[data-speed]");
    if (!shapes) return;
    const onScroll = () => {
      const y = scrollY;
      if (!promoted.current) { shapes.forEach(s => s.style.willChange = "transform"); promoted.current = true; }
      shapes.forEach(s => {
        const speed = parseFloat(s.dataset.speed ?? "0");
        const base = s.classList.contains("shape-square") ? "rotate(45deg) " : "";
        s.style.transform = `${base}translateY(${y * speed}px)`;
      });
      if (idle.current) clearTimeout(idle.current);
      idle.current = setTimeout(() => { shapes.forEach(s => s.style.willChange = ""); promoted.current = false; }, 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div ref={ref} className="bg-shapes" aria-hidden="true">
      <div className="shape shape-ring-lg" data-speed="0.06" />
      <div className="shape shape-ring-md" data-speed="0.12" />
      <div className="shape shape-square" data-speed="0.05" />
      <div className="shape shape-ring-sm" data-speed="0.09" />
      <div className="shape shape-cross" data-speed="0.14">+</div>
      <div className="shape shape-bracket-l" data-speed="0.07">{"{"}</div>
      <div className="shape shape-bracket-r" data-speed="0.1">{"}"}</div>
      <div className="shape shape-dots" data-speed="0.08" />
      <div className="shape shape-triangle" data-speed="0.04" />
    </div>
  );
}

const DroneSVG = () => (
  <svg width="160" height="140" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="isoBodyTop" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#1E5280"/><stop offset="50%" stopColor="#0C2238"/><stop offset="100%" stopColor="#050E1C"/></linearGradient>
      <linearGradient id="isoBodyR" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#0C2030"/><stop offset="100%" stopColor="#030810"/></linearGradient>
      <linearGradient id="isoBodyL" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#071018"/><stop offset="100%" stopColor="#020509"/></linearGradient>
      <linearGradient id="isoArmF" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#164466"/><stop offset="100%" stopColor="#050E1A"/></linearGradient>
      <linearGradient id="isoArmB" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#0A1E30"/><stop offset="100%" stopColor="#030810"/></linearGradient>
      <radialGradient id="isoMotF" cx="38%" cy="35%"><stop offset="0%" stopColor="#2A6EA8"/><stop offset="100%" stopColor="#061422"/></radialGradient>
      <radialGradient id="isoMotB" cx="38%" cy="35%"><stop offset="0%" stopColor="#164868"/><stop offset="100%" stopColor="#040E1A"/></radialGradient>
      <radialGradient id="isoLens" cx="32%" cy="30%"><stop offset="0%" stopColor="#8AEBFF"/><stop offset="45%" stopColor="#0EA5E9"/><stop offset="100%" stopColor="#032840"/></radialGradient>
      <radialGradient id="isoRotF" cx="50%" cy="50%"><stop offset="0%" stopColor="#60D8F8" stopOpacity="0.65"/><stop offset="65%" stopColor="#0EA5E9" stopOpacity="0.22"/><stop offset="100%" stopColor="#0EA5E9" stopOpacity="0"/></radialGradient>
      <radialGradient id="isoRotB" cx="50%" cy="50%"><stop offset="0%" stopColor="#38BDF8" stopOpacity="0.42"/><stop offset="65%" stopColor="#0EA5E9" stopOpacity="0.14"/><stop offset="100%" stopColor="#0EA5E9" stopOpacity="0"/></radialGradient>
    </defs>
    <polygon points="50,47 46,59 19,82 23,70" fill="url(#isoArmB)" opacity="0.8"/>
    <line x1="48" y1="53" x2="21" y2="76" stroke="#0EA5E9" strokeWidth="0.7" strokeLinecap="round" opacity="0.3"/>
    <polygon points="110,47 114,59 141,82 137,70" fill="url(#isoArmB)" opacity="0.8"/>
    <line x1="112" y1="53" x2="139" y2="76" stroke="#0EA5E9" strokeWidth="0.7" strokeLinecap="round" opacity="0.3"/>
    <ellipse cx="20" cy="84" rx="13" ry="6" fill="url(#isoMotB)" stroke="#0EA5E9" strokeWidth="0.75" opacity="0.75"/>
    <path d="M7,84 Q7,93 20,97 Q33,93 33,84" fill="#03090F" stroke="#07141E" strokeWidth="0.5" opacity="0.9"/>
    <ellipse cx="20" cy="84" rx="4.5" ry="2.2" fill="#080E1C" stroke="#0EA5E9" strokeWidth="0.8" opacity="0.75"/>
    <ellipse cx="140" cy="84" rx="13" ry="6" fill="url(#isoMotB)" stroke="#0EA5E9" strokeWidth="0.75" opacity="0.75"/>
    <path d="M127,84 Q127,93 140,97 Q153,93 153,84" fill="#03090F" stroke="#07141E" strokeWidth="0.5" opacity="0.9"/>
    <ellipse cx="140" cy="84" rx="4.5" ry="2.2" fill="#080E1C" stroke="#0EA5E9" strokeWidth="0.8" opacity="0.75"/>
    <ellipse cx="20" cy="84" rx="12" ry="5.5" fill="url(#isoRotB)" opacity="0.7"/>
    <ellipse cx="140" cy="84" rx="12" ry="5.5" fill="url(#isoRotB)" opacity="0.7"/>
    <g className="rotor r-bl"><ellipse cx="20" cy="79" rx="2" ry="5.5" fill="#38BDF8" opacity="0.65"/><ellipse cx="20" cy="79" rx="2" ry="5.5" fill="#38BDF8" opacity="0.65" transform="rotate(120 20 84)"/><ellipse cx="20" cy="79" rx="2" ry="5.5" fill="#38BDF8" opacity="0.65" transform="rotate(240 20 84)"/></g>
    <g className="rotor r-br"><ellipse cx="140" cy="79" rx="2" ry="5.5" fill="#38BDF8" opacity="0.65"/><ellipse cx="140" cy="79" rx="2" ry="5.5" fill="#38BDF8" opacity="0.65" transform="rotate(120 140 84)"/><ellipse cx="140" cy="79" rx="2" ry="5.5" fill="#38BDF8" opacity="0.65" transform="rotate(240 140 84)"/></g>
    <polygon points="112,47 80,65 80,78 112,60" fill="url(#isoBodyR)"/>
    <polygon points="48,47 80,65 80,78 48,60" fill="url(#isoBodyL)"/>
    <polygon points="80,29 112,47 80,65 48,47" fill="url(#isoBodyTop)" stroke="#4CC9F0" strokeWidth="0.9"/>
    <line x1="80" y1="29" x2="48" y2="47" stroke="#7AE7FF" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
    <line x1="80" y1="33" x2="80" y2="62" stroke="rgba(74,201,240,0.18)" strokeWidth="0.7" strokeDasharray="3,4"/>
    <polygon points="72,45 80,41 88,45 80,49" fill="none" stroke="rgba(74,201,240,0.22)" strokeWidth="0.65"/>
    <polygon points="55,41 51,53 22,34 26,22" fill="url(#isoArmF)" opacity="0.95"/>
    <line x1="53" y1="47" x2="24" y2="28" stroke="#4CC9F0" strokeWidth="1.1" strokeLinecap="round" opacity="0.55"/>
    <polygon points="105,41 109,53 138,34 134,22" fill="url(#isoArmF)" opacity="0.95"/>
    <line x1="107" y1="47" x2="136" y2="28" stroke="#4CC9F0" strokeWidth="1.1" strokeLinecap="round" opacity="0.55"/>
    <ellipse cx="23" cy="26" rx="14" ry="6.5" fill="url(#isoMotF)" stroke="#4CC9F0" strokeWidth="1"/>
    <path d="M9,26 Q9,36 23,40 Q37,36 37,26" fill="#04101E" stroke="#08182C" strokeWidth="0.6"/>
    <ellipse cx="23" cy="26" rx="5" ry="2.4" fill="#0C1E30" stroke="#38BDF8" strokeWidth="1"/>
    <ellipse cx="137" cy="26" rx="14" ry="6.5" fill="url(#isoMotF)" stroke="#4CC9F0" strokeWidth="1"/>
    <path d="M123,26 Q123,36 137,40 Q151,36 151,26" fill="#04101E" stroke="#08182C" strokeWidth="0.6"/>
    <ellipse cx="137" cy="26" rx="5" ry="2.4" fill="#0C1E30" stroke="#38BDF8" strokeWidth="1"/>
    <ellipse cx="23" cy="26" rx="13" ry="6" fill="url(#isoRotF)" opacity="0.85"/>
    <ellipse cx="137" cy="26" rx="13" ry="6" fill="url(#isoRotF)" opacity="0.85"/>
    <g className="rotor r-tl"><ellipse cx="23" cy="21" rx="2.2" ry="6" fill="#8AF0FF" opacity="0.9"/><ellipse cx="23" cy="21" rx="2.2" ry="6" fill="#8AF0FF" opacity="0.9" transform="rotate(120 23 26)"/><ellipse cx="23" cy="21" rx="2.2" ry="6" fill="#8AF0FF" opacity="0.9" transform="rotate(240 23 26)"/></g>
    <g className="rotor r-tr"><ellipse cx="137" cy="21" rx="2.2" ry="6" fill="#8AF0FF" opacity="0.9"/><ellipse cx="137" cy="21" rx="2.2" ry="6" fill="#8AF0FF" opacity="0.9" transform="rotate(120 137 26)"/><ellipse cx="137" cy="21" rx="2.2" ry="6" fill="#8AF0FF" opacity="0.9" transform="rotate(240 137 26)"/></g>
    <ellipse cx="80" cy="68" rx="11" ry="5.5" fill="#07111E" stroke="#4CC9F0" strokeWidth="0.9"/>
    <ellipse cx="80" cy="68" rx="7.5" ry="3.8" fill="rgba(14,165,233,0.09)" stroke="#0EA5E9" strokeWidth="0.75"/>
    <ellipse cx="80" cy="68" rx="4.5" ry="2.3" fill="url(#isoLens)"/>
    <ellipse cx="78.2" cy="66.8" rx="1.4" ry="0.7" fill="white" opacity="0.38"/>
    <ellipse cx="80" cy="68" rx="2" ry="1" fill="#38BDF8" opacity="0.95"><animate attributeName="rx" values="2;2.6;2" dur="3.5s" repeatCount="indefinite"/><animate attributeName="ry" values="1;1.3;1" dur="3.5s" repeatCount="indefinite"/></ellipse>
    <circle cx="34" cy="62" r="2.2" fill="#FF3344"><animate attributeName="fill" values="#FF3344;#440011;#FF3344" dur="1.1s" repeatCount="indefinite"/><animate attributeName="r" values="2.2;2.8;2.2" dur="1.1s" repeatCount="indefinite"/></circle>
    <circle cx="126" cy="44" r="2.2" fill="#22EE66"><animate attributeName="fill" values="#22EE66;#003318;#22EE66" dur="1.1s" begin="0.55s" repeatCount="indefinite"/><animate attributeName="r" values="2.2;2.8;2.2" dur="1.1s" begin="0.55s" repeatCount="indefinite"/></circle>
    <circle cx="80" cy="77" r="2"><animate attributeName="fill" values="#FCE300;#332900;#FCE300" dur="2s" repeatCount="indefinite"/><animate attributeName="r" values="2;2.6;2" dur="2s" repeatCount="indefinite"/></circle>
    <polygon points="74,79 86,79 93,102 67,102" fill="rgba(252,227,0,0.03)"><animate attributeName="opacity" values="0.9;0;0.9" dur="2.2s" repeatCount="indefinite"/></polygon>
    <line x1="80" y1="79" x2="80" y2="104" stroke="#FCE300" strokeWidth="0.75" opacity="0.35"><animate attributeName="opacity" values="0.35;0;0.35" dur="2.2s" repeatCount="indefinite"/></line>
  </svg>
);

function Drone() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const dramaActive = useRef(false);

  const showHud = useCallback((text: string, cls: string, duration: number) => {
    const hud = hudRef.current; if (!hud) return;
    hud.textContent = text;
    hud.className = "drone-hud " + cls + " show";
    setTimeout(() => { if (hudRef.current) hudRef.current.className = "drone-hud"; }, duration);
  }, []);

  const triggerCrash = useCallback(() => {
    if (dramaActive.current) return;
    dramaActive.current = true;
    const wrap = wrapRef.current; if (!wrap) return;
    wrap.style.animationPlayState = "paused";
    wrap.classList.add("drone-crashing");
    showHud("⚠ UAV SIGNAL LOST", "danger", 2100);
    setTimeout(() => { wrap.classList.remove("drone-crashing"); wrap.classList.add("drone-respawning"); showHud("↓ RECONNECTING...", "info", 1200); }, 2300);
    setTimeout(() => { wrap.classList.remove("drone-respawning"); wrap.style.animationPlayState = ""; dramaActive.current = false; }, 3500);
  }, [showHud]);

  const triggerEvade = useCallback(() => {
    if (dramaActive.current) return;
    dramaActive.current = true;
    const wrap = wrapRef.current; if (!wrap) return;
    wrap.classList.add("drone-evading");
    showHud("! EVASIVE MANEUVER", "info", 900);
    setTimeout(() => { wrap.classList.remove("drone-evading"); dramaActive.current = false; }, 900);
  }, [showHud]);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    function schedule() {
      t = setTimeout(() => {
        if (!document.hidden) Math.random() < 0.45 ? triggerCrash() : triggerEvade();
        schedule();
      }, 14000 + Math.random() * 16000);
    }
    schedule();
    return () => clearTimeout(t);
  }, [triggerCrash, triggerEvade]);

  return (
    <>
      <div ref={hudRef} className="drone-hud" />
      <div ref={wrapRef} className="drone-wrap" aria-hidden="true">
        <div className="drone-bob">
          <div className="drone-shadow" />
          <div className="drone-tilt"><DroneSVG /></div>
        </div>
      </div>
    </>
  );
}

export function GlobalUI() {
  return (
    <>
      <Cursor />
      <ScrollProgress />
      <AnimusScan />
      <div className="hud-corner hud-tl" /><div className="hud-corner hud-tr" />
      <div className="hud-corner hud-bl" /><div className="hud-corner hud-br" />
      <AnimusData />
      <EagleVision />
      <BgShapes />
      <Drone />
    </>
  );
}
