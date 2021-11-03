module.exports = {
    tasks: {
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
        },
        'MISC:CONFIG': true,
        'MISC:CLEAN': true
    }
}
