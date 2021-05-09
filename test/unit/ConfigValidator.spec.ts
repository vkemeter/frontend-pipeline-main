import {ConfigValidator} from '../../src/lib/ConfigValidator';
import {mocked} from 'ts-jest';
import * as fs from 'fs';

jest.mock('fs');
const fsMock = mocked(fs);

beforeEach(() => {
    fsMock.readdirSync.mockImplementation(() => {
        return [];
    });
})

describe('schema loading', () => {
    test('should throw error on invalid schemaName', () => {
        expect(() => new ConfigValidator<any>('invalid'))
            .toThrowError('Config schema invalid does not exist');
    });

    test('should not throw error on valid schemaName', () => {
        expect(() => new ConfigValidator<any>('PipelineConfig'))
            .not.toThrowError();
    });
});

describe('validation', () => {
    interface SimpleConfig {
        optionalParameter?: boolean,
        requiredParameter: boolean
    }

    test('should succeed with empty optional parameters', () => {

    });
});
