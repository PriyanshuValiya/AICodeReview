"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Github,
  Zap,
  ShieldCheck,
  MessageSquareCode,
  History,
  Sparkles,
  Rat,
} from "lucide-react";
import Link from "next/link";
import { requireUnAuth } from '@/module/utils/auth-utils'


export default function LandingPage() {
  useEffect(() => {
    requireUnAuth();
  }, []);

  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/20 mt-4">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md shadow-2xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Rat className="h-14 w-14 text-blue-600" />
            <span className="text-4xl font-semibold text-gray-900 tracking-tight mt-3 ml-1">
              CodeRat
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link
              href="#features"
              className="hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-primary transition-colors"
            >
              How it works
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,var(--color-primary)_0%,transparent_100%)] opacity-[0.03]" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance italic">
              The AI code reviewer <br />
              <span className="text-primary italic">
                your team will actually trust
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 text-pretty">
              Automate code reviews, catch critical bugs, and enforce quality
              standards on every pull request. Ship better code, 10x faster.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base shadow-xl shadow-primary/20 border rounded-2xl"
                >
                  <p className="text-lg">Start Reviewing</p>
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base bg-transparent border rounded-2xl"
              >
                <p className="text-lg">View Sample</p>
              </Button>
            </div>

            {/* Mockup Preview */}
            <div className="relative mx-auto max-w-5xl group">
              <div className="absolute -inset-1 from-primary/20 to-primary/5 rounded-2xl blur-2xl opacity-50 transition duration-1000 group-hover:opacity-70" />
              <div className="relative border rounded-xl bg-card shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/30">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/90" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/90" />
                    <div className="h-3 w-3 rounded-full bg-green-500/90" />
                  </div>
                  <div className="ml-4 h-4 w-48 rounded bg-muted animate-pulse" />
                </div>
                <div className="p-4 md:p-8 space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10">
                    <div className="mt-1 bg-primary p-1.5 rounded-full">
                      <Rat className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm mb-1">CodeRat</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        I found a potential memory leak in{" "}
                        <code className="text-primary px-1 font-mono">
                          useDataHook.ts
                        </code>
                        . The useEffect cleanup function is missing the event
                        listener removal.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-muted rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 border shadow-2xl rounded-2xl bg-muted/20 w-[1300px] mx-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold">50%</p>
                <p className="text-sm text-muted-foreground uppercase tracking-widest mt-1">
                  Faster Review Cycles
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold">25%</p>
                <p className="text-sm text-muted-foreground uppercase tracking-widest mt-1">
                  Work Efficiency Boost
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold">Up to 90%</p>
                <p className="text-sm text-muted-foreground uppercase tracking-widest mt-1">
                  Security Finding Rate
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold">
                  3.5 - 4 <span className="text-xl">Hours/Week</span>
                </p>
                <p className="text-sm text-muted-foreground uppercase tracking-widest mt-1">
                  Developer Time Saved
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-24 mt-5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 italic">
                Integrate in seconds.
              </h2>
              <p className="text-muted-foreground text-lg">
                CodePulse plugs directly into your GitHub workflow. No complex
                configuration or context-switching required.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-1/4 left-1/3 right-1/4 h-0.5 from-primary/10 via-primary/20 to-primary/10 -z-10" />
              {[
                {
                  icon: <Github className="h-6 w-6" />,
                  title: "Connect Repo",
                  desc: "One-click OAuth connection to your GitHub organization or specific repositories.",
                },
                {
                  icon: <MessageSquareCode className="h-6 w-6" />,
                  title: "Submit PR",
                  desc: "Open a pull request as usual. CodePulse automatically starts analyzing your changes.",
                },
                {
                  icon: <Sparkles className="h-6 w-6" />,
                  title: "Get Insights",
                  desc: "Receive inline comments with actionable suggestions, security alerts, and performance tips.",
                },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary mb-6 shadow-sm">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="md:w-1/2 space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold leading-tight italic">
                  Everything you need to ship quality code.
                </h2>
                <div className="grid gap-6">
                  {[
                    {
                      icon: <Zap className="h-5 w-5" />,
                      title: "Real-time Feedback",
                      desc: "Get review comments within minutes of pushing code to your PR.",
                    },
                    {
                      icon: <ShieldCheck className="h-5 w-5" />,
                      title: "Security Deep-Scan",
                      desc: "Detect SQL injection, XSS, and hardcoded secrets before they hit production.",
                    },
                    {
                      icon: <History className="h-5 w-5" />,
                      title: "Codebase Context",
                      desc: "Our AI understands your whole project structure, not just isolated files.",
                    },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-4 rounded-xl hover:bg-background transition-colors group"
                    >
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{feature.title}</h4>
                        <p className="text-muted-foreground text-sm">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:w-1/2 relative">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" />
                <Card className="relative border-2 border-primary/10 shadow-2xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-muted p-3 flex items-center justify-between border-b">
                      <div className="flex gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-red-500/90" />
                        <div className="h-2 w-2 rounded-full bg-amber-500/90" />
                        <div className="h-2 w-2 rounded-full bg-green-500/90" />
                      </div>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        PR #42 - Updated Auth Logic
                      </span>
                    </div>
                    <div className="p-6 font-mono text-sm space-y-3">
                      <div className="opacity-50 line-through text-red-500 bg-red-500/5 p-1">
                        - const user = await db.query(`SELECT * FROM users WHERE
                        id = $userId`);
                      </div>
                      <div className="text-green-500 bg-green-500/5 p-1">
                        + const user = await db.query(&apos;SELECT * FROM users
                        WHERE id = $1&apos;, [userId]);
                      </div>
                      <div className="pt-4 mt-4 border-t border-primary/10 italic text-muted-foreground">
                        <Rat className="inline h-3 w-3 mr-2 text-primary" />
                        Fixed SQL injection vulnerability by using parameterized
                        queries.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
            <div className="space-y-4 max-w-xs">
              <div className="flex items-center gap-2">
                <div className="bg-primary p-1 rounded-lg">
                  <Rat className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold tracking-tight">CodeRat</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering engineering teams with AI-driven code intelligence
                and security auditing.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                  Product
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Security
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                  Company
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                  Legal
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Terms
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t text-sm text-muted-foreground">
            <p>
              All rights reserved{" "}
              <a href="https://priyanshuvaliya.dev">@PriyanshuValiya</a>
            </p>
            <div className="flex gap-6">
              <Link
                href="https://priyanshuvaliya.dev"
                className="hover:text-primary transition-colors"
              >
                Portfolio
              </Link>
              <Link
                href="https://github.com/PriyanshuValiya"
                className="hover:text-primary transition-colors"
              >
                GitHub
              </Link>
              <Link
                href="https://www.linkedin.com/in/priyanshu-valiya19012006"
                className="hover:text-primary transition-colors"
              >
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
