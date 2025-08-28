import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient();
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        // Check if user exists and needs confirmation
        const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
        
        if (userError) {
            console.error("User lookup error:", userError);
            return NextResponse.json(
                { error: "Failed to check user status" },
                { status: 500 }
            );
        }

        const user = users?.find(u => u.email === email);
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        if (user.email_confirmed_at) {
            return NextResponse.json(
                { error: "Email is already confirmed" },
                { status: 400 }
            );
        }

        const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

        // Resend verification email
        const { error: resendError } = await supabase.auth.resend({
            type: "signup",
            email,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
            },
        });

        if (resendError) {
            console.error("Resend error:", resendError);
            return NextResponse.json(
                { error: resendError.message },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Verification email sent successfully. Please check your inbox.",
        });

    } catch (error) {
        console.error("Resend verification error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
