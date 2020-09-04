import {AuthToken, RefreshToken, User} from "../models";
import {post, postAuth, put} from '../util/http';
import config from '../util/global-config';
import {encode} from 'js-base64';

function login(email: string, password: string): Promise<User> {
    return postAuth('/users/auth', encode(email + ':' + password)).then(authResp => {
        config.Instance.auth = authResp;
        return authResp.user;
    });
}

function refreshAuth(): Promise<User> {
    return postAuth(`/users/auth?grant_type=refresh&token=${config.Instance.auth.refreshToken.id}&userId=${config.Instance.auth.user.id}`, null).then(authResp => {
        config.Instance.auth = authResp;
        return authResp.user;
    });
}

function createUser(email: string, displayName: string, password: string): Promise<User> {
    return post<User>(`/users`, {email: email, displayName: displayName, password: password});
}

function createUserAndLogin(email: string, displayName: string, password: string): Promise<User> {
    return createUser(email, displayName, password).then(() => {
        return login(email, password);
    });
}

function getUser(): User {
    return config.Instance.auth?.user;
}

function getAuthToken(): AuthToken {
    return config.Instance.auth?.authToken;
}

function getRefreshToken(): RefreshToken {
    return config.Instance.auth?.refreshToken;
}

function resendVerificationEmail(): Promise<void> {
    return post<void>(`/users/${config.Instance.auth.user.id}/sendEmail?type=verify_email`, null);
}

function resetPassword(email: string): Promise<void> {
    return post<void>(`/users/0/sendEmail?type=password_reset&email=${email}`, null, true);
}

function updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    return put<void>(`/users/${config.Instance.auth.user.id}/password`, {
        currentPassword: currentPassword,
        newPassword: newPassword
    });
}

function logout(): void {
    config.Instance.logoutFunc();
    config.Instance.auth = null;
}

function onLogout(func: Function): void {
    config.Instance.logoutFunc = func;
}

export {
    login,
    refreshAuth,
    createUser,
    createUserAndLogin,
    getUser,
    getAuthToken,
    getRefreshToken,
    resendVerificationEmail,
    resetPassword,
    updatePassword,
    logout,
    onLogout
}
