import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';
import { logWarning, logInfo } from './utils.js';
export async function setupFirebase(config) {
    if (!config.initializeFirebase || !config.firebaseProjectId) {
        logInfo('Skipping Firebase initialization (you can set this up later)');
        return;
    }
    const spinner = ora('Setting up Firebase...').start();
    try {
        // Check if Firebase CLI is installed
        await checkFirebaseCLI();
        // Create .firebaserc file
        await createFirebaseRC(config);
        // Update firebase.json if needed
        await updateFirebaseJson(config);
        // Create environment files with placeholders
        await createEnvFiles(config);
        spinner.succeed('Firebase configuration created');
        logInfo('\nNext steps for Firebase:');
        console.log(chalk.cyan('  1. Run'), chalk.yellow('firebase login'), chalk.cyan('to authenticate'));
        console.log(chalk.cyan('  2. Get your Firebase config from the Firebase Console'));
        console.log(chalk.cyan('  3. Update'), chalk.yellow('.env.local'), chalk.cyan('with your Firebase credentials'));
        if (config.useEmulators) {
            console.log(chalk.cyan('  4. Run'), chalk.yellow(`${getRunCommand(config)} emulators`), chalk.cyan('to start Firebase emulators'));
        }
    }
    catch (error) {
        spinner.fail('Failed to set up Firebase');
        if (error instanceof Error) {
            logWarning(error.message);
        }
        logInfo('You can set up Firebase manually later');
    }
}
async function checkFirebaseCLI() {
    try {
        await execa('firebase', ['--version']);
    }
    catch {
        throw new Error('Firebase CLI is not installed. Install it with: npm install -g firebase-tools');
    }
}
async function createFirebaseRC(config) {
    const firebaseRC = {
        projects: {
            default: config.firebaseProjectId
        }
    };
    const rcPath = path.join(config.projectPath, '.firebaserc');
    await fs.writeJSON(rcPath, firebaseRC, { spaces: 2 });
}
async function updateFirebaseJson(config) {
    const firebaseJsonPath = path.join(config.projectPath, 'firebase.json');
    // Check if firebase.json exists in template
    if (await fs.pathExists(firebaseJsonPath)) {
        const firebaseJson = await fs.readJSON(firebaseJsonPath);
        // Ensure emulators config exists if user wants emulators
        if (config.useEmulators && !firebaseJson.emulators) {
            firebaseJson.emulators = {
                auth: {
                    port: 9099
                },
                functions: {
                    port: 5001
                },
                firestore: {
                    port: 8080
                },
                ui: {
                    enabled: true,
                    port: 4000
                }
            };
            await fs.writeJSON(firebaseJsonPath, firebaseJson, { spaces: 2 });
        }
    }
}
async function createEnvFiles(config) {
    const envTemplate = `# Firebase Configuration
# Get these values from your Firebase project settings
# https://console.firebase.google.com/project/${config.firebaseProjectId}/settings/general

VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=${config.firebaseProjectId}.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=${config.firebaseProjectId}
VITE_FIREBASE_STORAGE_BUCKET=${config.firebaseProjectId}.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Use Firebase Emulators (set to 'true' for local development)
VITE_USE_FIREBASE_EMULATORS=${config.useEmulators ? 'true' : 'false'}
`;
    const envExamplePath = path.join(config.projectPath, '.env.example');
    const envLocalPath = path.join(config.projectPath, '.env.local');
    // Create .env.example
    await fs.writeFile(envExamplePath, envTemplate, 'utf-8');
    // Create .env.local if it doesn't exist
    if (!(await fs.pathExists(envLocalPath))) {
        await fs.writeFile(envLocalPath, envTemplate, 'utf-8');
    }
}
function getRunCommand(config) {
    switch (config.packageManager) {
        case 'yarn':
            return 'yarn';
        case 'pnpm':
            return 'pnpm';
        default:
            return 'npm run';
    }
}
export async function initializeGit(projectPath) {
    const spinner = ora('Initializing git repository...').start();
    try {
        // Check if git is available
        try {
            await execa('git', ['--version']);
        }
        catch {
            spinner.fail('Git is not installed');
            logWarning('Please install git to use version control');
            return;
        }
        // Initialize git repository
        await execa('git', ['init'], { cwd: projectPath });
        // Add all files
        await execa('git', ['add', '.'], { cwd: projectPath });
        // Try to create initial commit
        try {
            await execa('git', ['commit', '-m', 'Initial commit from create-turbo-firebase'], {
                cwd: projectPath
            });
            spinner.succeed('Git repository initialized with initial commit');
        }
        catch (commitError) {
            // Commit might fail if git user is not configured
            // Check if it's a user config issue
            try {
                await execa('git', ['config', 'user.name'], { cwd: projectPath });
                await execa('git', ['config', 'user.email'], { cwd: projectPath });
                // User is configured, but commit failed for another reason
                throw commitError;
            }
            catch {
                // User not configured, set local config and try again
                await execa('git', ['config', 'user.name', 'create-turbo-firebase'], { cwd: projectPath });
                await execa('git', ['config', 'user.email', 'create-turbo-firebase@example.com'], { cwd: projectPath });
                await execa('git', ['commit', '-m', 'Initial commit from create-turbo-firebase'], {
                    cwd: projectPath
                });
                spinner.succeed('Git repository initialized with initial commit');
                logInfo('Note: Git user was configured locally for this repository');
            }
        }
    }
    catch (error) {
        spinner.fail('Failed to initialize git repository');
        if (error instanceof Error) {
            logWarning(`Error: ${error.message}`);
        }
        logWarning('You can initialize git manually later with: git init');
    }
}
//# sourceMappingURL=firebase-setup.js.map