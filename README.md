# Portfólio — Enzo Romão

Site de portfólio em **Next.js**, **TypeScript** e **Tailwind CSS**, preparado para GitHub e Vercel.

## 1. Como executar localmente

```bash
npm install
npm run sync
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Outros comandos:

```bash
npm run build      # build de produção (já roda o sync)
npm run start      # servir o build
npm run typecheck  # validar TypeScript
npm run lint       # ESLint
```

## 2. Onde colocar cada tipo de material

| Pasta | Conteúdo |
| --- | --- |
| `public/designs-e-fotos/` | Imagens de design e fotos |
| `public/videos/` | Vídeos de produção audiovisual |
| `public/ia-videos/` | Vídeos feitos com IA |
| `public/ia-sites/` | Capturas ou vídeos de sites com IA |
| `public/fonts/` | Fontes licenciadas (opcional), ex.: TT Hoves |

Formatos suportados: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.avif`, `.mp4`, `.webm`, `.mov`, `.m4v`.

### Convenção de pastas

- **Arquivo solto** em `public/<categoria>/meu-projeto.jpg` → um projeto com uma mídia.
- **Subpasta** `public/<categoria>/meu-projeto/` com várias mídias → um único projeto (galeria / sequência).
- **`meta.json`** opcional dentro da subpasta (ou `nome.meta.json` ao lado do arquivo) para título, descrição, URL, etc.

Exemplo de `meta.json`:

```json
{
  "title": "Clínica de estética",
  "description": "Identidade visual e fotos de campanha.",
  "alt": "Peça gráfica da clínica",
  "aspect": "horizontal",
  "featured": true,
  "externalUrl": "https://exemplo.com",
  "technologies": ["Next.js", "Tailwind"]
}
```

Dica de proporção no nome do arquivo: use `-vertical`, `-horizontal` ou `-square` (ex.: `reel-vertical.mp4`) para o sync sugerir a proporção.

## 3. Como sincronizar e editar os projetos

```bash
npm run sync
```

O script gera/atualiza `src/content/projects.json` a partir das pastas em `public/`. Ele:

- detecta arquivos suportados;
- cria IDs estáveis (`categoria__slug`);
- **preserva** títulos, descrições, `alt`, `aspect`, `featured`, `externalUrl` e `technologies` que você já editou.

Você também pode editar o JSON diretamente após o sync. Rode `npm run sync` de novo depois de adicionar arquivos — as edições manuais são mantidas.

O sync roda automaticamente em `predev` e `prebuild` (não depende de escrever arquivos na Vercel em runtime).

## 4. Textos, cores, fontes e contatos

Edite `src/content/site.ts`:

- nome, tagline, texto “Sobre”;
- URL do site (`NEXT_PUBLIC_SITE_URL` ou o valor em `url`);
- contatos (`whatsapp`, `instagram`, `linkedin`, `email`) — **deixe vazio para ocultar**;
- cores de referência.

Cores e tipografia globais também estão em `src/app/globals.css` (`--paper`, `--coral`, `--ink`, `--graphite`).

Fonte atual: **Inter** (próxima da TT Hoves). Para usar TT Hoves licenciada:

1. Coloque `TTHoves-Regular.woff2` e `TTHoves-Bold.woff2` em `public/fonts/`.
2. Troque `src/lib/fonts.ts` por `next/font/local` apontando para esses arquivos.

## 5. GitHub e Vercel

### GitHub

```bash
git init
git add .
git commit -m "Initial portfolio for Enzo Romao"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
git push -u origin main
```

### Vercel

1. Acesse [vercel.com](https://vercel.com) e importe o repositório.
2. Framework: Next.js (detectado automaticamente).
3. Build command: `npm run build` (já inclui o sync).
4. Opcional: variável `NEXT_PUBLIC_SITE_URL` com a URL definitiva do site.
5. Deploy.

Ou via CLI (com login):

```bash
npx vercel
npx vercel --prod
```

## 6. Vídeos grandes (sem sobrecarregar o repositório)

Não versione arquivos pesados no Git. Opções:

1. **Hospedagem externa** (Cloudinary, Mux, Bunny, YouTube/Vimeo unlisted) e cadastre a URL no `externalUrl` / mídia do projeto — ou use um `meta.json` apontando para a URL pública se você adaptar o catálogo.
2. **Git LFS** para poucos vídeos médios (ainda conta no storage do host).
3. **Upload direto na Vercel Blob** / CDN e referencie a URL no catálogo.

Recomendação prática: mantenha no repo apenas capas leves (imagens) e hospede os `.mp4` fora do Git; depois registre as URLs no `projects.json` ou em `meta.json`.

Para ignorar vídeos locais no Git, você pode adicionar ao `.gitignore`:

```gitignore
public/**/*.mp4
public/**/*.mov
public/**/*.webm
```

(e manter as capas `.jpg`/`.webp` versionadas).

## Estrutura útil

```
public/
  designs-e-fotos/
  videos/
  ia-videos/
  ia-sites/
  fonts/
scripts/sync-projects.mjs
src/content/site.ts
src/content/projects.json
src/components/
```

## Identidade visual

Inspirada no PDF de referência: fundo off-white `#F0EFEB`, coral `#FF743D`, tipografia pesada em caixa alta e composição editorial com bastante respiro.
