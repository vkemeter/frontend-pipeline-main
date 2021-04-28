const _realFavicon = require('gulp-real-favicon');
const _config = require(__dirname.substring(0, __dirname.indexOf('node_modules')) +'config');
const _fancyLog = require('fancy-log');
const _colors = require('ansi-colors');

/**
 * Generate the icons. This task takes a few seconds to complete.
 * You should run it at least once to create the icons. Then,
 * you should run it whenever RealFaviconGenerator updates its@param done
 * package (see the check-for-favicon-update task below).
 *
 * @return {*|void}
 */
module.exports = function (done) {
    _config().favIcon.icons.forEach(function(icon, key){
        _fancyLog(_colors.green('Generating '+ icon.name));

        let _masterPicture = icon.master,
            _dest = icon.dest,
            _FAVICON_DATA_FILE = icon.data,
            _iconsPath = icon.iconsPath;

        _realFavicon.generateFavicon({
            masterPicture: _masterPicture,
            dest: _dest,
            iconsPath: _iconsPath,
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
        }, function() {});
    });

    return done();
};

module.exports.alias = 'Favicon:GENERATE';
module.exports.enabled = _config().favIcon.enabled;