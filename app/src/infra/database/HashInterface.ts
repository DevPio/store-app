export interface IHash {
    hash(data: string): Promise<string>
    compare(data: string, hashed: string): Promise<boolean>
}