import Nav from "@/components/nav";
import Hero from "@/components/hero";
import Services from "@/components/services";
import Work from "@/components/work";
import About from "@/components/about";
import Contact from "@/components/contact";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <hr className="section-divider" />
        <Services />
        <hr className="section-divider" />
        <Work />
        <hr className="section-divider" />
        <About />
        <hr className="section-divider" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
