import {AuthenticationResponse, ErrorResponse, File} from "../models";
import config from './global-config';
import f, {Blob} from "node-fetch";
import {refreshAuth} from "../auth/auth.functions";

const tangyntApiUrl: string = 'https://api.tangynt.com/api/v1';

function constructOptions(method: string, body: any = null, excludeAuth: boolean = false): Promise<any> {
    const options: any = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Tangynt-Api-Key': config.Instance.apiKey
        },
        body: body != null ? JSON.stringify(body) : null
    };

    const authToken = config.Instance.auth?.authToken;
    if (!excludeAuth && authToken) {
        if (authToken.expires > new Date().getTime()) {
            options.headers['Authorization'] = 'Bearer ' + authToken.id;
        } else {
            const refreshToken = config.Instance.auth.refreshToken;
            if (refreshToken && refreshToken.expires > new Date().getTime()) {
                return refreshAuth().then(() => {
                    options.headers['Authorization'] = 'Bearer ' + config.Instance.auth.authToken.id
                    return Promise.resolve(options);
                });
            }
        }
    }

    return Promise.resolve(options);
}

function post<T>(url: string, body: any, excludeAuth: boolean = false): Promise<T> {
    return constructOptions('POST', body, excludeAuth).then(options => {
        return http<T>(url, options);
    });
}

function postFile(url: string, body: any, excludeAuth: boolean = false): Promise<File> {
    return constructOptions('POST', body, excludeAuth).then(options => {
        options.headers['Content-Type'] = 'multipart/form-data';
        return http<File>(url, options);
    });
}

function postAuth(url: string, base64Creds: string): Promise<AuthenticationResponse> {
    return constructOptions('POST', null, true).then(options => {
        if (base64Creds) {
            options.headers['Authorization'] = 'Basic ' + base64Creds;
        }

        return http<AuthenticationResponse>(url, options);
    });
}

function get<T>(url: string): Promise<T> {
    return constructOptions('GET').then(options => {
        return http<T>(url, options);
    });

}


function getFile(url: string): Promise<Blob> {
    return constructOptions('GET').then(options => {
        return httpBlob(url, options);
    });

}

function put<T>(url: string, body: any): Promise<T> {
    return constructOptions('PUT', body).then(options => {
        return http<T>(url, options);
    });
}

function putFile(url: string, body: any): Promise<File> {
    return constructOptions('PUT', body).then(options => {
        options.headers['Content-Type'] = 'multipart/form-data';
        return http<File>(url, options);
    });
}

function del<T>(url: string): Promise<T> {
    return constructOptions('DELETE').then(options => {
        return http<T>(url, options);
    });
}

async function http<T>(url: string, options: any): Promise<T> {
    return (await f(tangyntApiUrl + url, options)).json().then(resp => {
        if (isErrorResponse(resp)) {
            throw resp;
        }

        return resp;
    }).catch(err => {
        if (err.type == 'invalid-json') {

        } else {
            throw err;
        }
    });
}

async function httpBlob(url: string, options: any): Promise<Blob> {
    return (await f(tangyntApiUrl + url, options)).blob();
}

function isErrorResponse(object: any): object is ErrorResponse {
    return object && Object.keys(object).length == 3 && 'timestamp' in object && 'status' in object && 'error' in object;
}

export {post, postFile, postAuth, get, getFile, put, putFile, del}
