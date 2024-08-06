import { Storage } from '@google-cloud/storage';

const storage = new Storage();

export async function downloadFile(bucket, file) {
    const content = await storage.bucket(bucket).file(file).download()
    return content[0].toString('base64');
}
