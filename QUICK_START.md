# Quick Start - Testing Your CLI Locally

Follow these steps to test your `create-turbo-firebase` CLI before using it from GitHub.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Prepare the Template

This copies your project files (apps/, packages/, etc.) to the `template/` folder:

```bash
npm run prepare-template
```

## Step 3: Build the CLI

Compile TypeScript to JavaScript:

```bash
npm run build
```

## Step 4: Test It!

### Method 1: Direct Node Execution (Recommended for Quick Testing)

```bash
# From the project root, create a test project
node dist/index.js ../my-test-app
```

### Method 2: Using npm link (Recommended for Full Testing)

```bash
# Link the CLI globally
npm link

# Now you can use it anywhere
create-turbo-firebase ../my-test-app

# When done testing, unlink
npm unlink -g create-turbo-firebase
```

### Method 3: Test from GitHub (Most Realistic)

After pushing to GitHub:

```bash
# Replace 'yourusername' with your GitHub username
npx github:yourusername/turbo-firebase-base my-test-app
```

## Step 5: Verify the Generated Project

```bash
cd my-test-app
npm install  # If you skipped installation during creation
npm run dev  # Should start all development servers
```

## Using from GitHub

The recommended way to share your CLI is via GitHub:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Setup create-turbo-firebase CLI"
   git push origin main
   ```

2. **Share with others**:
   ```bash
   # Users can now run (replace yourusername):
   npx github:yourusername/turbo-firebase-base my-app
   ```

3. **Optional: Create a release**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0

   # Users can use specific version:
   npx github:yourusername/turbo-firebase-base#v1.0.0 my-app
   ```

## Publishing to npm (Optional)

If you prefer npm over GitHub:

1. **Login to npm** (first time only):
   ```bash
   npm login
   ```

2. **Publish**:
   ```bash
   npm publish --access public
   ```

3. **Test the published version**:
   ```bash
   npx create-turbo-firebase@latest another-test-app
   ```

## Making Updates

After making changes to the template or CLI code:

```bash
# 1. Update the template
npm run prepare-template

# 2. Rebuild
npm run build

# 3. Test again
node dist/index.js ../test-app-v2

# 4. Commit and push
git add .
git commit -m "Update template"
git push origin main

# 5. Optional: Create a new release
git tag v1.1.0
git push origin v1.1.0
```

## Troubleshooting

### "Template directory not found"
Run `npm run prepare-template` first.

### "Command not found" after npm link
Try: `npm link --force` or check your global npm bin path.

### Changes not reflected
Make sure to run `npm run build` after modifying TypeScript files.

### Published version doesn't work
The `prepack` script should run automatically. If issues persist, manually run:
```bash
npm run prepare-template
npm run build
npm publish
```

## Tips

- Always test locally before publishing
- Use `npm pack` to see exactly what will be published
- Check the generated `.tgz` file contents with: `tar -tzf create-turbo-firebase-0.1.0.tgz`
- Keep your parent project (template) clean and working before running `prepare-template`
