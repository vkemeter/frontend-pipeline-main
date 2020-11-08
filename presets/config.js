'use strict';

module.exports = function () {
    let build = __dirname.substring(0, __dirname.indexOf(__dirname.split('/').splice(-1).pop())) + __dirname.split('/').splice(-1).pop(),
        theme = __dirname.substring(0, __dirname.indexOf('theme')) + 'theme',
        webRoot = __dirname.substring(0, __dirname.indexOf('app')) + 'app/public';

    return {
        theme: build,
        browserPrefix: 'last 4 versions',
        backend: {
            css: {
                enabled: true,
                src: build + '/Src/Scss/Backend/*.scss',
                dest: theme + '/Resources/Public/Css/Backend/'
            },
            javascript: {
                enabled: true,
                src: build + '/Src/JavaScript/Backend.js',
                dest: theme + '/Resources/Public/JavaScript'
            }
        },
        favIcon: {
            data: build + '/Resources/Public/Icons/Favicon/faviconData.json',
            master: build + '/Resources/Public/Icons/Favicon/FaviconMaster.svg',
            dest: webRoot,
            destHtml: build + '/Resources/Private/Partials/Page/Favicon/Src/RealFavIcon.html',
            destDir: build + '/Resources/Private/Partials/Page/Favicon/Dist'
        },
        config: {
            sourceFile: build + '/config.yaml'
        },
        browserSync: {
            watch: [
                build + '/Resources/Public/Css/Styles.min.css',
                build + '/Resources/Public/JavaScript/Main.min.js'
            ]
        },
        icoMoon: {
            src: build + '/Build/Src/IcoMoon/fonts/*',
            dest: build  + '/Resources/Public/Webfonts/IcoMoon/',
            data: build + '/Build/Src/IcoMoon/selection.json',
            scssDest: build + '/Build/Src/Scss/Abstracts/'
        },
        frontend: {
            css: {
                enabled: true,
                src: build + '/Src/Scss/Styles.scss',
                dest: theme + '/Resources/Public/Css',
                watch: build + '/Src/Scss/**/*.scss'
            },
            javascript: {
                enabled: true,
                src: build + '/Src/JavaScript/Main.js',
                ie11: build + '/Src/JavaScript/IE11.js',
                dest: theme + '/Resources/Public/JavaScript',
                watch: build + '/Src/JavaScript/**/*.js',
                includeJquery: true,
                modules: [
                    build +'/node_modules/frontend-pipeline-main/Src/JavaScript/Plugins/plugin.Breakoints.js',
                ]
            },
            fonts: {
                enabled: true,
                src: build + '/Src/Fonts/**/*',
                dest: theme + '/Resources/Public/Webfonts'
            },
            images: {
                svg: {
                    src: build + '/Build/Src/Images/Svg/**/*.svg',
                    dest: build + '/Resources/Public/Images/Svg',
                    watch: build + '/Build/Src/Images/Svg/**/*.svg'
                },
                svgSprites: {
                    SocialIcons: build + '/Build/Src/Images/SvgSprites/SocialIcons/**/*.svg',
                    watch: build + '/Build/Src/Images/SvgSprites/**/*.svg',
                    scssDestDir: build + '/Build/Src/Scss/Utilities/SvgSprites/',
                    parentDir: build + '/Build/Src/Images/SvgSprites/SocialIcons/'
                }
            }
        },
        misc: {
            enabled: true
        }
    };
};
