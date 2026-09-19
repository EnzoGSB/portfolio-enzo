import { Inter } from "next/font/google";

/**
 * Alternativa visualmente próxima à TT Hoves.
 * Se você adicionar arquivos licenciados em public/fonts (ex.: TTHoves-Regular.woff2
 * e TTHoves-Bold.woff2), troque este módulo por next/font/local conforme o README.
 */
export const portfolioFont = Inter({
  subsets: ["latin"],
  variable: "--font-portfolio",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});
