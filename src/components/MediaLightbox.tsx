"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import type { Project, ProjectMedia } from "@/types/project";
import { cn } from "@/lib/utils";

type LightboxItem = {
  project: Project;
  media: ProjectMedia;
};

type MediaLightboxProps = {
  items: LightboxItem[];
  index: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
};

export function MediaLightbox({
  items,
  index,
  open,
  onClose,
  onIndexChange,
}: MediaLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const originRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const current = items[index];

  const close = useCallback(() => {
    videoRef.current?.pause();
    onClose();
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      originRef.current = (document.activeElement as HTMLElement) ?? null;
      if (!dialog.open) dialog.showModal();
      queueMicrotask(() => closeRef.current?.focus());
      return;
    }

    if (dialog.open) {
      dialog.close();
    }
    originRef.current?.focus?.();
    originRef.current = null;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    videoRef.current?.pause();
  }, [index, open]);

  function onDialogKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (!open || items.length === 0) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      onIndexChange((index + 1) % items.length);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      onIndexChange((index - 1 + items.length) % items.length);
    }
  }

  if (!current) return null;

  const { project, media } = current;

  return (
    <dialog
      ref={dialogRef}
      className="media-lightbox m-0 max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/80"
      aria-labelledby={titleId}
      onClose={close}
      onKeyDown={onDialogKeyDown}
      onClick={(event) => {
        if (event.target === dialogRef.current) close();
      }}
    >
      <div className="flex min-h-full w-screen flex-col items-center justify-center px-4 py-6 sm:px-8">
        <div className="mb-4 flex w-full max-w-6xl items-start justify-between gap-4 text-white">
          <div className="min-w-0">
            <h2 id={titleId} className="truncate text-lg font-semibold sm:text-xl">
              {project.title}
            </h2>
            {project.description ? (
              <p className="mt-1 max-w-2xl text-sm text-white/75">
                {project.description}
              </p>
            ) : null}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="shrink-0 rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20 focus-ring"
          >
            Fechar
          </button>
        </div>

        <div className="relative flex w-full max-w-6xl items-center justify-center">
          {items.length > 1 ? (
            <button
              type="button"
              className="absolute left-0 z-10 rounded-md bg-white/10 px-3 py-3 text-white transition hover:bg-white/20 focus-ring sm:-left-2"
              aria-label="Mídia anterior"
              onClick={() =>
                onIndexChange((index - 1 + items.length) % items.length)
              }
            >
              ←
            </button>
          ) : null}

          <div className="flex max-h-[75vh] w-full items-center justify-center">
            {media.type === "image" ? (
              <Image
                src={media.src}
                alt={media.alt || project.alt || project.title}
                width={1600}
                height={1600}
                className="max-h-[75vh] w-auto max-w-full object-contain"
                sizes="(max-width: 768px) 100vw, 90vw"
                priority
              />
            ) : (
              <video
                ref={videoRef}
                key={media.src}
                src={media.src}
                controls
                playsInline
                preload="metadata"
                className="max-h-[75vh] w-auto max-w-full"
              >
                Seu navegador não suporta a reprodução deste vídeo.
              </video>
            )}
          </div>

          {items.length > 1 ? (
            <button
              type="button"
              className="absolute right-0 z-10 rounded-md bg-white/10 px-3 py-3 text-white transition hover:bg-white/20 focus-ring sm:-right-2"
              aria-label="Próxima mídia"
              onClick={() => onIndexChange((index + 1) % items.length)}
            >
              →
            </button>
          ) : null}
        </div>

        {items.length > 1 ? (
          <p className="mt-4 text-sm text-white/70">
            {index + 1} / {items.length}
          </p>
        ) : null}

        {project.externalUrl ? (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mt-4 inline-flex rounded-md bg-coral px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95 focus-ring",
            )}
          >
            Visitar site
          </a>
        ) : null}
      </div>
    </dialog>
  );
}
