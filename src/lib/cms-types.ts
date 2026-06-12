// Pure, dependency-free types shared between the server data layer and the
// client editor (so the client never imports the server-only module).

export type EditorField = {
  key: string;
  /** The actual namespace this field belongs to (differs from EditorNamespace.namespace for merged groups). */
  sourceNamespace: string;
  /** Human-readable label (falls back to `key` when no schema entry exists). */
  label: string;
  /** Current Indonesian value (DB override, falling back to bundled JSON). */
  id: string;
  /** Current English value (DB override, falling back to bundled JSON). */
  en: string;
  /** Hint for the editor to render a taller textarea. */
  isLong: boolean;
  /** Renders as a large textarea with a tag-support caption (see cms-schema). */
  rich: boolean;
};

export type EditorNamespace = {
  namespace: string;
  fields: EditorField[];
};
