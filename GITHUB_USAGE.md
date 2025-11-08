# Using create-turbo-firebase from GitHub

This guide explains how to use and share your CLI tool directly from GitHub without publishing to npm.

## For Users

### Quick Start

Create a new Firebase + Turborepo project directly from GitHub:

```bash
npx github:yourusername/turbo-firebase-base my-app
```

> **Important:** Replace `yourusername` with the actual GitHub username or organization name.

### Using Specific Versions

Use a specific branch:
```bash
npx github:yourusername/turbo-firebase-base#main my-app
npx github:yourusername/turbo-firebase-base#develop my-app
```

Use a specific tag/release:
```bash
npx github:yourusername/turbo-firebase-base#v1.0.0 my-app
npx github:yourusername/turbo-firebase-base#v2.1.0 my-app
```

Use a specific commit:
```bash
npx github:yourusername/turbo-firebase-base#abc1234 my-app
```

### Options

All standard CLI options work:

```bash
# Skip dependency installation
npx github:yourusername/turbo-firebase-base my-app --skip-install

# Skip git initialization
npx github:yourusername/turbo-firebase-base my-app --skip-git

# Combine multiple options
npx github:yourusername/turbo-firebase-base my-app -s -g
```

## For Maintainers

### Repository Setup

1. **Push your changes to GitHub:**
   ```bash
   git add .
   git commit -m "Setup CLI for GitHub npx usage"
   git push origin main
   ```

2. **Create a release (optional but recommended):**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

   Or use GitHub's release interface to create a release.

### Testing Before Sharing

Test your CLI from GitHub before sharing with others:

```bash
# Test from your own repository
npx github:yourusername/turbo-firebase-base test-project
```

### Updating the Template

When you make changes to your template:

1. **Update your template files** (apps/, packages/, etc.)

2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update template with new features"
   git push origin main
   ```

3. **Users automatically get updates** when they run npx (npx fetches the latest code)

4. **For versioned releases:**
   ```bash
   npm version patch  # or minor, or major
   git push origin main --tags
   ```

### Repository Structure

Your repository now has this structure:

```
turbo-firebase-base/
├── src/                    # CLI source code
│   ├── index.ts
│   ├── prompts.ts
│   ├── template.ts
│   └── ...
├── dist/                   # Compiled CLI (gitignored)
├── template/               # Template files (gitignored, generated)
├── apps/                   # Your actual template apps
├── packages/               # Your actual template packages
├── package.json            # CLI package.json
├── tsconfig.cli.json       # CLI TypeScript config
├── prepare-template.js     # Template preparation script
└── README.md              # Main documentation
```

**Important files:**
- `package.json` - CLI configuration (users see this when they run npx)
- `prepare-template.js` - Copies apps/, packages/, etc. into template/ folder
- Template files are gitignored and generated during `npm run prepare-template`

### Workflow for Making Changes

#### Updating CLI Code (src/)

```bash
# 1. Make changes to CLI code in src/
vim src/prompts.ts

# 2. Test locally
npm run build
node dist/index.js test-app

# 3. Commit and push
git add src/
git commit -m "Update CLI prompts"
git push origin main
```

#### Updating Template (apps/, packages/)

```bash
# 1. Make changes to template files
vim apps/webapp/src/App.tsx

# 2. Test the template works
cd apps/webapp
npm run dev

# 3. Commit and push
git add apps/
git commit -m "Update webapp template"
git push origin main
```

### Publishing Workflow

Since you're using GitHub instead of npm, your "publishing" workflow is:

1. **Make changes** (to CLI or template)
2. **Test locally:**
   ```bash
   npm run prepare-template
   npm run build
   node dist/index.js ../test-project
   ```
3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
4. **Tag a release** (optional):
   ```bash
   git tag v1.1.0
   git push origin v1.1.0
   ```

### GitHub Actions (Optional)

You can add a GitHub Action to automatically build and test:

Create `.github/workflows/test.yml`:

```yaml
name: Test CLI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run prepare-template
      - run: node dist/index.js test-app --skip-install --skip-git
```

## Advantages of GitHub vs npm

**GitHub Approach:**
- ✅ No need for npm account
- ✅ No publishing steps
- ✅ Users always get latest code (or specific versions via tags)
- ✅ Free and simple
- ❌ Slightly longer command
- ❌ Requires GitHub repository to be public

**npm Approach:**
- ✅ Shorter command (`npx create-turbo-firebase`)
- ✅ More "official" feeling
- ✅ Better discoverability
- ❌ Requires npm account
- ❌ Must publish for each update
- ❌ Publishing workflow required

## Switching to npm Later

If you decide to publish to npm later, you can! Just run:

```bash
npm login
npm publish --access public
```

Both methods will work simultaneously:
- GitHub: `npx github:yourusername/turbo-firebase-base my-app`
- npm: `npx create-turbo-firebase my-app`

## Troubleshooting

### "Package not found" error

- Ensure your repository is public
- Check the username/repo name is correct
- Verify package.json exists at repository root

### "Template directory not found" error

Run `npm run prepare-template` before testing locally. The GitHub npx method handles this automatically via the `prepack` script.

### Changes not reflected

- Ensure you've pushed to GitHub
- npx caches packages; clear with: `npx clear-npx-cache`
- Or force refresh: `npx --yes github:yourusername/turbo-firebase-base my-app`
