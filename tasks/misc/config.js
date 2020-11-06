const _read = require('read-data');
const _writeFile = require('write');
const _config = require(__dirname.substring(0, __dirname.indexOf('node_modules')) +'config');

module.exports = function(done) {
    // read the desired yaml file
    // look for possible options in the yaml file
    return _read(_config().config.sourceFile, function(err, data) {
        // log error to console, if file is missing
        // not not correct yaml
        if (err) {
            return console.log(err);
        }

        // pre defined variables
        var config = data['config'],
            exports,
            type,
            i;

        // loop through the export keys
        // located in the yaml file.
        // in this case breakpoints and containers
        for (exports in config) {
            var entry = config[exports];
            var values = entry['values'];

            // loop through the type in each
            // export loop. in this case
            // it is the scss and constantsts in the
            // first export and the scss in the second
            // breakpoint
            for (type in entry['export']) {
                var _variableName = entry['export'][type].name,
                    _fileName = entry['export'][type].file,
                    _return = [];

                // get the values for the desired export file
                for(i in values) {
                    // check if there is a typecast for the value
                    var _value = values[i].value;
                    if (typeof entry['export'][type].typecast !== 'undefined') {
                        _value = parseInt(_value);
                    }

                    // parse the i as an integer for math operations
                    i = parseInt(i);

                    // get the line for each value depending on the
                    // export type (scss/typoscript)
                    _return.push(writeLn(values[i].key, _value, type));

                    // add the additional line, if the additional key
                    // is set. very specific. dont know if that is a cool way
                    if (typeof entry['export'][type].additional !== 'undefined') {
                        if (typeof values[i + 1] !== 'undefined') {

                            // check if there is a typecast for the value
                            var _value = (parseInt(values[i + 1].value) - 1) +'px';
                            if (typeof entry['export'][type].typecast !== 'undefined') {
                                _value = parseInt(_value);
                            }

                            _return.push(writeLn(values[i].key +'-'+ entry['export'][type].additional, _value, type));
                        }
                    }
                }

                // wrap and join the array with some comments and line breaks
                var content = wrap(joinLines(_return, type), _variableName, type, _fileName);

                // finaly write the desired file to the folder given in the
                // yaml file or log an error to the console if it fails
                _writeFile(_fileName, content, function(err) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }
    }, waitUntilFilesWritten(done));

    function waitUntilFilesWritten(done) {
        setTimeout(function(){
            done();
        }, 100);
    }

    /**
     * this function join the givven arrays with an
     * defined END OF LINE (eol) string. in this case,
     * the scss files need a comma at the end. if no key
     * is given for the type, then nothing will be added.
     *
     * add eol strings for each type you want to join, if needed
     *
     * maybe we should put that in a different class
     * for better usability
     *
     * @param object
     * @param type
     */
    function joinLines(object, type) {
        var eol = {
            'scss': ',',
        };

        // simply add a tab for better readability to each line.
        for(k in object) {
            if (type === 'yaml') {
                object[k] = '  '+ object[k];
            } else {
                object[k] = '\t'+ object[k];
            }
        }

        return object.join((typeof eol[type] !== 'undefined' ? eol[type] : '') +'\n');
    }

    /**
     * returns the line for the export file
     * active exportable lines are for scss files
     * or typoscript files. each file has different
     * separators. you can add for each type in your
     * export a different separator key, if needed.
     *
     * maybe we should put that in a different class
     * for better usability
     *
     * @param key
     * @param value
     * @param type
     * @return {string}
     */
    function writeLn(key, value, type) {
        var separator = {
            'scss': ': ',
            'constantsts': ' = '
        };

        if (type === 'yaml') {
            return '- { key: '+ key +', value: \''+ value +'\' }';
        }

        return key + (typeof separator[type] !== 'undefined' ? separator[type] : '') + value;
    }

    /**
     * wrap the string you get with specific variable
     * names from the yaml file. each type can have
     * different variableName write styles. depends
     * on what your file should be (scss, typoscript or
     * maybe a php file)
     *
     * even a end string could be set in the variables for
     * each type.
     *
     * the whole string is wrapped with comments for better
     * readability and understandability
     *
     * @param string
     * @param variableName
     * @param type
     * @param fileName
     * @return {string}
     */
    function wrap(string, variableName, type, fileName) {
        var wrap = {
            'scss': {
                'start': '$'+ variableName +': (\n',
                'end': '\n);',
                'comment': '//',
            },
            'constantsts': {
                'start': variableName +' {\n',
                'end': '\n}',
                'comment': '//',
            },
            'yaml': {
                'start': variableName +': \r\n',
                'end': '\r\n',
                'comment': '#',
            },
        };

        var comment  = '';
        comment += wrap[type]['comment'] +' ' + fileName + ', created with gulp task and yaml config\n';
        comment += wrap[type]['comment'] +' created at: ' + new Date().toString() +'\n';

        return comment + (typeof wrap[type] !== undefined ? wrap[type]['start'] : '') + string + (typeof wrap[type] !== undefined ? wrap[type]['end'] : '');
    }
};

module.exports.alias = 'Misc:CONFIG';
module.exports.enabled = _config().misc.enabled;