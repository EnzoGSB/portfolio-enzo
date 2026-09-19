/**
 * Sincroniza o catálogo de projetos com as pastas em /public.
 *
 * Convenção de pastas:
 * - Arquivo solto em public/<categoria>/ = um projeto com uma mídia
 * - Subpasta em public/<categoria>/<projeto>/ = um projeto com várias mídias
 * - meta.json opcional dentro da subpasta (ou ao lado do arquivo via <nome>.meta.json)
 *   pode informar: title, description, alt, aspect, featured, externalUrl, technologies
 *
 * O script preserva title, description, alt, aspect, featured, externalUrl e
 * technologies já editados em src/content/projects.json.
 *
 * Execute: npm run sync
 * Também roda automaticamente em predev e prebuild.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");
const catalogPath = path.join(root, "src", "content", "projects.json");

const CATEGORIES = [
  "designs-e-fotos",
  "videos",
  "ia-videos",
  "ia-sites",
];

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov", ".m4v"]);
const MEDIA_EXT = new Set([...IMAGE_EXT, ...VIDEO_EXT]);

/** Campos preservados quando o projeto já existe no catálogo. */
const PRESERVE_KEYS = [
  "title",
  "description",
  "alt",
  "aspect",
  "featured",
  "externalUrl",
  "technologies",
];

function slugify(input) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function titleFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function mediaType(ext) {
  if (IMAGE_EXT.has(ext)) return "image";
  if (VIDEO_EXT.has(ext)) return "video";
  return null;
}

function detectAspect(name) {
  const lower = name.toLowerCase();
  if (/(^|[-_])(v|vert|vertical|9x16|portrait)([-_.]|$)/.test(lower)) {
    return "vertical";
  }
  if (/(^|[-_])(h|horiz|horizontal|16x9|landscape)([-_.]|$)/.test(lower)) {
    return "horizontal";
  }
  if (/(^|[-_])(sq|square|1x1)([-_.]|$)/.test(lower)) {
    return "square";
  }
  return "auto";
}

function readJsonSafe(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

function listMediaFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => {
      const ext = path.extname(name).toLowerCase();
      return MEDIA_EXT.has(ext) && !name.startsWith(".");
    })
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function toPublicSrc(category, ...parts) {
  return "/" + [category, ...parts].map((p) => encodeURI(p)).join("/");
}

function buildMediaItems(category, relativeParts, fileNames, fallbackAlt) {
  return fileNames.map((fileName) => {
    const ext = path.extname(fileName).toLowerCase();
    const base = path.basename(fileName, ext);
    return {
      src: toPublicSrc(category, ...relativeParts, fileName),
      type: mediaType(ext),
      alt: fallbackAlt || titleFromSlug(slugify(base)),
      aspect: detectAspect(base),
    };
  });
}

function mergePreserved(existing, next) {
  if (!existing) return next;
  const merged = { ...next };
  for (const key of PRESERVE_KEYS) {
    if (existing[key] !== undefined && existing[key] !== null && existing[key] !== "") {
      // Mantém aspect editado se não for o default "auto" ou se o usuário já definiu
      if (key === "aspect") {
        if (existing.aspect && existing.aspect !== "auto") {
          merged.aspect = existing.aspect;
        } else if (existing.aspect === "auto" && next.aspect !== "auto") {
          merged.aspect = next.aspect;
        } else {
          merged.aspect = existing.aspect ?? next.aspect;
        }
        continue;
      }
      if (key === "featured") {
        merged.featured = Boolean(existing.featured);
        continue;
      }
      if (key === "technologies" && Array.isArray(existing.technologies)) {
        merged.technologies = existing.technologies;
        continue;
      }
      merged[key] = existing[key];
    }
  }
  // Preserva description mesmo se string vazia foi intencional? Preferimos manter se definida
  if (Object.prototype.hasOwnProperty.call(existing, "description")) {
    merged.description = existing.description;
  }
  if (Object.prototype.hasOwnProperty.call(existing, "externalUrl")) {
    merged.externalUrl = existing.externalUrl || undefined;
  }
  if (Object.prototype.hasOwnProperty.call(existing, "technologies")) {
    merged.technologies = existing.technologies;
  }
  return merged;
}

