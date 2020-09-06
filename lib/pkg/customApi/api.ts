import {del, get, post, put} from "../util/http";
import {ListOptions} from "../models";

function createObject<T>(objectName: string, object: any, fields: string[] = null): Promise<T> {
    let url = `/${objectName}`;

    url = addFieldsToUrl(url, fields);

    return post<T>(url, object);
}

function getObject<T>(objectName: string, id: number, fields: string[] = null): Promise<T> {
    if (!id) {
        throw new Error('Must provide an object ID.');
    }

    let url = `/${objectName}/${id}`;

    url = addFieldsToUrl(url, fields);

    return get<T>(url);
}

function getObjects<T>(objectName: string, options: ListOptions): Promise<T[]> {
    let url = `/${objectName}`;

    url = addFieldsToUrl(url, options.fields);

    if (options.skip) {
        url += `&skip=${options.skip}`;
    }
    if (options.limit) {
        url += `&limit=${options.limit}`;
    }
    if (options.orderBy) {
        url += `&orderBy=${options.orderBy}`;
    }
    if (options.orderDir) {
        url += `&orderDir=${options.orderDir}`;
    }

    return post<T[]>(url, (options.filters && options.filters.length ? options.filters : []));
}

function updateObject<T>(objectName: string, object: any, fields: string[] = null): Promise<T> {
    if (!object['id']) {
        throw new Error('Updated object must have an ID.');
    }

    let url = `/${objectName}/${object['id']}`;

    url = addFieldsToUrl(url, fields);

    return put<T>(url, object);
}

function deleteObject(objectName: string, id: number): Promise<void> {
    if (!id) {
        throw new Error('Must provide an object ID.');
    }

    let url = `/${objectName}/${id}`;

    return del<void>(url);
}

function addFieldsToUrl(url: string, fields: string[]): string {
    let newUrl = url + '?fields=';

    if (fields && fields.length) {
        for (let i = 0; i < fields.length; i++) {
            if (fields[i]) {
                newUrl += fields[i];
                if (i !== fields.length - 1) {
                    newUrl += ',';
                }
            }
        }
    }

    return newUrl;
}

export {createObject, getObject, getObjectList, updateObject, deleteObject}
