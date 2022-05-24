"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HdpConfig = void 0;
class HdpConfig {
    constructor(host, port, user, proto = 'http', fsRoot = 'webhdfs/v1') {
        this.host = host;
        this.port = port;
        this.user = user;
        this.proto = proto;
        this.fsRoot = fsRoot;
        this.hdpUrl = this.setHdpUrl();
        this.hdpCredentials = this.setHdpCredentials();
    }
    setHdpUrl() {
        return `${this.proto}://${this.host}:${this.port}/${this.fsRoot}`;
    }
    setHdpCredentials() {
        return {
            'user.name': this.user
        };
    }
}
exports.HdpConfig = HdpConfig;
