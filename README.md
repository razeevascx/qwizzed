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
![Supabase](https://img.shields.io/badge/-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Radix UI](https://img.shields.io/badge/-Radix_UI-18181B?style=flat-square&logo=radix-ui)
![Shadcn/UI](https://img.shields.io/badge/-Shadcn%2FUI-000?style=flat-square)
![Lucide](https://img.shields.io/badge/-Lucide-000?style=flat-square)
![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?style=flat-square&logo=eslint)

</div>

## Project Overview

Qwizzed is a Next.js and Supabase-powered quiz platform for educators, teams, and creators who need to spin up engaging assessments quickly. Build quizzes with modern UI components, publish securely, and track submissions in real time without managing backend boilerplate. The experience is tuned for fast authoring, smooth taking, and reliable data.

## Key Features

- **Fast quiz authoring** - Create, edit, and publish quizzes with structured forms and sensible defaults.
- **Rich question types** - Multiple choice, true/false, and short answer support tailored feedback and scoring.
- **Protected experiences** - Supabase Auth and middleware guard private routes and data access.
- **Submission insights** - Track attempts and scores to understand performance trends.
- **Responsive theming** - Light/dark mode and adaptive layouts keep quizzes readable on any device.
- **Shareable links** - Publish quizzes and distribute unique URLs in seconds.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript 5, Radix UI, Shadcn/UI
- **Styling:** Tailwind CSS 4, class-variance-authority, tailwind-merge
- **Backend & Auth:** Supabase (database, auth, real-time)
- **Tooling:** ESLint 9, TypeScript, PostCSS
- **Icons:** Lucide React

## Installation & Setup

### Prerequisites

- Node.js 18+
- npm or bun
- Supabase project with URL and publishable (anon) key
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

4. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Verify the setup**
   - Open http://localhost:3000
   - Create a test account and build a sample quiz
   - Submit an attempt to confirm data flow
