import { cn } from "@/lib/utils";

export default function Layout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(`mx-auto max-w-7xl ${className}`)}>{children}</div>;
}
