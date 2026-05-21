# Collection Ledger

Collection Ledger is a browser-based ledger system for local cable operators and collection teams. It helps an organization keep track of customer connections, monthly payments, package pricing, add-ons, unpaid accounts, and collection history from a single dashboard.

The app is the web version of Collection Ledger Lite, built for operators who need a faster way to manage customer records and monthly collections without relying on paper ledgers or spreadsheets.

## What It Does

- Tracks customer connections with box number, area, phone number, base pack, and active add-ons
- Records payments and keeps payment history for each connection
- Shows dashboard stats for total connections, paid connections, unpaid connections, and monthly revenue
- Supports package and add-on management with separate operator and customer pricing
- Handles connection updates, package migrations, and payment deletion
- Provides history views for reviewing previous collections
- Supports importing and exporting ledger data, including paid connection lists
- Includes organization-level profile, company, and settings pages

## Main Areas

- **Dashboard** - Collection summary, recent payments, package-wise monthly payment data, and quick actions
- **Connections** - Customer records, search, mobile list view, desktop table view, details, edits, payments, add-ons, and migrations
- **Payments History** - A chronological view of recorded payments
- **Areas** - Area management for organizing connections by location
- **Base Packs** - Monthly package management with LCO and customer prices
- **Add-ons** - Optional channel/package add-ons attached to connections
- **Profile and Company** - User and organization information
- **Settings** - App and ledger configuration

## Stack

- **Framework:** Next.js App Router with React 19
- **Language:** TypeScript
- **Database:** PostgreSQL through Drizzle ORM
- **Authentication and organizations:** Better Auth
- **Styling:** Tailwind CSS with Shadcn components
- **Tables and charts:** TanStack Table and Recharts
- **Forms and validation:** React Hook Form with Zod
- **Internationalization:** next-intl
- **Testing:** Vitest and Playwright
- **Tooling:** Biome for linting and formatting
