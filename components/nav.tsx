"use client";

import { useState, useEffect } from "react";

function scrollTo(id: string) {
  if (!id) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

const links = [
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const init = window.location.pathname.replace(/^\//, "");
    if (init) setTimeout(() => scrollTo(init), 150);
    const onPop = () => scrollTo(window.location.pathname.replace(/^\//, ""));
    window.addEventListener("popstate", onPop);
    const onOutside = (e: MouseEvent) => {
      const t = e.target as Element;
      if (open && !t.closest("#mobileMenu") && !t.closest("#hamburger")) setOpen(false);
    };
    document.addEventListener("click", onOutside);
    return () => { window.removeEventListener("popstate", onPop); document.removeEventListener("click", onOutside); };
  }, [open]);

  function nav(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    scrollTo(id);
    history.pushState(null, "", id ? "/" + id : "/");
    setOpen(false);
  }

  return (
    <>
      <nav>
        <a href="/" onClick={e => nav(e, "")} className="nav-logo">
          ARK <span className="blue">SYSTEMS</span>
          <span className="glitch-r" aria-hidden="true">ARK SYSTEMS</span>
          <span className="glitch-b" aria-hidden="true">ARK SYSTEMS</span>
        </a>
        <ul className="nav-links">
          {links.map(({ id, label }) => (
            <li key={id}><a href={"/" + id} onClick={e => nav(e, id)}>{label}</a></li>
          ))}
          <li><a href="/contact" onClick={e => nav(e, "contact")} className="btn-nav">Get a Quote</a></li>
        </ul>
        <button id="hamburger" className="hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {open && (
        <div id="mobileMenu" className="mobile-menu">
          {links.map(({ id, label }) => (
            <a key={id} href={"/" + id} onClick={e => nav(e, id)}>{label}</a>
          ))}
          <a href="/contact" onClick={e => nav(e, "contact")} className="btn-nav" style={{ alignSelf: "flex-start" }}>Get a Quote</a>
        </div>
      )}
    </>
  );
}
