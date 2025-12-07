"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Search, Info, GitCompare } from "lucide-react"
import { LibraryComparison } from "./library-comparison"
import { trackLibrarySelection } from "@/lib/analytics"
import type { ProjectConfig } from "@/lib/types"

interface Option {
  id: string
  name: string
  description: string
  icon?: string
  iconColor?: string
  tooltip?: string
}

const frontendOptions: Option[] = [
  {
    id: "react",
    name: "React",
    description: "Vite + React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    tooltip: "A JavaScript library for building user interfaces with a component-based architecture",
  },
  {
    id: "next",
    name: "Next.js",
    description: "Full-stack React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    tooltip: "The React framework for production with SSR, SSG, and API routes built-in",
  },
  {
    id: "vue",
    name: "Vue 3",
    description: "Vite + Vue 3",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
    tooltip: "Progressive JavaScript framework for building user interfaces",
  },
  {
    id: "nuxt",
    name: "Nuxt",
    description: "Vue meta-framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg",
    tooltip: "The intuitive Vue framework with SSR, routing, and modules",
  },
  {
    id: "svelte",
    name: "Svelte",
    description: "Vite + Svelte",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg",
    tooltip: "Compile-time framework that shifts work from runtime to build time",
  },
  {
    id: "sveltekit",
    name: "SvelteKit",
    description: "Svelte meta-framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg",
    tooltip: "Full-stack Svelte framework for building web applications",
  },
  {
    id: "angular",
    name: "Angular",
    description: "Angular CLI",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
    tooltip: "Platform for building mobile and desktop web applications",
  },
  {
    id: "solid",
    name: "Solid.js",
    description: "SolidStart",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/solidjs/solidjs-original.svg",
    tooltip: "Simple and performant reactivity for building user interfaces",
  },
  {
    id: "qwik",
    name: "Qwik",
    description: "Resumable framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/qwik/qwik-original.svg",
    tooltip: "Instant-loading web apps with resumable execution",
  },
  {
    id: "astro",
    name: "Astro",
    description: "Content-focused",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/astro/astro-original.svg",
    tooltip: "All-in-one web framework for content-driven websites",
  },
  {
    id: "remix",
    name: "Remix",
    description: "Full-stack React",
    icon: "https://cdn.simpleicons.org/remix/000000",
    tooltip: "Full stack web framework focused on web standards and modern UX",
  },
]

const variantOptions: Option[] = [
  {
    id: "ts",
    name: "TypeScript",
    description: "Type-safe",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    tooltip: "JavaScript with syntax for types for better tooling and error detection",
  },
  {
    id: "js",
    name: "JavaScript",
    description: "Classic",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    tooltip: "Standard JavaScript for maximum flexibility",
  },
]

const stylingOptions: Option[] = [
  {
    id: "tailwind",
    name: "Tailwind CSS",
    description: "Utility-first CSS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
    tooltip: "A utility-first CSS framework for rapid UI development",
  },
  {
    id: "sass",
    name: "Sass/SCSS",
    description: "CSS preprocessor",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg",
    tooltip: "Professional grade CSS extension language",
  },
  {
    id: "styled-components",
    name: "Styled Components",
    description: "CSS-in-JS",
    icon: "https://cdn.simpleicons.org/styledcomponents/DB7093",
    tooltip: "Visual primitives for styling React components",
  },
  {
    id: "emotion",
    name: "Emotion",
    description: "CSS-in-JS library",
    icon: "https://cdn.simpleicons.org/emotion/C865B9",
    tooltip: "Flexible CSS-in-JS library for styling applications",
  },
  {
    id: "css-modules",
    name: "CSS Modules",
    description: "Scoped CSS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    tooltip: "CSS files where class names are scoped locally by default",
  },
  {
    id: "vanilla-extract",
    name: "Vanilla Extract",
    description: "Zero-runtime CSS",
    icon: "https://cdn.simpleicons.org/css3/1572B6",
    tooltip: "Zero-runtime Stylesheets in TypeScript",
  },
]

