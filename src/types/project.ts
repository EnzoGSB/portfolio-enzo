export type ProjectCategory =
  | "designs-e-fotos"
  | "videos"
  | "ia-videos"
  | "ia-sites";

export type MediaType = "image" | "video";

export type AspectRatio = "horizontal" | "vertical" | "square" | "auto";

export interface ProjectMedia {
  src: string;
  type: MediaType;
  alt: string;
  aspect?: AspectRatio;
}

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description?: string;
  cover: string;
  media: ProjectMedia[];
  aspect: AspectRatio;
  alt: string;
  featured: boolean;
  externalUrl?: string;
  /** Tecnologias (principalmente para sites com IA). */
  technologies?: string[];
}

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  "designs-e-fotos": "Designs e fotos",
  videos: "Produção de vídeos",
  "ia-videos": "Vídeos com IA",
  "ia-sites": "Sites com IA",
};

export const CATEGORY_FOLDERS: Record<ProjectCategory, string> = {
  "designs-e-fotos": "designs-e-fotos",
  videos: "videos",
  "ia-videos": "ia-videos",
  "ia-sites": "ia-sites",
};

export const ALL_CATEGORIES: ProjectCategory[] = [
  "designs-e-fotos",
  "videos",
  "ia-videos",
  "ia-sites",
];
