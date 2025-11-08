export interface ProjectConfig {
    projectName: string;
    projectPath: string;
    packageManager: 'npm' | 'yarn' | 'pnpm';
    initializeFirebase: boolean;
    firebaseProjectId?: string;
    useEmulators: boolean;
}
export interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
}
export interface TemplateFile {
    source: string;
    destination: string;
    transform?: (content: string, config: ProjectConfig) => string;
}
//# sourceMappingURL=types.d.ts.map