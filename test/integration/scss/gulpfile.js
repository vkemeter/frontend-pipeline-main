const gulp = require('gulp');
const pipeline = require('../../../dist/Pipeline');

pipeline.default.setConfig({
    tasks: {
        ...Object.keys(pipeline.DefaultConfig.get().tasks).reduce((output, task) => {
            output[task] = false;
            return output;
        }, {}),
        'FRONTEND:SCSS': {
            src: './src/test.scss',
            dest: './dist'
        }
    }
})
pipeline.default.init();
