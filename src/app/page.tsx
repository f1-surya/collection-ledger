import { headers } from "next/navigation";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import {
  Upload,
  CheckCircle,
  Download,
  Zap,
  ArrowRight,
  Users,
  BarChart3,
  Shield,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "Collection Ledger - Bulk Payment Management for Cable Operators",
  description:
    "Simplify bulk payment collection for cable TV operators. Import customer data from MSO providers, track payments, and export lists in seconds. Made for South Indian cable operators.",
};

export default async function Home() {

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
          <div className="text-center space-y-8 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Built for MSO bulk payments
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl font-bold text-foreground text-balance">
                Bulk Payment Collection
                <span className="block text-primary">Done Right</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                Stop wasting hours on complex MSO portals. Import, track, and
                submit bulk payments in minutes. Made specifically for cable TV
                operators in South India.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-16">
            {[
              {
                icon: Upload,
                title: "Import",
                description: "Upload data from SCV or other MSO providers",
              },
              {
                icon: CheckCircle,
                title: "Track",
                description: "Monitor customer payments in real-time",
              },
              {
                icon: Download,
                title: "Export",
                description: "Download and bulk submit to MSO instantly",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-card border rounded-xl p-6 flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">
              Why Choose Collection Ledger
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built from the ground up for cable operators who need simplicity
              and speed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Clock,
                title: "Save Hours Daily",
                description:
                  "What takes 30+ minutes on MSO portals now takes 2 minutes. Process hundreds of customers instantly.",
              },
              {
                icon: Users,
                title: "Handle Bulk Operations",
                description:
                  "Import thousands of customer records at once. Track, update, and export in one place without headaches.",
              },
              {
                icon: BarChart3,
                title: "Real-time Payment Status",
                description:
                  "See exactly which customers have paid, are pending, or need follow-up. Clear visibility into your collections.",
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description:
                  "Your data is encrypted and backed up. Never lose a payment record or customer information.",
              },
            ].map((benefit, index) => (
              <div key={index} className="bg-card border rounded-xl p-8">
                <benefit.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">
              Your New Workflow
            </h2>
            <p className="text-lg text-muted-foreground">
              From MSO data to bulk payment submission—simplified
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                number: "1",
                title: "Download from MSO Provider",
                description:
                  "Export customer data from SCV or your MSO provider portal",
              },
              {
                number: "2",
                title: "Import into Collection Ledger",
                description:
                  "Upload the CSV file—we parse it instantly and organize by status",
              },
              {
                number: "3",
                title: "Track Collections in Real-Time",
                description:
                  "Update payment status as customers pay. See pending and paid customers at a glance",
              },
              {
                number: "4",
                title: "Export & Submit to MSO",
                description:
                  "Download the formatted list and submit bulk payments back to your MSO provider",
              },
            ].map((step, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-4xl sm:text-5xl font-bold mb-2">90%</div>
              <p className="text-sm opacity-90">Faster than MSO portals</p>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold mb-2">1000+</div>
              <p className="text-sm opacity-90">Records processed instantly</p>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold mb-2">Zero</div>
              <p className="text-sm opacity-90">Data entry errors</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-12 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Stop Wasting Time on MSO Portals
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Collection Ledger is designed by cable operators, for cable
              operators. Start your free trial today and see the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Start Free Today
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Already Have Account
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
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2024 Collection Ledger. Made for cable operators.</p>
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
