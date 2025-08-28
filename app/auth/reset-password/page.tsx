"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email.trim()) {
            setMessage("Please enter your email address");
            return;
        }

        setLoading(true);
        setStatus("idle");
        setMessage("");

        try {
            const response = await fetch("/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setMessage(data.message);
                setEmail("");
            } else {
                setStatus("error");
                setMessage(data.error || "Failed to send reset email");
            }
        } catch (error) {
            console.error("Reset password error:", error);
            setStatus("error");
            setMessage("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-2xl">Reset Password</CardTitle>
                    <CardDescription>
                        Enter your email address and we'll send you a link to reset your password.
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                disabled={loading}
                            />
                        </div>

                        {message && (
                            <div className={`p-3 rounded-md text-sm ${
                                status === "success" 
                                    ? "bg-green-50 text-green-800 border border-green-200" 
                                    : status === "error"
                                    ? "bg-red-50 text-red-800 border border-red-200"
                                    : "bg-blue-50 text-blue-800 border border-blue-200"
                            }`}>
                                <div className="flex items-center gap-2">
                                    {status === "success" && <CheckCircle className="h-4 w-4" />}
                                    {status === "error" && <XCircle className="h-4 w-4" />}
                                    {message}
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending Reset Email...
                                </>
                            ) : (
                                "Send Reset Email"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center space-y-3">
                        <div>
                            <Link 
                                href="/login" 
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 underline"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Login
                            </Link>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                            Remember your password?{" "}
                            <Link href="/login" className="text-blue-600 hover:text-blue-800 underline">
                                Sign in here
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
