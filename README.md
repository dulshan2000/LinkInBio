# LinkInBio ⚡

A high-performance, full-stack Linktree clone built with the modern Next.js 14 App Router, Prisma, NextAuth v5, and Tailwind CSS. Create your personalized profile page in seconds to share all your links in one place.

## Features ✨

- **Public Profiles**: Beautiful, fully responsive `/username` pages to showcase your links.
- **5 Custom Themes**: Cosmic, Ocean, Sunset, Forest, and Midnight styling out-of-the-box.
- **Drag & Drop Reordering**: Intuitively reorder your links on the dashboard using `@hello-pangea/dnd`.
- **Advanced Analytics**: Track clicks, view 30-day timelines, and see device/country breakdowns (powered by Recharts and Vercel geo-headers).
- **Secure Authentication**: NextAuth v5 credentials provider with bcrypt password hashing.
- **Dashboard**: A powerful admin interface for managing your profile, links, and analytics.

## Tech Stack 🛠️

- **Framework:** Next.js 14 (App Router, Server Components, Server Actions)
- **Database:** PostgreSQL (Hosted on Prisma Postgres)
- **ORM:** Prisma v7 (with `@prisma/adapter-pg`)
- **Authentication:** NextAuth.js (v5 Beta)
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui & Radix Primitives
- **Icons:** Lucide React
- **Validation:** Zod

## Getting Started 🚀

### 1. Requirements
Ensure you have **Node.js 18+** installed.

### 2. Environment Variables
Create a `.env` file in the root directory and add the following:

```env
# Your Prisma Postgres connection string
DATABASE_URL="postgresql://user:password@db.prisma.io:5432/postgres?sslmode=require"

# Generate a random string using `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
NEXTAUTH_SECRET="your_secret_here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup
Push the Prisma schema to your database and seed it with demo data:

```bash
npm run db:push
npm run db:seed
```

### 5. Run the Application
Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the landing page.
Visit `http://localhost:3000/demo` (after seeding) to view the generated demo profile.

## Directory Structure 📁

- `app/` — Application routes (Dashboard, Auth, Landing, Profile).
- `app/api/` — API routes for link tracking, analytics, and data changes.
- `components/` — Reusable React components (UI, Dashboard, Forms).
- `lib/` — Utilities, Prisma client singleton, and Auth configurations.
- `prisma/` — Database schema, configuration, and seed scripts.

## License

This project is licensed under the MIT License.
