import { StorageAdapter } from "../infra/database/StorageAdapter";


export class StorageService {
    storageAdapter: StorageAdapter;
    container = "photos"
    constructor(storageAdapter: StorageAdapter) {
        this.storageAdapter = storageAdapter
    }


    async uploadFile(blobName: string, file: Buffer | Blob | ArrayBuffer | ArrayBufferView) {
        return await this.storageAdapter.uploadFile(this.container, blobName, file)
    }

    async downloadFile(blobName: string, type: string) {
        return await this.storageAdapter.downloadFile(this.container, blobName, type)
    }


}