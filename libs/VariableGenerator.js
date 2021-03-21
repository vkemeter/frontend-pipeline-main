const VariableExporterRegistry = require('./variableExporter/VariableExporterRegistry');

class VariableGenerator {
    static DEFINITION_VALUE_KEY = 'values';
    static DEFINITION_EXPORT_KEY = 'export';

    generate(baseDefinitions) {
        for (let definitionName in baseDefinitions) {
            if(baseDefinitions.hasOwnProperty(definitionName)) {
                console.debug(`Generating files for ${definitionName}`);
                this._generateDefinition(baseDefinitions[definitionName]);
            }
        }
    }

    _generateDefinition(variableDefinition) {
        const definitionValues = variableDefinition[VariableGenerator.DEFINITION_VALUE_KEY];
        const definitionExports = variableDefinition[VariableGenerator.DEFINITION_EXPORT_KEY];
        for(let exportTarget in definitionExports) {
            if(definitionExports.hasOwnProperty(exportTarget)) {
                const exportConfig = definitionExports[exportTarget];
                const exporter = this._findAndCreateExporterForTarget(exportTarget, exportConfig);
                exporter?.generateValues(definitionValues);
            }
        }
    }

    _findAndCreateExporterForTarget(exportTarget, exportConfig) {
        const Exporter = VariableExporterRegistry.get(exportTarget);
        if(!Exporter) {
            console.warn(`No exporter defined for ${exportTarget}`);
            return;
        }
        return new Exporter(exportConfig);
    }
}

module.exports = VariableGenerator;