const uiLibraryOptions: Option[] = [
  {
    id: "shadcn",
    name: "shadcn/ui",
    description: "Beautifully designed components",
    icon: "https://cdn.simpleicons.org/shadcnui/000000",
    tooltip: "Re-usable components built with Radix UI and Tailwind CSS",
  },
  {
    id: "antd",
    name: "Ant Design",
    description: "Enterprise UI system",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/antdesign/antdesign-original.svg",
    tooltip: "An enterprise-class UI design language and React UI library",
  },
  {
    id: "mui",
    name: "Material UI",
    description: "Google's Material Design",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg",
    tooltip: "React components that implement Google's Material Design",
  },
  {
    id: "chakra",
    name: "Chakra UI",
    description: "Simple, modular components",
    icon: "https://cdn.simpleicons.org/chakraui/319795",
    tooltip: "Simple, modular and accessible component library",
  },
  {
    id: "radix",
    name: "Radix UI",
    description: "Unstyled, accessible",
    icon: "https://cdn.simpleicons.org/radixui/161618",
    tooltip: "Unstyled, accessible UI primitives for React",
  },
  {
    id: "headless",
    name: "Headless UI",
    description: "Unstyled by Tailwind",
    icon: "https://cdn.simpleicons.org/headlessui/66E3FF",
    tooltip: "Completely unstyled, fully accessible UI components",
  },
  {
    id: "daisyui",
    name: "DaisyUI",
    description: "Tailwind components",
    icon: "https://cdn.simpleicons.org/daisyui/5A0EF8",
    tooltip: "The most popular Tailwind CSS component library",
  },
  {
    id: "nextui",
    name: "NextUI",
    description: "Beautiful, modern UI",
    icon: "https://cdn.simpleicons.org/nextui/000000",
    tooltip: "Beautiful, fast and modern React UI library",
  },
  {
    id: "mantine",
    name: "Mantine",
    description: "Full-featured React UI",
    icon: "https://cdn.simpleicons.org/mantine/339AF0",
    tooltip: "A fully featured React components library",
  },
  {
    id: "arco",
    name: "Arco Design",
    description: "ByteDance UI system",
    icon: "https://cdn.simpleicons.org/bytedance/3C8CFF",
    tooltip: "ByteDance's enterprise-level design system",
  },
  {
    id: "primereact",
    name: "PrimeReact",
    description: "Rich UI components",
    icon: "https://cdn.simpleicons.org/primereact/DD0031",
    tooltip: "The Most Complete React UI Component Library",
  },
  {
    id: "flowbite",
    name: "Flowbite",
    description: "Tailwind components",
    icon: "https://cdn.simpleicons.org/flowbite/1C64F2",
    tooltip: "Tailwind CSS component library with vanilla JS",
  },
]

const stateManagementOptions: Option[] = [
  {
    id: "zustand",
    name: "Zustand",
    description: "Minimal state management",
    icon: "https://cdn.simpleicons.org/zustand/453F39",
    tooltip: "A small, fast and scalable bearbones state-management solution",
  },
  {
    id: "redux",
    name: "Redux Toolkit",
    description: "Predictable state container",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg",
    tooltip: "The official, opinionated, batteries-included toolset for Redux",
  },
  {
    id: "jotai",
    name: "Jotai",
    description: "Primitive atomic state",
    icon: "https://cdn.simpleicons.org/jotai/000000",
    tooltip: "Primitive and flexible state management for React",
  },
  {
    id: "recoil",
    name: "Recoil",
    description: "Facebook state management",
    icon: "https://cdn.simpleicons.org/recoil/3578E5",
    tooltip: "A state management library for React by Facebook",
  },
  {
    id: "tanstack-query",
    name: "TanStack Query",
    description: "Server state management",
    icon: "https://cdn.simpleicons.org/reactquery/FF4154",
    tooltip: "Powerful asynchronous state management for React",
  },
  {
    id: "apollo",
    name: "Apollo Client",
    description: "GraphQL state management",
    icon: "https://cdn.simpleicons.org/apollographql/311C87",
    tooltip: "Comprehensive state management library for JavaScript with GraphQL",
  },
  {
    id: "swr",
    name: "SWR",
    description: "React Hooks for data fetching",
    icon: "https://cdn.simpleicons.org/swr/000000",
    tooltip: "React Hooks for data fetching by Vercel",
  },
  {
    id: "mobx",
    name: "MobX",
    description: "Simple, scalable state",
    icon: "https://cdn.simpleicons.org/mobx/FF9955",
    tooltip: "Simple, scalable state management",
  },
]

