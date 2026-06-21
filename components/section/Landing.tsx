import { ArrowRight, Zap } from "lucide-react";
import Layout from "../layout/Layout";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Landing() {
  return (
    <>
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-background " />

      <section className="h-dvh relative">
        <Layout className="relative w-full z-10 py-16 md:py-32 overflow-hidden h-full  ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center ">
            {/* Left Content */}
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm w-fit hover:border-border transition-colors">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  The easiest way to create quizzes
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                Create Quizzes That Engage
              </h1>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/dashboard/create">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto gap-2 text-base px-8"
                  >
                    Create Quiz Free <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto text-base px-8"
                  >
                    See Examples
                  </Button>
                </Link>
              </div>
            </div>
            {/* Right Content */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-12 w-12 rounded-full border-4 border-background bg-muted overflow-hidden"
                    >
                      <Image
                        unoptimized
                        height={48}
                        width={48}
                        src={`https://api.dicebear.com/10.x/notionists/svg?seed=user${i}&backgroundColor=ff8aab,ffbe47,ff7f50,ff6f61,ffb347`}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  Join engaging quizzes today.
                </div>
              </div>
              <p className="text-lg text-muted-foreground font-medium max-w-xl leading-relaxed">
                Build interactive quizzes in minutes. Share with a link. Track
                results instantly. Perfect for teachers, trainers, and teams.
              </p>
            </div>
          </div>
        </Layout>
      </section>
    </>
  );
}
