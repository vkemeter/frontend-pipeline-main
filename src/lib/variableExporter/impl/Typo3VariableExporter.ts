import {AbstractVariableExporter} from '../AbstractVariableExporter';
import {VariableValues} from '../../../types/config/VariableConfig'

class Typo3VariableExporter extends AbstractVariableExporter {
    public static readonly TARGET_EXPORT_KEY = 'typo'

    generate (target: VariableValues[]): Promise<void> {
        console.log('typo3', target);
        return Promise.resolve(undefined);
    }
}

export = Typo3VariableExporter
