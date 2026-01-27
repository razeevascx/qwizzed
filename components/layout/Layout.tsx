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
    <section className={cn("mx-auto w-full max-w-7xl ", className)} id={id}>
      {children}
    </section>
  );
}