const backendOptions: Option[] = [
  { id: "none", name: "None", description: "Frontend only", tooltip: "No backend, frontend only project" },
  {
    id: "express",
    name: "Express.js",
    description: "Node.js framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    tooltip: "Fast, unopinionated, minimalist web framework for Node.js",
  },
  {
    id: "fastify",
    name: "Fastify",
    description: "Fast Node.js server",
    icon: "https://cdn.simpleicons.org/fastify/000000",
    tooltip: "Fast and low overhead web framework for Node.js",
  },
  {
    id: "nest",
    name: "NestJS",
    description: "Progressive Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg",
    tooltip: "A progressive Node.js framework for building efficient server-side applications",
  },
  {
    id: "hono",
    name: "Hono",
    description: "Ultrafast web framework",
    icon: "https://cdn.simpleicons.org/hono/E36002",
    tooltip: "Ultrafast web framework for Cloudflare Workers, Bun, Deno, and more",
  },
  {
    id: "bun",
    name: "Bun",
    description: "Fast all-in-one runtime",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bun/bun-original.svg",
    tooltip: "Incredibly fast JavaScript runtime, bundler, transpiler and package manager",
  },
  {
    id: "deno",
    name: "Deno",
    description: "Secure JS/TS runtime",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/denojs/denojs-original.svg",
    tooltip: "A secure runtime for JavaScript and TypeScript",
  },
  {
    id: "flask",
    name: "Flask",
    description: "Python micro-framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
    tooltip: "A lightweight WSGI web application framework in Python",
  },
  {
    id: "fastapi",
    name: "FastAPI",
    description: "Modern Python API",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
    tooltip: "FastAPI framework, high performance, easy to learn, fast to code",
  },
  {
    id: "django",
    name: "Django",
    description: "Python web framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
    tooltip: "The web framework for perfectionists with deadlines",
  },
  {
    id: "spring",
    name: "Spring Boot",
    description: "Java framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
    tooltip: "Java-based framework for creating stand-alone, production-grade applications",
  },
  {
    id: "quarkus",
    name: "Quarkus",
    description: "Supersonic Java",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/quarkus/quarkus-original.svg",
    tooltip: "Kubernetes-native Java framework tailored for GraalVM and HotSpot",
  },
  {
    id: "gin",
    name: "Gin",
    description: "Go web framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
    tooltip: "A high-performance HTTP web framework written in Go",
  },
  {
    id: "fiber",
    name: "Fiber",
    description: "Express-inspired Go",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
    tooltip: "Express inspired web framework built on top of Fasthttp",
  },
]

const databaseOptions: Option[] = [
  { id: "none", name: "None", description: "No database", tooltip: "No database configuration" },
  {
    id: "prisma-postgres",
    name: "Prisma + PostgreSQL",
    description: "Type-safe ORM",
    icon: "https://cdn.simpleicons.org/prisma/2D3748",
    tooltip: "Next-generation ORM for Node.js and TypeScript with PostgreSQL",
  },
  {
    id: "prisma-mysql",
    name: "Prisma + MySQL",
    description: "Type-safe ORM",
    icon: "https://cdn.simpleicons.org/prisma/2D3748",
    tooltip: "Next-generation ORM for Node.js and TypeScript with MySQL",
  },
  {
    id: "drizzle",
    name: "Drizzle ORM",
    description: "Lightweight TypeScript ORM",
    icon: "https://cdn.simpleicons.org/drizzle/C5F74F",
    tooltip: "TypeScript ORM that is lightweight, performant and type-safe",
  },
  {
    id: "mongodb",
    name: "MongoDB",
    description: "NoSQL document DB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    tooltip: "Document-oriented NoSQL database for modern applications",
  },
  {
    id: "mongoose",
    name: "Mongoose",
    description: "MongoDB ODM",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongoose/mongoose-original.svg",
    tooltip: "Elegant MongoDB object modeling for Node.js",
  },
  {
    id: "typeorm",
    name: "TypeORM",
    description: "TypeScript ORM",
    icon: "https://cdn.simpleicons.org/typeorm/FE0803",
    tooltip: "ORM for TypeScript and JavaScript with support for multiple databases",
  },
  {
    id: "sequelize",
    name: "Sequelize",
    description: "Node.js ORM",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sequelize/sequelize-original.svg",
    tooltip: "Promise-based Node.js ORM for SQL databases",
  },
  {
    id: "kysely",
    name: "Kysely",
    description: "Type-safe SQL builder",
    icon: "https://cdn.simpleicons.org/postgresql/4169E1",
    tooltip: "Type-safe TypeScript SQL query builder",
  },
  {
    id: "sqlite",
    name: "SQLite",
    description: "Embedded database",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg",
    tooltip: "Self-contained, serverless SQL database engine",
  },
  {
    id: "redis",
    name: "Redis",
    description: "In-memory data store",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
    tooltip: "In-memory data structure store used as database, cache, and message broker",
  },
]

