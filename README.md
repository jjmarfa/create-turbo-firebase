# create-turbo-firebase

A CLI tool to quickly scaffold a Firebase + Turborepo monorepo project with best practices built-in.

## Features

- 🔥 **Firebase Integration**: Pre-configured Firebase setup with emulators
- ⚡ **Turborepo**: High-performance build system for monorepos
- 📦 **Monorepo Structure**: Apps and packages organized efficiently
- 🛠️ **TypeScript**: Full TypeScript support across the stack
- 🎨 **Modern Tooling**: ESLint, Prettier, and more
- 🚀 **Quick Setup**: Interactive CLI for easy project initialization

## Usage

### Using from GitHub (Recommended)

Run directly from this GitHub repository using npx:

```bash
npx github:yourusername/turbo-firebase-base my-app
```

Or use a specific branch/tag:

```bash
npx github:yourusername/turbo-firebase-base#main my-app
npx github:yourusername/turbo-firebase-base#v1.0.0 my-app
```

> **Note:** Replace `yourusername` with your actual GitHub username.

### Using from npm (If published)

```bash
npx create-turbo-firebase@latest my-app
```

Or with npm:

```bash
npm create turbo-firebase@latest my-app
```

Or with yarn:

```bash
yarn create turbo-firebase my-app
```

Or with pnpm:

```bash
pnpm create turbo-firebase my-app
```

## Options

```bash
npx github:yourusername/turbo-firebase-base [project-name] [options]
```

**Options:**

- `-s, --skip-install` - Skip installing dependencies
- `-g, --skip-git` - Skip git initialization
- `-V, --version` - Output the version number
- `-h, --help` - Display help for command

## For Maintainers

See [USAGE_GUIDE.md](./USAGE_GUIDE.md) for development and publishing instructions.

## What's Included

The generated project includes:

```
my-app/
├── apps/
│   ├── webapp/          # Frontend application
│   └── server/          # Firebase Functions
├── packages/
│   ├── common/          # Shared types and utilities
│   ├── services/        # Shared business logic
│   ├── ui/              # Shared UI components
│   ├── eslint-config/   # Shared ESLint configuration
│   └── typescript-config/ # Shared TypeScript configuration
├── firebase.json        # Firebase configuration
├── .firebaserc          # Firebase project settings
├── turbo.json           # Turborepo configuration
└── package.json         # Root package.json
```

## Project Structure

### Apps

- **webapp**: Your frontend application (React/Vite setup)
- **server**: Firebase Cloud Functions for backend logic

### Packages

- **common**: Shared TypeScript types and utilities
- **services**: Shared business logic and services
- **ui**: Shared UI components library
- **eslint-config**: Shared ESLint configurations
- **typescript-config**: Shared TypeScript configurations

## Available Scripts

After creating your project, you can run:

### `npm run dev`

Starts all development servers in watch mode using Turborepo.

### `npm run build`

Builds all apps and packages for production.

### `npm run lint`

Runs ESLint across all packages.

### `npm run emulators`

Starts Firebase emulators for local development.

### `npm run clean`

Cleans all build artifacts and cache.

## Firebase Setup

After creating your project:

1. **Authenticate with Firebase:**
   ```bash
   firebase login
   ```

2. **Get your Firebase config:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to Project Settings > General
   - Copy your Firebase configuration

3. **Update environment variables:**
   Edit `.env.local` with your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. **Start Firebase emulators (optional):**
   ```bash
   npm run emulators
   ```

## Development Workflow

1. Start emulators: `npm run emulators`
2. Start dev servers: `npm run dev`
3. Make your changes
4. Build for production: `npm run build`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
