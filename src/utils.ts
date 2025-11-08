import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import validateProjectName from 'validate-npm-package-name';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getTemplateDir(): string {
  // When built, the template folder is at the package root
  // Go up from dist/utils.js to package root
  return path.join(__dirname, '..', 'template');
}

export function validateName(name: string): true | string {
  const validation = validateProjectName(name);

  if (!validation.validForNewPackages) {
    const errors = [
      ...(validation.errors || []),
      ...(validation.warnings || [])
    ];
    return errors.join(', ');
  }

  return true;
}

export function getPackageManagerCommand(
  packageManager: 'npm' | 'yarn' | 'pnpm'
): { install: string; run: string; exec: string } {
  switch (packageManager) {
    case 'yarn':
      return { install: 'yarn', run: 'yarn', exec: 'yarn dlx' };
    case 'pnpm':
      return { install: 'pnpm install', run: 'pnpm', exec: 'pnpm dlx' };
    case 'npm':
    default:
      return { install: 'npm install', run: 'npm run', exec: 'npx' };
  }
}

export async function detectPackageManager(): Promise<'npm' | 'yarn' | 'pnpm'> {
  // Check if package manager is specified in environment
  const userAgent = process.env.npm_config_user_agent;

  if (userAgent) {
    if (userAgent.startsWith('yarn')) return 'yarn';
    if (userAgent.startsWith('pnpm')) return 'pnpm';
    return 'npm';
  }

  // Default to npm
  return 'npm';
}

export function logSuccess(message: string): void {
  console.log(chalk.green('✓'), message);
}

export function logError(message: string): void {
  console.log(chalk.red('✖'), message);
}

export function logInfo(message: string): void {
  console.log(chalk.blue('ℹ'), message);
}

export function logWarning(message: string): void {
  console.log(chalk.yellow('⚠'), message);
}

export async function isDirectoryEmpty(dirPath: string): Promise<boolean> {
  try {
    const files = await fs.readdir(dirPath);
    return files.length === 0;
  } catch {
    // Directory doesn't exist, so it's "empty"
    return true;
  }
}
