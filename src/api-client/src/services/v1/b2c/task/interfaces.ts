export interface AuthResponse {
    id: number;
    token: string;
}

export interface SignInParams {
    invitation_id: string;
}

export interface SignUpParams extends SignInParams {
    email: string;
}
