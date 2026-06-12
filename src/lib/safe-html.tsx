import DOMPurify from "isomorphic-dompurify";
import { cn } from "@/lib/utils";

type SafeHtmlProps = {
  html: string;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
};

export function SafeHtml({ html, className, as: Tag = "div" }: SafeHtmlProps) {
  const clean = DOMPurify.sanitize(html);
  return (
    <Tag
      className={cn("rich-content", className)}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
