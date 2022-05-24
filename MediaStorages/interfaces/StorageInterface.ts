

export interface IStorage {
    createFile(filePath: string, fileData: BinaryType): Promise<boolean | null>;
    makeDir(filePath: string): Promise<boolean | null>;
    readFile(filePath: string): Promise<object | null>;
    deleteFile(filePath: string): Promise<boolean | null>;
    isExists(filePath: string): Promise<boolean | null>;
}