import * as path from 'path';
import * as TJS from 'typescript-json-schema';
import * as fs from 'fs';

const TYPES_PATH = path.join(__dirname, '../src/types/config');
const SCHEMA_PATH = path.join(__dirname, '../src/schemas')
const TJS_BASE_CONFIG: TJS.PartialArgs = {
    strictNullChecks: true,
    required: true
}

function generateAll() {
    const foundTypes = fs.readdirSync(TYPES_PATH).filter(type => path.extname(type) === '.ts');
    foundTypes.forEach(generateSchema);
}

function generateSchema(typeName: string) {
    const baseName = path.basename(typeName, '.ts');
    const schemaName = baseName + '.json';
    const typePath = path.join(TYPES_PATH, typeName);
    const schemaPath = path.join(SCHEMA_PATH, schemaName);

    const tsjProgram = TJS.getProgramFromFiles([typePath], TJS_BASE_CONFIG);
    const schema = TJS.generateSchema(tsjProgram, baseName, TJS_BASE_CONFIG);

    if(schema) {
        fs.writeFileSync(schemaPath, JSON.stringify(schema));
    }
}

generateAll();
