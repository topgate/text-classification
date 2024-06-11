import { BigQuery } from "@google-cloud/bigquery";

const bigquery = new BigQuery();
const dataset = process.env.DATASET_ID;
const table = process.env.TABLE_ID;

export async function insertBQ(fileName, category, createdAt) {
    return bigquery.dataset(dataset).table(table).insert({ file_name: fileName, category: category, createdAt: createdAt });
}
