import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // allow the auth callback/error pages through untouched
    if (pathname.startsWith("/auth/callback") || pathname.startsWith("/auth/error")) {
        return NextResponse.next();
    }

    // base response we will attach cookies to
    const res = NextResponse.next();

    // ✅ NEW API: cookies is an object with the methods
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            get(name: string) {
                return req.cookies.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
                res.cookies.set({ name, value, ...options });
            },
            remove(name: string, options: CookieOptions) {
                res.cookies.set({ name, value: "", ...options });
            },
        },
    });

    // touch the session so refreshed cookies (if any) get written to `res`
    await supabase.auth.getUser();

    return res;
}

export const config = {
    matcher: ["/((?!_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)).*)"],
};
