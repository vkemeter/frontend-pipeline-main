import * as path from 'path'
import {ParsedPath} from 'path'
import * as fs from 'fs'
import {ContextFileHelper} from './ContextFileHelper'

const read = require('read-data');

export class ConfigLoader<T> {
    private static readonly EXTENSION_HIERARCHY = ['.js', '.json', '.yaml', '.yml'];

    constructor() {
    }

    loadConfig(configPath: string, filename?: string,  callbackArgs?: any): T {
        const absoluteFilepath = ContextFileHelper.getContextFilepath(configPath);
        const isPathDirectory = fs.lstatSync(configPath).isDirectory();

        let fileExtension: string;
        let fileBasename: string;

        if(isPathDirectory) {
            if(!filename) {
                throw new Error(`Given path ${configPath} is a directory and no filename provided`);
            }
            fileExtension = path.extname(filename);
            fileBasename = path.basename(filename, fileExtension);
        } else {
            fileExtension = path.extname(absoluteFilepath);
            fileBasename = path.basename(absoluteFilepath, fileExtension);
        }

        if (ConfigLoader.EXTENSION_HIERARCHY.includes(fileExtension)) {
            return this.loadConfigByFileExtension(absoluteFilepath, callbackArgs);
        }
        filename = fileBasename + fileExtension;
        const foundConfigFile = this.findConfigFileInDirectory(absoluteFilepath, filename);
        return this.loadConfigByFileExtension(foundConfigFile, callbackArgs);
    }

    private loadConfigByFileExtension(configFilepath: string, callbackArgs?: any[]): T {
        const extension = path.extname(configFilepath);
        if (!ConfigLoader.EXTENSION_HIERARCHY.includes(extension)) {
            throw new Error(`Cannot load ${configFilepath}. Extension ${extension} is not allowed`);
        }
        if (extension === '.js') {
            return this.loadJsConfigFile(configFilepath, callbackArgs);
        }
        return this.loadJsonOrYamlConfigFile(configFilepath);
    }

    private findConfigFileInDirectory(directoryPath: string, filename: string): string {
        const foundConfigFiles = this.findAllConfigFilesInDirectory(directoryPath, filename);
        const highestOrderConfigFile = this.findHighestOrderConfigFileInPaths(foundConfigFiles);
        if (!highestOrderConfigFile) {
            throw new Error(`Cannot find any config files with valid extension in ${directoryPath}`);
        }
        return path.format({
            dir: directoryPath,
            base: highestOrderConfigFile
        });
    }

    private findHighestOrderConfigFileInPaths(foundConfigFiles: ParsedPath[]): string | undefined {
        for (let extension of ConfigLoader.EXTENSION_HIERARCHY) {
            const configFile = foundConfigFiles.find(file => file.ext === extension);
            if (configFile) {
                return configFile.base;
            }
        }
        return undefined;
    }

    private findAllConfigFilesInDirectory(directoryPath: string, filename: string): ParsedPath[] {
        const srcPathEntries = fs.readdirSync(directoryPath, {withFileTypes: true});
        return srcPathEntries
            .filter(entry => entry.isFile())
            .map(entry => path.parse(entry.name))
            .filter(entry => entry.name === filename && ConfigLoader.EXTENSION_HIERARCHY.includes(entry.ext));
    }

    private loadJsConfigFile(configFilepath: string, callbackArgs?: any[]): T {
        let configuration = require(configFilepath);
        if (configuration && typeof configuration === 'function') {
            callbackArgs = Array.isArray(callbackArgs) ? callbackArgs : [callbackArgs];
            configuration = configuration(...callbackArgs);
        }
        return configuration;
    }

    private loadJsonOrYamlConfigFile(configFilepath: string): T {
        return read.sync(configFilepath);
    }
}
