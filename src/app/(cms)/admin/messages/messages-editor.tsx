"use client";

import { Fragment, useActionState, useEffect, useMemo, useState } from "react";
import { ChevronDownIcon, SaveIcon, SearchIcon } from "lucide-react";
import { toast } from "sonner";
import { RichEditor } from "@/components/rich-editor";
import { Spinner } from "@/components/ui/spinner";
import type { EditorField, EditorNamespace } from "@/lib/cms-types";
import { cn } from "@/lib/utils";
import { saveNamespace, type SaveState } from "./actions";

const initialState: SaveState = { ok: false, error: null, ts: 0 };

const textareaClass =
  "field-sizing-content w-full rounded-[2px] border border-sume-line bg-white px-3 py-2 text-sm leading-relaxed text-sume-ink outline-none transition placeholder:text-sume-muted/60 focus-visible:border-sume-blue focus-visible:ring-2 focus-visible:ring-sume-blue/15";

function fieldMatches(field: EditorField, namespace: string, q: string) {
  if (!q) return true;
  return (
    field.key.toLowerCase().includes(q) ||
    field.id.toLowerCase().includes(q) ||
    field.en.toLowerCase().includes(q) ||
    namespace.toLowerCase().includes(q) ||
    field.sourceNamespace.toLowerCase().includes(q)
  );
}

function NamespaceForm({ data, query }: { data: EditorNamespace; query: string }) {
  const [state, formAction, pending] = useActionState(saveNamespace, initialState);
  const [dirty, setDirty] = useState(false);
  const [savedTs, setSavedTs] = useState(0);

  if (state.ok && state.ts !== savedTs) {
    setSavedTs(state.ts);
    setDirty(false);
  }

  useEffect(() => {
    if (!state.ts) return;
    if (state.ok) toast.success(`"${data.namespace}" tersimpan.`);
    else if (state.error) toast.error(state.error);
  }, [state.ts, state.ok, state.error, data.namespace]);

  const hasSubGroups =
    data.fields.length > 0 &&
    data.fields.some((f) => f.sourceNamespace !== data.fields[0]!.sourceNamespace);

  return (
    <form action={formAction} onInput={() => setDirty(true)} className="animate-fade-in">
      <input type="hidden" name="namespace" value={data.namespace} />

      <div className="flex flex-col gap-5 px-4 pt-4 pb-4">
        <div className="hidden grid-cols-2 gap-3 text-[11px] font-semibold uppercase tracking-wide text-sume-muted md:grid">
          <span>Bahasa Indonesia</span>
          <span>English</span>
        </div>

        {data.fields.map((field, index) => {
          const prevField = index > 0 ? data.fields[index - 1] : null;
          const isFirstOfSubNs =
            hasSubGroups &&
            (index === 0 || field.sourceNamespace !== prevField!.sourceNamespace);
          const rows = field.rich ? 6 : field.isLong ? 3 : 2;

          return (
            <Fragment key={`${field.sourceNamespace}:${field.key}`}>
              {isFirstOfSubNs && !query && (
                <div
                  className={cn(
                    "flex items-center gap-2.5",
                    index > 0 && "mt-2 border-t border-sume-line pt-4",
                  )}
                >
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-sume-blue/70">
                    {field.sourceNamespace}
                  </span>
                  {index === 0 && <div className="h-px flex-1 bg-sume-line" />}
                </div>
              )}
              <div
                className={cn(
                  "flex flex-col gap-2",
                  !fieldMatches(field, data.namespace, query) && "hidden",
                )}
              >
                {field.label === field.key ? (
                  <label className="font-mono text-[11px] font-medium text-sume-muted">
                    {field.key}
                  </label>
                ) : (
                  <div className="flex flex-col gap-0.5">
                    <label className="text-[12.5px] font-semibold text-sume-ink">
                      {field.label}
                    </label>
                    <span className="font-mono text-[10.5px] text-sume-muted/70">
                      {field.key}
                    </span>
                  </div>
                )}
                {field.rich ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    <RichEditor
                      name={`field:id:${field.sourceNamespace}:${field.key}`}
                      defaultValue={field.id}
                      aria-label={`${field.label} — Bahasa Indonesia`}
                    />
                    <RichEditor
                      name={`field:en:${field.sourceNamespace}:${field.key}`}
                      defaultValue={field.en}
                      aria-label={`${field.label} — English`}
                    />
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    <textarea
                      name={`field:id:${field.sourceNamespace}:${field.key}`}
                      defaultValue={field.id}
                      aria-label={`${field.label} — Bahasa Indonesia`}
                      rows={rows}
                      className={textareaClass}
                    />
                    <textarea
                      name={`field:en:${field.sourceNamespace}:${field.key}`}
                      defaultValue={field.en}
                      aria-label={`${field.label} — English`}
                      rows={rows}
                      className={textareaClass}
                    />
                  </div>
                )}
              </div>
            </Fragment>
          );
        })}
      </div>

      {/* Floating save bar — sticks to the bottom of the viewport while you
          scroll through this namespace, then settles at its end so the next
          section's bar takes over. */}
      <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 border-t border-sume-line bg-white/85 px-4 py-3 shadow-[0_-10px_24px_-18px_rgba(14,36,60,0.45)] backdrop-blur supports-[backdrop-filter]:bg-white/75">
        <span className="flex items-center gap-2 text-[12.5px] text-sume-muted">
          <span
            className={cn(
              "size-1.5 rounded-full",
              dirty ? "bg-amber-500" : "bg-emerald-500",
            )}
          />
          {dirty ? "Perubahan belum disimpan" : "Tidak ada perubahan"}
        </span>
        <button
          type="submit"
          disabled={pending || !dirty}
          className="inline-flex h-10 items-center gap-2 rounded-[2px] bg-sume-blue px-5 font-head text-sm font-semibold text-white transition hover:bg-sume-blue-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sume-blue disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? <Spinner /> : <SaveIcon className="size-4" />}
          Simpan
        </button>
      </div>
    </form>
  );
}

