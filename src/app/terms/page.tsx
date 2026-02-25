import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Terms of Service - Collection Ledger",
  description: "Terms of Service for Collection Ledger",
};

export default function TermsOfService() {
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
              Terms of Service
            </h1>
            <p className="text-muted-foreground">Last updated: February 2026</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Collection Ledger, you accept and agree to
              be bound by the terms and provision of this agreement. If you do
              not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              2. Use License
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Permission is granted to temporarily download one copy of the
              materials (information or software) on Collection Ledger for
              personal, non-commercial transitory viewing only. This is the
              grant of a license, not a transfer of title, and under this
              license you may not:
            </p>
            <ul className="space-y-2 text-muted-foreground leading-relaxed">
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>Modifying or copying the materials</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  Using the materials for any commercial purpose or for any
                  public display
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  Attempting to decompile or reverse engineer any software
                  contained on Collection Ledger
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  Removing any copyright or other proprietary notations from the
                  materials
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  Transferring the materials to another person or "mirroring"
                  the materials on any other server
                </span>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              3. Disclaimer
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The materials on Collection Ledger are provided on an 'as is'
              basis. Collection Ledger makes no warranties, expressed or
              implied, and hereby disclaims and negates all other warranties
              including, without limitation, implied warranties or conditions of
              merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property or other violation of
              rights.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              4. Limitations
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall Collection Ledger or its suppliers be liable for
              any damages (including, without limitation, damages for loss of
              data or profit, or due to business interruption) arising out of
              the use or inability to use the materials on Collection Ledger.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              5. Accuracy of Materials
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The materials appearing on Collection Ledger could include
              technical, typographical, or photographic errors. Collection
              Ledger does not warrant that any of the materials on its Service
              are accurate, complete, or current. Collection Ledger may make
              changes to the materials contained on its Service at any time
              without notice.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">6. Links</h2>
            <p className="text-muted-foreground leading-relaxed">
              Collection Ledger has not reviewed all of the sites linked to its
              Service and is not responsible for the contents of any such linked
              site. The inclusion of any link does not imply endorsement by
              Collection Ledger of the site. Use of any such linked website is
              at the user's own risk.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              7. Modifications
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Collection Ledger may revise these terms of service for its
              Service at any time without notice. By using this Service, you are
              agreeing to be bound by the then current version of these terms of
              service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              8. User Responsibilities
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for:
            </p>
            <ul className="space-y-2 text-muted-foreground leading-relaxed">
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>Maintaining the confidentiality of your account</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  All activities that occur under your account, whether by you
                  or by others
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  Ensuring that all information you provide is accurate and
                  current
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  Complying with all applicable laws and regulations regarding
                  data and collections management
                </span>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              9. Governing Law
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              These terms and conditions are governed by and construed in
              accordance with the laws of India, and you irrevocably submit to
              the exclusive jurisdiction of the courts in that location.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">
              10. Contact Information
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please
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
