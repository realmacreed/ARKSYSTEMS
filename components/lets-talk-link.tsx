"use client";

import { navTo } from "@/lib/scroll";

export function LetsTalkLink() {
  return (
    <a
      href="/contact"
      className="btn-primary"
      onClick={e => { e.preventDefault(); navTo("contact"); history.pushState(null, "", "/contact"); }}
    >
      Let&apos;s Talk
    </a>
  );
}
