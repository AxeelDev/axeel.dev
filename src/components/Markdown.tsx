import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({ children }: { children: string }) {
  return <div className="prose"><ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={{
    a: ({ href, children }) => <a href={href} target={href?.startsWith("https://") ? "_blank" : undefined} rel="noreferrer">{children}</a>,
    img: ({ src, alt }) => <img src={src} alt={alt || ""} loading="lazy" decoding="async" />,
    table: ({ children }) => <div className="table-scroll"><table>{children}</table></div>,
  }}>{children}</ReactMarkdown></div>;
}
