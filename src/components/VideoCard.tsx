"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Project } from "@/types/project";
import { aspectClass, cn } from "@/lib/utils";

type VideoCardProps = {
  project: Project;
  onOpen: () => void;
  phoneFrame?: boolean;
};

export function VideoCard({ project, onOpen, phoneFrame = false }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const media = project.media.find((item) => item.type === "video") ?? project.media[0];
  const poster =
    project.media.find((item) => item.type === "image")?.src ?? undefined;
  const aspect = media?.aspect && media.aspect !== "auto" ? media.aspect : project.aspect;
  const isVertical = aspect === "vertical";

  function togglePlay() {
    const video = videoRef.current;
    if (!video) {
      onOpen();
      return;
    }
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  const frame = (
    <div
      className={cn(
        "relative overflow-hidden bg-black/5",
        phoneFrame && isVertical
          ? "rounded-[1.6rem] border-[3px] border-black/80 shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          : "rounded-sm border border-black/8",
        aspectClass(aspect),
      )}
    >
      {media?.type === "video" ? (
        <video
          ref={videoRef}
          src={media.src}
          poster={poster}
          playsInline
          preload="none"
          controls={playing}
          className="h-full w-full object-contain"
          onPause={() => setPlaying(false)}
          onPlay={() => setPlaying(true)}
        />
      ) : poster || project.cover ? (
        <Image
          src={poster || project.cover}
          alt={project.alt || project.title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 90vw, 320px"
          loading="lazy"
        />
      ) : null}

      {!playing ? (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/15 transition hover:bg-black/25 focus-ring"
          aria-label={`Reproduzir ${project.title}`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-coral text-white shadow-md transition hover:scale-105">
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-current" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      ) : null}
    </div>
  );

  return (
    <article className="group flex flex-col gap-3">
      {phoneFrame && isVertical ? (
        <div className="mx-auto w-full max-w-[220px] sm:max-w-[240px]">{frame}</div>
      ) : (
        frame
      )}
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-ink">{project.title}</h3>
        {project.description ? (
          <p className="text-sm leading-relaxed text-graphite/80">
            {project.description}
          </p>
        ) : null}
        {project.media.length > 1 ? (
          <button
            type="button"
            onClick={onOpen}
            className="text-sm font-medium text-coral underline-offset-4 hover:underline focus-ring"
          >
            Ver sequência
          </button>
        ) : null}
      </div>
    </article>
  );
}
