
export interface IHttpClient<T, F> {
    get(url: string, headers: T): F;
    post(url: string, headers: T, data?: any): F;
    put(url: string, headers: T, data?: any): F;
    delete(url: string, headers: T, data?: any): F;
}
