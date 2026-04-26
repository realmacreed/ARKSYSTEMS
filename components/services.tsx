import { Reveal } from "./reveal";

const services = [
  {
    icon: "◻",
    title: "Web Design",
    desc: "Pixel-perfect interfaces built to convert. We design experiences that reflect your brand, communicate your value, and keep visitors engaged from first scroll to final click.",
    num: "_01",
  },
  {
    icon: "⌥",
    title: "Web Development",
    desc: "Clean, fast, scalable code. Whether it's a marketing site, web app, or custom platform. We build with performance and maintainability at the core. No shortcuts, no bloat.",
    num: "_02",
  },
  {
    icon: "⊞",
    title: "eCommerce Consulting",
    desc: "Launch and scale your online store with confidence. Shopify, WooCommerce, or custom builds. We help you pick the right platform, set it up right, and get it selling.",
    num: "_03",
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
        {services.map((s, i) => (
          <Reveal key={s.num} delay={i * 100}>
            <div className="service-card">
              <span className="service-icon">{s.icon}</span>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>
              <span className="service-num">{s.num}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
