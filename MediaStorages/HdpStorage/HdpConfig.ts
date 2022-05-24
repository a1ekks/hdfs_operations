

export class HdpConfig {
    hdpUrl: string;
    hdpCredentials: object;
    host: string;
    port: number;
    user: string;
    proto: string;
    fsRoot: string;

    constructor (host: string, port: number, user: string, proto: string = 'http', fsRoot: string = 'webhdfs/v1') {
        this.host = host;
        this.port = port;
        this.user = user;
        this.proto = proto;
        this.fsRoot = fsRoot;
        
        this.hdpUrl = this.setHdpUrl();
        this.hdpCredentials = this.setHdpCredentials();
    }

    setHdpUrl(): string{
        return `${this.proto}://${this.host}:${this.port}/${this.fsRoot}`;
    }

    setHdpCredentials(): object {
        return {
            'user.name': this.user
        }
    }
}
