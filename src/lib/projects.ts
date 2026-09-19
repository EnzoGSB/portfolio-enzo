import projectsJson from "@/content/projects.json";
import {
  ALL_CATEGORIES,
  CATEGORY_LABELS,
  type Project,
  type ProjectCategory,
} from "@/types/project";

export const projects = projectsJson as Project[];

export function getProjectsByCategory(category: ProjectCategory | "todos") {
  if (category === "todos") return projects;
  return projects.filter((project) => project.category === category);
}

export function getAvailableCategories(): ProjectCategory[] {
  const present = new Set(projects.map((project) => project.category));
  return ALL_CATEGORIES.filter((category) => present.has(category));
}

export function getCategoryLabel(category: ProjectCategory) {
  return CATEGORY_LABELS[category];
}

export function hasProjects() {
  return projects.length > 0;
}
