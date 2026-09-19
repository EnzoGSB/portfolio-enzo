import { cn } from "@/lib/utils";

type ArrowProps = {
  className?: string;
  direction?: "down" | "right";
};

/** Seta reta laranja, no espírito do PDF. */
export function Arrow({ className, direction = "down" }: ArrowProps) {
  const rotate = direction === "right" ? "-rotate-90" : "";
  return (
    <svg
      viewBox="0 0 24 48"
      fill="none"
      aria-hidden="true"
      className={cn("text-coral", rotate, className)}
    >
      <path
        d="M12 2v36M12 38l-7-8M12 38l7-8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Seta curva com aparência desenhada à mão. */
export function HandArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      aria-hidden="true"
      className={cn("text-coral", className)}
    >
      <path
        d="M8 58c18-28 42-42 78-46"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M72 8c8 2 16 6 20 12M92 20c-2 8-2 14 0 22"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
