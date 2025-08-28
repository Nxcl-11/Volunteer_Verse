// app/register/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HandHeart, Building2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";

type Sex = "Male" | "Female" | "Other" | "";

interface BaseFormData {
    firstName: string;
    lastName: string;
    sex: Sex;
    email: string;
    password: string;
    confirmPassword: string;
    country: string;
    phone: string;
    agree: boolean;
}

interface VolunteerFormData extends BaseFormData {}
interface OrganizerFormData extends BaseFormData {
    organizationName: string;
}

const countries = [
    "", "Cambodia", "Thailand", "Vietnam", "Laos", "Singapore", "Malaysia", "Indonesia", "Philippines", "Other",
];

const PasswordInput = ({
                           id,
                           value,
                           onChange,
                           placeholder,
                           show,
                           setShow,
                       }: {
    id: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    show: boolean;
    setShow: (v: boolean) => void;
}) => (
    <div className="relative">
        <Input
            id={id}
            type={show ? "text" : "password"}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoComplete="new-password"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            required
        />
        <button
            type="button"
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShow(!show)}
        >
            {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
    </div>
);

const RoleCard = ({
                      active,
                      label,
                      accent,
                      icon,
                      onClick,
                  }: {
    active: boolean;
    label: "Organizer" | "Volunteer";
    accent: "blue" | "pink";
    icon: React.ReactNode;
    onClick: () => void;
}) => {
    const isBlue = accent === "blue";
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
    );
};

