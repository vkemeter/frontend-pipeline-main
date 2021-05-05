import * as path from 'path';

export class ContextFileHelper {
    private static readonly EXECUTION_PATH = process.env.PIPELINE_CONTEXT_PATH || process.cwd();

    static getContextFilepath(relativeOrAbsoluteFilepath: string): string {
        if (path.isAbsolute(relativeOrAbsoluteFilepath)) {
            return relativeOrAbsoluteFilepath;
        }
        return path.join(this.EXECUTION_PATH, relativeOrAbsoluteFilepath);
    }
}
