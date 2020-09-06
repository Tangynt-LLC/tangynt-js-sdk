export interface AuthenticationResponse {
    user: User;
    authToken: AuthToken;
    refreshToken: RefreshToken;
}

export interface AuthToken {
    id: string;
    issuedAt: number;
    expires: number;
}

export interface RefreshToken {
    id: string;
    client: string;
    issuedTo: number;
    issuedAt: number;
    expires: number;
    deactivated: boolean;
}

export interface User {
    id: number;
    emailVerified: boolean;
    email: string;
    displayName: string;
}

export interface ErrorResponse {
    timestamp: number;
    status: number;
    error: string;
}

export interface ApiRequestFilter {
    field: string;
    operator: string;
    value: string;
}

export interface ListOptions {
    fields: string[];
    skip: number;
    limit: number;
    orderBy: string;
    orderDir: string;
    filters: ApiRequestFilter[];
}