const baasOptions: Option[] = [
  {
    id: "firebase",
    name: "Firebase",
    description: "Google's BaaS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg",
    tooltip: "Google's platform for building mobile and web applications",
  },
  {
    id: "supabase",
    name: "Supabase",
    description: "Open source Firebase",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
    tooltip: "Open source Firebase alternative with PostgreSQL",
  },
  {
    id: "appwrite",
    name: "Appwrite",
    description: "Self-hosted BaaS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/appwrite/appwrite-original.svg",
    tooltip: "Open-source backend as a service for web and mobile developers",
  },
  {
    id: "convex",
    name: "Convex",
    description: "Reactive backend",
    icon: "https://cdn.simpleicons.org/convex/EE342F",
    tooltip: "The reactive backend-as-a-service for modern apps",
  },
  {
    id: "pocketbase",
    name: "PocketBase",
    description: "Go backend in 1 file",
    icon: "https://cdn.simpleicons.org/pocketbase/B8DBE4",
    tooltip: "Open Source backend for your SaaS and mobile apps in 1 file",
  },
  {
    id: "clerk",
    name: "Clerk",
    description: "Authentication",
    icon: "https://cdn.simpleicons.org/clerk/6C47FF",
    tooltip: "Authentication and user management platform",
  },
  {
    id: "auth0",
    name: "Auth0",
    description: "Identity platform",
    icon: "https://cdn.simpleicons.org/auth0/EB5424",
    tooltip: "Flexible authentication and authorization platform",
  },
  {
    id: "nextauth",
    name: "NextAuth.js",
    description: "Next.js auth",
    icon: "https://cdn.simpleicons.org/nextdotjs/000000",
    tooltip: "Authentication for Next.js applications",
  },
  {
    id: "lucia",
    name: "Lucia",
    description: "Auth library",
    icon: "https://cdn.simpleicons.org/lucia/5F57FF",
    tooltip: "Simple session-based authentication library",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Payment processing",
    icon: "https://cdn.simpleicons.org/stripe/635BFF",
    tooltip: "Online payment processing for internet businesses",
  },
  {
    id: "lemonsqueezy",
    name: "Lemon Squeezy",
    description: "Payments for SaaS",
    icon: "https://cdn.simpleicons.org/lemonsqueezy/FFC233",
    tooltip: "Payments, tax, and subscriptions for software companies",
  },
  {
    id: "resend",
    name: "Resend",
    description: "Email for developers",
    icon: "https://cdn.simpleicons.org/resend/000000",
    tooltip: "Email API for developers to send transactional emails",
  },
  {
    id: "uploadthing",
    name: "UploadThing",
    description: "File uploads",
    icon: "https://cdn.simpleicons.org/uploadthing/FF0000",
    tooltip: "File uploads for full-stack TypeScript applications",
  },
  {
    id: "neon",
    name: "Neon",
    description: "Serverless Postgres",
    icon: "https://cdn.simpleicons.org/neon/00E699",
    tooltip: "Serverless PostgreSQL with branching and auto-scaling",
  },
  {
    id: "planetscale",
    name: "PlanetScale",
    description: "Serverless MySQL",
    icon: "https://cdn.simpleicons.org/planetscale/000000",
    tooltip: "Serverless MySQL platform with branching workflows",
  },
  {
    id: "upstash",
    name: "Upstash",
    description: "Serverless Redis",
    icon: "https://cdn.simpleicons.org/upstash/00E9A3",
    tooltip: "Serverless data for Redis and Kafka",
  },
]

