"use client";

import Image from "next/image";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";

type SiteCardProps = {
  project: Project;
  onOpen: () => void;
};

export function SiteCard({ project, onOpen }: SiteCardProps) {
  const hasUrl = Boolean(project.externalUrl?.trim());
  const coverIsVideo = project.media[0]?.type === "video";

  return (
    <article className="flex flex-col gap-4">
      <button
        type="button"
        onClick={onOpen}
        className="group relative block w-full overflow-hidden border border-black/8 bg-black/[0.03] text-left focus-ring"
        aria-label={`Ver detalhes de ${project.title}`}
      >
        <div className="relative aspect-video">
          {coverIsVideo ? (
            <video
              src={project.cover}
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.01]"
            />
          ) : (
            <Image
              src={project.cover}
              alt={project.alt || project.title}
              fill
              className="object-cover object-top transition duration-300 group-hover:scale-[1.01]"
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
            />
          )}
        </div>
      </button>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-ink">{project.title}</h3>
        {project.description ? (
          <p className="text-sm leading-relaxed text-graphite/85">
            {project.description}
          </p>
        ) : null}
        {project.technologies && project.technologies.length > 0 ? (
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-graphite/60">
            {project.technologies.join(" · ")}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={onOpen}
            className="text-sm font-medium text-coral underline-offset-4 hover:underline focus-ring"
          >
            Ver mídia
          </button>
          {hasUrl ? (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-sm font-semibold text-ink underline-offset-4 hover:text-coral hover:underline focus-ring",
              )}
            >
              Visitar site
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
