import Layout from "../layout/Layout";

export default function Steps() {
  return (
    <section className="border-t border-border/30 py-20 px-6 bg-muted/30">
      <Layout>
        <div className="space-y-3 mb-16">
          <h3 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            How it works
          </h3>
        </div>
        <div className="">
          <div className="space-y-16">
            {[
              {
                step: "01",
                title: "Create your quiz",
                desc: "Use our eay form builder to add questions",
              },
              {
                step: "02",
                title: "Share with your audience",
                desc: "Send a link or show a QR code. People can join from any device.",
              },
              {
                step: "03",
                title: "Analyze results",
                desc: "Get instant insights into student performance or team knowledge gaps.",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-8 items-start group">
                <div className="flex-none w-20 text-6xl md:text-7xl font-bold text-primary group-hover:text-primary/40 transition-colors">
                  {item.step}
                </div>
                <div className="space-y-3 pt-2">
                  <h4 className="text-2xl font-semibold">{item.title}</h4>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </section>
  );
}
