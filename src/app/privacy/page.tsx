import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Privacy Policy - Collection Ledger",
  description: "Privacy Policy for Collection Ledger",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">
            Collection Ledger
          </h1>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-invert max-w-none space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">Last updated: February 2026</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              1. Introduction
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Collection Ledger ("we", "our", or "us") operates the Collection
              Ledger application. This page informs you of our policies
              regarding the collection, use, and disclosure of personal data
              when you use our Service and the choices you have associated with
              that data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              2. Information Collection and Use
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect several different types of information for various
              purposes to provide and improve our Service to you.
            </p>
            <h3 className="text-xl font-semibold text-foreground">
              Types of Data Collected:
            </h3>
            <ul className="space-y-2 text-muted-foreground leading-relaxed">
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong>Personal Data:</strong> Email address, name, and other
                  contact information
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong>Customer Data:</strong> Customer payment records,
                  collection status, and financial information you upload
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong>Usage Data:</strong> Information about how you use our
                  Service, including IP address, browser type, and pages visited
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong>Cookies:</strong> We use cookies to track and remember
                  your preferences
                </span>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              3. Use of Data
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Collection Ledger uses the collected data for various purposes:
            </p>
            <ul className="space-y-2 text-muted-foreground leading-relaxed">
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>To provide and maintain our Service</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>To notify you about changes to our Service</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  To allow you to participate in interactive features of our
                  Service
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>To provide customer support</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  To gather analysis or valuable information so that we can
                  improve our Service
                </span>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              4. Security of Data
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The security of your data is important to us, but remember that no
              method of transmission over the Internet or method of electronic
              storage is 100% secure. While we strive to use commercially
              acceptable means to protect your Personal Data, we cannot
              guarantee its absolute security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              5. Changes to This Privacy Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page
              and updating the "Last updated" date at the top of this Privacy
              Policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              6. Contact Us
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please
              contact us at support@collectionledger.com
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Collection Ledger. Made for
              cable operators.
            </p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <Link
                href="/privacy"
                className="hover:text-foreground transition"
              >
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
