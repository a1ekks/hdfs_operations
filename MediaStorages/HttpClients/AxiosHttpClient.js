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
exports.AxiosHttpClient = void 0;
const axios_1 = __importDefault(require("axios"));
class AxiosHttpClient {
    get(url, headers = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default.get(url, headers = headers);
        });
    }
    post(url, data, headers = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultHeaders = {
                "Content-Type": "multipart/form-data"
            };
            headers = Object.assign({}, defaultHeaders, headers);
            const requestConfig = {
                method: "post",
                url: url,
                headers: headers,
                data: data
            };
            return yield axios_1.default(requestConfig);
        });
    }
    put(url, headers = null, data = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultHeaders = {
                "Content-Type": "multipart/form-data"
            };
            headers = Object.assign({}, defaultHeaders, headers);
            const requestConfig = {
                method: "put",
                url: url,
                headers: headers,
                data: data
            };
            return yield axios_1.default(requestConfig);
        });
    }
    delete(url, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield axios_1.default.delete(url, headers = headers);
        });
    }
}
exports.AxiosHttpClient = AxiosHttpClient;
