import axios, { AxiosPromise, AxiosResponse } from 'axios';
import { IHttpClient } from "../interfaces/HttpClientInterface";


export class AxiosHttpClient implements IHttpClient<object | null,  AxiosPromise<any>> {
    async get(url: string, headers: any = null): Promise<AxiosResponse<any>>{
        return await axios.get(url, headers=headers);
    }

    async post(url: string, data: any, headers: any = null): Promise<AxiosResponse<any>> {
        const defaultHeaders = {
            "Content-Type": "multipart/form-data"
        }
        headers = Object.assign({}, defaultHeaders, headers);

        const requestConfig = {
            method: "post",
            url: url,
            headers: headers,
            data: data
        };

        return await axios(requestConfig);
    }

    async put(url: string, headers: any = null, data: any = null): Promise<AxiosResponse<any>> {
        const defaultHeaders = {
            "Content-Type": "multipart/form-data"
        }
        headers = Object.assign({}, defaultHeaders, headers);

        const requestConfig = {
            method: "put",
            url: url,
            headers: headers,
            data: data
        };

        return await axios(requestConfig);
    }

    async delete(url: string, headers: any): Promise<AxiosResponse<any>> {
        return await axios.delete(url, headers=headers);
    }

}
