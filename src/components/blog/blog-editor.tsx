"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";
import { Placeholder } from "@tiptap/extensions";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  BoldIcon,
  CodeIcon,
  Heading2,
  Heading3,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  List,
  ListOrdered,
  Maximize2,
  Minimize2,
  QuoteIcon,
  StrikethroughIcon,
  TableIcon,
  UnderlineIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { contentImageUrls } from "@/lib/blog-storage";
import { deleteBlogImage, uploadBlogImage } from "@/lib/blog-upload";
import { cn } from "@/lib/utils";

type ToolbarButtonProps = {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
};

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-[2px] transition disabled:cursor-not-allowed disabled:opacity-40",
        active
          ? "bg-sume-blue text-white"
          : "text-sume-muted hover:bg-sume-mist hover:text-sume-ink",
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-0.5 h-5 w-px bg-sume-line" />;
}

type BlogEditorProps = {
  /** Name of the hidden input the HTML is written to (form field). */
  name: string;
  defaultValue?: string;
  placeholder?: string;
  "aria-label"?: string;
  /**
   * A value that changes whenever the parent form saves successfully. On change,
   * the editor promotes its current images to "persisted" (stops tracking them
   * for auto-delete), so removing them later is handled server-side instead.
   */
  savedSignal?: number;
};

/**
 * Rich text editor for blog articles. Extends the `RichEditor` pattern (the
 * messages CMS editor) with images (uploaded to Supabase Storage), links,
 * tables, code blocks, and a placeholder. The HTML output is mirrored into a
 * hidden input so it posts with a plain <form> (server action re-sanitizes it).
 */
export function BlogEditor({
  name,
  defaultValue = "",
  placeholder,
  "aria-label": ariaLabel,
  savedSignal,
}: BlogEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor | null>(null);
  // Images uploaded during this editing session. If one is removed from the
  // content before it's saved, it's deleted from Storage (draft churn cleanup).
  // Never holds images loaded from defaultValue, so persisted images are safe.
  const sessionUploads = useRef<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  // Distraction-free full-viewport writing mode. A CSS overlay (not the native
  // Fullscreen API) so it stays styleable and Escape-dismissable.
  const [fullscreen, setFullscreen] = useState(false);

  const insertImage = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadBlogImage(file, "posts");
      sessionUploads.current.add(url);
      editorRef.current?.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (error) {
      toast.error(
        `Gagal mengunggah gambar: ${error instanceof Error ? error.message : "kesalahan tak terduga"}`,
      );
    } finally {
      setUploading(false);
    }
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // Link is bundled in StarterKit 3.x — configure it here rather than
        // re-importing (a duplicate extension would throw).
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ HTMLAttributes: { class: "rich-editor-image" } }),
      TableKit.configure({ table: { resizable: true } }),
      Placeholder.configure({
        placeholder: placeholder ?? "Tulis konten artikel di sini…",
      }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        class:
          "rich-editor-content min-h-[320px] w-full rounded-b-[2px] border-x border-b border-sume-line bg-white px-4 py-3 text-[15px] leading-relaxed text-sume-ink outline-none focus:border-sume-blue focus:ring-2 focus:ring-sume-blue/15",
        ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
      },
      // Paste or drop an image → upload to Storage, then insert its public URL.
      handlePaste(_view, event) {
        const file = Array.from(event.clipboardData?.files ?? []).find((f) =>
          f.type.startsWith("image/"),
        );
        if (!file) return false;
        event.preventDefault();
        void insertImage(file);
        return true;
      },
      handleDrop(_view, event) {
        const file = Array.from(event.dataTransfer?.files ?? []).find((f) =>
          f.type.startsWith("image/"),
        );
        if (!file) return false;
        event.preventDefault();
        void insertImage(file);
        return true;
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      if (inputRef.current) {
        inputRef.current.value = html;
        inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
      }
      // Free any session-uploaded image that has just been removed from the
      // content. Only touches uploads made this session (draft churn).
      if (sessionUploads.current.size > 0) {
        const present = new Set(contentImageUrls(html));
        for (const url of [...sessionUploads.current]) {
          if (!present.has(url)) {
            sessionUploads.current.delete(url);
            void deleteBlogImage(url);
          }
        }
      }
    },
  });

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  // On a successful save, everything in the content is now persisted — stop
  // tracking those uploads so a later removal is reconciled server-side and can
  // never delete a file the saved article still references.
  useEffect(() => {
    if (savedSignal) sessionUploads.current.clear();
  }, [savedSignal]);

  // In fullscreen: lock body scroll and let Escape close the overlay.
  useEffect(() => {
    if (!fullscreen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [fullscreen]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = (editor.getAttributes("link").href as string | undefined) ?? "";
    const url = window.prompt("URL tautan (kosongkan untuk menghapus):", previous || "https://");
    if (url === null) return; // cancelled
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        "flex flex-col",
        fullscreen && "fixed inset-0 z-50 bg-white p-3 sm:p-5",
      )}
    >
      <input type="hidden" name={name} ref={inputRef} defaultValue={defaultValue} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void insertImage(file);
          event.target.value = "";
        }}
      />

      {/* Toolbar — sticks below the admin header while scrolling long content
          (top-0 when fullscreen). Nearly opaque so text doesn't bleed through. */}
      <div
        className={cn(
          "z-20 flex flex-wrap items-center gap-0.5 rounded-t-[2px] border border-sume-line bg-sume-mist/95 px-1.5 py-1 backdrop-blur-[6px]",
          fullscreen ? "sticky top-0" : "sticky top-[68px]",
        )}
      >
        <ToolbarButton
          title="Tebal"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <BoldIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Miring"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <ItalicIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Garis bawah"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        >
          <UnderlineIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Coret"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
        >
          <StrikethroughIcon className="size-3.5" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title="Judul 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Judul 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
        >
          <Heading3 className="size-3.5" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title="Daftar tak berurut"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Daftar berurut"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrdered className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Kutipan"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          <QuoteIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Blok kode"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
        >
          <CodeIcon className="size-3.5" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title="Rata kiri"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
        >
          <AlignLeft className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Rata tengah"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
        >
          <AlignCenter className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Rata kanan"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
        >
          <AlignRight className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Rata kanan-kiri"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          active={editor.isActive({ textAlign: "justify" })}
        >
          <AlignJustify className="size-3.5" />
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton title="Tautan" onClick={setLink} active={editor.isActive("link")}>
          <LinkIcon className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          title="Sisipkan gambar"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Spinner className="size-3.5" /> : <ImageIcon className="size-3.5" />}
        </ToolbarButton>
        <ToolbarButton
          title="Sisipkan tabel"
          onClick={() =>
            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
          }
        >
          <TableIcon className="size-3.5" />
        </ToolbarButton>

        <div className="ml-auto flex items-center">
          <ToolbarButton
            title={fullscreen ? "Keluar layar penuh (Esc)" : "Layar penuh"}
            onClick={() => setFullscreen((prev) => !prev)}
            active={fullscreen}
          >
            {fullscreen ? (
              <Minimize2 className="size-3.5" />
            ) : (
              <Maximize2 className="size-3.5" />
            )}
          </ToolbarButton>
        </div>
      </div>

      {/* Fullscreen: the content area is the scroll container so the toolbar
          stays pinned at the top of the overlay. */}
      <div className={cn(fullscreen && "min-h-0 flex-1 overflow-y-auto")}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
