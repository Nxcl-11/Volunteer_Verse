"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordConfirm() {
    const supabase = createClient();
    const router = useRouter();
    const params = useSearchParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Setting up password reset...");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleReset = async () => {
            try {
                // Check for error in URL
                const error = params.get("error");
                if (error) {
                    setStatus("error");
                    setMessage("Invalid or expired reset link. Please request a new one.");
                    return;
                }

                // Get the reset code
                const code = params.get("code") || params.get("token_hash");
                if (!code) {
                    setStatus("error");
                    setMessage("Missing reset code. Please check your email link.");
                    return;
                }

                // Verify the code is valid
                const { error: verifyError } = await supabase.auth.exchangeCodeForSession(code);
                if (verifyError) {
                    console.error("Code verification error:", verifyError);
                    setStatus("error");
                    setMessage("Invalid reset link. Please request a new one.");
                    return;
                }

                setStatus("loading");
                setMessage("Enter your new password");
            } catch (error) {
                console.error("Reset setup error:", error);
                setStatus("error");
                setMessage("Failed to setup password reset. Please try again.");
            }
        };

        handleReset();
    }, [params, supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            setMessage("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);
        setMessage("Updating your password...");

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) {
                console.error("Password update error:", error);
                setStatus("error");
                setMessage("Failed to update password. Please try again.");
                return;
            }

            setStatus("success");
            setMessage("Password updated successfully! Redirecting to login...");

            // Redirect to login after a delay
            setTimeout(() => {
                router.push("/login");
            }, 2000);

        } catch (error) {
            console.error("Password update error:", error);
            setStatus("error");
            setMessage("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderContent = () => {
        switch (status) {
            case "loading":
                if (message === "Setting up password reset...") {
                    return (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                            <h1 className="text-xl font-semibold text-gray-900">Setting up password reset</h1>
                            <p className="text-gray-600 text-center max-w-md">{message}</p>
                        </div>
                    );
                }

                return (
                    <div className="w-full">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                            Set New Password
                        </h1>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your new password"
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your new password"
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating Password...
                                    </>
                                ) : (
                                    "Update Password"
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link href="/login" className="text-blue-600 hover:text-blue-800 underline">
                                Back to Login
                            </Link>
                        </div>
                    </div>
                );

            case "success":
                return (
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircle className="h-12 w-12 text-green-600" />
                        <h1 className="text-xl font-semibold text-gray-900">Password Updated!</h1>
                        <p className="text-gray-600 text-center max-w-md">{message}</p>
                    </div>
                );

            case "error":
                return (
                    <div className="flex flex-col items-center gap-4">
                        <XCircle className="h-12 w-12 text-red-600" />
                        <h1 className="text-xl font-semibold text-gray-900">Reset Failed</h1>
                        <p className="text-gray-600 text-center max-w-md">{message}</p>
                        <div className="flex gap-3 mt-4">
                            <Link href="/auth/reset-password">
                                <Button variant="outline">
                                    Try Again
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button>
                                    Go to Login
                                </Button>
                            </Link>
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
