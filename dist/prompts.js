import inquirer from 'inquirer';
import path from 'path';
import chalk from 'chalk';
import { validateName, detectPackageManager, isDirectoryEmpty } from './utils.js';
export async function promptForProjectConfig(projectNameArg) {
    const questions = [];
    // Project name
    if (!projectNameArg) {
        questions.push({
            type: 'input',
            name: 'projectName',
            message: 'What is your project named?',
            default: 'my-turbo-firebase-app',
            validate: (input) => {
                const validation = validateName(input);
                return validation === true ? true : chalk.red(validation);
            }
        });
    }
    // Package manager
    const defaultPM = await detectPackageManager();
    questions.push({
        type: 'list',
        name: 'packageManager',
        message: 'Which package manager would you like to use?',
        choices: [
            { name: 'npm', value: 'npm' },
            { name: 'yarn', value: 'yarn' },
            { name: 'pnpm', value: 'pnpm' }
        ],
        default: defaultPM
    });
    // Firebase setup
    questions.push({
        type: 'confirm',
        name: 'initializeFirebase',
        message: 'Would you like to connect to a Firebase project now?',
        default: false
    });
    const answers = await inquirer.prompt(questions);
    let firebaseProjectId;
    let useEmulators = true;
    // If user wants to initialize Firebase, ask for project ID
    if (answers.initializeFirebase) {
        const firebaseQuestions = await inquirer.prompt([
            {
                type: 'input',
                name: 'firebaseProjectId',
                message: 'What is your Firebase project ID?',
                validate: (input) => {
                    if (!input || input.trim().length === 0) {
                        return 'Project ID is required';
                    }
                    // Basic validation for Firebase project ID format
                    if (!/^[a-z0-9-]+$/.test(input)) {
                        return 'Project ID can only contain lowercase letters, numbers, and hyphens';
                    }
                    return true;
                }
            },
            {
                type: 'confirm',
                name: 'useEmulators',
                message: 'Set up Firebase emulators for local development?',
                default: true
            }
        ]);
        firebaseProjectId = firebaseQuestions.firebaseProjectId;
        useEmulators = firebaseQuestions.useEmulators;
    }
    const projectName = projectNameArg || answers.projectName;
    const projectPath = path.resolve(process.cwd(), projectName);
    // Check if directory exists and is not empty
    const isEmpty = await isDirectoryEmpty(projectPath);
    if (!isEmpty) {
        const { overwrite } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'overwrite',
                message: `Directory ${chalk.cyan(projectName)} already exists and is not empty. Continue anyway?`,
                default: false
            }
        ]);
        if (!overwrite) {
            console.log(chalk.yellow('\nOperation cancelled.'));
            process.exit(0);
        }
    }
    return {
        projectName,
        projectPath,
        packageManager: answers.packageManager,
        initializeFirebase: answers.initializeFirebase,
        firebaseProjectId,
        useEmulators
    };
}
//# sourceMappingURL=prompts.js.map