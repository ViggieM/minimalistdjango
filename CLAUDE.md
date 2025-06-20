# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Minimalist Django" - a static site built with Astro that serves as a documentation and learning resource for Django development. Despite the name, this is actually an Astro-based static site generator project, not a Django application. The site contains articles, tutorials (TIL - Today I Learned), code snippets, and tool documentation focused on Django and web development.

## Development Commands

### Core Commands
- `pnpm dev` or `npm run dev` - Start development server
- `pnpm build` or `npm run build` - Build for production
- `pnpm preview` or `npm run preview` - Preview production build
- `pnpm format` or `npm run format` - Format code with Prettier

### Package Management
This project uses pnpm (preferred) but npm also works. Always check `pnpm-lock.yaml` for dependency versions.

## Architecture

### Framework Stack
- **Astro 5.x** - Static site generator with component-based architecture
- **TailwindCSS 4.x** - Utility-first CSS framework with Vite plugin
- **TypeScript** - Type checking with strict Astro configuration
- **Fuse.js** - Client-side fuzzy search functionality

### Content Management
The site uses Astro's Content Collections API with three main collections:

1. **TIL Collection** (`/TIL/`) - Tutorial and learning content
2. **Articles Collection** (`/articles/`) - Long-form articles  
3. **Snippets Collection** (`/snippets/`) - Code snippets and templates

Each collection uses glob loaders to automatically discover Markdown files and enforces schemas with frontmatter validation including title, tags, dates, and optional images.

### Key Architectural Patterns

#### Content Schema
All content collections share a similar Zod schema requiring:
- `title` (string)
- `pubDate` (date) 
- `shortDescription` (string)
- Optional: `tags`, `keywords`, `updatedDate`, `image`

#### Dynamic Routing
- `[...slug].astro` files handle dynamic content routing for each collection
- Content is automatically processed from Markdown to HTML with remark/rehype plugins

#### Search Implementation
- Client-side search using Fuse.js with weighted scoring across title, description, tags, and keywords
- Search data is generated at build time via `/all-content.json.js` endpoint
- Real-time filtering with animated placeholder text

### Directory Structure
- `src/components/` - Reusable Astro components
- `src/layouts/` - Page layout templates
- `src/pages/` - Route definitions and page components  
- `src/styles/` - Global CSS
- `TIL/`, `articles/`, `snippets/` - Content directories (root level)
- `media/` - Static assets and images
- `tools/`, `topics/` - Additional documentation

### Markdown Processing
- Automatic `.md` link conversion to clean URLs
- Rehype plugins for heading auto-linking
- Support for image captions and frontmatter metadata

## Code Style

### Formatting
- Prettier with Astro and TailwindCSS plugins
- Single quotes preferred
- Automatic formatting on save recommended

### Component Conventions
- Astro components use `.astro` extension
- TailwindCSS classes for styling
- TypeScript for logic when needed
- Search functionality implemented as inline scripts in components