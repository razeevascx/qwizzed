import Layout from "@/components/layout/Layout";

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout className="prose prose-slate dark:prose-invert p-4 ">
      <article className=" ">{children}</article>
    </Layout>
  );
}
