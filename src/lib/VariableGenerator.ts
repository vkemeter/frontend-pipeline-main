import {VariableExporterRegistry} from './variableExporter/VariableExporterRegistry'
import {VariableConfig, VariableConfigurationEntry} from '../types/config/VariableConfig'

export class VariableGenerator {
    private static readonly DEFINITION_VALUE_KEY = 'values';
    private static readonly DEFINITION_EXPORT_KEY = 'export';

    private readonly variableExporterRegistry = new VariableExporterRegistry();

    constructor () {
        this.variableExporterRegistry.loadDefaultExporter();
    }

    generate(variableConfig: VariableConfig) {
        Object.entries(variableConfig.config).forEach(([key, entry]) => {
            console.debug(`Generating files for ${key}`);
            this.processVariableConfigEntry(entry)
        })
    }

    private processVariableConfigEntry(variableDefinition: VariableConfigurationEntry) {
        const variableValues = variableDefinition[VariableGenerator.DEFINITION_VALUE_KEY];
        const variableExports = variableDefinition[VariableGenerator.DEFINITION_EXPORT_KEY];

        Object.entries(variableExports).forEach(async ([exporterKey, targetPath]) => {
            const exporter = this.variableExporterRegistry.get(exporterKey, targetPath);
            if(!exporter) {
                console.warn(`Used key ${exporterKey} has no registered Exporter. Will be ignored`);
                return;
            }
            await exporter.generate(variableValues);
        });
    }
}