export default function RegisterPage() {
    const supabase = useMemo(() => createClient(), []);
    const { toast } = useToast();

    const [activeTab, setActiveTab] = useState<"organizer" | "volunteer">("organizer");
    const [submitting, setSubmitting] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

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
    });

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
    });

    const onVolunteerChange = <K extends keyof VolunteerFormData>(key: K, value: VolunteerFormData[K]) =>
        setVolunteerData((p) => ({ ...p, [key]: value }));

    const onOrganizerChange = <K extends keyof OrganizerFormData>(key: K, value: OrganizerFormData[K]) =>
        setOrganizerData((p) => ({ ...p, [key]: value }));

    const validateBase = (data: BaseFormData) => {
        console.log("Validating data:", data);
        
        if (
            !data.firstName || !data.lastName || !data.sex || !data.email ||
            !data.password || !data.confirmPassword || !data.country || !data.phone
        ) {
            console.log("Missing required fields:", {
                firstName: !!data.firstName,
                lastName: !!data.lastName,
                sex: !!data.sex,
                email: !!data.email,
                password: !!data.password,
                confirmPassword: !!data.confirmPassword,
                country: !!data.country,
                phone: !!data.phone
            });
            toast({ title: "Missing information", description: "Please fill in all required fields.", variant: "destructive" });
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(data.email)) {
            console.log("Invalid email format:", data.email);
            toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
            return false;
        }
        if (data.password !== data.confirmPassword) {
            console.log("Password mismatch");
            toast({ title: "Password mismatch", description: "Passwords do not match.", variant: "destructive" });
            return false;
        }
        if (data.password.length < 8) {
            console.log("Password too short:", data.password.length);
            toast({ title: "Weak password", description: "Password must be at least 8 characters.", variant: "destructive" });
            return false;
        }
        if (!data.agree) {
            console.log("Terms not agreed to");
            toast({ title: "Terms not accepted", description: "You must agree to the terms & policy.", variant: "destructive" });
            return false;
        }
        
        console.log("Validation passed");
        return true;
    };

    const signupUser = async (
        role: "volunteer" | "organizer",
        payload: VolunteerFormData | OrganizerFormData
    ) => {
        console.log("signupUser called with role:", role, "payload:", payload);
        setSubmitting(true);
        try {
            const origin = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL;
            console.log("Origin:", origin);

            // Sign up the user with Supabase
            console.log("Calling supabase.auth.signUp...");
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: payload.email,
                password: payload.password,
                options: {
                    emailRedirectTo: `${origin}/auth/callback`,
                    data: {
                        role,
                        first_name: payload.firstName,
                        last_name: payload.lastName,
                        sex: payload.sex,
                        country: payload.country,
                        phone: payload.phone,
                        ...(role === "organizer"
                            ? { organization_name: (payload as OrganizerFormData).organizationName }
                            : {}),
                    },
                },
            });

            console.log("SignUp response:", { data, error: signUpError });

            if (signUpError) {
                throw signUpError;
            }

            // For email confirmation flow, we don't create the profile immediately
            // The profile will be created when the user clicks the confirmation link
            if (data.user) {
                console.log("User created successfully, email confirmation sent");
                toast({
                    title: "Check your email",
                    description: "We sent a confirmation link. Click it to activate your account, then sign in.",
                });
            } else {
                throw new Error("Failed to create user");
            }

        } catch (err: any) {
            console.error("Registration error:", err);
            
            // Handle specific Supabase errors
            if (err.message?.includes("User already registered")) {
                toast({
                    title: "Email already exists",
                    description: "This email is already registered. Please try signing in instead.",
                    variant: "destructive",
                });
            } else if (err.message?.includes("Password should be at least")) {
                toast({
                    title: "Password too weak",
                    description: "Password must be at least 6 characters long.",
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Registration failed",
                    description: err?.message ?? "Something went wrong. Please try again.",
                    variant: "destructive",
                });
            }
        } finally {
            console.log("Setting submitting to false");
            setSubmitting(false);
        }
    };

    const handleVolunteerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Volunteer form submitted", volunteerData);
        
        if (!validateBase(volunteerData)) {
            console.log("Volunteer validation failed");
            return;
        }
        
        console.log("Volunteer validation passed, calling signupUser");
        try {
            await signupUser("volunteer", volunteerData);
            console.log("signupUser completed successfully");
        } catch (error) {
            console.error("Error in handleVolunteerSubmit:", error);
        }
    };

    const handleOrganizerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Organizer form submitted", organizerData);
        
        if (!organizerData.organizationName) {
            console.log("Organization name missing");
            toast({ title: "Missing information", description: "Organization name is required.", variant: "destructive" });
            return;
        }
        
        console.log("Organization name check passed:", organizerData.organizationName);
        
        if (!validateBase(organizerData)) {
            console.log("Organizer validation failed");
            return;
        }
        
        console.log("Organizer validation passed, calling signupUser");
        try {
            await signupUser("organizer", organizerData);
            console.log("signupUser completed successfully");
        } catch (error) {
            console.error("Error in handleOrganizerSubmit:", error);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Top Left Logo */}
            <div className="px-6 pt-4">
                <Link href="/" className="inline-flex items-center">
                    <img
                        src="/SL-091823-63290-21.jpg"
                        alt="VolunteerVerse Logo"
                        className="w-20 h-20 object-contain cursor-pointer"
                    />
                </Link>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Role Cards */}
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
                            <form onSubmit={handleOrganizerSubmit} className="space-y-5" noValidate>
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
                                        inputMode="email"
                                        placeholder="Enter your Email"
                                        value={organizerData.email}
                                        onChange={(e) => onOrganizerChange("email", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="orgPassword">Password *</Label>
                                    <PasswordInput
                                        id="orgPassword"
                                        value={organizerData.password}
                                        onChange={(v) => onOrganizerChange("password", v)}
                                        placeholder="Enter your password"
                                        show={showPass}
                                        setShow={setShowPass}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="orgConfirmPassword">Confirm password *</Label>
                                    <PasswordInput
                                        id="orgConfirmPassword"
                                        value={organizerData.confirmPassword}
                                        onChange={(v) => onOrganizerChange("confirmPassword", v)}
                                        placeholder="Re-enter your password"
                                        show={showConfirm}
                                        setShow={setShowConfirm}
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
                                        inputMode="tel"
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

                                {/* Test button to see if basic functionality works */}
                                <Button
                                    type="button"
                                    onClick={() => {
                                        console.log("Test button clicked");
                                        console.log("Current organizer data:", organizerData);
                                        console.log("Form validation result:", validateBase(organizerData));
                                        
                                        // Test toast functionality
                                        toast({
                                            title: "Test Toast",
                                            description: "This is a test toast to verify the system is working.",
                                        });
                                    }}
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md"
                                >
                                    Test Form Data & Toast
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    onClick={() => console.log("Submit button clicked for organizer")}
                                    className="w-full h-12 bg-gray-900 hover:bg-black text-white font-medium rounded-md shadow-md disabled:opacity-60"
                                >
                                    {submitting ? (
                                        <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Registering…
                  </span>
                                    ) : (
                                        "Agree and Register"
                                    )}
                                </Button>
                            </form>
                        )}

                        {/* VOLUNTEER FORM */}
                        {activeTab === "volunteer" && (
                            <form onSubmit={handleVolunteerSubmit} className="space-y-5" noValidate>
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
                                        inputMode="email"
                                        placeholder="Enter your Email"
                                        value={volunteerData.email}
                                        onChange={(e) => onVolunteerChange("email", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="volPassword">Password *</Label>
                                    <PasswordInput
                                        id="volPassword"
                                        value={volunteerData.password}
                                        onChange={(v) => onVolunteerChange("password", v)}
                                        placeholder="Enter your password"
                                        show={showPass}
                                        setShow={setShowPass}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="volConfirmPassword">Confirm password *</Label>
                                    <PasswordInput
                                        id="volConfirmPassword"
                                        value={volunteerData.confirmPassword}
                                        onChange={(v) => onVolunteerChange("confirmPassword", v)}
                                        placeholder="Re-enter your password"
                                        show={showConfirm}
                                        setShow={setShowConfirm}
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
                                        inputMode="tel"
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

                                {/* Test button to see if basic functionality works */}
                                <Button
                                    type="button"
                                    onClick={() => {
                                        console.log("Test button clicked");
                                        console.log("Current volunteer data:", volunteerData);
                                        console.log("Form validation result:", validateBase(volunteerData));
                                        
                                        // Test toast functionality
                                        toast({
                                            title: "Test Toast",
                                            description: "This is a test toast to verify the system is working.",
                                        });
                                    }}
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md"
                                >
                                    Test Form Data & Toast
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    onClick={() => console.log("Submit button clicked for volunteer")}
                                    className="w-full h-12 bg-gray-900 hover:bg-black text-white font-medium rounded-md shadow-md disabled:opacity-60"
                                >
                                    {submitting ? (
                                        <span className="inline-flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" /> Registering…
                                        </span>
                                    ) : (
                                        "Agree and Register"
                                    )}
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
    );
}
