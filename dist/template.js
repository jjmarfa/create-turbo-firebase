import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import { getTemplateDir } from './utils.js';
const SKIP_FILES = new Set([
    'node_modules',
    'dist',
    '.git',
    '.turbo',
    'build',
    '.DS_Store',
    '.env.local',
    '.env',
    'npm-debug.log',
    'yarn-debug.log',
    'yarn-error.log',
    'pnpm-debug.log',
    '.firebase',
    '.firebaserc',
    'firebase-debug.log',
    'firestore-debug.log',
    'ui-debug.log',
    'emulator-data'
]);
export async function copyTemplate(config) {
    const spinner = ora('Copying template files...').start();
    try {
        const templateDir = getTemplateDir();
        // Ensure template directory exists
        if (!(await fs.pathExists(templateDir))) {
            spinner.fail(`Template directory not found at ${templateDir}`);
            throw new Error('Template directory not found. Please ensure the package is installed correctly.');
        }
        // Create project directory
        await fs.ensureDir(config.projectPath);
        // Copy all template files
        await copyDirectory(templateDir, config.projectPath, config);
        // Update package.json with project name
        await updatePackageJson(config);
        spinner.succeed('Template files copied successfully');
    }
    catch (error) {
        spinner.fail('Failed to copy template files');
        throw error;
    }
}
async function copyDirectory(source, destination, config) {
    const entries = await fs.readdir(source, { withFileTypes: true });
    for (const entry of entries) {
        // Skip files/directories in SKIP_FILES
        if (SKIP_FILES.has(entry.name)) {
            continue;
        }
        const sourcePath = path.join(source, entry.name);
        const destPath = path.join(destination, entry.name);
        if (entry.isDirectory()) {
            await fs.ensureDir(destPath);
            await copyDirectory(sourcePath, destPath, config);
        }
        else {
            await copyFile(sourcePath, destPath, config);
        }
    }
}
async function copyFile(source, destination, config) {
    // Read file content
    let content = await fs.readFile(source, 'utf-8');
    // Transform specific files
    const fileName = path.basename(source);
    // Transform package.json files
    if (fileName === 'package.json') {
        try {
            let pkg = JSON.parse(content);
            // Update root package.json name
            if (source.includes('template' + path.sep + 'package.json')) {
                pkg.name = config.projectName;
            }
            // Replace package scopes (@urinvited and @repo) with the project name
            pkg = replacePackageScopes(pkg, config.projectName);
            content = JSON.stringify(pkg, null, 2) + '\n';
        }
        catch (error) {
            // If parsing fails, just copy as-is
        }
    }
    // Write file
    await fs.writeFile(destination, content, 'utf-8');
}
/**
 * Recursively replace @urinvited and @repo scopes with the project name
 */
function replacePackageScopes(obj, projectName) {
    if (typeof obj === 'string') {
        // Replace both @urinvited/* and @repo/* with @projectName/*
        return obj.replace(/@urinvited\//g, `@${projectName}/`)
            .replace(/@repo\//g, `@${projectName}/`);
    }
    if (Array.isArray(obj)) {
        return obj.map(item => replacePackageScopes(item, projectName));
    }
    if (obj !== null && typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            result[key] = replacePackageScopes(value, projectName);
        }
        return result;
    }
    return obj;
}
async function updatePackageJson(config) {
    const packageJsonPath = path.join(config.projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
        const pkg = await fs.readJSON(packageJsonPath);
        pkg.name = config.projectName;
        await fs.writeJSON(packageJsonPath, pkg, { spaces: 2 });
    }
}
export async function createGitignore(projectPath) {
    const gitignorePath = path.join(projectPath, '.gitignore');
    const gitignoreContent = `# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage

# Production
build
dist
.turbo

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Firebase
.firebase
*-debug.log
firebase-debug.log
firestore-debug.log
ui-debug.log
emulator-data/
`;
    await fs.writeFile(gitignorePath, gitignoreContent, 'utf-8');
}
//# sourceMappingURL=template.js.map