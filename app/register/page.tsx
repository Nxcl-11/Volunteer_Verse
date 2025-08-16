"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { HandHeart, User as UserIcon, Building2, Heart } from "lucide-react"

type Sex = "Male" | "Female" | "Other" | ""

interface BaseFormData {
    firstName: string
    lastName: string
    sex: Sex
    email: string
    password: string
    confirmPassword: string
    country: string
    phone: string
    agree: boolean
}

interface VolunteerFormData extends BaseFormData {}

interface OrganizerFormData extends BaseFormData {
    organizationName: string
}

const countries = [
    "", "Cambodia", "Thailand", "Vietnam", "Laos", "Singapore", "Malaysia", "Indonesia", "Philippines", "Other",
]

export default function RegisterPage() {
    const [activeTab, setActiveTab] = useState<"organizer" | "volunteer">("organizer")
    const { toast } = useToast()

    const [volunteerData, setVolunteerData] = useState<VolunteerFormData>({
        firstName: "",
        lastName: "",
        sex: "",
        email: "",
        password: "",
        confirmPassword: "",
        country: "",
        phone: "",
        agree: false,
    })

    const [organizerData, setOrganizerData] = useState<OrganizerFormData>({
        firstName: "",
        lastName: "",
        sex: "",
        email: "",
        password: "",
        confirmPassword: "",
        country: "",
        phone: "",
        organizationName: "",
        agree: false,
    })

    const onVolunteerChange = <K extends keyof VolunteerFormData>(key: K, value: VolunteerFormData[K]) =>
        setVolunteerData((p) => ({ ...p, [key]: value }))

    const onOrganizerChange = <K extends keyof OrganizerFormData>(key: K, value: OrganizerFormData[K]) =>
        setOrganizerData((p) => ({ ...p, [key]: value }))

    const validateBase = (data: BaseFormData) => {
        if (
            !data.firstName ||
            !data.lastName ||
            !data.sex ||
            !data.email ||
            !data.password ||
            !data.confirmPassword ||
            !data.country ||
            !data.phone
        ) {
            toast({ title: "Missing information", description: "Please fill in all required fields.", variant: "destructive" })
            return false
        }
        if (data.password !== data.confirmPassword) {
            toast({ title: "Password mismatch", description: "Passwords do not match.", variant: "destructive" })
            return false
        }
        if (data.password.length < 8) {
            toast({ title: "Weak password", description: "Password must be at least 8 characters.", variant: "destructive" })
            return false
        }
        if (!data.agree) {
            toast({ title: "Terms not accepted", description: "You must agree to the terms & policy.", variant: "destructive" })
            return false
        }
        return true
    }

    const handleVolunteerSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateBase(volunteerData)) return

        // submit volunteerData to API here
        console.log("Volunteer:", volunteerData)
        toast({ title: "Registration successful", description: "Welcome to VolunteerVerse!" })

        setVolunteerData({
            firstName: "",
            lastName: "",
            sex: "",
            email: "",
            password: "",
            confirmPassword: "",
            country: "",
            phone: "",
            agree: false,
        })
    }

    const handleOrganizerSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!organizerData.organizationName) {
            toast({ title: "Missing information", description: "Organization name is required.", variant: "destructive" })
            return
        }
        if (!validateBase(organizerData)) return

        // submit organizerData to API here
        console.log("Organizer:", organizerData)
        toast({ title: "Registration successful", description: "Welcome to VolunteerVerse!" })

        setOrganizerData({
            firstName: "",
            lastName: "",
            sex: "",
            email: "",
            password: "",
            confirmPassword: "",
            country: "",
            phone: "",
            organizationName: "",
            agree: false,
        })
    }

    const RoleCard = ({
                          active,
                          label,
                          accent, // "blue" | "pink"
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
        <div className="min-h-screen bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Top: Role Cards */}
                <div className="flex items-center justify-center gap-10 mb-8">
                    <RoleCard
                        active={activeTab === "organizer"}
                        label="Organizer"
                        accent="blue"
                        icon={<Building2 className="w-7 h-7 text-white" />}
                        onClick={() => setActiveTab("organizer")}
                    />
                    <RoleCard
                        active={activeTab === "volunteer"}
                        label="Volunteer"
                        accent="pink"
                        icon={<HandHeart className="w-7 h-7 text-white" />}
                        onClick={() => setActiveTab("volunteer")}
                    />
                </div>

                <Card className="w-full">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Create your account</CardTitle>
                        <CardDescription>Fill in the required details to register</CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* ORGANIZER FORM */}
                        {activeTab === "organizer" && (
                            <form onSubmit={handleOrganizerSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="orgFirstName">First Name *</Label>
                                        <Input
                                            id="orgFirstName"
                                            placeholder="Enter your First Name"
                                            value={organizerData.firstName}
                                            onChange={(e) => onOrganizerChange("firstName", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="orgLastName">Last Name *</Label>
                                        <Input
                                            id="orgLastName"
                                            placeholder="Enter your Last name"
                                            value={organizerData.lastName}
                                            onChange={(e) => onOrganizerChange("lastName", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="orgSex">Sex *</Label>
                                        <select
                                            id="orgSex"
                                            className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm"
                                            value={organizerData.sex}
                                            onChange={(e) => onOrganizerChange("sex", e.target.value as Sex)}
                                            required
                                        >
                                            <option value="">Select your gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="orgEmail">Email *</Label>
                                    <Input
                                        id="orgEmail"
                                        type="email"
                                        placeholder="Enter your Email"
                                        value={organizerData.email}
                                        onChange={(e) => onOrganizerChange("email", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="orgPassword">Password *</Label>
                                    <Input
                                        id="orgPassword"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={organizerData.password}
                                        onChange={(e) => onOrganizerChange("password", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="orgConfirmPassword">Confirm password *</Label>
                                    <Input
                                        id="orgConfirmPassword"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={organizerData.confirmPassword}
                                        onChange={(e) => onOrganizerChange("confirmPassword", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="orgCountry">Country *</Label>
                                    <select
                                        id="orgCountry"
                                        className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm"
                                        value={organizerData.country}
                                        onChange={(e) => onOrganizerChange("country", e.target.value)}
                                        required
                                    >
                                        {countries.map((c) => (
                                            <option key={c} value={c}>
                                                {c ? c : "Select your Country"}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="orgPhone">Phone Number *</Label>
                                    <Input
                                        id="orgPhone"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={organizerData.phone}
                                        onChange={(e) => onOrganizerChange("phone", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="orgName">Organization name *</Label>
                                    <Input
                                        id="orgName"
                                        placeholder="Enter your Organization name"
                                        value={organizerData.organizationName}
                                        onChange={(e) => onOrganizerChange("organizationName", e.target.value)}
                                        required
                                    />
                                </div>

                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={organizerData.agree}
                                        onChange={(e) => onOrganizerChange("agree", e.target.checked)}
                                    />
                                    I agree to the <a href="#" className="underline">terms & policy</a>
                                </label>

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-gray-900 hover:bg-black text-white font-medium rounded-md shadow-md"
                                >
                                    Agree and Register
                                </Button>
                            </form>
                        )}

                        {/* VOLUNTEER FORM */}
                        {activeTab === "volunteer" && (
                            <form onSubmit={handleVolunteerSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="volFirstName">First Name *</Label>
                                        <Input
                                            id="volFirstName"
                                            placeholder="Enter your First Name"
                                            value={volunteerData.firstName}
                                            onChange={(e) => onVolunteerChange("firstName", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="volLastName">Last Name *</Label>
                                        <Input
                                            id="volLastName"
                                            placeholder="Enter your Last name"
                                            value={volunteerData.lastName}
                                            onChange={(e) => onVolunteerChange("lastName", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="volSex">Sex *</Label>
                                        <select
                                            id="volSex"
                                            className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm"
                                            value={volunteerData.sex}
                                            onChange={(e) => onVolunteerChange("sex", e.target.value as Sex)}
                                            required
                                        >
                                            <option value="">Select your gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="volEmail">Email *</Label>
                                    <Input
                                        id="volEmail"
                                        type="email"
                                        placeholder="Enter your Email"
                                        value={volunteerData.email}
                                        onChange={(e) => onVolunteerChange("email", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="volPassword">Password *</Label>
                                    <Input
                                        id="volPassword"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={volunteerData.password}
                                        onChange={(e) => onVolunteerChange("password", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="volConfirmPassword">Confirm password *</Label>
                                    <Input
                                        id="volConfirmPassword"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={volunteerData.confirmPassword}
                                        onChange={(e) => onVolunteerChange("confirmPassword", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="volCountry">Country *</Label>
                                    <select
                                        id="volCountry"
                                        className="w-full h-10 rounded-md border border-input bg-transparent px-3 text-sm"
                                        value={volunteerData.country}
                                        onChange={(e) => onVolunteerChange("country", e.target.value)}
                                        required
                                    >
                                        {countries.map((c) => (
                                            <option key={c} value={c}>
                                                {c ? c : "Select your Country"}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="volPhone">Phone Number *</Label>
                                    <Input
                                        id="volPhone"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={volunteerData.phone}
                                        onChange={(e) => onVolunteerChange("phone", e.target.value)}
                                        required
                                    />
                                </div>

                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={volunteerData.agree}
                                        onChange={(e) => onVolunteerChange("agree", e.target.checked)}
                                    />
                                    I agree to the <a href="#" className="underline">terms & policy</a>
                                </label>

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-gray-900 hover:bg-black text-white font-medium rounded-md shadow-md"
                                >
                                    Agree and Register
                                </Button>
                            </form>
                        )}

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium underline">
                                    Sign in here
                                </a>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center text-xs text-gray-500 mt-6">
                    © 2025 VolunteerVerse. All rights reserved.
                </div>
            </div>
        </div>
    )
}
