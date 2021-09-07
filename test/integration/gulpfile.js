const gulp = require('gulp');
const pipeline = require('../../dist/Pipeline');

pipeline.default.setConfig({
    tasks: {
        ...Object.keys(pipeline.DefaultConfig.get().tasks).reduce((output, task) => {
            output[task] = false;
            return output;
        }, {}),
        'FRONTEND:SCSS': {
            src: './src/scss/test.scss',
            dest: './dist/css'
        },
        'FRONTEND:JS': {
            src: './src/ts/main.ts',
            dest: './dist/js'
        },
        'FRONTEND:IMAGES': {
            src: './src/img/**/*',
            dest: './dist/img',
            imagemin: {
                png: true,
                jpg: true,
                gif: true
            }
        },
        'BACKEND:SCSS': {
            src: './src/scss/backend/main.scss',
            dest: './dist/backend/css'
        },
        'BACKEND:JS': {
            src: './src/js/backend/main.js',
            dest: './dist/backend/js'
        }
    }
})
pipeline.default.init();
