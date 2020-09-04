import {AuthToken, RefreshToken, User} from "../models";
import {postAuth} from '../util/http';
import config from '../util/global-config';
import {encode} from 'js-base64';

function login(email: string, password: string): Promise<User> {
    return postAuth('/users/auth', encode(email + ':' + password)).then(authResp => {
        config.Instance.auth = authResp;
        return authResp.user;
    });
}

function refreshAuth(): Promise<User> {
    return null;
}

function createUser(email: string, displayName: string, password: string): Promise<User> {
    return null;
}

function createUserAndLogin(email: string, displayName: string, password: string): Promise<User> {
    return null;
}

function getUser(): User {
    return null;
}

function getAuthToken(): AuthToken {
    return null;
}

function getRefreshToken(): RefreshToken {
    return null;
}

function resendVerificationEmail(): Promise<void> {
    return null;
}

function updatePassword(newPassword: string): Promise<void> {
    return null;
}

function logout(): void {

}

export {
    login,
    refreshAuth,
    createUser,
    getUser,
    getAuthToken,
    getRefreshToken,
    resendVerificationEmail,
    updatePassword,
    logout
}
