const ConfigLoader = require('../../libs/ConfigLoader');
const path = require('path');
const mockFs = require('mock-fs');

const relativeResourcePath = './tests/unit/resources/config';
const absoluteResourcePath = path.join(process.cwd(), relativeResourcePath);

describe('setup', () => {
    test('relative path should be mapped to absolute path', () => {
        const configLoader = new ConfigLoader(relativeResourcePath);

        expect(configLoader._configFilepath).toEqual(absoluteResourcePath);
    });

    test('absolute path should be kept', () => {
        const configLoader = new ConfigLoader(absoluteResourcePath);

        expect(configLoader._configFilepath).toEqual(absoluteResourcePath);
    });

    test('default extension hierarchy should be applied by default', () => {
        const configLoader = new ConfigLoader('');

        expect(configLoader._extensionHierarchy).toEqual(ConfigLoader.DEFAULT_EXTENSION_HIERARCHY);
    });

    test('extension hierarchy can be passed as constructor parameter', () => {
        const newExtensionHierarchy = ['.json', '.yaml', '.js'];
        const configLoader = new ConfigLoader('', {extensionHierarchy: newExtensionHierarchy});

        expect(configLoader._extensionHierarchy).toEqual(newExtensionHierarchy);
    })
});

describe('find correct files when no file extension is set', () => {
    const resourceDirname = path.dirname(absoluteResourcePath);
    const defaultMockFsEntries = {
        'config.js': '',
        'config.json': '',
        'config.yaml': '',
        'config.yml': ''
    };

    beforeEach(() => {
        mockFs({
            [resourceDirname]: defaultMockFsEntries
        });
    });

    afterEach(() => {
        mockFs.restore();
    })

    test('use js-config first by default', () => {
        const configLoader = new ConfigLoader(relativeResourcePath);
        const filename = configLoader._findHighestOrderConfigFile(absoluteResourcePath);
        const filenameExtension = path.extname(filename);

        expect(filenameExtension).toEqual('.js');
    });

    test('prefer config from first hierarchy extension', () => {
        for (let i = 0; i < ConfigLoader.DEFAULT_EXTENSION_HIERARCHY.length; i++) {
            const iterationHierarchy = [];
            for (let j = 0; j < ConfigLoader.DEFAULT_EXTENSION_HIERARCHY.length; j++) {
                const targetIndex = (i + j) % ConfigLoader.DEFAULT_EXTENSION_HIERARCHY.length;
                iterationHierarchy.push(ConfigLoader.DEFAULT_EXTENSION_HIERARCHY[targetIndex]);
            }
            const configLoader = new ConfigLoader(relativeResourcePath, {extensionHierarchy: iterationHierarchy});
            const filename = configLoader._findHighestOrderConfigFile(absoluteResourcePath);
            const filenameExtension = path.extname(filename);

            expect(filenameExtension).toEqual(iterationHierarchy[0]);
        }
    });

    test('use next best config if highest order extension does not exist', () => {
        const mockFsEntries = {...defaultMockFsEntries};
        delete mockFsEntries['config.js'];
        delete mockFsEntries['config.json'];
        mockFs({
            [resourceDirname]: mockFsEntries
        });

        const configLoader = new ConfigLoader(relativeResourcePath);
        const filename = configLoader._findHighestOrderConfigFile(absoluteResourcePath);
        const filenameExtension = path.extname(filename);

        expect(filenameExtension).toEqual('.yaml');
    });
});

describe('load and parse all filetypes correctly', () => {
    ConfigLoader.DEFAULT_EXTENSION_HIERARCHY.forEach(extension => {
        test(`${extension.substr(1)}-configs should be parsed correctly`, () => {
            const configLoader = new ConfigLoader(absoluteResourcePath + extension);
            const loadedConfig = configLoader.load();

            expect(typeof loadedConfig).toEqual('object');
            expect(loadedConfig.foo).toEqual('bar');
        });
    });

    test('execute exported function from loaded js-config', () => {
        const configLoader = new ConfigLoader(absoluteResourcePath + 'Fn.js');
        const loadedConfig = configLoader.load();

        expect(typeof loadedConfig).toEqual('object');
        expect(loadedConfig.foo).toEqual('bar');
    });
});
