export interface User {
    id: number;
    usuario: string;
    email: string;
    password: string;
    access_token: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface LoginDTO {
    usuario: string;
    password: string;
}

export interface LoginResponse {
    message: string;
}
