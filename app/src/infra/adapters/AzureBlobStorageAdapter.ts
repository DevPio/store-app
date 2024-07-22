import { BlobServiceClient } from "@azure/storage-blob";
import { StorageAdapter } from "../database/StorageAdapter";
import { blobServiceClient } from "../database/AzureBlobConfig";




export class AzureBlobStorageAdapter implements StorageAdapter {

    private client: BlobServiceClient;

    constructor() {
        this.client = blobServiceClient
    }
    async uploadFile(container: string, blobName: string, file: Buffer | Blob | ArrayBuffer | ArrayBufferView): Promise<string> {
        const containerClient = this.client.getContainerClient(container);

        await containerClient.createIfNotExists();

        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(file);

        return blobName
    }
    async downloadFile(container: string, blobName: string, type: string): Promise<string> {
        const containerClient = this.client.getContainerClient(container);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        const downloadResponse = await blockBlobClient.download(0);
        const downloadedBuffer = await this.streamToBuffer(downloadResponse.readableStreamBody as NodeJS.ReadableStream);
        const base64String = downloadedBuffer.toString('base64');


        return `data:${type};base64,${base64String}`;

    }

    async streamToBuffer(readableStream: NodeJS.ReadableStream | null): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];
            readableStream?.on('data', (data) => {
                chunks.push(data instanceof Buffer ? data : Buffer.from(data));
            });
            readableStream?.on('end', () => {
                resolve(Buffer.concat(chunks));
            });
            readableStream?.on('error', reject);
        });
    }

    async deleteFile(containerName: string, blobName: string): Promise<void> {
        const containerClient = this.client.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.delete()
    }

}