"use client";

import Image from "next/image";
import type { Project } from "@/types/project";
import { aspectClass, cn } from "@/lib/utils";

type ImageCardProps = {
  project: Project;
  onOpen: () => void;
  priority?: boolean;
};

export function ImageCard({ project, onOpen, priority = false }: ImageCardProps) {
  return (
    <article className="group">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left focus-ring"
        aria-label={`Ampliar ${project.title}`}
      >
        <div
          className={cn(
            "relative overflow-hidden bg-black/[0.03] transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)]",
            aspectClass(project.aspect === "auto" ? "square" : project.aspect),
          )}
        >
          <Image
            src={project.cover}
            alt={project.alt || project.title}
            fill
            className="object-contain p-1 transition duration-300 group-hover:scale-[1.01]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading={priority ? "eager" : "lazy"}
            priority={priority}
          />
        </div>
        <h3 className="mt-3 text-sm font-semibold tracking-tight text-ink sm:text-base">
          {project.title}
        </h3>
      </button>
    </article>
  );
}
