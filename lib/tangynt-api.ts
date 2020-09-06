import config from "./pkg/util/global-config";

export function initApp(apiKey: string): void {
    config.Instance.apiKey = apiKey;
}

export * from './pkg/auth/auth.functions';
export * from './pkg/customApi/api';
