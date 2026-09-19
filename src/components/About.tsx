import { siteConfig } from "@/content/site";
import { Reveal } from "@/components/Reveal";

export function About() {
  return (
    <section
      id="sobre"
      className="scroll-mt-24 border-t border-black/5 px-5 py-20 sm:px-8 sm:py-28 lg:px-10"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <Reveal>
          <h2 className="title-section">
            <span className="text-ink text-shadow-title">SO</span>
            <span className="text-coral text-shadow-title">BRE</span>
          </h2>
        </Reveal>
        <Reveal delayMs={80}>
          <p className="max-w-2xl text-lg leading-relaxed text-graphite sm:text-xl sm:leading-relaxed">
            {siteConfig.about}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
