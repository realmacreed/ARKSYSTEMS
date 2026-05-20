import { Reveal } from "./reveal";

const services = [
  {
    icon: "◻",
    title: "Web Design",
    desc: "Pixel-perfect interfaces built to convert. We design experiences that reflect your brand, communicate your value, and keep visitors engaged from first scroll to final click.",
  },
  {
    icon: "⌥",
    title: "Application Development",
    desc: "Clean, fast, scalable code. Whether it's a marketing site, web app, or custom platform. We build with performance and maintainability at the core. No shortcuts, no bloat.",
  },
  {
    icon: "⊞",
    title: "eCommerce Consulting",
    desc: "Launch and scale your online store with confidence. Shopify, WooCommerce, or custom builds. We help you pick the right platform, set it up right, and get it selling.",
  },
  {
    icon: "◈",
    title: "Drone Recording",
    desc: "Cinematic aerial footage for real estate, events, and promotional content. We handle flight, capture, and delivery. High-resolution video and stills that make your project stand out from the ground up.",
  },
  {
    icon: "⌂",
    title: "Smart Home Setup",
    desc: "Full smart home installation and integration. Lighting, security, climate, and automation, all configured to work together seamlessly. We set it up, walk you through it, and make sure everything just works.",
  },
  {
    icon: "⊙",
    title: "Security Camera Installation",
    desc: "Professional camera installation for homes and businesses. Wired or wireless, indoor or outdoor. We handle placement, setup, and remote access configuration so you always know what's happening on your property.",
  },
];

export default function Services() {
  return (
    <section id="services">
      <Reveal className="section-header">
        <span className="section-num">// <span className="seq-num">01</span> / Services</span>
        <h2 className="section-title">What We Do</h2>
        <p className="section-sub">From concept to launch, every layer of your digital presence, handled.</p>
      </Reveal>
      <div className="services-grid">
        {services.map((s, i) => {
          const num = `_${String(i + 1).padStart(2, "0")}`;
          return (
            <Reveal key={num} delay={i * 100}>
              <div className="service-card">
                <span className="service-icon">{s.icon}</span>
                <h3 className="service-title">{s.title}</h3>
                <p className="service-desc">{s.desc}</p>
                <span className="service-num">{num}</span>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