const testingOptions: Option[] = [
  {
    id: "jest",
    name: "Jest",
    description: "Testing framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg",
    tooltip: "Delightful JavaScript Testing Framework with a focus on simplicity",
  },
  {
    id: "vitest",
    name: "Vitest",
    description: "Vite-native testing",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitest/vitest-original.svg",
    tooltip: "Blazing Fast Unit Test Framework powered by Vite",
  },
  {
    id: "cypress",
    name: "Cypress",
    description: "E2E testing",
    icon: "https://cdn.simpleicons.org/cypress/69D3A7",
    tooltip: "Fast, easy and reliable testing for anything that runs in a browser",
  },
  {
    id: "playwright",
    name: "Playwright",
    description: "Browser testing",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/playwright/playwright-original.svg",
    tooltip: "End-to-end testing for modern web apps",
  },
  {
    id: "rtl",
    name: "React Testing Library",
    description: "React testing",
    icon: "https://cdn.simpleicons.org/testinglibrary/E33332",
    tooltip: "Simple and complete React DOM testing utilities",
  },
  {
    id: "msw",
    name: "MSW",
    description: "API mocking",
    icon: "https://cdn.simpleicons.org/msw/FF6A33",
    tooltip: "API mocking library for browser and Node.js",
  },
  {
    id: "storybook",
    name: "Storybook",
    description: "Component workshop",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/storybook/storybook-original.svg",
    tooltip: "UI development, testing, and documentation tool",
  },
]

const animationOptions: Option[] = [
  {
    id: "framer-motion",
    name: "Framer Motion",
    description: "Production-ready animations",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/framermotion/framermotion-original.svg",
    tooltip: "A production-ready motion library for React",
  },
  {
    id: "gsap",
    name: "GSAP",
    description: "Professional animations",
    icon: "https://cdn.simpleicons.org/greensock/88CE02",
    tooltip: "Professional-grade JavaScript animation library",
  },
  {
    id: "react-spring",
    name: "React Spring",
    description: "Spring-physics animations",
    icon: "https://cdn.simpleicons.org/react/61DAFB",
    tooltip: "Spring-physics based animation library for React",
  },
  {
    id: "auto-animate",
    name: "AutoAnimate",
    description: "Zero-config animations",
    icon: "https://cdn.simpleicons.org/formkit/21C483",
    tooltip: "Add motion to your apps with a single line of code",
  },
  {
    id: "lottie",
    name: "Lottie",
    description: "After Effects animations",
    icon: "https://cdn.simpleicons.org/lottiefiles/00DDB3",
    tooltip: "Render After Effects animations natively in web and mobile apps",
  },
]

const dataVizOptions: Option[] = [
  {
    id: "recharts",
    name: "Recharts",
    description: "React charts library",
    icon: "https://cdn.simpleicons.org/react/61DAFB",
    tooltip: "A composable charting library built on React components",
  },
  {
    id: "chartjs",
    name: "Chart.js",
    description: "Simple, flexible charts",
    icon: "https://cdn.simpleicons.org/chartdotjs/FF6384",
    tooltip: "Simple yet flexible JavaScript charting library",
  },
  {
    id: "d3",
    name: "D3.js",
    description: "Data-driven documents",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/d3js/d3js-original.svg",
    tooltip: "JavaScript library for producing dynamic, interactive data visualizations",
  },
  {
    id: "echarts",
    name: "ECharts",
    description: "Apache charts",
    icon: "https://cdn.simpleicons.org/apacheecharts/AA344D",
    tooltip: "Feature-rich interactive charting and visualization library",
  },
  {
    id: "visx",
    name: "visx",
    description: "Airbnb visualization",
    icon: "https://cdn.simpleicons.org/airbnb/FF5A5F",
    tooltip: "Collection of reusable low-level visualization components by Airbnb",
  },
  {
    id: "nivo",
    name: "Nivo",
    description: "Rich dataviz components",
    icon: "https://cdn.simpleicons.org/nivo/F88C24",
    tooltip: "Rich set of data visualization components built on D3",
  },
]

