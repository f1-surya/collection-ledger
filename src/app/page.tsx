import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import {
  BarChart3,
  TrendingUp,
  Shield,
  Zap,
  ArrowRight,
  Check,
} from "lucide-react";

export const metadata = {
  title: "Collection Ledger - Smart Financial Management",
  description:
    "Streamline your business finances with intelligent collection and payment tracking. Manage connections, monitor payments, and grow with confidence.",
};

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Collection Ledger
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                  Manage Your Collections with
                  <span className="block text-primary">Confidence</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Collection Ledger helps you track payments, manage business
                  connections, and grow your revenue with intelligent financial
                  insights.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-muted-foreground">
                No credit card required. Start tracking your collections today.
              </p>
            </div>

            {/* Hero Visual */}
            <div className="relative h-96 hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-3xl" />
              <div className="relative bg-card border rounded-2xl p-8 shadow-lg">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/10 rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary">
                        $124K
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total Revenue
                      </div>
                    </div>
                    <div className="bg-accent/10 rounded-lg p-4">
                      <div className="text-2xl font-bold text-accent-foreground">
                        94%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Collection Rate
                      </div>
                    </div>
                  </div>
                  <div className="h-32 bg-muted/30 rounded-lg flex items-end justify-around px-4">
                    <div className="h-12 w-2 bg-primary rounded" />
                    <div className="h-20 w-2 bg-primary rounded" />
                    <div className="h-24 w-2 bg-primary rounded" />
                    <div className="h-16 w-2 bg-primary rounded" />
                    <div className="h-28 w-2 bg-primary rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to streamline your collection process and
              maximize revenue
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: "Real-time Dashboard",
                description:
                  "Track all your collections and payments in one beautiful dashboard with instant updates",
              },
              {
                icon: TrendingUp,
                title: "Growth Analytics",
                description:
                  "Get insights into your collection trends and identify opportunities to grow",
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description:
                  "Enterprise-grade security ensures your financial data is always protected",
              },
              {
                icon: Zap,
                title: "Fast & Responsive",
                description:
                  "Lightning-fast interface that works seamlessly across all your devices",
              },
              {
                icon: TrendingUp,
                title: "Connection Management",
                description:
                  "Easily manage and organize all your business connections in one place",
              },
              {
                icon: Check,
                title: "Payment Tracking",
                description:
                  "Comprehensive payment history and status tracking at your fingertips",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-12 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Ready to transform your collections?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of businesses using Collection Ledger to manage
              their finances with confidence and precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2024 Collection Ledger. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <Link href="#" className="hover:text-foreground transition">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground transition">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
