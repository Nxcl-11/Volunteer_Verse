
"use client";
import { createClient } from "@/utils/supabase/client";

type Common = {
    firstName: string;
    lastName: string;
    sex: "Male" | "Female" | "Other" | "";
    country: string;
    phone: string;
    email: string;
    password: string;
};

export async function registerVolunteer(data: Common) {
    const supabase = createClient();
    return await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
                role: "volunteer",
                firstName: data.firstName,
                lastName: data.lastName,
                sex: data.sex,
                country: data.country,
                phone: data.phone,
            },
        },
    });
}

export async function registerOrganizer(
    data: Common & { organizationName: string }
) {
    const supabase = createClient();
    return await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
                role: "organizer",
                firstName: data.firstName,
                lastName: data.lastName,
                sex: data.sex,
                country: data.country,
                phone: data.phone,
                organizationName: data.organizationName,
            },
        },
    });
}

export async function resendVerification(email: string) {
    const supabase = createClient();
    return await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
}
