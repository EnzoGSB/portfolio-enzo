"use client";

import { useMemo, useState } from "react";
import type { Project, ProjectCategory } from "@/types/project";
import { CATEGORY_LABELS } from "@/types/project";
import { ImageCard } from "@/components/ImageCard";
import { VideoCard } from "@/components/VideoCard";
import { SiteCard } from "@/components/SiteCard";
import { MediaLightbox } from "@/components/MediaLightbox";
import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

type FilterId = "todos" | ProjectCategory;

type WorksProps = {
  projects: Project[];
  availableCategories: ProjectCategory[];
};

export function Works({ projects, availableCategories }: WorksProps) {
  const [filter, setFilter] = useState<FilterId>("todos");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filters = useMemo(() => {
    const items: { id: FilterId; label: string }[] = [
      { id: "todos", label: "Todos" },
    ];
    for (const category of availableCategories) {
      items.push({ id: category, label: CATEGORY_LABELS[category] });
    }
    return items;
  }, [availableCategories]);

  const visible = useMemo(() => {
    if (filter === "todos") return projects;
    return projects.filter((project) => project.category === filter);
  }, [filter, projects]);

  const lightboxItems = useMemo(
    () =>
      visible.flatMap((project) =>
        project.media.map((media) => ({ project, media })),
      ),
    [visible],
  );

  function openProject(project: Project) {
    const index = lightboxItems.findIndex(
      (item) => item.project.id === project.id,
    );
    setLightboxIndex(index >= 0 ? index : 0);
    setLightboxOpen(true);
  }

  return (
    <section id="trabalhos" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <h2 className="title-section">
            <span className="text-coral text-shadow-title">TRABA</span>
            <span className="text-ink text-shadow-title">LHOS</span>
          </h2>
        </Reveal>

        {projects.length === 0 ? (
          <Reveal delayMs={80}>
            <p className="mt-10 max-w-lg text-base leading-relaxed text-graphite/70">
              Os trabalhos aparecerão aqui assim que você adicionar arquivos em{" "}
              <code className="text-ink">public/</code> e rodar{" "}
              <code className="text-ink">npm run sync</code>.
            </p>
          </Reveal>
        ) : (
          <>
            <Reveal delayMs={60}>
              <div
                role="tablist"
                aria-label="Filtrar trabalhos por categoria"
                className="mt-10 flex flex-wrap gap-2 sm:mt-12 sm:gap-3"
              >
                {filters.map((item) => {
                  const selected = filter === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setFilter(item.id)}
                      className={cn(
                        "rounded-md px-3.5 py-2 text-sm font-medium transition focus-ring",
                        selected
                          ? "bg-ink text-paper"
                          : "bg-transparent text-graphite hover:bg-black/[0.04] hover:text-ink",
                      )}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </Reveal>

            <div className="mt-12 space-y-20 sm:mt-16">
              {(filter === "todos"
                ? availableCategories
                : [filter as ProjectCategory]
              ).map((category) => {
                const group = visible.filter((p) => p.category === category);
                if (group.length === 0) return null;

                return (
                  <Reveal key={category}>
                    <div>
                      {filter === "todos" ? (
                        <h3 className="mb-8 text-sm font-semibold uppercase tracking-[0.14em] text-graphite/70">
                          {CATEGORY_LABELS[category]}
                        </h3>
                      ) : null}

                      {category === "designs-e-fotos" ? (
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                          {group.map((project, i) => (
                            <ImageCard
                              key={project.id}
                              project={project}
                              onOpen={() => openProject(project)}
                              priority={i < 3}
                            />
                          ))}
                        </div>
                      ) : null}

                      {category === "videos" || category === "ia-videos" ? (
                        <div
                          className={cn(
                            "grid gap-10",
                            category === "videos"
                              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                              : "grid-cols-1 md:grid-cols-2",
                          )}
                        >
                          {group.map((project) => (
                            <VideoCard
                              key={project.id}
                              project={project}
                              phoneFrame={
                                category === "videos" &&
                                (project.aspect === "vertical" ||
                                  project.media.some((m) => m.aspect === "vertical"))
                              }
                              onOpen={() => openProject(project)}
                            />
                          ))}
                        </div>
                      ) : null}

                      {category === "ia-sites" ? (
                        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                          {group.map((project) => (
                            <SiteCard
                              key={project.id}
                              project={project}
                              onOpen={() => openProject(project)}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </>
        )}
      </div>

      <MediaLightbox
        items={lightboxItems}
        index={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setLightboxIndex}
      />
    </section>
  );
}
