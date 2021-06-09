declare module 'gulp-sass-glob' {
    export interface SassGlobOptions {
        ignorePaths: string[]
    }

    const sassGlobFunction: (options?: SassGlobOptions) => NodeJS.ReadWriteStream;
    export default sassGlobFunction;
}
