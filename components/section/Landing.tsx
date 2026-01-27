import { ArrowRight, Zap } from "lucide-react";
import Layout from "../layout/Layout";
import { Button } from "../ui/button";
import Link from "next/link";
import PixelBlast from "../3d/PixelBlast";

export default function Landing() {
  return (
    <>
      <div className="absolute inset-0">
        <PixelBlast
          variant="square"
          pixelSize={10}
          color="#B19EEF"
          patternScale={4}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.5}
          edgeFade={0.25}
          transparent
        />
      </div>
      {/* Linear Gradient Overlay: From Top to Bottom */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-background/20 to-background pointer-events-none" />
      <section className="h-dvh relative">
        <Layout className="relative w-full z-10 py-16 md:py-32 overflow-hidden h-full flex flex-col justify-end ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center ">
            {/* Left Content */}
            <div className="space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm w-fit hover:border-border transition-colors">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text">
                  The easiest way to create quizzes
                </span>
              </div>

              {/* Heading */}
              <div className="space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                  Create{" "}
                  <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                    Quizzes
                  </span>
                  <br />
                  <span className="text-foreground">That Engage</span>
                </h1>
              </div>
            </div>
            {/* Right Content */}
            <div className="flex flex-col gap-10 justify-center">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-12 w-12 rounded-full border-4 border-background bg-muted overflow-hidden"
                    >
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Join engaging quizzes today.
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                  Build interactive quizzes in minutes. Share with a link. Track
                  results instantly. Perfect for teachers, trainers, and teams.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/dashboard/create">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto gap-2 text-base px-8"
                    >
                      Create Quiz Free <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/quiz">
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
            </div>
          </div>
        </Layout>
      </section>
    </>
  );
}
