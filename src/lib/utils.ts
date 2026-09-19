import type { AspectRatio } from "@/types/project";

export function aspectClass(aspect: AspectRatio | undefined) {
  switch (aspect) {
    case "vertical":
      return "aspect-[9/16]";
    case "horizontal":
      return "aspect-video";
    case "square":
      return "aspect-square";
    default:
      return "aspect-[4/5] sm:aspect-[3/4]";
  }
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