const toolingOptions: Option[] = [
  {
    id: "turborepo",
    name: "Turborepo",
    description: "Monorepo tool",
    icon: "https://cdn.simpleicons.org/turborepo/EF4444",
    tooltip: "High-performance build system for JavaScript/TypeScript monorepos",
  },
  {
    id: "nx",
    name: "Nx",
    description: "Smart build system",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nx/nx-original.svg",
    tooltip: "Smart, fast and extensible build system with first-class monorepo support",
  },
  {
    id: "docker",
    name: "Docker",
    description: "Containerization",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    tooltip: "Platform for developing, shipping, and running applications in containers",
  },
  {
    id: "github-actions",
    name: "GitHub Actions",
    description: "CI/CD workflows",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg",
    tooltip: "Automate, customize, and execute software development workflows",
  },
  {
    id: "changesets",
    name: "Changesets",
    description: "Version management",
    icon: "https://cdn.simpleicons.org/github/181717",
    tooltip: "Tool for managing versioning and changelogs in monorepos",
  },
]

const lintingOptions: Option[] = [
  {
    id: "eslint",
    name: "ESLint",
    description: "JavaScript linter",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eslint/eslint-original.svg",
    tooltip: "Find and fix problems in your JavaScript code",
  },
  {
    id: "prettier",
    name: "Prettier",
    description: "Code formatter",
    icon: "https://cdn.simpleicons.org/prettier/F7B93E",
    tooltip: "Opinionated code formatter for consistent code style",
  },
  {
    id: "husky",
    name: "Husky",
    description: "Git hooks",
    icon: "https://cdn.simpleicons.org/git/F05032",
    tooltip: "Git hooks made easy to lint commit messages and run tests",
  },
  {
    id: "lint-staged",
    name: "lint-staged",
    description: "Pre-commit linting",
    icon: "https://cdn.simpleicons.org/git/F05032",
    tooltip: "Run linters on staged git files before committing",
  },
  {
    id: "commitlint",
    name: "Commitlint",
    description: "Commit conventions",
    icon: "https://cdn.simpleicons.org/commitlint/000000",
    tooltip: "Lint commit messages to follow conventional commits",
  },
  {
    id: "biome",
    name: "Biome",
    description: "Fast formatter & linter",
    icon: "https://cdn.simpleicons.org/biome/60A5FA",
    tooltip: "One toolchain for your web project - fast linter and formatter",
  },
]

interface StackSelectorProps {
  config: ProjectConfig
  setConfig: React.Dispatch<React.SetStateAction<ProjectConfig>>
}

function LibraryIcon({ src, name }: { src?: string; name: string }) {
  if (!src) {
    return (
      <div className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400">
        {name.charAt(0)}
      </div>
    )
  }
  return (
    <img
      src={src || "/placeholder.svg"}
      alt={name}
      className="w-6 h-6 object-contain"
      onError={(e) => {
        const target = e.target as HTMLImageElement
        target.style.display = "none"
      }}
    />
  )
}

