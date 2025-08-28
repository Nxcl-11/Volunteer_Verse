"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AuthCallback() {
    const supabase = createClient();
    const router = useRouter();
    const params = useSearchParams();
    const [msg, setMsg] = useState("Finishing sign-in...");

    useEffect(() => {
        const run = async () => {
            // 1) If Supabase already put an error in the URL, show it
            const err = params.get("error");
            if (err) {
                setMsg("Link invalid or expired. Please request a new email.");
                return;
            }

            // 2) Consume Supabase magic/verify link
            // Supabase sends ?code=... (modern) or sometimes ?token_hash=... (older)
            const code = params.get("code") ?? params.get("token_hash");
            if (code) {
                const { error } = await supabase.auth.exchangeCodeForSession(code);
                if (error) {
                    setMsg("Could not finish sign-in. Please request a new link.");
                    return;
                }
            }

            // 3) Get the user (now that the session should exist)
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setMsg("No session found. Please try again.");
                return;
            }

            // 4) Create profile row if missing (note: your metadata is camelCase)
            const { data: vol } = await supabase
                .from("volunteers").select("id").eq("user_id", user.id).maybeSingle();
            const { data: org } = await supabase
                .from("organizers").select("id").eq("user_id", user.id).maybeSingle();

            if (!vol && !org) {
                const m = user.user_metadata || {};
                if (m.role === "volunteer") {
                    await supabase.from("volunteers").insert({
                        user_id: user.id,
                        first_name: m.firstName,
                        last_name: m.lastName,
                        sex: m.sex,
                        email: user.email,
                        country: m.country,
                        phone: m.phone,
                    });
                } else {
                    await supabase.from("organizers").insert({
                        user_id: user.id,
                        first_name: m.firstName,
                        last_name: m.lastName,
                        sex: m.sex,
                        email: user.email,
                        country: m.country,
                        phone: m.phone,
                        organization_name: m.organizationName,
                    });
                }
            }

            setMsg("Redirecting...");
            router.replace(user.user_metadata?.role === "organizer" ? "/organization" : "/volunteer");
        };

        run();
    }, [params, router, supabase]);

    return <div className="p-8 text-center">{msg}</div>;
}
