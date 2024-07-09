const $RefParser = require('json-schema-ref-parser');
const fs = require('fs');
const path = require('path');

async function resolveSchema(schemaFilePath) {
    try {
        // Resolve the schema
        const schema = await $RefParser.dereference(schemaFilePath);
        return schema;
    } catch (error) {
        console.error(`Error resolving schema: ${error.message}`);
        process.exit(1);
    }
}

function saveResolvedSchema(outputFilePath, resolvedSchema) {
    try {
        fs.writeFileSync(outputFilePath, JSON.stringify(resolvedSchema, null, 2));
        console.log(`Resolved schema saved to ${outputFilePath}`);
    } catch (error) {
        console.error(`Error saving resolved schema: ${error.message}`);
        process.exit(1);
    }
}

async function main() {
    const mainFilePath = 'Offer-nlpi-dsb-v0.2.3/offer-nlpi/OfferRejectionType.json';
    const splittedPath = mainFilePath.split('/');
    const mainFileName = splittedPath[splittedPath.length - 1];
    const schemaFilePath = path.resolve(__dirname, 'schemas', ...splittedPath); // Path to your main schema file
    const outputFilePath = path.resolve(__dirname, 'output', mainFileName); // Output file path

    const resolvedSchema = await resolveSchema(schemaFilePath);
    saveResolvedSchema(outputFilePath, resolvedSchema);
}

main();
