import { sanitizeRichHtml } from "@/lib/sanitize";
import { cn } from "@/lib/utils";

type SafeHtmlProps = {
  html: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
};

// Renders admin-authored HTML (blog bodies + messages-CMS copy) after
// sanitizing it server-side. See `@/lib/sanitize` for the allowlist.
export function SafeHtml({ html, className, as: Tag = "div" }: SafeHtmlProps) {
  const clean = sanitizeRichHtml(html);
  return (
    <Tag
      className={cn("rich-content", className)}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
