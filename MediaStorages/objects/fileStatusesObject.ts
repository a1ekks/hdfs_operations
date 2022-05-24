export class FileStatusObject {
    accessTime: number
    blockSize: number
    group: string
    length: number
    modificationTime: number
    owner: string
    pathSuffix: string
    permission: string
    replication: number | null
    type: string
}


export class FileStatusesObject{
    FileStatuses: Record<string, [FileStatusObject]>
}
