export type UserRole = "volunteer" | "organizer"

export interface UserMetadata {
    role: UserRole
    first_name: string
    last_name: string
    sex: string
    country: string
    phone: string
    organization_name?: string
}

export interface AuthUser {
    id: string
    email: string
    user_metadata: UserMetadata
}

export interface LoginCredentials {
    email: string
    password: string
}
