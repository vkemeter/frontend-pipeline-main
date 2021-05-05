import * as path from 'path';
import {ParsedPath} from 'path';
import * as fs from 'fs';
import {ContextFileHelper} from './ContextFileHelper';

const read = require('read-data').data;

export class ConfigLoader<T> {
    private static readonly DEFAULT_EXTENSION_HIERARCHY = ['.js', '.json', '.yaml', '.yml'];

    private extensionHierarchy: string[];
    private configFilepath: string;
    private cachedConfig?: T;

    constructor(configFilepath: string, {extensionHierarchy}: { extensionHierarchy?: string[] } = {}) {
        this.configFilepath = ContextFileHelper.getContextFilepath(configFilepath);
        this.extensionHierarchy = ConfigLoader.getExtensionHierarchyOrDefault(extensionHierarchy);
    }

    get<M = T>(path?: string, defaultValue?: M): T | M {
        if (!this.cachedConfig) {
            throw new Error('Config has not been loaded yet');
        }
        if (!path) {
            return this.cachedConfig;
        }
        return this.getObjectPropertyByPath<M>(path, defaultValue);
    }

    loadConfig(): void {
        const fileExtension = path.extname(this.configFilepath);
        if (fileExtension) {
            this.cachedConfig = this.loadConfigByFileExtension();
            return;
        }
        const foundConfigFilepath = this.findConfigFileInDirectory();
        this.cachedConfig = this.loadConfigByFileExtension(foundConfigFilepath);
    }

    private getObjectPropertyByPath<M>(path: string, defaultValue?: M): M {
        return path.split('.').reduce((output, pathSegment) => {
            if (output) {
                return output[pathSegment];
            }
            return defaultValue;
        }, this.cachedConfig as any);
    }

    private loadConfigByFileExtension(configFilepath = this.configFilepath): T {
        const extension = path.extname(configFilepath);
        if (!this.extensionHierarchy.includes(extension)) {
            throw new Error(`Cannot load ${this.configFilepath}. Extension ${extension} is not allowed`);
        }
        if (extension === '.js') {
            return this.loadJsConfigFile(configFilepath);
        }
        return this.loadJsonOrYamlConfigFile(configFilepath);
    }

    private findConfigFileInDirectory(): string {
        const foundConfigFiles = this.findAllConfigFilesInDirectory();
        const highestOrderConfigFile = this.findHighestOrderConfigFileInDirectoryEntries(foundConfigFiles);
        if (!highestOrderConfigFile) {
            throw new Error(`Cannot find any config files with valid extension in ${this.configFilepath}`);
        }
        return path.format({
            dir: path.dirname(this.configFilepath),
            base: highestOrderConfigFile
        });
    }

    private findHighestOrderConfigFileInDirectoryEntries(foundConfigFiles: ParsedPath[]): string | null {
        for (let extension of this.extensionHierarchy) {
            const configFile = foundConfigFiles.find(file => file.ext === extension);
            if (configFile) {
                return configFile.base;
            }
        }
        return null;
    }

    private findAllConfigFilesInDirectory(): ParsedPath[] {
        const directoryPath = path.dirname(this.configFilepath);
        const filename = path.basename(this.configFilepath)
        const srcPathEntries = fs.readdirSync(directoryPath, {withFileTypes: true});
        return srcPathEntries
            .filter(entry => entry.isFile())
            .map(entry => path.parse(entry.name))
            .filter(entry => entry.name === filename && this.extensionHierarchy.includes(entry.ext));
    }

    private loadJsConfigFile(configFilepath: string): T {
        let configuration = require(configFilepath);
        if (configuration && typeof configuration === 'function') {
            configuration = configuration();
        }
        return configuration;
    }

    private loadJsonOrYamlConfigFile(configFilepath: string): T {
        return read.sync(configFilepath);
    }

    private static getExtensionHierarchyOrDefault(extensionHierarchy?: string[]): string[] {
        if (Array.isArray(extensionHierarchy)) {
            return extensionHierarchy;
        }
        return ConfigLoader.DEFAULT_EXTENSION_HIERARCHY;
    }
}

module.exports = ConfigLoader;
