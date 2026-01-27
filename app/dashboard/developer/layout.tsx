import { ReactNode } from "react";
import Layout from "@/components/layout/Layout";

export const metadata = {
  title: "Developer | Qwizzed",
  description: "Developer documentation and API reference for Qwizzed",
};

export default function DeveloperLayout({ children }: { children: ReactNode }) {
  return <Layout>{children}</Layout>;
}
