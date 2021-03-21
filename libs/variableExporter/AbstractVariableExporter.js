class AbstractVariableExporter {
    static TARGET_EXPORT_KEY = '__NULL__';

    constructor() {
        if(new.target === AbstractVariableExporter) {
            throw new TypeError('AbstractVariableExporter cannot be instantiated');
        }
    }
}

module.exports = AbstractVariableExporter;
