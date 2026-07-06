"use client";

import { useCallback, useRef, useState } from "react";
import Image from "@tiptap/extension-image";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type ReactNodeViewProps,
} from "@tiptap/react";

const MIN_WIDTH = 100;

/**
 * React node view that renders an article image with a drag-to-resize handle.
 * The chosen width is committed to the node's `width` attribute (serialized as
 * `<img width="…">`, which survives sanitization); `height` is cleared so the
 * shared `height: auto` rule keeps the aspect ratio on both the editor and the
 * public page. The handle only appears while the image node is selected.
 */
function ResizableImageView({ node, updateAttributes, selected, editor }: ReactNodeViewProps) {
  const src = node.attrs.src as string;
  const alt = (node.attrs.alt as string | null) ?? "";
  const title = (node.attrs.title as string | null) ?? undefined;
  // Attributes parsed from stored HTML come back as strings; coerce to a number.
  const attrWidth = Number(node.attrs.width);
  const width = Number.isFinite(attrWidth) && attrWidth > 0 ? attrWidth : null;

  const imgRef = useRef<HTMLImageElement>(null);
  const latestWidth = useRef<number | null>(null);
  const [dragWidth, setDragWidth] = useState<number | null>(null);

  const startResize = useCallback(
    (event: React.PointerEvent) => {
      // Keep ProseMirror from starting a node drag / text selection instead.
      event.preventDefault();
      event.stopPropagation();
      const img = imgRef.current;
      if (!img) return;

      const startX = event.clientX;
      const startWidth = img.offsetWidth;
      // Never let an image grow past the editor column width.
      const maxWidth = editor.view.dom.clientWidth;

      const onMove = (moveEvent: PointerEvent) => {
        const next = Math.round(startWidth + (moveEvent.clientX - startX));
        const clamped = Math.max(MIN_WIDTH, Math.min(next, maxWidth));
        latestWidth.current = clamped;
        setDragWidth(clamped);
      };
      const onUp = () => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
        // Commit once on release (a single transaction, not one per move).
        if (latestWidth.current != null) {
          updateAttributes({ width: latestWidth.current, height: null });
        }
        latestWidth.current = null;
        setDragWidth(null);
      };

      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    },
    [editor, updateAttributes],
  );

  const shownWidth = dragWidth ?? width;

  return (
    <NodeViewWrapper className="resizable-image" data-selected={selected ? "" : undefined}>
      {/* next/image can't render inside a ProseMirror node view (contentEditable,
          dynamic Supabase src); the editor uses a plain <img> by design. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        title={title}
        className="rich-editor-image"
        style={shownWidth != null ? { width: `${shownWidth}px` } : undefined}
        draggable={false}
      />
      {selected ? (
        <span
          className="resizable-image__handle"
          onPointerDown={startResize}
          role="presentation"
          aria-hidden="true"
        />
      ) : null}
      {dragWidth != null ? <span className="resizable-image__badge">{dragWidth}px</span> : null}
    </NodeViewWrapper>
  );
}

/**
 * The stock image extension plus a resize handle. `Image` already declares the
 * `width`/`height` attributes and the `setImage` command, so we only swap in a
 * node view; everything else (paste/drop handling, serialization) is inherited.
 */
export const ResizableImage = Image.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },
});
