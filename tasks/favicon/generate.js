const _realFavicon = require('gulp-real-favicon');
const _config = require(__dirname.substring(0, __dirname.indexOf('node_modules')) +'config');
const _masterPicture = _config().favIcon.master;
const _FAVICON_DATA_FILE = _config().favIcon.data;
const _dest = _config().favIcon.dest;

/**
 * Generate the icons. This task takes a few seconds to complete.
 * You should run it at least once to create the icons. Then,
 * you should run it whenever RealFaviconGenerator updates its@param done
 * package (see the check-for-favicon-update task below).
 *
 * @return {*|void}
 */
module.exports = function (done) {

    return _realFavicon.generateFavicon({
        masterPicture: _masterPicture,
        dest: _dest,
        iconsPath: '/',
        design: {
            ios: {
                pictureAspect: 'noChange',
                assets: {
                    ios6AndPriorIcons: false,
                    ios7AndLaterIcons: false,
                    precomposedIcons: false,
                    declareOnlyDefaultIcon: true
                }
            },
            desktopBrowser: {},
            windows: {
                pictureAspect: 'noChange',
                backgroundColor: '#da532c',
                onConflict: 'override',
                assets: {
                    windows80Ie10Tile: false,
                    windows10Ie11EdgeTiles: {
                        small: false,
                        medium: true,
                        big: false,
                        rectangle: false
                    }
                }
            },
            androidChrome: {
                pictureAspect: 'noChange',
                themeColor: '#ffffff',
                manifest: {
                    name: 'Web',
                    display: 'standalone',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                },
                assets: {
                    legacyIcon: false,
                    lowResolutionIcons: false
                }
            },
            safariPinnedTab: {
                pictureAspect: 'silhouette',
                themeColor: '#5bbad5'
            }
        },
        settings: {
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false
        },
        markupFile: _FAVICON_DATA_FILE
    }, function () {
        done();
        console.log("DONE CREATING FAVICONS!");
    });
};

module.exports.alias = 'Favicon:GENERATE';
module.exports.enabled = _config().favIcon.enabled;