export function StackSelector({ config, setConfig }: StackSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [comparisonCategory, setComparisonCategory] = useState<string | null>(null)

  const toggleArray = (key: keyof ProjectConfig, value: string) => {
    trackLibrarySelection(value)
    setConfig((prev) => {
      const arr = prev[key] as string[]
      if (arr.includes(value)) {
        return { ...prev, [key]: arr.filter((v) => v !== value) }
      }
      return { ...prev, [key]: [...arr, value] }
    })
  }

  const filterOptions = (options: Option[]) => {
    if (!searchQuery) return options
    return options.filter(
      (opt) =>
        opt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opt.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  const Section = ({
    title,
    options,
    type,
    configKey,
    icon: SectionIcon,
    showCompare,
  }: {
    title: string
    options: Option[]
    type: "single" | "multi"
    configKey: keyof ProjectConfig
    icon: React.ElementType
    showCompare?: boolean
  }) => {
    const filteredOptions = filterOptions(options)
    if (filteredOptions.length === 0 && searchQuery) return null

    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SectionIcon className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
          </div>
          {showCompare && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setComparisonCategory(configKey)}
              className="text-slate-500 hover:text-emerald-600"
            >
              <GitCompare className="w-4 h-4 mr-1" />
              Compare
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredOptions.map((option) => {
            const isSelected =
              type === "single" ? config[configKey] === option.id : (config[configKey] as string[]).includes(option.id)

            return type === "single" ? (
              <TooltipProvider key={option.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card
                      className={cn(
                        "p-3 cursor-pointer transition-all duration-200 hover:shadow-md border-2 bg-white dark:bg-slate-700 group",
                        isSelected
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-md"
                          : "border-slate-200 dark:border-slate-600 hover:border-emerald-300",
                      )}
                      onClick={() => {
                        trackLibrarySelection(option.id)
                        setConfig((prev) => ({ ...prev, [configKey]: option.id }))
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <LibraryIcon src={option.icon} name={option.name} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-slate-900 dark:text-white truncate">{option.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{option.description}</p>
                        </div>
                        {option.tooltip && (
                          <Info className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        )}
                      </div>
                    </Card>
                  </TooltipTrigger>
                  {option.tooltip && (
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-sm">{option.tooltip}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ) : (
              <TooltipProvider key={option.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Card
                      className={cn(
                        "p-3 cursor-pointer transition-all duration-200 hover:shadow-md border-2 bg-white dark:bg-slate-700 group",
                        isSelected
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-md"
                          : "border-slate-200 dark:border-slate-600 hover:border-emerald-300",
                      )}
                      onClick={() => toggleArray(configKey, option.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={isSelected}
                          className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                        <LibraryIcon src={option.icon} name={option.name} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-slate-900 dark:text-white truncate">{option.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{option.description}</p>
                        </div>
                        {option.tooltip && (
                          <Info className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                        )}
                      </div>
                    </Card>
                  </TooltipTrigger>
                  {option.tooltip && (
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="text-sm">{option.tooltip}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Project Name */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
        <Label htmlFor="projectName" className="text-slate-900 dark:text-white font-medium">
          Project Name
        </Label>
        <Input
          id="projectName"
          value={config.projectName}
          onChange={(e) => setConfig((prev) => ({ ...prev, projectName: e.target.value }))}
          className="mt-2 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
          placeholder="my-awesome-app"
        />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search libraries and frameworks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
          />
        </div>
      </div>

      <Section
        title="Frontend Framework"
        options={frontendOptions}
        type="single"
        configKey="frontend"
        icon={() => <span className="text-lg">⚛️</span>}
      />
      <Section
        title="Language Variant"
        options={variantOptions}
        type="single"
        configKey="variant"
        icon={() => <span className="text-lg">📝</span>}
      />
      <Section
        title="Styling"
        options={stylingOptions}
        type="multi"
        configKey="styling"
        icon={() => <span className="text-lg">🎨</span>}
      />
      <Section
        title="UI Library"
        options={uiLibraryOptions}
        type="multi"
        configKey="uiLibrary"
        icon={() => <span className="text-lg">🧩</span>}
        showCompare
      />
      <Section
        title="State Management"
        options={stateManagementOptions}
        type="multi"
        configKey="stateManagement"
        icon={() => <span className="text-lg">📦</span>}
        showCompare
      />
      <Section
        title="Backend"
        options={backendOptions}
        type="single"
        configKey="backend"
        icon={() => <span className="text-lg">🖥️</span>}
      />
      <Section
        title="Database"
        options={databaseOptions}
        type="single"
        configKey="database"
        icon={() => <span className="text-lg">🗄️</span>}
      />
      <Section
        title="BaaS & Services"
        options={baasOptions}
        type="multi"
        configKey="baas"
        icon={() => <span className="text-lg">☁️</span>}
      />
      <Section
        title="Animation"
        options={animationOptions}
        type="multi"
        configKey="animation"
        icon={() => <span className="text-lg">✨</span>}
      />
      <Section
        title="Data Visualization"
        options={dataVizOptions}
        type="multi"
        configKey="dataViz"
        icon={() => <span className="text-lg">📊</span>}
      />
      <Section
        title="Testing"
        options={testingOptions}
        type="multi"
        configKey="testing"
        icon={() => <span className="text-lg">🧪</span>}
      />
      <Section
        title="Linting & Formatting"
        options={lintingOptions}
        type="multi"
        configKey="linting"
        icon={() => <span className="text-lg">✅</span>}
      />
      <Section
        title="Tooling"
        options={toolingOptions}
        type="multi"
        configKey="tooling"
        icon={() => <span className="text-lg">🔧</span>}
      />

      {/* Library Comparison Modal */}
      <LibraryComparison
        isOpen={!!comparisonCategory}
        onClose={() => setComparisonCategory(null)}
        category={comparisonCategory || ""}
        onSelect={(id) => {
          if (comparisonCategory) {
            toggleArray(comparisonCategory as keyof ProjectConfig, id)
          }
        }}
      />
    </div>
  )
}
