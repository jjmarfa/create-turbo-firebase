export declare function getTemplateDir(): string;
export declare function validateName(name: string): true | string;
export declare function getPackageManagerCommand(packageManager: 'npm' | 'yarn' | 'pnpm'): {
    install: string;
    run: string;
    exec: string;
};
export declare function detectPackageManager(): Promise<'npm' | 'yarn' | 'pnpm'>;
export declare function logSuccess(message: string): void;
export declare function logError(message: string): void;
export declare function logInfo(message: string): void;
export declare function logWarning(message: string): void;
export declare function isDirectoryEmpty(dirPath: string): Promise<boolean>;
//# sourceMappingURL=utils.d.ts.map