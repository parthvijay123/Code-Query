import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/magicui/particles";
import { Meteors } from "@/components/magicui/meteors";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex flex-col items-center justify-center text-center overflow-hidden bg-gradient-to-br from-background to-secondary/20">
        <Particles
          className="absolute inset-0 z-0"
          quantity={100}
          color="#a78bfa" // Primary purple-ish color
          refresh
        />
        <div className="relative z-10 px-4 space-y-6 max-w-3xl mx-auto">
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Solve Problems. <br />
              Share Knowledge.
            </h1>
            <Meteors number={20} className="md:block hidden" />
          </div>

          <p className="text-xl text-muted-foreground">
            Join our community of developers and learners. Ask questions, receive instant AI answers, and vote on the best solutions.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Link href="/questions">
              <Button size="lg" className="rounded-full px-8 text-lg hover:scale-105 transition-transform">
                Browse Questions
              </Button>
            </Link>
            <Link href="/questions/ask">
              <Button variant="outline" size="lg" className="rounded-full px-8 text-lg hover:scale-105 transition-transform">
                Ask a Question
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid (Simplified mockup) */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Join Us?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-xl bg-card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Expert Answers</h3>
            <p className="text-muted-foreground">Get help from experienced developers in the community.</p>
          </div>
          <div className="p-6 border rounded-xl bg-card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">Share & Grow</h3>
            <p className="text-muted-foreground">Contributing answers helps you learn and build your reputation.</p>
          </div>
          <div className="p-6 border rounded-xl bg-card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">AI Powered</h3>
            <p className="text-muted-foreground">Receive instant, intelligent answers from our Gemini integration.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
