export abstract class AbstractVariableExporter {
    public static get TARGET_EXPORT_KEY(): string {
        throw new Error('TARGET_EXPORT_KEY was not defined');
    };
}
