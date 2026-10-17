<div align="center">

# QWIZZED

_Create, share, and master quizzes without friction_

![Last Commit](https://img.shields.io/github/last-commit/razeevascx/Qwizzed?label=last%20commit&color=blue&style=flat-square)
![TypeScript](https://img.shields.io/badge/typescript-100%25-blue?style=flat-square)
![Languages](https://img.shields.io/github/languages/count/razeevascx/Qwizzed?label=languages&color=orange&style=flat-square)

**Built with the tools and technologies:**

![Next.js](https://img.shields.io/badge/-Next.js-000?style=flat-square&logo=nextdotjs)
![React](https://img.shields.io/badge/-React-149ECA?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Clerk](https://img.shields.io/badge/-Clerk-6C47FF?style=flat-square)
![Convex](https://img.shields.io/badge/-Convex-EE342F?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Radix UI](https://img.shields.io/badge/-Radix_UI-18181B?style=flat-square&logo=radix-ui)
![Shadcn/UI](https://img.shields.io/badge/-Shadcn%2FUI-000?style=flat-square)
![Lucide](https://img.shields.io/badge/-Lucide-000?style=flat-square)
![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?style=flat-square&logo=eslint)

</div>

## Project Overview

Qwizzed is a Next.js, Clerk, and Convex-powered quiz platform for educators, teams, and creators who need to spin up engaging assessments quickly. Build quizzes with modern UI components, publish securely, and track submissions in real time without managing backend boilerplate. The experience is tuned for fast authoring, smooth taking, and reliable data.

## Key Features

- **Fast quiz authoring** - Create, edit, and publish quizzes with structured forms and sensible defaults.
- **Rich question types** - Multiple choice, true/false, and short answer support tailored feedback and scoring.
- **Protected experiences** - Clerk, middleware, and Convex authorization guard private routes and data access.
- **Submission insights** - Track attempts and scores to understand performance trends.
- **Responsive theming** - Light/dark mode and adaptive layouts keep quizzes readable on any device.
- **Shareable links** - Publish quizzes and distribute unique URLs in seconds.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript 5, Radix UI, Shadcn/UI
- **Styling:** Tailwind CSS 4, class-variance-authority, tailwind-merge
- **Backend & Auth:** Convex (database and real-time), Clerk (authentication)
- **Tooling:** ESLint 9, TypeScript, PostCSS
- **Icons:** Lucide React

## Installation & Setup

### Prerequisites

- Node.js 20.9+
- npm or bun
- Access to the linked Clerk application and Convex project
- Git

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/razeevascx/Qwizzed.git
   ```

2. **Navigate to the project**

   ```bash
   cd Qwizzed
   ```

3. **Install dependencies**

   ```bash
   npm install
   # or
   bun install
   ```

4. **Link the existing development services**

   ```bash
   npx -y clerk@latest auth login
   npx -y clerk@latest link --app app_3Kpd3Rd4H47FXXymzPFj28ypece
   npx -y clerk@latest env pull
   bunx convex dev
   ```

   Select the existing Convex project `qwizzed-2bfa2` on team `rajeev-puri`.
   The CLIs write the ignored local environment files. Required app variables are
   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, and
   `NEXT_PUBLIC_CONVEX_URL`. Never commit secret keys.

   The Convex development deployment already has its Clerk issuer configured.
   See [migration notes](docs/clerk-migration.md) for identity mapping, imported
   data, verification commands, and production cutover.

5. **Start the development server** in another terminal

   ```bash
   bun run dev
   ```

6. **Verify the setup**
   - Open http://localhost:3000/get-started
   - Sign in with email or Google using the original form
   - Create a quiz and submit an attempt

   ```bash
   bun test tests/convex-auth.test.ts
   node scripts/check-auth-routes.mjs
   ```
