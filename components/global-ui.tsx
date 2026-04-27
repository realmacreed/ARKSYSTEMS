"use client";

import { useEffect, useRef, useState } from "react";

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
    let t2: ReturnType<typeof setTimeout>;
    const t1 = setTimeout(() => {
      el.style.top = "100vh";
      t2 = setTimeout(() => { el.style.opacity = "0"; }, 1600);
    }, 200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return <div ref={ref} className="animus-scan" />;
}

function AnimusData() {
  const [time, setTime] = useState(() => "SYS " + new Date().toLocaleTimeString("en-GB"));
  const [seq, setSeq] = useState("MEM_SEQ_01 / ANIMUS v2.0.1");
  useEffect(() => {
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
  const idle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    const shapeEls = ref.current?.querySelectorAll<HTMLElement>(".shape[data-speed]");
    if (!shapeEls?.length) return;
    const shapes = Array.from(shapeEls);
    const speeds = shapes.map(s => parseFloat(s.dataset.speed ?? "0"));
    const isSquare = shapes.map(s => s.classList.contains("shape-square"));
    const onScroll = () => {
      const y = scrollY;
      if (!promoted.current) { shapes.forEach(s => s.style.willChange = "transform"); promoted.current = true; }
      shapes.forEach((s, i) => {
        s.style.transform = `${isSquare[i] ? "rotate(45deg) " : ""}translateY(${y * speeds[i]}px)`;
      });
      clearTimeout(idle.current);
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
    </>
  );
}
