"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Building2, HandHeart } from "lucide-react"

type Role = "Organizer" | "Volunteer"

export default function LoginPage() {
    const router = useRouter()
    const [role, setRole] = useState<Role>("Volunteer")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // TODO: call your auth API here
            if (role === "Organizer") {
                router.push("/organization")
            } else {
                router.push("/volunteer")
            }
        } finally {
            setLoading(false)
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
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs text-gray-600 hover:text-gray-900"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-gray-900 hover:bg-black text-white"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
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
