export interface RegistrationRequest {
    name: string;
    email: string;
    invite_id: string;
}

export interface RegistrationResponse {
    user_id: string;
    token: string;
}
