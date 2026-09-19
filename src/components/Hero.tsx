import { siteConfig } from "@/content/site";
import { Arrow, HandArrow } from "@/components/icons/Arrows";
import { Reveal } from "@/components/Reveal";

export function Hero() {
  return (
    <section
      id="topo"
      className="relative flex min-h-[100svh] flex-col justify-center px-5 pb-16 pt-28 sm:px-8 lg:px-10"
    >
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <h1 className="title-display text-balance">
            <span className="text-coral text-shadow-title">PORT</span>
            <span className="text-ink text-shadow-title">FÓLIO</span>
          </h1>
        </Reveal>

        <Reveal delayMs={80}>
          <div className="mt-8 max-w-xl sm:mt-10">
            <p className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {siteConfig.name}
            </p>
            <p className="mt-3 max-w-md text-base leading-relaxed text-graphite sm:text-lg">
              {siteConfig.tagline}
            </p>
          </div>
        </Reveal>

        <Reveal delayMs={140}>
          <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-5">
            <a href="#trabalhos" className="btn-primary focus-ring">
              Ver trabalhos
            </a>
            <a href="#contato" className="btn-secondary focus-ring">
              Vamos conversar
            </a>
            <HandArrow className="ml-1 hidden h-14 w-20 sm:block motion-safe:animate-nudge" />
          </div>
        </Reveal>

        <Reveal delayMs={200}>
          <a
            href="#trabalhos"
            className="mt-16 inline-flex flex-col items-start gap-2 text-sm font-medium text-graphite transition-colors hover:text-coral focus-ring sm:mt-24"
            aria-label="Rolar para trabalhos"
          >
            <span>Explorar</span>
            <Arrow className="h-10 w-5 motion-safe:animate-bounce-soft" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
