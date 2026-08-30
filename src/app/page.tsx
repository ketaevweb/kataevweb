import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Services } from "@/components/site/Services";
import { Process } from "@/components/site/Process";
import { Portfolio } from "@/components/site/Portfolio";
import { Faq } from "@/components/site/Faq";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Services />
        <Process />
        <Portfolio />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
