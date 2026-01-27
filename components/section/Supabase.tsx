import Layout from "../layout/Layout";
import { SupabaseLogo } from "../supabase-logo";

export default function Supabase() {
  return (
    <section className="border-t border-border/30 py-20 bg-emerald-500 relative overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-400/25 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-emerald-300/20 rounded-full blur-[100px] animate-pulse delay-500" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-teal-400/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <Layout className="relative z-10">
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="relative text-center">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-center text-white flex items-center justify-center gap-4 flex-wrap">
              Powered by
              <SupabaseLogo />
            </h2>

            {/* Glow behind text */}
            <div className="absolute inset-0 bg-emerald-500/40 blur-[100px] -z-10" />
          </div>
        </div>
      </Layout>

      {/* Bottom fade to background */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
