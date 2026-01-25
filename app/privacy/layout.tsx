import Layout from "@/components/layout/Layout";

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout className="p-10">{children}</Layout>;
}
