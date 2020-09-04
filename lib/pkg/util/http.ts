import {AuthenticationResponse, ErrorResponse} from "../models";
import config from './global-config';
import fetch from "node-fetch";

const tangyntApiUrl: string = 'https://api.tangynt.com/api/v1';

function constructOptions(method: string, body: any = null, isAuth: boolean = false) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Tangynt-Api-Key': config.Instance.apiKey
        },
        body: body != null ? JSON.stringify(body) : null
    };

    // TODO Add functionality to grab a current auth token and add it in the header

    return options;
}

function post<T>(url: string, body: any): Promise<T> {
    return http<T>(url, constructOptions('POST', body));
}

function postAuth(url: string, base64Creds: string): Promise<AuthenticationResponse> {
    const options: any = constructOptions('POST', null, true);
    options.headers['Authorization'] = 'Basic ' + base64Creds;

    return http<AuthenticationResponse>(url, options);
}

function get<T>(url: string): Promise<T> {
    return http<T>(url, constructOptions('GET'));
}

function put<T>(url: string, body: any): Promise<T> {
    return http<T>(url, constructOptions('PUT', body));
}

function del<T>(url: string): Promise<T> {
    return http<T>(url, constructOptions('DELETE'));
}

async function http<T>(url: string, options: any): Promise<T> {
    return (await fetch(tangyntApiUrl + url, options)).json().then(resp => {
        if (isErrorResponse(resp)) {
            throw resp;
        }

        return resp;
    });
}

function isErrorResponse(object: any): object is ErrorResponse {
    return object.keys.length == 3 && 'timestamp' in object && 'status' in object && 'error' in object;
}

export {post, postAuth, get, put, del}
