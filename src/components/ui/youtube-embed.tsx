"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type YouTubeEmbedProps = {
  /** YouTube video id (the part after `youtu.be/` or `watch?v=`). */
  id: string;
  /** Accessible title for the video — read out by the play button. */
  title: string;
  /** Poster image shown before playback (local path or configured remote). */
  poster: string;
  /** `sizes` hint for the poster fill image. */
  sizes?: string;
  className?: string;
};

/**
 * Lightweight YouTube facade. Renders a poster image with a play button and
 * only mounts the (heavy) YouTube iframe after the user clicks — keeping the
 * page fast while still embedding the video inline. Uses the privacy-friendly
 * youtube-nocookie domain.
 */
export function YouTubeEmbed({
  id,
  title,
  poster,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  className,
}: YouTubeEmbedProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden border border-white/[0.14] bg-sume-navy",
        className,
      )}
    >
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video — ${title}`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          <Image
            src={poster}
            alt=""
            fill
            sizes={sizes}
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute inset-0 bg-sume-navy/30 transition group-hover:bg-sume-navy/15" />
          <span className="absolute left-1/2 top-1/2 flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 shadow-lg transition duration-300 group-hover:scale-110 group-hover:bg-white">
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="ml-1 h-7 w-7 fill-sume-blue"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
