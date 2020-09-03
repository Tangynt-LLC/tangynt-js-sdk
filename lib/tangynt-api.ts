import {Config} from "./config";

export function initApp(apiKey: string): void {
    Config.Instance.apiKey = apiKey;
}

export * from './auth/auth.functions';
