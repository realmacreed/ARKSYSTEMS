const links = ["services", "work", "about", "contact"];

export default function Footer() {
  return (
    <footer>
      <span className="footer-copy">© 2025 ARK Systems LLC &nbsp;|&nbsp; Sterling Heights, MI</span>
      <ul className="footer-links">
        {links.map(id => (
          <li key={id}><a href={"/" + id} style={{ textTransform: "capitalize" }}>{id}</a></li>
        ))}
      </ul>
    </footer>
  );
}
