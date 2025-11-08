#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { promptForProjectConfig } from './prompts.js';
import { copyTemplate, createGitignore } from './template.js';
import { setupFirebase, initializeGit } from './firebase-setup.js';
import { installDependencies, runInitialBuild } from './installer.js';
import { logError, logInfo } from './utils.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function main() {
    console.log(chalk.bold.cyan('\n🔥 Create Turbo Firebase App\n'));
    const program = new Command();
    // Read package.json for version
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    let version = '0.1.0';
    try {
        const pkg = await fs.readJSON(packageJsonPath);
        version = pkg.version;
    }
    catch {
        // Use default version if can't read
    }
    program
        .name('create-turbo-firebase')
        .description('Create a new Firebase + Turborepo monorepo project')
        .version(version)
        .argument('[project-name]', 'Name of the project')
        .option('-s, --skip-install', 'Skip installing dependencies')
        .option('-g, --skip-git', 'Skip git initialization')
        .parse(process.argv);
    const options = program.opts();
    const projectNameArg = program.args[0];
    try {
        // Step 1: Get project configuration
        console.log(chalk.bold('\n📋 Project Configuration\n'));
        const config = await promptForProjectConfig(projectNameArg);
        console.log(chalk.bold('\n🚀 Creating your project...\n'));
        // Step 2: Copy template files
        await copyTemplate(config);
        // Step 3: Create .gitignore
        await createGitignore(config.projectPath);
        // Step 4: Set up Firebase
        await setupFirebase(config);
        // Step 5: Install dependencies
        if (!options.skipInstall) {
            await installDependencies(config);
            // Step 6: Run initial build
            await runInitialBuild(config);
        }
        else {
            logInfo('Skipping dependency installation');
        }
        // Step 7: Initialize git
        if (!options.skipGit) {
            await initializeGit(config.projectPath);
        }
        else {
            logInfo('Skipping git initialization');
        }
        // Success message
        console.log(chalk.bold.green('\n✨ Success! Your project is ready.\n'));
        const { run } = getPackageManagerCommandForDisplay(config.packageManager);
        console.log(chalk.bold('Next steps:\n'));
        console.log(chalk.cyan(`  cd ${config.projectName}`));
        if (options.skipInstall) {
            console.log(chalk.cyan(`  ${getInstallCommand(config.packageManager)}`));
        }
        console.log(chalk.cyan(`  ${run} dev`));
        console.log(chalk.bold('\n📚 Available commands:\n'));
        console.log(chalk.cyan(`  ${run} dev`), '       - Start development servers');
        console.log(chalk.cyan(`  ${run} build`), '     - Build all apps');
        console.log(chalk.cyan(`  ${run} lint`), '      - Run linting');
        console.log(chalk.cyan(`  ${run} emulators`), ' - Start Firebase emulators');
        if (config.initializeFirebase) {
            console.log(chalk.bold('\n🔥 Firebase Setup:\n'));
            console.log(chalk.yellow('  Don\'t forget to:'));
            console.log(chalk.cyan('  1. Update .env.local with your Firebase credentials'));
            console.log(chalk.cyan('  2. Run'), chalk.yellow('firebase login'), chalk.cyan('to authenticate'));
        }
        console.log(chalk.bold.cyan('\n🎉 Happy coding!\n'));
    }
    catch (error) {
        console.log('\n');
        logError('Failed to create project');
        if (error instanceof Error) {
            console.log(chalk.red(error.message));
            if (error.stack) {
                console.log(chalk.gray(error.stack));
            }
        }
        process.exit(1);
    }
}
function getPackageManagerCommandForDisplay(packageManager) {
    switch (packageManager) {
        case 'yarn':
            return { run: 'yarn' };
        case 'pnpm':
            return { run: 'pnpm' };
        case 'npm':
        default:
            return { run: 'npm run' };
    }
}
function getInstallCommand(packageManager) {
    switch (packageManager) {
        case 'yarn':
            return 'yarn';
        case 'pnpm':
            return 'pnpm install';
        case 'npm':
        default:
            return 'npm install';
    }
}
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map