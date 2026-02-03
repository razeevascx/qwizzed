import { cn } from "@/lib/utils";

export default function Layout({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-7xl", className)}
      id={id}
    >
      {children}
    </section>
  );
}
