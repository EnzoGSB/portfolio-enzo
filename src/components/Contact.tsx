import { Arrow } from "@/components/icons/Arrows";
import { Reveal } from "@/components/Reveal";
import { getFilledContacts, type ContactKey } from "@/content/site";

const LABELS: Record<ContactKey, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  email: "E-mail",
};

function contactHref(key: ContactKey, value: string) {
  if (key === "email") {
    return value.startsWith("mailto:") ? value : `mailto:${value}`;
  }
  return value;
}

export function Contact() {
  const contacts = getFilledContacts();

  return (
    <section
      id="contato"
      className="scroll-mt-24 border-t border-black/5 px-5 py-20 sm:px-8 sm:py-28 lg:px-10"
    >
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <h2 className="title-display leading-[0.9]">
            <span className="block text-ink text-shadow-title">VAMOS</span>
            <span className="block text-coral text-shadow-title">JUNTOS NESSA</span>
          </h2>
        </Reveal>

        <Reveal delayMs={100}>
          <div className="mt-8 flex items-start gap-4 sm:mt-10">
            <Arrow direction="right" className="mt-1 h-12 w-6 shrink-0" />
            <p className="max-w-md text-base leading-relaxed text-graphite sm:text-lg">
              Tem um projeto em mente? Vamos conversar.
            </p>
          </div>
        </Reveal>

        {contacts.length > 0 ? (
          <Reveal delayMs={160}>
            <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
              {contacts.map(([key, value]) => (
                <li key={key}>
                  <a
                    href={contactHref(key, value)}
                    target={key === "email" ? undefined : "_blank"}
                    rel={key === "email" ? undefined : "noopener noreferrer"}
                    className="text-base font-semibold text-ink underline-offset-4 transition hover:text-coral hover:underline focus-ring"
                  >
                    {LABELS[key]}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        ) : (
          <Reveal delayMs={160}>
            <p className="mt-12 max-w-md text-sm text-graphite/65">
              Preencha seus contatos em{" "}
              <code className="text-ink">src/content/site.ts</code> para
              exibi-los aqui.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
