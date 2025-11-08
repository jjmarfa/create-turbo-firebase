import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';
import { getPackageManagerCommand, logWarning } from './utils.js';
export async function installDependencies(config) {
    const { install } = getPackageManagerCommand(config.packageManager);
    const spinner = ora(`Installing dependencies with ${config.packageManager}...`).start();
    try {
        await execa(install.split(' ')[0], install.split(' ').slice(1), {
            cwd: config.projectPath,
            stdio: 'inherit'
        });
        spinner.succeed('Dependencies installed successfully');
    }
    catch (error) {
        spinner.fail('Failed to install dependencies');
        logWarning(`Please run ${chalk.cyan(install)} in the ${chalk.cyan(config.projectName)} directory manually`);
        throw error;
    }
}
export async function runInitialBuild(config) {
    const { run } = getPackageManagerCommand(config.packageManager);
    const spinner = ora('Running initial build...').start();
    try {
        await execa(run.split(' ')[0], [...run.split(' ').slice(1), 'build'], {
            cwd: config.projectPath,
            stdio: 'pipe'
        });
        spinner.succeed('Initial build completed');
        return true;
    }
    catch (error) {
        spinner.warn('Initial build failed (you can run it later)');
        return false;
    }
}
//# sourceMappingURL=installer.js.map