function applyMeta(project, meta) {
  if (!meta || typeof meta !== "object") return project;
  const next = { ...project };
  for (const key of PRESERVE_KEYS) {
    if (meta[key] !== undefined && meta[key] !== null && meta[key] !== "") {
      next[key] = meta[key];
    }
  }
  if (meta.description !== undefined) next.description = meta.description;
  if (meta.externalUrl !== undefined) next.externalUrl = meta.externalUrl || undefined;
  if (meta.technologies !== undefined) next.technologies = meta.technologies;
  if (meta.featured !== undefined) next.featured = Boolean(meta.featured);
  return next;
}

function loadExistingCatalog() {
  const data = readJsonSafe(catalogPath);
  if (!Array.isArray(data)) return new Map();
  return new Map(data.map((item) => [item.id, item]));
}

function discoverProjects() {
  const existing = loadExistingCatalog();
  const discovered = [];

  for (const category of CATEGORIES) {
    const categoryDir = path.join(publicDir, category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
      continue;
    }

    const entries = fs.readdirSync(categoryDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;

      if (entry.isDirectory()) {
        const folder = entry.name;
        const folderPath = path.join(categoryDir, folder);
        const files = listMediaFiles(folderPath);
        if (files.length === 0) continue;

        const id = `${category}__${slugify(folder)}`;
        const defaultTitle = titleFromSlug(slugify(folder));
        const meta = readJsonSafe(path.join(folderPath, "meta.json"));
        const media = buildMediaItems(category, [folder], files, defaultTitle);
        const cover =
          media.find((m) => m.type === "image")?.src ?? media[0].src;
        const aspect =
          meta?.aspect ??
          media.find((m) => m.aspect && m.aspect !== "auto")?.aspect ??
          detectAspect(folder);

        let project = {
          id,
          title: defaultTitle,
          category,
          description: "",
          cover,
          media,
          aspect,
          alt: defaultTitle,
          featured: false,
        };

        project = applyMeta(project, meta);
        project = mergePreserved(existing.get(id), project);
        discovered.push(project);
        continue;
      }

      if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (!MEDIA_EXT.has(ext)) continue;
        if (entry.name.endsWith(".meta.json")) continue;

        const base = path.basename(entry.name, ext);
        const id = `${category}__${slugify(base)}`;
        const defaultTitle = titleFromSlug(slugify(base));
        const meta =
          readJsonSafe(path.join(categoryDir, `${base}.meta.json`)) ??
          readJsonSafe(path.join(categoryDir, `${entry.name}.meta.json`));
        const media = buildMediaItems(category, [], [entry.name], defaultTitle);
        const aspect = meta?.aspect ?? detectAspect(base);

        let project = {
          id,
          title: defaultTitle,
          category,
          description: "",
          cover: media[0].src,
          media,
          aspect,
          alt: defaultTitle,
          featured: false,
        };

        project = applyMeta(project, meta);
        project = mergePreserved(existing.get(id), project);
        discovered.push(project);
      }
    }
  }

  discovered.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.title.localeCompare(b.title, "pt-BR");
  });

  return discovered;
}

function main() {
  for (const category of CATEGORIES) {
    const dir = path.join(publicDir, category);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const keep = path.join(dir, ".gitkeep");
    if (!fs.existsSync(keep)) fs.writeFileSync(keep, "");
  }

  const fontsDir = path.join(publicDir, "fonts");
  if (!fs.existsSync(fontsDir)) fs.mkdirSync(fontsDir, { recursive: true });
  const fontsKeep = path.join(fontsDir, ".gitkeep");
  if (!fs.existsSync(fontsKeep)) fs.writeFileSync(fontsKeep, "");

  const projects = discoverProjects();
  fs.mkdirSync(path.dirname(catalogPath), { recursive: true });
  fs.writeFileSync(catalogPath, `${JSON.stringify(projects, null, 2)}\n`, "utf8");

  console.log(
    `Catálogo sincronizado: ${projects.length} projeto${projects.length === 1 ? "" : "s"} → src/content/projects.json`,
  );
}

main();
