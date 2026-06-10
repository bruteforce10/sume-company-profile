// Pure, dependency-free types shared between the server data layer and the
// client editor (so the client never imports the server-only module).

export type EditorField = {
  key: string;
  /** Current Indonesian value (DB override, falling back to bundled JSON). */
  id: string;
  /** Current English value (DB override, falling back to bundled JSON). */
  en: string;
  /** Hint for the editor to render a taller textarea. */
  isLong: boolean;
};

export type EditorNamespace = {
  namespace: string;
  fields: EditorField[];
};
