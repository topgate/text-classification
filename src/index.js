import functions from '@google-cloud/functions-framework';
import { classifyPdf } from './generator.js';
import { downloadFile } from './storage.js';
import { insertBQ } from './bigquery.js';


// Register a CloudEvent callback with the Functions Framework that will
// be triggered by Cloud Storage.
functions.cloudEvent('classify', async cloudEvent => {
    const file = cloudEvent.data;
    const content = await downloadFile(file.bucket, file.name);
    const category = await classifyPdf(content);
    await insertBQ(file.name, category, file.timeCreated);
    console.log(`File ${file.name} classified as ${category}`);
});
