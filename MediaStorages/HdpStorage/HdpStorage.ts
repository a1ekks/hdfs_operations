import querystring from "querystring";

import { IHttpClient } from "../interfaces/HttpClientInterface";
import { IStorage } from "../interfaces/StorageInterface";
import { FileStatusesObject } from "../objects/fileStatusesObject";
import { ResponseObject } from "../objects/responseObject";
import { HdpConfig } from "./HdpConfig";


export class HdpStorage implements IStorage {
    private hdpConfig: HdpConfig;
    private httpClient: IHttpClient<Record<string, any> | null, ResponseObject>;

    constructor(hdpConfig: HdpConfig, httpClient: IHttpClient<Record<string, any>, ResponseObject>) {
        this.hdpConfig = hdpConfig;
        this.httpClient = httpClient;
    }

    async createFile(filePath: string, fileData: BinaryType, hdpParams = null, headers = null): Promise<boolean | null> {
        if (!fileData) return null;
        try {
            const operationParams = {
                'op': 'CREATE',
                'overwrite': 'true'
            };  
            const defaultHeaders = {
                "Content-Type": "multipart/form-data"
            }
            headers = Object.assign({}, defaultHeaders, headers);
            hdpParams = Object.assign({}, operationParams, hdpParams, this.hdpConfig.hdpCredentials);

            const hdpQueryParams = await this.ConvertQueryParamsToStr(hdpParams);
            const url = `${this.hdpConfig.hdpUrl}/${filePath}?${hdpQueryParams}`;

            const response = await this.httpClient.put(url, headers, fileData);
            // console.log(`Created ${response.status}: ${response.statusText}`)

            return response.status == 201;
        }
        catch (err) {
            console.error(err.message);
            return null;
        }
    }

    async makeDir(filePath: string, hdpParams = null, headers = null): Promise<boolean | null> {
        try {
            const operationParams = {
                'op': 'MKDIRS'
            };
            hdpParams = Object.assign({}, operationParams, hdpParams, this.hdpConfig.hdpCredentials);
            const hdpQueryParams = await this.ConvertQueryParamsToStr(hdpParams);
            const url = `${this.hdpConfig.hdpUrl}/${filePath}?${hdpQueryParams}`;
            const response = await this.httpClient.put(url, headers);

            return response.status == 200 && response.data.boolean;
        }
        catch (err) {
            console.error(err.message);
            return null;
        }
    }

    async readFile(filePath: string, hdpParams = null, headers = null): Promise<object | null> {
        try {
            const operationParams = {
                'op': 'OPEN'
            };
            hdpParams = Object.assign({}, operationParams, hdpParams, this.hdpConfig.hdpCredentials);
            const hdpQueryParams = await this.ConvertQueryParamsToStr(hdpParams);
            const url = `${this.hdpConfig.hdpUrl}/${filePath}?${hdpQueryParams}`;
            const response = await this.httpClient.get(url, headers);

            return response.data;
        }
        catch (err) {
            console.error(err.message);
            return null;
        }
    }

    async deleteFile(filePath: string, hdpParams = null, headers = null): Promise<boolean | null> {
        try {
            const operationParams = {
                'op': 'DELETE'
            };
            hdpParams = Object.assign({}, operationParams, hdpParams, this.hdpConfig.hdpCredentials);
            const hdpQueryParams = await this.ConvertQueryParamsToStr(hdpParams);
            const url = `${this.hdpConfig.hdpUrl}/${filePath}?${hdpQueryParams}`;
            const response = await this.httpClient.delete(url, headers);
    
            return response.status == 200 && response.data.boolean;
        }
        catch (err) {
            console.error(err.message);
            return null;
        }
    }

    async isExists(filePath: string, hdpParams = null, headers = null): Promise<boolean | null> {
        filePath = await this.convertFilePath(filePath);
        try {
            const operationParams = {
                'op': 'GETFILESTATUS'
            };
            hdpParams = Object.assign({}, operationParams, hdpParams, this.hdpConfig.hdpCredentials);
            const hdpQueryParams = await this.ConvertQueryParamsToStr(hdpParams);
            const url = `${this.hdpConfig.hdpUrl}${filePath}?${hdpQueryParams}`;
            const response = await this.httpClient.get(url, headers);
            return response.status == 200
        }
        catch (err){
            if (err.response && err.response.status === 404) return false;
            console.error(err.message);
            return null;
        }
    }

    async concatOrdered(filePath: string, pathList: Array<string>, hdpParams = null, headers = null): Promise<boolean | null> {
        if (!await this.isExists(filePath)){
            console.log(`File ${filePath} is not exists`);
            return false;
        }

        const pathListFiltered = pathList
            .filter(x => x !== filePath)
        for (let sourcePath of pathListFiltered) {
            const result = await this.concat(filePath, [sourcePath]);
            if (!result) return false;
        }
        return true;
    }

    async concat(filePath: string, pathList: Array<string>, hdpParams = null, headers = null): Promise<boolean | null> {
        if (!await this.isExists(filePath)){
            console.log(`File ${filePath} is not exists`);
            return false;
        }
        try {
            const pathListJoined = pathList
                .filter(x => x !== filePath)
                .map(x => `/${x}`);

            const operationParams = {
                'op': 'CONCAT',
                'sources': pathListJoined
            };

            hdpParams = Object.assign({}, operationParams, hdpParams, this.hdpConfig.hdpCredentials);
            const hdpQueryParams = await this.ConvertQueryParamsToStr(hdpParams);
            const url = `${this.hdpConfig.hdpUrl}/${filePath}?${hdpQueryParams}`;
            const response = await this.httpClient.post(url, headers);

            return response.status == 200
        }
        catch (err){
            console.log(err.message);
            return false;
        }
    }

    async rename(filePath: string, newFilePath: string, hdpParams = null, headers = null): Promise<boolean | null> {
        newFilePath = await this.convertFilePath(newFilePath);
        if (!await this.isExists(filePath)){
            console.log(`File ${filePath} is not exists`);
            return false;
        }

        try {
            const operationParams = {
                'op': 'RENAME',
                'destination': newFilePath
            };

            hdpParams = Object.assign({}, operationParams, hdpParams, this.hdpConfig.hdpCredentials);
            const hdpQueryParams = await this.ConvertQueryParamsToStr(hdpParams);
            const url = `${this.hdpConfig.hdpUrl}/${filePath}?${hdpQueryParams}`;
            const response = await this.httpClient.put(url, headers, null);

            return response.status == 200 && response.data.boolean
        }
        catch(err) {
            console.log(err.message);
            return false;
        }
    }

    async listDir(filePath: string, hdpParams = null, headers = null): Promise<FileStatusesObject | null> {
        try {
            const operationParams = {
                'op': 'LISTSTATUS'
            };
            hdpParams = Object.assign({}, operationParams, hdpParams, this.hdpConfig.hdpCredentials);
            const hdpQueryParams = await this.ConvertQueryParamsToStr(hdpParams);
            const url = `${this.hdpConfig.hdpUrl}/${filePath}?${hdpQueryParams}`;
            const response = await this.httpClient.get(url, headers);

            return response.data;
        }
        catch (err) {
            console.error(err.message);
            return null;
        }
    }

    async convertFilePath(filePath: string): Promise<string>{
        if (!filePath.startsWith('/')){
            filePath = `/${filePath}`;
        }
        return filePath;
    }

    async ConvertQueryParamsToStr(paramsDict: Record<string, any> | null): Promise<string>{
        return !paramsDict? '' : querystring.stringify(paramsDict);
    }
}
