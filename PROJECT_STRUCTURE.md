# Project Structure

This document explains the structure of the create-turbo-firebase repository after restructuring for GitHub npx usage.

## Directory Layout

```
turbo-firebase-base/                 # Root (CLI package)
├── src/                            # CLI source code (TypeScript)
│   ├── index.ts                    # Main CLI entry point
│   ├── prompts.ts                  # Interactive user prompts
│   ├── template.ts                 # Template file copying logic
│   ├── firebase-setup.ts           # Firebase initialization
│   ├── installer.ts                # Dependency installation
│   ├── utils.ts                    # Utility functions
│   └── types.ts                    # TypeScript type definitions
│
├── dist/                           # Compiled JavaScript (gitignored)
│   ├── index.js                    # Executable entry point
│   └── ...                         # Other compiled files
│
├── template/                       # Generated template (gitignored)
│   ├── apps/                       # Copied from root apps/
│   ├── packages/                   # Copied from root packages/
│   ├── package.json                # Template workspace config
│   └── ...                         # All template files
│
├── apps/                           # Template application code
│   ├── webapp/                     # Frontend app (React/Vite)
│   └── server/                     # Firebase Functions backend
│
├── packages/                       # Template shared packages
│   ├── common/                     # Shared types and utilities
│   ├── services/                   # Shared business logic
│   ├── ui/                         # Shared UI components
│   ├── eslint-config/              # ESLint configuration
│   └── typescript-config/          # TypeScript configuration
│
├── package.json                    # CLI package configuration
├── tsconfig.cli.json               # CLI TypeScript config
├── prepare-template.js             # Script to prepare template/
├── .gitignore                      # Git ignore rules
├── .npmignore                      # npm publish ignore rules
│
├── README.md                       # Main documentation
├── QUICK_START.md                  # Quick testing guide
├── USAGE_GUIDE.md                  # Comprehensive guide
├── GITHUB_USAGE.md                 # GitHub-specific usage
└── PROJECT_STRUCTURE.md            # This file
```

## How It Works

### 1. CLI Code (src/)

The `src/` directory contains the TypeScript source code for the CLI tool:

- **index.ts**: Main entry point with command parsing
- **prompts.ts**: Inquirer prompts for user input
- **template.ts**: Logic to copy template files to new project
- **firebase-setup.ts**: Firebase project initialization
- **installer.ts**: Dependency installation and build scripts
- **utils.ts**: Helper functions (validation, logging, etc.)
- **types.ts**: TypeScript interfaces and types

### 2. Template Source (apps/, packages/, etc.)

These directories contain your actual template project:

- **apps/webapp**: React/Vite frontend application
- **apps/server**: Firebase Cloud Functions
- **packages/**: Shared packages for the monorepo

When users create a new project, these directories are copied to their new project.

### 3. Template Generation (template/)

The `template/` directory is **generated** by `prepare-template.js`:

```bash
npm run prepare-template
```

This script:
1. Cleans existing `template/` directory
2. Copies `apps/`, `packages/`, and other template files
3. Creates a workspace `package.json` for the template
4. Excludes CLI-specific files (src/, dist/, etc.)

### 4. Build Process (dist/)

TypeScript is compiled to JavaScript:

```bash
npm run build
```

Output goes to `dist/` directory, which is what gets executed when users run `npx`.

## File Purposes

### Root Configuration Files

- **package.json**: CLI package definition
  - `name`: "create-turbo-firebase"
  - `bin`: Points to `dist/index.js`
  - `files`: Specifies what to include when publishing (dist/, template/)
  
- **tsconfig.cli.json**: TypeScript configuration for CLI code
  - Compiles `src/` to `dist/`
  - ESM module format
  
- **prepare-template.js**: Template preparation script
  - Node.js script (ESM)
  - Copies template files
  - Generates template/package.json

### Ignore Files

- **.gitignore**: Prevents committing:
  - `node_modules/`
  - `dist/` (build artifacts)
  - `template/` (generated folder)
  - `.env` files
  
- **.npmignore**: Excludes from npm package:
  - `src/` (TypeScript source)
  - `tsconfig.cli.json`
  - Only includes `dist/` and `template/`

## Workflows

### Development Workflow

```bash
# 1. Install dependencies
npm install

# 2. Make changes to CLI or template
vim src/prompts.ts           # CLI changes
vim apps/webapp/src/App.tsx  # Template changes

# 3. Prepare and build
npm run prepare-template
npm run build

# 4. Test locally
node dist/index.js ../test-project

# 5. Commit and push
git add .
git commit -m "Updates"
git push origin main
```

### User Workflow

```bash
# User runs from GitHub
npx github:yourusername/turbo-firebase-base my-app

# What happens:
# 1. npx downloads the repo
# 2. Runs `prepack` script (prepare-template + build)
# 3. Executes dist/index.js with args
# 4. CLI prompts user for config
# 5. Copies template/ to user's project
# 6. Installs dependencies
# 7. Success!
```

## Key Differences from Original Structure

### Before (CLI in subdirectory):
```
turbo-firebase-base/
├── apps/
├── packages/
├── package.json (workspace)
└── cli/
    ├── src/
    ├── package.json (CLI)
    └── template/ (copy of parent)
```

### After (CLI at root):
```
turbo-firebase-base/
├── src/ (CLI code)
├── dist/ (CLI build)
├── template/ (generated)
├── apps/ (template source)
├── packages/ (template source)
└── package.json (CLI)
```

## Benefits of New Structure

1. **npx GitHub support**: Package.json at root allows `npx github:user/repo`
2. **Simpler**: No nested directory structure
3. **Clear separation**: CLI code vs template code
4. **Dual purpose**: Can publish to npm OR use from GitHub
5. **Single source**: Template files are actual project files, not copies

## Publishing Options

### Option 1: GitHub Only (Current)
```bash
git push origin main
# Users: npx github:yourusername/turbo-firebase-base my-app
```

### Option 2: npm
```bash
npm publish --access public
# Users: npx create-turbo-firebase my-app
```

### Option 3: Both
Both work simultaneously!

## Maintenance

### Updating CLI Logic
- Edit files in `src/`
- Run `npm run build`
- Test with `node dist/index.js`
- Push to GitHub

### Updating Template
- Edit files in `apps/`, `packages/`, etc.
- Run `npm run prepare-template`
- Test the generated project
- Push to GitHub

### Creating Releases
```bash
git tag v1.0.0
git push origin v1.0.0

# Users can use specific version:
# npx github:yourusername/turbo-firebase-base#v1.0.0 my-app
```
