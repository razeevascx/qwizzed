'"use client";';
import Link from "next/link";
import Layout from "./layout/Layout";
import { Button } from "./ui/button";

export default function GetStarted() {
  return (
    <section className="relative  ">
      <Layout>
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-linear-to-br from-primary via-primary to-violet-600" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-size-[4rem_4rem]" />

          {/* Content */}
          <div className="relative px-6 py-16 sm:px-12 sm:py-20 lg:px-20 lg:py-24 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              Ready to create your first quiz?
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard/create">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2 text-base h-12 px-8 rounded-full bg-background text-foreground hover:bg-background/90 hover:scale-105 transition-all shadow-xl"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="/quiz">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto gap-2 text-base h-12 px-8 rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/50 transition-all"
                >
                  See Examples
                </Button>
              </Link>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-primary-foreground/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary-foreground/10 rounded-full blur-2xl animate-pulse delay-1000" />
          </div>
        </div>
      </Layout>
    </section>
  );
}
