"use client";

import { navTo } from "@/lib/scroll";

const links = ["services", "work", "about", "contact"];

export default function Footer() {
  function nav(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    navTo(id);
    history.pushState(null, "", "/" + id);
  }

  return (
    <footer>
      <span className="footer-copy">© 2026 ARK Systems LLC &nbsp;|&nbsp; Sterling Heights, MI</span>
      <ul className="footer-links">
        {links.map(id => (
          <li key={id}><a href={"/" + id} onClick={e => nav(e, id)}>{id}</a></li>
        ))}
      </ul>
    </footer>
  );
}
