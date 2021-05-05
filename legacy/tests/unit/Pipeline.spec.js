const Pipeline = require('../../libs/Pipeline');

describe('get correct config', () => {
    test('should throw error if config was not found', () => {
        expect(Pipeline.get).toThrowError();
    });

    test('should find custom config path', () => {
        Pipeline.setConfig('tests/unit/resources/config');
        expect(typeof Pipeline.get()).toEqual('object');
    });

    test('should find custom config path with custom extension', () => {
        Pipeline.setConfig('tests/unit/resources/config.yaml');
        expect(typeof Pipeline.get()).toEqual('object');
        expect(Pipeline.get().type).toEqual('yaml');
    });

    test('should not get file if object is set', () => {
        const testObj = {foo: 'bar'};
        Pipeline.setConfig(testObj);
        expect(Pipeline.get()).toEqual(testObj);
    });
});

describe('can get properties by property path', () => {
    Pipeline.setConfig('tests/unit/resources/config.yaml');

    test('empty pathstring should return whole object', () => {
        expect(Pipeline.get('')).toEqual(Pipeline.get());
    });

    test('should return correct property value of path', () => {
        expect(Pipeline.get('nested.config.works')).toEqual('perfectly');
    })

    test('should work with arrays', () => {
        expect(Pipeline.get('array.4.nested.property')).toEqual('hi');
    });

    test('should return undefined if no default value set and property does not exist', () => {
        expect(Pipeline.get('this.will.not.exist')).toBeUndefined();
    });

    test('should return default value if property does not exist', () => {
        expect(Pipeline.get('this.will.not.exist', 'defaultValue')).toEqual('defaultValue');
    })
});
