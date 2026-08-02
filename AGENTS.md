<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# ui.byronwade.com

Blank Next.js 16 app for the Byron Wade design site. Build application UI and design surfaces here from a clean foundation.

## Stack

- Next.js 16 App Router + Turbopack
- React 19 + React Compiler (`reactCompiler: true` in `next.config.ts`)
- Tailwind CSS v4 (`@import "tailwindcss"` in `app/globals.css`)
- TypeScript, ESLint

## Conventions

- Edit under `app/`
- Prefer Server Components; add `"use client"` only when needed
- Keep the surface blank until intentional design work lands
- Read Next.js docs in `node_modules/next/dist/docs/` before using unfamiliar APIs
