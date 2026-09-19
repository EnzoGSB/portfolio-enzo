import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Works } from "@/components/Works";
import { getAvailableCategories, projects } from "@/lib/projects";

export default function Home() {
  const availableCategories = getAvailableCategories();

  return (
    <>
      <main className="flex-1">
        <Hero />
        <Works projects={projects} availableCategories={availableCategories} />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
