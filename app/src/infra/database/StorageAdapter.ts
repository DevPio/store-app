export interface StorageAdapter {
    uploadFile(container: string, blobName: string, file: Buffer | Blob | ArrayBuffer | ArrayBufferView): Promise<string>
    downloadFile(container: string, blobName: string, type: string): Promise<string>
    deleteFile(containerName: string, blobName: string): Promise<void>
}