function NamespaceSection({
  data,
  query,
  q,
  open,
  onToggle,
}: {
  data: EditorNamespace;
  query: string;
  q: string;
  open: boolean;
  onToggle: () => void;
}) {
  const nsHasMatch =
    !q ||
    data.namespace.toLowerCase().includes(q) ||
    data.fields.some((f) => fieldMatches(f, data.namespace, q));

  const shownCount = q
    ? data.fields.filter((f) => fieldMatches(f, data.namespace, q)).length
    : data.fields.length;

  const expanded = q ? true : open;

  return (
    <section
      id={`ns-${data.namespace}`}
      className={cn(
        "rounded-[2px] border border-sume-line bg-white",
        !nsHasMatch && "hidden",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-sume-mist/60"
      >
        <span className="flex items-center gap-2.5">
          <span className="font-head text-[15px] font-semibold text-sume-ink">
            {data.namespace}
          </span>
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-[2px] bg-sume-bg-blue-soft px-1.5 font-head text-[11px] font-semibold text-sume-blue">
            {shownCount}
          </span>
        </span>
        <ChevronDownIcon
          className={cn(
            "size-4 shrink-0 text-sume-muted transition-transform duration-200",
            expanded && "rotate-180",
          )}
        />
      </button>

      {expanded ? (
        <div className="border-t border-sume-line/70">
          <NamespaceForm data={data} query={query} />
        </div>
      ) : null}
    </section>
  );
}

export function MessagesEditor({ data }: { data: EditorNamespace[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const allNamespaces = useMemo(() => data.map((ns) => ns.namespace), [data]);
  const [openSet, setOpenSet] = useState<Set<string>>(
    () => new Set(allNamespaces),
  );
  const [activeNs, setActiveNs] = useState<string | null>(
    data[0]?.namespace ?? null,
  );

  const matchCount = useMemo(() => {
    if (!q) return null;
    return data.reduce(
      (sum, ns) =>
        sum + ns.fields.filter((f) => fieldMatches(f, ns.namespace, q)).length,
      0,
    );
  }, [data, q]);

  const allOpen = openSet.size === allNamespaces.length;

  function toggle(ns: string) {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(ns)) next.delete(ns);
      else next.add(ns);
      return next;
    });
  }

  // Track the section currently in the viewport for the sidebar active indicator.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveNs(entry.target.id.replace(/^ns-/, ""));
          }
        }
      },
      { rootMargin: "-10% 0px -78% 0px" },
    );

    for (const ns of data) {
      const el = document.getElementById(`ns-${ns.namespace}`);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [data]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-sume-muted" />
          <input
            type="search"
            placeholder="Cari kunci atau teks…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-10 w-full rounded-[2px] border border-sume-line bg-white pr-3 pl-9 text-sm text-sume-ink outline-none transition placeholder:text-sume-muted/70 focus-visible:border-sume-blue focus-visible:ring-2 focus-visible:ring-sume-blue/15"
          />
        </div>
        {!q ? (
          <button
            type="button"
            onClick={() =>
              setOpenSet(allOpen ? new Set() : new Set(allNamespaces))
            }
            className="self-start font-head text-[13px] font-semibold text-sume-blue transition hover:text-sume-blue-hover sm:self-auto"
          >
            {allOpen ? "Tutup semua" : "Buka semua"}
          </button>
        ) : null}
      </div>

      {matchCount !== null ? (
        <p className="text-sm text-sume-body">
          {matchCount} hasil untuk &ldquo;{query.trim()}&rdquo;.
        </p>
      ) : null}

      <div className="flex gap-6">
        {/* Sidebar navigation — visible on lg+ screens */}
        <aside className="hidden lg:block w-40 shrink-0">
          <nav className="sticky top-[84px] flex flex-col gap-0.5 max-h-[calc(100vh-100px)] overflow-y-auto">
            {data.map((ns) => (
              <a
                key={ns.namespace}
                href={`#ns-${ns.namespace}`}
                className={cn(
                  "block rounded-[2px] px-3 py-1.5 font-head text-[12.5px] font-medium transition",
                  activeNs === ns.namespace
                    ? "bg-sume-bg-blue-soft text-sume-blue"
                    : "text-sume-muted hover:bg-sume-mist/50 hover:text-sume-ink",
                )}
              >
                {ns.namespace}
              </a>
            ))}
          </nav>
        </aside>

        {/* Namespace sections */}
        <div className="flex flex-1 min-w-0 flex-col gap-3">
          {data.map((ns) => (
            <NamespaceSection
              key={ns.namespace}
              data={ns}
              query={q}
              q={q}
              open={openSet.has(ns.namespace)}
              onToggle={() => toggle(ns.namespace)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
