"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Building2, HandHeart, Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { UserRole } from "@/types/auth"

// Force dynamic rendering to prevent build issues
export const dynamic = 'force-dynamic';

type Role = "Organizer" | "Volunteer"

export default function LoginPage() {
    const router = useRouter()
    const { toast } = useToast()
    const supabase = useMemo(() => createClient(), [])
    
    const [role, setRole] = useState<Role>("Volunteer")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    // Users must manually log in - no automatic authentication check

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Basic validation
        if (!email || !password) {
            toast({
                title: "Missing information",
                description: "Please fill in all required fields.",
                variant: "destructive",
            })
            return
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            toast({
                title: "Invalid email",
                description: "Please enter a valid email address.",
                variant: "destructive",
            })
            return
        }

        setLoading(true)

        try {
            // Sign in with Supabase
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                throw error
            }

            if (data.user) {
                // Check if email is confirmed
                if (!data.user.email_confirmed_at) {
                    toast({
                        title: "Email not confirmed",
                        description: "Please check your email and confirm your account before logging in.",
                        variant: "destructive",
                    })
                    return
                }
                
                // Verify the user exists and has a valid profile
                const userRole = data.user.user_metadata?.role as UserRole
                console.log("Login - User role from metadata:", userRole)
                
                if (userRole === "organizer") {
                    // Debug: Log user information
                    console.log("Login - Checking organizer profile for user:", {
                        userId: data.user.id,
                        userEmail: data.user.email,
                        userMetadata: data.user.user_metadata
                    })
                    
                    // Verify organizer profile exists in database
                    const { data: organizerProfile, error: orgError } = await supabase
                        .from("organizers")
                        .select("id, first_name, last_name")
                        .eq("user_id", data.user.id)
                        .single()
                    
                    console.log("Login - Organizer profile query result:", {
                        profile: organizerProfile,
                        error: orgError,
                        errorDetails: orgError ? {
                            message: orgError.message,
                            details: orgError.details,
                            hint: orgError.hint,
                            code: orgError.code
                        } : null
                    })
                    
                    if (orgError || !organizerProfile) {
                        console.error("Organizer profile not found:", orgError)
                        
                        // Try to find any profiles for this user
                        const { data: allProfiles, error: profileError } = await supabase
                            .from("organizers")
                            .select("id, user_id, first_name, last_name")
                            .eq("user_id", data.user.id)
                        
                        console.log("Login - All organizer profiles for user:", {
                            profiles: allProfiles,
                            error: profileError
                        })
                        
                        toast({
                            title: "Profile not found",
                            description: "Organizer profile not found. Please contact support.",
                            variant: "destructive",
                        })
                        return
                    }
                    
                    console.log("Login - Organizer profile verified:", organizerProfile)
                    toast({
                        title: "Login successful",
                        description: `Welcome back, ${organizerProfile.first_name}!`,
                    })
                    router.push("/organization")
                    
                } else if (userRole === "volunteer") {
                    // Debug: Log user information
                    console.log("Login - Checking volunteer profile for user:", {
                        userId: data.user.id,
                        userEmail: data.user.email,
                        userMetadata: data.user.user_metadata
                    })
                    
                    // Verify volunteer profile exists in database
                    const { data: volunteerProfile, error: volError } = await supabase
                        .from("volunteers")
                        .select("id, first_name, last_name")
                        .eq("user_id", data.user.id)
                        .single()
                    
                    console.log("Login - Volunteer profile query result:", {
                        profile: volunteerProfile,
                        error: volError,
                        errorDetails: volError ? {
                            message: volError.message,
                            details: volError.details,
                            hint: volError.hint,
                            code: volError.code
                        } : null
                    })
                    
                    if (volError || !volunteerProfile) {
                        console.error("Volunteer profile not found:", volError)
                        
                        // Try to find any profiles for this user
                        const { data: allProfiles, error: profileError } = await supabase
                            .from("volunteers")
                            .select("id, user_id, first_name, last_name")
                            .eq("user_id", data.user.id)
                        
                        console.log("Login - All volunteer profiles for user:", {
                            profiles: allProfiles,
                            error: profileError
                        })
                        
                        toast({
                            title: "Profile not found",
                            description: "Volunteer profile not found. Please contact support.",
                            variant: "destructive",
                        })
                        return
                    }
                    
                    console.log("Login - Volunteer profile verified:", volunteerProfile)
                    toast({
                        title: "Login successful",
                        description: `Welcome back, ${volunteerProfile.first_name}!`,
                    })
                    router.push("/volunteer")
                    
                } else {
                    // No role stored in metadata - this shouldn't happen for registered users
                    console.error("No role found in user metadata")
                    toast({
                        title: "Account error",
                        description: "Your account role is not set. Please contact support.",
                        variant: "destructive",
                    })
                    return
                }
            }
        } catch (error: any) {
            console.error("Login error:", error)
            
            // Handle specific error cases
            let errorMessage = "Invalid email or password. Please try again."
            if (error.message?.includes("Invalid login credentials")) {
                errorMessage = "Invalid email or password. Please check your credentials and try again."
            } else if (error.message?.includes("Email not confirmed")) {
                errorMessage = "Please check your email and confirm your account before logging in."
            } else if (error.message) {
                errorMessage = error.message
            }
            
            toast({
                title: "Login failed",
                description: errorMessage,
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleForgotPassword = async () => {
        if (!email) {
            toast({
                title: "Email required",
                description: "Please enter your email address first.",
                variant: "destructive",
            })
            return
        }

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
                toast({
                    title: "Password Reset Email Sent",
                    description: data.message,
                });
            } else {
                toast({
                    title: "Password Reset Failed",
                    description: data.error || "Failed to send reset email. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Password reset error:", error);
            toast({
                title: "Password Reset Failed",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive",
            });
        }
    }

    const debugDatabase = async () => {
        try {
            console.log("=== DATABASE DEBUG INFO ===")
            
            // Check if tables exist and their structure
            const { data: organizers, error: orgError } = await supabase
                .from("organizers")
                .select("*")
                .limit(1)
            
            console.log("Organizers table check:", { data: organizers, error: orgError })
            
            const { data: volunteers, error: volError } = await supabase
                .from("volunteers")
                .select("*")
                .limit(1)
            
            console.log("Volunteers table check:", { data: volunteers, error: volError })
            
            // Check current user session
            const { data: { session } } = await supabase.auth.getSession()
            console.log("Current session:", session)
            
            if (session?.user) {
                console.log("Current user metadata:", session.user.user_metadata)
                
                // Try to find any profiles for current user
                const { data: orgProfiles } = await supabase
                    .from("organizers")
                    .select("*")
                    .eq("user_id", session.user.id)
                
                const { data: volProfiles } = await supabase
                    .from("volunteers")
                    .select("*")
                    .eq("user_id", session.user.id)
                
                console.log("Current user profiles:", {
                    organizers: orgProfiles,
                    volunteers: volProfiles
                })
            }
            
            console.log("=== END DEBUG INFO ===")
            
            toast({
                title: "Debug info logged",
                description: "Check console for database structure information.",
            })
        } catch (error) {
            console.error("Debug error:", error)
            toast({
                title: "Debug failed",
                description: "Check console for error details.",
                variant: "destructive",
            })
        }
    }



    const RoleCard = ({
                          active,
                          label,
                          accent,
                          icon,
                          onClick,
                      }: {
        active: boolean
        label: "Organizer" | "Volunteer"
        accent: "blue" | "pink"
        icon: React.ReactNode
        onClick: () => void
    }) => {
        const isBlue = accent === "blue"
        return (
            <button
                type="button"
                onClick={onClick}
                className={`w-40 h-40 rounded-2xl shadow-md border transition-all duration-200
        flex flex-col items-center justify-center gap-3
        ${active ? "bg-white" : "bg-gray-100"}
        ${active ? "shadow-lg" : "shadow"}
        hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`}
            >
                <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center
          ${active ? (isBlue ? "bg-blue-600" : "bg-pink-500") : "bg-gray-300"}`}
                >
                    {icon}
                </div>
                <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full
          ${active ? (isBlue ? "bg-blue-50 text-blue-700" : "bg-pink-50 text-pink-700") : "bg-gray-200 text-gray-600"}`}
                >
          {label}
        </span>
            </button>
        )
    }

    // No need for authentication checking loading state

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Logo */}
            <div className="px-4 sm:px-8 pt-4">
                <Link href="/" className="inline-flex items-center gap-2">
                    <div className="w-12 h-12 overflow-hidden flex items-center justify-center">
                        <img
                            src="/SL-091823-63290-21.jpg"
                            alt="VolunteerVerse Logo"
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <span className="font-bold text-lg text-gray-900">VOLUNTEERVERSE</span>
                </Link>
            </div>

            {/* Main */}
            <main className="flex-1 grid grid-cols-1 lg:grid-cols-2">
                {/* Left: Form */}
                <section className="flex items-center justify-center py-10">
                    <div className="w-full max-w-md px-6">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Login</h1>

                        {/* Role Switch (like Register page) */}
                        <div className="flex items-center justify-center gap-10 mb-8">
                            <RoleCard
                                active={role === "Organizer"}
                                label="Organizer"
                                accent="blue"
                                icon={<Building2 className="w-7 h-7 text-white" />}
                                onClick={() => setRole("Organizer")}
                            />
                            <RoleCard
                                active={role === "Volunteer"}
                                label="Volunteer"
                                accent="pink"
                                icon={<HandHeart className="w-7 h-7 text-white" />}
                                onClick={() => setRole("Volunteer")}
                            />
                        </div>
                        
                        <p className="text-xs text-gray-500 text-center mb-6">
                            Select your role to help us personalize your experience. 
                            Your actual role will be determined from your account.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-11"
                                />
                            </div>

                            {/* Password with show/hide */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-11 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((s) => !s)}
                                        className="absolute inset-y-0 right-0 px-3 flex items-center"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5 text-gray-500" />
                                        ) : (
                                            <Eye className="w-5 h-5 text-gray-500" />
                                        )}
                                    </button>
                                </div>
                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className="text-xs text-gray-600 hover:text-gray-900 underline underline-offset-4"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-gray-900 hover:bg-black text-white"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Logging in...
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </Button>
                        </form>

                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600">
                                <Link
                                    href="/register"
                                    className="underline underline-offset-4 hover:text-gray-900"
                                >
                                    Create account
                                </Link>
                            </p>
                            
                        </div>
                    </div>
                </section>

                {/* Right: Hero Image */}
                <section className="relative hidden lg:block">
                    <Image
                        src="/hands-globe-plant.png"
                        alt="Welcome to VolunteerVerse"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="relative z-10 h-full w-full flex items-center justify-center text-center px-10">
                        <div>
                            <h2 className="text-white text-3xl font-semibold mb-2">
                                Welcome to the VolunteerVerse where change begins
                            </h2>
                            <p className="text-white/90">Your actions make our world better</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full border-t bg-white">
                <div className="max-w-7xl mx-auto px-6 py-3 text-center text-xs text-gray-600">
                    © 2025 VolunteerVerse. All rights reserved.
                </div>
            </footer>
        </div>
    )
}
