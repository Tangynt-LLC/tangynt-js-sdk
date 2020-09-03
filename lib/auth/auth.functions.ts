import {Config} from "../config";

export function authUser(email: string, password: string): void {
    console.log(Config.Instance.apiKey);
    console.log(email);
    console.log(password);
}
