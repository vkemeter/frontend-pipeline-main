import {AbstractVariableExporter} from '../AbstractVariableExporter'

class SassVariableExporter extends AbstractVariableExporter {
    public static readonly TARGET_EXPORT_KEY = 'scss'

    protected variablePrefix = '$'
    protected variableAssignment = '='
    protected mapStart = '('
    protected mapEnd = ')'
    protected endWithSemicolon = true
}

export = SassVariableExporter
