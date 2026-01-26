import { cn } from "@/lib/utils";

export default function Layout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto w-full max-w-7xl ", className)}>
      {children}
    </section>
  );
}
