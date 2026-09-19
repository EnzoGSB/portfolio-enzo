/**
 * Configuração central do site.
 * Edite textos, cores e contatos aqui.
 * Deixe contatos vazios para ocultá-los na interface.
 */
export const siteConfig = {
  name: "Enzo Romão",
  title: "Portfólio — Enzo Romão",
  description:
    "Design, audiovisual e criação com inteligência artificial. Portfólio de Enzo Romão.",
  tagline: "Design, audiovisual e criação com inteligência artificial.",
  about:
    "Crio designs, fotos, vídeos e experiências digitais com foco na identidade e nos objetivos de cada projeto. Combino direção criativa, produção audiovisual e inteligência artificial para transformar ideias em entregas visuais.",
  locale: "pt_BR",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-enzo.vercel.app",
  contacts: {
    /** Ex.: https://wa.me/5511999999999 */
    whatsapp: "",
    /** Ex.: https://instagram.com/seuusuario */
    instagram: "",
    /** Ex.: https://linkedin.com/in/seuusuario */
    linkedin: "",
    /** Ex.: email@dominio.com */
    email: "",
  },
  colors: {
    background: "#F0EFEB",
    coral: "#FF743D",
    black: "#000000",
    graphite: "#222222",
  },
} as const;

export type ContactKey = keyof typeof siteConfig.contacts;

export function getFilledContacts() {
  return (Object.entries(siteConfig.contacts) as [ContactKey, string][]).filter(
    ([, value]) => Boolean(value?.trim()),
  );
}
