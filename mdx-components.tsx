import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight mt-12 mb-6 first:mt-0 bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="scroll-m-20 text-3xl font-bold tracking-tight mt-10 mb-4 pb-2 border-b border-border/50">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-3 text-foreground/90">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-2">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="leading-7 mb-4 text-muted-foreground not-first:mt-4">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="font-medium text-primary underline-offset-4 hover:underline transition-colors"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="my-6 ml-6 list-disc space-y-2 text-muted-foreground [&>li]:mt-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-6 ml-6 list-decimal space-y-2 text-muted-foreground [&>li]:mt-2">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-7">{children}</li>,
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    code: ({ children }) => (
      <code className="relative rounded-md bg-muted px-[0.4rem] py-[0.2rem] font-mono text-sm font-medium text-foreground border border-border/50">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="mb-4 mt-6 overflow-x-auto rounded-lg border border-border/50 bg-muted/50 p-4">
        <code className="relative font-mono text-sm">{children}</code>
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-4 border-primary pl-6 italic text-muted-foreground *:text-muted-foreground">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-8 border-t border-border/50" />,
    table: ({ children }) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className="w-full border-collapse border border-border/50">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-border/50 bg-muted/50 px-4 py-2 text-left font-semibold [[align=center]]:text-center [[align=right]]:text-right">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-border/50 px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right">
        {children}
      </td>
    ),
    ...components,
  };
}
