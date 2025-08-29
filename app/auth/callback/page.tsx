"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

// Force dynamic rendering to prevent build issues
export const dynamic = 'force-dynamic';

export default function AuthCallback() {
    const supabase = createClient();
    const router = useRouter();
    const params = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Processing your confirmation...");
    const [redirecting, setRedirecting] = useState(false);
    const [debugInfo, setDebugInfo] = useState<string>("");

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Debug: Log all URL parameters
                const allParams = Object.fromEntries(params.entries());
                console.log("All URL parameters:", allParams);
                setDebugInfo(`URL params: ${JSON.stringify(allParams)}`);

                // Check for error in URL
                const error = params.get("error");
                const errorDescription = params.get("error_description");
                
                if (error) {
                    console.error("Auth error:", error, errorDescription);
                    setStatus("error");
                    setMessage(`Authentication error: ${errorDescription || error}`);
                    setDebugInfo(`Error: ${error}, Description: ${errorDescription}`);
                    return;
                }

                // Get the confirmation code - try multiple possible parameter names
                const code = params.get("code") || 
                           params.get("token_hash") || 
                           params.get("access_token") ||
                           params.get("refresh_token");
                
                if (!code) {
                    console.error("No confirmation code found in URL");
                    setStatus("error");
                    setMessage("Missing confirmation code. Please check your email link.");
                    setDebugInfo("No code found in URL parameters");
                    return;
                }

                console.log("Found confirmation code:", code.substring(0, 10) + "...");

                // For email confirmation, we need to use a different approach
                // Instead of exchangeCodeForSession, we'll try to get the user directly
                // and then create the profile if needed
                
                try {
                    // First, try to get the current user session
                    const { data: { user }, error: userError } = await supabase.auth.getUser();
                    
                    if (userError) {
                        console.error("User fetch error:", userError);
                        setStatus("error");
                        setMessage("Failed to get user information. Please try again.");
                        setDebugInfo(`User fetch error: ${userError.message}`);
                        return;
                    }

                    if (!user) {
                        console.error("No user found after confirmation");
                        setStatus("error");
                        setMessage("User not found after confirmation. Please try signing in.");
                        setDebugInfo("No user found after confirmation");
                        return;
                    }

                    console.log("User data retrieved:", user);

                    // Check if profile already exists
                    const userRole = user.user_metadata?.role;
                    if (!userRole) {
                        console.error("No user role found in metadata:", user.user_metadata);
                        setStatus("error");
                        setMessage("User role not found. Please contact support.");
                        setDebugInfo(`No role in metadata: ${JSON.stringify(user.user_metadata)}`);
                        return;
                    }

                    console.log("User role:", userRole);

                    // Check existing profiles
                    const { data: existingVolunteer, error: volunteerCheckError } = await supabase
                        .from("volunteers")
                        .select("id")
                        .eq("user_id", user.id)
                        .maybeSingle();

                    if (volunteerCheckError) {
                        console.error("Error checking volunteer profile:", volunteerCheckError);
                        setDebugInfo(`Volunteer check error: ${volunteerCheckError.message}`);
                    }

                    const { data: existingOrganizer, error: organizerCheckError } = await supabase
                        .from("organizers")
                        .select("id")
                        .eq("user_id", user.id)
                        .maybeSingle();

                    if (organizerCheckError) {
                        console.error("Error checking organizer profile:", organizerCheckError);
                        setDebugInfo(`Organizer check error: ${organizerCheckError.message}`);
                    }

                    console.log("Existing profiles:", { volunteer: existingVolunteer, organizer: existingOrganizer });

                    // Create profile if it doesn't exist
                    if (!existingVolunteer && !existingOrganizer) {
                        const metadata = user.user_metadata;
                        console.log("Creating profile for role:", userRole, "with metadata:", metadata);
                        
                        if (userRole === "volunteer") {
                            const { error: profileError } = await supabase
                                .from("volunteers")
                                .insert({
                                    user_id: user.id,
                                    first_name: metadata.first_name,
                                    last_name: metadata.last_name,
                                    sex: metadata.sex,
                                    email: user.email,
                                    country: metadata.country,
                                    phone: metadata.phone,
                                });

                            if (profileError) {
                                console.error("Volunteer profile creation error:", profileError);
                                setStatus("error");
                                setMessage("Failed to create volunteer profile. Please contact support.");
                                setDebugInfo(`Profile creation error: ${profileError.message}`);
                                return;
                            }
                            console.log("Volunteer profile created successfully");
                        } else if (userRole === "organizer") {
                            const { error: profileError } = await supabase
                                .from("organizers")
                                .insert({
                                    user_id: user.id,
                                    first_name: metadata.first_name,
                                    last_name: metadata.last_name,
                                    sex: metadata.sex,
                                    email: user.email,
                                    country: metadata.country,
                                    phone: metadata.phone,
                                    organization_name: metadata.organization_name,
                                });

                            if (profileError) {
                                console.error("Organizer profile creation error:", profileError);
                                setStatus("error");
                                setMessage("Failed to create organizer profile. Please contact support.");
                                setDebugInfo(`Profile creation error: ${profileError.message}`);
                                return;
                            }
                            console.log("Organizer profile created successfully");
                        }
                    } else {
                        console.log("Profile already exists, skipping creation");
                    }

                    // Success - redirect to appropriate dashboard
                    setStatus("success");
                    setMessage("Account confirmed successfully! Redirecting to your dashboard...");
                    setRedirecting(true);

                    // Redirect after a short delay
                    setTimeout(() => {
                        const redirectPath = userRole === "organizer" ? "/organization" : "/volunteer";
                        console.log("Redirecting to:", redirectPath);
                        router.replace(redirectPath);
                    }, 2000);

                } catch (authError) {
                    console.error("Authentication error:", authError);
                    setStatus("error");
                    setMessage("Authentication failed. Please try signing in with your email and password.");
                    setDebugInfo(`Auth error: ${authError instanceof Error ? authError.message : String(authError)}`);
                }

            } catch (error) {
                console.error("Callback error:", error);
                setStatus("error");
                setMessage("An unexpected error occurred. Please try again or contact support.");
                setDebugInfo(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
            }
        };

        handleCallback();
    }, [params, router, supabase]);

    const renderContent = () => {
        switch (status) {
            case "loading":
                return (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                        <h1 className="text-xl font-semibold text-gray-900">Confirming your account</h1>
                        <p className="text-gray-600 text-center max-w-md">{message}</p>
                    </div>
                );

            case "success":
                return (
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                        <h1 className="text-xl font-semibold text-gray-900">Account Confirmed!</h1>
                        <p className="text-gray-600 text-center max-w-md">{message}</p>
                        {redirecting && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Redirecting...
                            </div>
                        )}
                    </div>
                );

            case "error":
                return (
                    <div className="flex flex-col items-center gap-4">
                        <XCircle className="h-12 w-12 text-red-600" />
                        <h1 className="text-xl font-semibold text-gray-900">Confirmation Failed</h1>
                        <p className="text-gray-600 text-center max-w-md">{message}</p>
                        
                        {/* Debug information for development */}
                        {process.env.NODE_ENV === "development" && debugInfo && (
                            <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-700 max-w-full overflow-auto">
                                <strong>Debug Info:</strong><br />
                                {debugInfo}
                            </div>
                        )}
                        
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => router.push("/register")}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => router.push("/login")}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                            >
                                Go to Login
                            </button>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                {renderContent()}
            </div>
        </div>
    );
}
