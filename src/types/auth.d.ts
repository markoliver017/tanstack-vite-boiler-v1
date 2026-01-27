export interface AuthSession {
    userId: string;
    email: string;
    name: string;
    image?: string;
    role?: string;
    // role: string;
}
