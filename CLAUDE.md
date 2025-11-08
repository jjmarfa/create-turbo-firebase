# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a CLI tool (`create-turbo-firebase`) that scaffolds Firebase + Turborepo monorepo projects. It's a template generator, not a generated project itself.

**Key distinction**: The root of this repo contains the CLI tool source code (in `src/`), while the `template/` directory contains the actual project template that gets copied to users' machines.

## Development Commands

### CLI Tool Development

```bash
# Build the CLI tool
npm run build

# Watch mode for CLI development
npm run dev

# Test the CLI locally (creates a project in current directory)
npm run test:local

# Test via npx (simulates real usage)
node dist/index.js my-test-project
```

### Working with the Template

The `template/` directory is the actual monorepo structure that gets copied to users. When testing changes to the template:

1. Build the CLI: `npm run build`
2. Run it: `node dist/index.js test-project`
3. Navigate to generated project: `cd test-project`
4. Test the generated project commands:
   - `npm run dev` - Start all development servers
   - `npm run build` - Build all packages
   - `npm run emulators` - Start Firebase emulators
   - `npm run lint` - Run linting across monorepo

## Architecture

### CLI Tool Structure (`src/`)

- **index.ts**: Entry point, orchestrates the project creation flow
- **prompts.ts**: Interactive CLI prompts (project name, package manager, Firebase setup)
- **template.ts**: Copies template files and transforms package.json names
- **firebase-setup.ts**: Handles Firebase initialization and git setup
- **installer.ts**: Manages dependency installation and initial build
- **utils.ts**: Logging utilities and helper functions

### Template Monorepo Structure (`template/`)

The generated project is a Turborepo monorepo with:

**Apps:**
- `apps/webapp/`: React + Vite frontend with Tanstack Router/Query, Tailwind CSS 4, and shadcn/ui
- `apps/server/`: Firebase Cloud Functions built with Vite

**Packages:**
- `packages/common/`: Shared TypeScript types and utilities
- `packages/services/`: Shared business logic
- `packages/ui/`: Shared UI components
- `packages/eslint-config/`: Shared ESLint config
- `packages/typescript-config/`: Shared TypeScript config

### Firebase Functions Build System

The `apps/server/` uses a custom Vite build configuration that:
- Bundles functions to ESM format in `dist/`
- Keeps external dependencies (firebase-admin, firebase-functions) unbundled via regex patterns
- Generates a standalone package.json in dist/ with only external deps
- Copies .env files to dist/
- Resolves symlinks to monorepo packages (via `preserveSymlinks: true`)

**Important**: Firebase deploys from `apps/server/dist/`, not the source directory.

### Turborepo Task Pipeline

Key task dependencies from `template/turbo.json`:
- `build`: Depends on `^build` (dependencies build first)
- `dev`: No cache, persistent (long-running dev servers)
- `emulators`: No cache, persistent
- All tasks receive `.env*` files as inputs

## Firebase Emulator Configuration

From `template/firebase.json`:
- Auth: port 9099
- Functions: port 5001
- Firestore: port 8080
- Storage: port 9199
- UI enabled in single project mode

## Template Customization Notes

### Adding shadcn/ui Components to Template

Per `.cursorrules` in template/apps/webapp: Use `pnpx shadcn@latest add <component>` to add new shadcn components.

### Package Naming Convention

When copying template, only the root `package.json` name is replaced with the user's project name. Workspace packages keep their original names (e.g., `@urinvited/common`).

### Files Skipped During Copy

The template copier skips these (see `src/template.ts`):
- node_modules, dist, build, .turbo
- .git, .firebase
- All debug logs
- .env files (users create their own)
- emulator-data

## Testing the CLI

To test the full flow:

1. Make changes to CLI source or template
2. Build: `npm run build`
3. Test locally: `node dist/index.js ../test-output`
4. Verify generated project works:
   ```bash
   cd ../test-output
   npm run build
   npm run dev
   ```

## Firebase Functions Development Workflow

When working on the template's Firebase Functions:

1. Navigate to generated project's server: `cd apps/server`
2. Use `npm run dev` (vite build --watch) for auto-rebuilding
3. Or `npm run emulators` to run emulators with functions
4. Functions deploy from `dist/`, so always build before deploying

## Package Manager Support

The CLI supports npm, yarn, and pnpm. The installer detects or prompts for preference and uses appropriate commands for each.
