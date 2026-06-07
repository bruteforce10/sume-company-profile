import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type OverlaySectionProps = {
  /** Section id, for in-page anchor links. */
  id?: string;
  /** Classes for the <section> — background, padding, height, layout. */
  className?: string;
  /** Background image source. Omit for a solid-color section. */
  image?: string;
  /** object-fit / opacity / blend / position classes for the image. */
  imageClassName?: string;
  /** Load the image eagerly (above-the-fold headers and heroes). */
  priority?: boolean;
  /** `sizes` hint for the fill image. */
  sizes?: string;
  /** Classes for the gradient / scrim layer. Omit to skip the overlay. */
  overlayClassName?: string;
  /** Classes for the content wrapper. */
  contentClassName?: string;
  children: ReactNode;
};

/**
 * Full-bleed section with an optional background image, an optional gradient
 * scrim, and a z-indexed content wrapper.
 *
 * Encapsulates the layered overlay pattern shared by the page header, the CTA
 * bands, and the dark feature sections — previously copy-pasted across pages.
 */
export function OverlaySection({
  id,
  className,
  image,
  imageClassName = "object-cover object-center",
  priority,
  sizes = "100vw",
  overlayClassName,
  contentClassName = "sume-wrap relative z-[2]",
  children,
}: OverlaySectionProps) {
  return (
    <section id={id} className={cn("relative overflow-hidden", className)}>
      {image ? (
        <Image
          src={image}
          alt=""
          aria-hidden
          fill
          priority={priority}
          sizes={sizes}
          className={imageClassName}
        />
      ) : null}
      {overlayClassName ? (
        <div className={cn("absolute inset-0", overlayClassName)} />
      ) : null}
      <div className={contentClassName}>{children}</div>
    </section>
  );
}
