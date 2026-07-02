import DOMPurify from "isomorphic-dompurify";
import { cn } from "@/lib/utils";

// Article bodies (from the blog editor) contain links, images, tables, and code
// blocks. DOMPurify's defaults already allow those tags; the "article" profile
// additionally keeps the link/image attributes we set (target/rel/loading).
// The default profile — used by the messages CMS — is left unchanged.
const ARTICLE_CONFIG = { ADD_ATTR: ["target", "rel", "loading"] };

type SafeHtmlProps = {
  html: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  /** "article" keeps the extra link/image attributes used in blog post bodies. */
  profile?: "default" | "article";
};

export function SafeHtml({
  html,
  className,
  as: Tag = "div",
  profile = "default",
}: SafeHtmlProps) {
  const clean =
    profile === "article"
      ? DOMPurify.sanitize(html, ARTICLE_CONFIG)
      : DOMPurify.sanitize(html);
  return (
    <Tag
      className={cn("rich-content", className)}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
