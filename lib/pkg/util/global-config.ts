import {AuthenticationResponse} from "../models";

export default class GlobalConfig {
    private static _instance: GlobalConfig;
    private _apiKey: string;
    private _auth: AuthenticationResponse;

    get auth(): AuthenticationResponse {
        return this._auth;
    }

    set auth(value: AuthenticationResponse) {
        this._auth = value;
    }

    private constructor() {
    }

    get apiKey(): string {
        return this._apiKey;
    }

    set apiKey(value: string) {
        this._apiKey = value;
    }

    static get Instance() {
        return this._instance || (this._instance = new this());
    }
}
