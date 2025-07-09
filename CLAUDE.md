# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static site built with Astro.
The site contains articles, tutorials (TIL - Today I Learned) and code snippets focused on Django and web development.

## Development Commands

### Core Commands

- `pnpm dev` or `npm run dev` - Start development server
- `pnpm build` or `npm run build` - Build for production
- `pnpm preview` or `npm run preview` - Preview production build
- `pnpm format` or `npm run format` - Format code with Prettier

### Quality Assurance

All code quality is handled programmatically:

- `pnpm quality` - Run full quality check (type-check, lint, format-check)
- `pnpm build` - Ensure the build succeeds
- Pre-commit hooks automatically run formatting and linting

### Package Management

This project uses pnpm (preferred) but npm also works. Always check `pnpm-lock.yaml` for dependency versions.

### Initial Setup

After cloning the repository, install dependencies and set up quality tools:

```bash
pnpm install
pre-commit install  # Set up pre-commit hooks
pnpm quality       # Verify everything works
```

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

Each collection uses glob loaders to automatically discover Markdown files and enforces schemas with frontmatter validation.

### Component Architecture

### SEO & Meta Tags

All pages use the centralized SEO component with:

- Dynamic meta tag generation from frontmatter
- Open Graph protocol support
- Default fallback to `/media/default-og-image.png` for OG images
- Automatic sitemap generation via `/sitemap.xml.js`

### Mobile-First Design

- **Responsive headers**: Full-width images on mobile
- **Typography scaling**: Reduced font sizes for mobile screens
- **TailwindCSS utilities**: Mobile-first responsive classes

## Code Quality

### Automated Tools

Code quality is enforced programmatically through:

- **ESLint**: Code linting with `eslint.config.js`
- **Prettier**: Code formatting with `.prettierrc`
- **Pre-commit hooks**: Automatic validation before commits
- **TypeScript**: Strict type checking with `tsconfig.json`

### Development Workflow

1. **Write code** - IDE automatically formats on save
2. **Commit changes** - Pre-commit hooks validate automatically
3. **Quality check** - Run `pnpm quality` to verify all checks pass
4. **Build verification** - `pnpm build` ensures production readiness

### Component Conventions

- **Astro components**: Use `.astro` extension
- **TypeScript**: Strict typing for all utilities and interfaces
- **TailwindCSS**: Utility-first styling with component classes
- **Event communication**: Use CustomEvents instead of global functions
- **Error handling**: Graceful fallbacks for external API calls

## Content Guidelines

- **SEO optimization**: Always include title, description, and relevant tags
- **Mobile responsiveness**: Test all content on mobile devices
- **Accessibility**: Ensure proper alt text and semantic HTML structure
