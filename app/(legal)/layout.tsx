import Layout from "@/components/layout/Layout";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <Layout className="p-10">{children}</Layout>
      <SiteFooter />
    </>
  );
}
