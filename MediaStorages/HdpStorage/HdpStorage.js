"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdpStorage = void 0;
const querystring_1 = __importDefault(require("querystring"));
class HdpStorage {
    constructor(hdpConfig, httpClient) {
        this.hdpConfig = hdpConfig;
        this.httpClient = httpClient;
    }
    createFile(filePath, fileData, hdpParams = null, headers = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!fileData)
                return null;
            try {
                const operationParams = {
                    'op': 'CREATE',
                    'overwrite': 'true'
                };
                const defaultHeaders = {
                    "Content-Type": "multipart/form-data"
                };
                headers = Object.assign({}, defaultHeaders, headers);
                hdpParams = Object.assign({}, operationParams, hdpParams, this.hdpConfig.hdpCredentials);
                const hdpQueryParams = yield this.ConvertQueryParamsToStr(hdpParams);
                const url = `${this.hdpConfig.hdpUrl}/${filePath}?${hdpQueryParams}`;
                const response = yield this.httpClient.put(url, headers, fileData);
                // console.log(`Created ${response.status}: ${response.statusText}`)
                return response.status == 201;
            }
            catch (err) {
                console.error(err.message);
                return null;
            }
        });
    }
    makeDir(filePath, hdpParams = null, headers = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const operationParams = {
                    'op': 'MKDIRS'
                };
                hdpParams = Object.assign({}, operationParams, hdpParams, this.hdpConfig.hdpCredentials);
                const hdpQueryParams = yield this.ConvertQueryParamsToStr(hdpParams);
                const url = `${this.hdpConfig.hdpUrl}/${filePath}?${hdpQueryParams}`;
                const response = yield this.httpClient.put(url, headers);
                return response.status == 200 && response.data.boolean;
            }
            catch (err) {
                console.error(err.message);
                return null;
            }
        });
    }
    readFile(filePath, hdpParams = null, headers = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const operationParams = {
                    'op': 'OPEN'
                };
                hdpParams = Object.assign({}, operationParams, hdpParams, this.hdpConfig.hdpCredentials);
                const hdpQueryParams = yield this.ConvertQueryParamsToStr(hdpParams);
                const url = `${this.hdpConfig.hdpUrl}/${filePath}?${hdpQueryParams}`;
                const response = yield this.httpClient.get(url, headers);
                return response.data;
            }
            catch (err) {
                console.error(err.message);
                return null;
            }
        });
    }
    deleteFile(filePath, hdpParams = null, headers = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const operationParams = {
                    'op': 'DELETE'
                };
                hdpParams = Object.assign({}, operationParams, hdpParams, this.hdpConfig.hdpCredentials);
                const hdpQueryParams = yield this.ConvertQueryParamsToStr(hdpParams);
                const url = `${this.hdpConfig.hdpUrl}/${filePath}?${hdpQueryParams}`;
                const response = yield this.httpClient.delete(url, headers);
                return response.status == 200 && response.data.boolean;
            }
            catch (err) {
                console.error(err.message);
                return null;
            }
        });
    }
    isExists(filePath, hdpParams = null, headers = null) {
        return __awaiter(this, void 0, void 0, function* () {
            filePath = yield this.convertFilePath(filePath);
            try {
                const operationParams = {
                    'op': 'GETFILESTATUS'
                };
                hdpParams = Object.assign({}, operationParams, hdpParams, this.hdpConfig.hdpCredentials);
                const hdpQueryParams = yield this.ConvertQueryParamsToStr(hdpParams);
                const url = `${this.hdpConfig.hdpUrl}${filePath}?${hdpQueryParams}`;
                const response = yield this.httpClient.get(url, headers);
                return response.status == 200;
            }
            catch (err) {
                if (err.response && err.response.status === 404)
                    return false;
                console.error(err.message);
                return null;
            }
        });
    }
    concatOrdered(filePath, pathList, hdpParams = null, headers = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isExists(filePath))) {
                console.log(`File ${filePath} is not exists`);
                return false;
            }
            const pathListFiltered = pathList
                .filter(x => x !== filePath);
            for (let sourcePath of pathListFiltered) {
                const result = yield this.concat(filePath, [sourcePath]);
                if (!result)
                    return false;
            }
            return true;
        });
    }
    concat(filePath, pathList, hdpParams = null, headers = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.isExists(filePath))) {
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
                const hdpQueryParams = yield this.ConvertQueryParamsToStr(hdpParams);
                const url = `${this.hdpConfig.hdpUrl}/${filePath}?${hdpQueryParams}`;
                const response = yield this.httpClient.post(url, headers);
                return response.status == 200;
            }
            catch (err) {
                console.log(err.message);
                return false;
            }
        });
    }
    rename(filePath, newFilePath, hdpParams = null, headers = null) {
        return __awaiter(this, void 0, void 0, function* () {
            newFilePath = yield this.convertFilePath(newFilePath);
            if (!(yield this.isExists(filePath))) {
                console.log(`File ${filePath} is not exists`);
                return false;
            }
            try {
                const operationParams = {
                    'op': 'RENAME',
                    'destination': newFilePath
                };
                hdpParams = Object.assign({}, operationParams, hdpParams, this.hdpConfig.hdpCredentials);
                const hdpQueryParams = yield this.ConvertQueryParamsToStr(hdpParams);
                const url = `${this.hdpConfig.hdpUrl}/${filePath}?${hdpQueryParams}`;
                const response = yield this.httpClient.put(url, headers, null);
                return response.status == 200 && response.data.boolean;
            }
            catch (err) {
                console.log(err.message);
                return false;
            }
        });
    }
    listDir(filePath, hdpParams = null, headers = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const operationParams = {
                    'op': 'LISTSTATUS'
                };
                hdpParams = Object.assign({}, operationParams, hdpParams, this.hdpConfig.hdpCredentials);
                const hdpQueryParams = yield this.ConvertQueryParamsToStr(hdpParams);
                const url = `${this.hdpConfig.hdpUrl}/${filePath}?${hdpQueryParams}`;
                const response = yield this.httpClient.get(url, headers);
                return response.data;
            }
            catch (err) {
                console.error(err.message);
                return null;
            }
        });
    }
    convertFilePath(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!filePath.startsWith('/')) {
                filePath = `/${filePath}`;
            }
            return filePath;
        });
    }
    ConvertQueryParamsToStr(paramsDict) {
        return __awaiter(this, void 0, void 0, function* () {
            return !paramsDict ? '' : querystring_1.default.stringify(paramsDict);
        });
    }
}
exports.HdpStorage = HdpStorage;
