# Usage Guide for create-turbo-firebase

This guide explains how to develop, test, and publish the `create-turbo-firebase` CLI tool.

## Development Workflow

### 1. Initial Setup

Install dependencies in the CLI directory:

```bash
cd cli
npm install
```

### 2. Development

Build the TypeScript source code:

```bash
npm run build
```

Or run in watch mode during development:

```bash
npm run dev
```

### 3. Testing Locally

Before publishing, you should test the CLI locally.

#### Option A: Test with the built CLI

```bash
# From the cli directory
npm run prepare-template  # Prepare the template
npm run build            # Build the CLI
node dist/index.js ../test-project  # Test creating a project
```

#### Option B: Test with npm link

```bash
# From the cli directory
npm run prepare-template
npm run build
npm link

# Now you can run it from anywhere
create-turbo-firebase my-test-app

# When done testing, unlink
npm unlink -g create-turbo-firebase
```

#### Option C: Test with npx from local directory

```bash
cd cli
npm run prepare-template
npm run build
npm pack  # Creates a .tgz file

# Test the packed version
npx /path/to/create-turbo-firebase-0.1.0.tgz my-test-app
```

## Publishing to npm

### Prerequisites

1. Create an npm account at https://www.npmjs.com/signup
2. Login to npm locally:
   ```bash
   npm login
   ```

### Publishing Steps

1. **Ensure everything is committed to git**

2. **Update version in package.json** (if needed)
   ```bash
   cd cli
   npm version patch  # or minor, or major
   ```

3. **Prepare and publish**
   ```bash
   # The prepack script will automatically run prepare-template and build
   npm publish
   ```

   For first-time publish, you might need:
   ```bash
   npm publish --access public
   ```

### What happens during publish?

The `prepack` script (in package.json) automatically:
1. Runs `prepare-template` to copy your parent project to the template folder
2. Runs `build` to compile TypeScript to JavaScript

This ensures the published package always has the latest template.

## Project Structure

```
cli/
├── src/                    # TypeScript source code
│   ├── index.ts           # Main entry point
│   ├── prompts.ts         # Interactive prompts
│   ├── template.ts        # Template copying logic
│   ├── firebase-setup.ts  # Firebase initialization
│   ├── installer.ts       # Dependency installation
│   ├── utils.ts           # Utility functions
│   └── types.ts           # TypeScript types
├── dist/                  # Compiled JavaScript (gitignored)
├── template/              # Template files (generated, gitignored)
├── prepare-template.js    # Script to prepare template
├── package.json
├── tsconfig.json
├── .npmignore
└── README.md
```

## Important Files

### prepare-template.js

This script copies the parent project (your turbo-firebase-base) to the `template/` folder, excluding:
- `node_modules`
- `dist` and build artifacts
- `.git`
- The `cli` directory itself
- Environment files
- Firebase emulator data

### .npmignore

Specifies what NOT to include in the published npm package:
- TypeScript source files (`src/`)
- Development files

What IS included:
- `dist/` - Compiled JavaScript
- `template/` - The project template

## Updating the Template

Whenever you make changes to the parent project (turbo-firebase-base):

1. Make your changes in the parent project
2. Test them
3. Run `npm run prepare-template` in the CLI directory
4. Test the CLI with the updated template
5. Publish a new version

## Version Management

Follow semantic versioning:

- **Patch** (0.1.0 → 0.1.1): Bug fixes, minor updates
  ```bash
  npm version patch
  ```

- **Minor** (0.1.0 → 0.2.0): New features, backwards compatible
  ```bash
  npm version minor
  ```

- **Major** (0.1.0 → 1.0.0): Breaking changes
  ```bash
  npm version major
  ```

## Testing Checklist

Before publishing, test:

- [ ] CLI runs without errors
- [ ] Project is created successfully
- [ ] Dependencies install correctly
- [ ] Firebase configuration is created
- [ ] Git is initialized (if not skipped)
- [ ] All prompts work correctly
- [ ] Package manager detection works
- [ ] Template files are copied correctly
- [ ] Generated project builds successfully
- [ ] Generated project runs in development mode

## Common Issues

### Template files not found

Run `npm run prepare-template` before testing or publishing.

### TypeScript compilation errors

Check your `tsconfig.json` and ensure all imports use `.js` extensions (for ESM compatibility).

### Module resolution errors

Ensure `"type": "module"` is in package.json and all imports include file extensions.

## Maintenance

### Regular Updates

Keep dependencies updated:

```bash
npm update
npm outdated  # Check for newer versions
```

### Security Audits

Regularly check for security vulnerabilities:

```bash
npm audit
npm audit fix
```

## Getting Help

- Create an issue in the GitHub repository
- Check npm documentation: https://docs.npmjs.com/
- Review Turbo documentation: https://turbo.build/repo/docs
- Review Firebase documentation: https://firebase.google.com/docs

## Next Steps

After setting up the CLI, you might want to:

1. Add more configuration options
2. Support different frontend frameworks
3. Add more Firebase features (Storage, Realtime Database, etc.)
4. Create integration tests
5. Add CI/CD for automated publishing
6. Create a website/documentation site
