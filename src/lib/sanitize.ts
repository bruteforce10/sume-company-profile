import "server-only";
import sanitizeHtml from "sanitize-html";

// Server-side sanitizer for admin-authored rich text: blog article bodies
// (TipTap output) and the marketing copy edited in the messages CMS. It runs at
// write time (blog server actions) and again at render time (SafeHtml).
//
// This replaces the previous DOMPurify sanitizer. `isomorphic-dompurify` pulls
// in `jsdom`, which Next.js force-externalizes and which `require()`s the
// ESM-only `@exodus/bytes` — that crashed the serverless function with
// ERR_REQUIRE_ESM on Node runtimes below 22.12. `sanitize-html` is pure
// CommonJS with no DOM dependency, so it works on any Node version.

// Every tag the TipTap editor can emit (StarterKit + the image / table /
// text-align / underline extensions) plus the inline semantic tags used in CMS
// copy. Anything else — including <script>/<style> and their contents — is
// dropped.
const ALLOWED_TAGS = [
  "p", "br", "hr", "span", "div",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "strong", "b", "em", "i", "u", "s", "del", "mark", "sub", "sup", "small",
  "a", "ul", "ol", "li",
  "blockquote", "pre", "code",
  "img", "figure", "figcaption",
  "table", "caption", "colgroup", "col", "thead", "tbody", "tfoot", "tr", "th", "td",
];

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: {
    // target/rel/loading are set by the blog editor; href for links.
    a: ["href", "name", "title", "target", "rel"],
    // width survives image resizing; loading is set for lazy article images.
    img: ["src", "alt", "title", "width", "height", "loading"],
    th: ["colspan", "rowspan", "scope"],
    td: ["colspan", "rowspan"],
    col: ["span"],
    // The TextAlign extension writes inline `text-align`; nothing else may set styles.
    "*": ["style"],
  },
  allowedStyles: {
    "*": { "text-align": [/^(left|right|center|justify)$/] },
  },
  // Strip `javascript:` and other unsafe URLs; keep the schemes real links use.
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https", "data"] },
};

/** Sanitize admin-authored HTML for safe rendering via dangerouslySetInnerHTML. */
export function sanitizeRichHtml(html: string): string {
  return sanitizeHtml(html, OPTIONS);
}
