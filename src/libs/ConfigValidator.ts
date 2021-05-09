import * as path from 'path';
import * as fs from 'fs';
import {Schema, Validator} from 'jsonschema';

export class ConfigValidator<C> {
    private static readonly JSON_SCHEMA_DIR = path.join(__dirname, '../schemas');
    private static readonly AVAILABLE_JSON_SCHEMAS = ConfigValidator.getAllAvailableJsonSchemas();

    private validator: Validator;
    private schema: Schema;

    constructor(schemaName: string) {
        const schemaPath = ConfigValidator.getSchemaPathFromName(schemaName);
        if (!schemaPath) {
            throw new Error(`Config schema ${schemaName} does not exist`);
        }
        this.validator = new Validator();
        this.schema = require(schemaPath);
    }

    public validate(config: C): config is C {
        return this.validator.validate(config, this.schema).valid;
    }

    private static getSchemaPathFromName(schemaName: string): string | null {
        if (path.extname(schemaName) !== '.json') {
            schemaName = path.join(schemaName, '.json');
        }
        schemaName = schemaName.toLowerCase().trim();
        const availableSchema = this.AVAILABLE_JSON_SCHEMAS.find(s => s.toLowerCase() === schemaName);
        if (!availableSchema) {
            return null;
        }
        return path.join(this.JSON_SCHEMA_DIR, availableSchema);
    }

    private static getAllAvailableJsonSchemas(): string[] {
        return fs.readdirSync(this.JSON_SCHEMA_DIR).filter(schema => path.extname(schema) !== '.json');
    }
}
