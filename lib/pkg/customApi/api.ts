import {del, get, getFile, post, postFile, put, putFile} from "../util/http";
import {File, ListOptions} from "../models";

function createObject<T>(objectName: string, object: any, fields: string[] = null): Promise<T> {
    let url = `/${objectName}`;

    url = addFieldsToUrl(url, fields);

    return post<T>(url, object);
}

function uploadFile(fileData: Blob, object: any, fields: string[] = null): Promise<File> {
    let url = `/files`;

    url = addFieldsToUrl(url, fields);

    const formData = new FormData();
    formData.append('file', fileData);
    formData.append('object', object);

    return postFile(url, formData);
}

function getObject<T>(objectName: string, id: number, fields: string[] = null): Promise<T> {
    if (!id) {
        throw new Error('Must provide an object ID.');
    }

    let url = `/${objectName}/${id}`;

    url = addFieldsToUrl(url, fields);

    return get<T>(url);
}

function downloadFile(fileId: number): Promise<Blob> {
    return getFile(`/files/${fileId}`).then(blob => {
        return <Blob>blob;
    });
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

function getFiles(options: ListOptions): Promise<File[]> {
    return getObjects<File>('files', options);
}

function updateObject<T>(objectName: string, object: any, fields: string[] = null): Promise<T> {
    if (!object['id']) {
        throw new Error('Updated object must have an ID.');
    }

    let url = `/${objectName}/${object['id']}`;

    url = addFieldsToUrl(url, fields);

    return put<T>(url, object);
}

function updateFile(fileData: Blob, object: any, fields: string[] = null): Promise<File> {
    if (!object['id']) {
        throw new Error('Updated object must have an ID.');
    }

    let url = `/files/${object['id']}`;

    url = addFieldsToUrl(url, fields);

    const formData = new FormData();
    formData.append('file', fileData);
    formData.append('object', object);

    return putFile(url, formData);
}


function deleteObject(objectName: string, id: number): Promise<void> {
    if (!id) {
        throw new Error('Must provide an object ID.');
    }

    let url = `/${objectName}/${id}`;

    return del<void>(url);
}

function deleteFile(fileId: number): Promise<void> {
    return deleteObject('files', fileId);
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

export {
    createObject,
    uploadFile,
    getObject,
    getFile,
    getObjects,
    getFiles,
    updateObject,
    updateFile,
    deleteObject,
    deleteFile
}
