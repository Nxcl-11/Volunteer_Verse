import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient();
        const body = await request.json();
        const { role, ...userData } = body;

        // Validate required fields
        if (!role || !userData.email || !userData.password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Validate role
        if (!["volunteer", "organizer"].includes(role)) {
            return NextResponse.json(
                { error: "Invalid role specified" },
                { status: 400 }
            );
        }

        // Validate organizer has organization name
        if (role === "organizer" && !userData.organizationName) {
            return NextResponse.json(
                { error: "Organization name is required for organizers" },
                { status: 400 }
            );
        }

        const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

        // Create user account
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
                data: {
                    role,
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                    sex: userData.sex,
                    country: userData.country,
                    phone: userData.phone,
                    ...(role === "organizer" ? { organization_name: userData.organizationName } : {}),
                },
            },
        });

        if (authError) {
            console.error("Auth signup error:", authError);
            return NextResponse.json(
                { error: authError.message },
                { status: 400 }
            );
        }

        if (!authData.user) {
            return NextResponse.json(
                { error: "Failed to create user account" },
                { status: 500 }
            );
        }

        // Check if email confirmation is required
        if (!authData.session) {
            return NextResponse.json({
                success: true,
                message: "Please check your email to confirm your account",
                requiresConfirmation: true,
                user: authData.user,
            });
        }

        // If auto-confirm is enabled, create profile immediately
        try {
            if (role === "volunteer") {
                const { error: profileError } = await supabase
                    .from("volunteers")
                    .insert({
                        user_id: authData.user.id,
                        first_name: userData.firstName,
                        last_name: userData.lastName,
                        sex: userData.sex,
                        email: userData.email,
                        country: userData.country,
                        phone: userData.phone,
                    });

                if (profileError) {
                    console.error("Volunteer profile creation error:", profileError);
                    return NextResponse.json(
                        { error: "Failed to create volunteer profile" },
                        { status: 500 }
                    );
                }
            } else {
                const { error: profileError } = await supabase
                    .from("organizers")
                    .insert({
                        user_id: authData.user.id,
                        first_name: userData.firstName,
                        last_name: userData.lastName,
                        sex: userData.sex,
                        email: userData.email,
                        country: userData.country,
                        phone: userData.phone,
                        organization_name: userData.organizationName,
                    });

                if (profileError) {
                    console.error("Organizer profile creation error:", profileError);
                    return NextResponse.json(
                        { error: "Failed to create organizer profile" },
                        { status: 500 }
                    );
                }
            }

            return NextResponse.json({
                success: true,
                message: "Account created successfully",
                requiresConfirmation: false,
                user: authData.user,
                session: authData.session,
            });
        } catch (profileError) {
            console.error("Profile creation error:", profileError);
            return NextResponse.json(
                { error: "Failed to create user profile" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Registration API error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
