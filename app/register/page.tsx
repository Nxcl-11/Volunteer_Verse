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
        if (
            !data.firstName || !data.lastName || !data.sex || !data.email ||
            !data.password || !data.confirmPassword || !data.country || !data.phone
        ) {
            toast({ title: "Missing information", description: "Please fill in all required fields.", variant: "destructive" });
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(data.email)) {
            toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
            return false;
        }
        if (data.password !== data.confirmPassword) {
            toast({ title: "Password mismatch", description: "Passwords do not match.", variant: "destructive" });
            return false;
        }
        if (data.password.length < 8) {
            toast({ title: "Weak password", description: "Password must be at least 8 characters.", variant: "destructive" });
            return false;
        }
        if (!data.agree) {
            toast({ title: "Terms not accepted", description: "You must agree to the terms & policy.", variant: "destructive" });
            return false;
        }
        return true;
    };

    /** Signup using email confirmation LINK (no OTP).
     *  - Sends email with ConfirmationURL (must enable "Confirm email" in Supabase).
     *  - If there is no session (typical), we stop and ask user to check inbox.
     *  - If autoconfirm is ON and session exists, we insert profile immediately.
     */
    const signupWithLinkAndMaybeInsert = async (
        role: "volunteer" | "organizer",
        payload: VolunteerFormData | OrganizerFormData
    ) => {
        setSubmitting(true);
        try {
            const origin =
                typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL;

            const { error: signUpError } = await supabase.auth.signUp({
                email: payload.email,
                password: payload.password,
                options: {
                    emailRedirectTo: `${origin}/auth/callback`, // add this in Supabase → URL Configuration → Redirect URLs
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
            if (signUpError) throw signUpError;

            // If confirmations are ON, there is no session now → ask user to check inbox and stop.
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                toast({
                    title: "Check your email",
                    description: "We sent a confirmation link. Click it to activate your account, then sign in.",
                });
                return;
            }

            // If you DO have a session (autoconfirm), insert profile now.
            const { data: userData } = await supabase.auth.getUser();
            const userId = userData.user?.id;
            if (!userId) throw new Error("User ID not found.");

            if (role === "volunteer") {
                const { error } = await supabase.from("volunteers").insert({
                    user_id: userId,
                    first_name: payload.firstName,
                    last_name: payload.lastName,
                    sex: payload.sex,
                    email: payload.email,
                    country: payload.country,
                    phone: payload.phone,
                });
                if (error) throw error;
            } else {
                const org = payload as OrganizerFormData;
                const { error } = await supabase.from("organizers").insert({
                    user_id: userId,
                    first_name: org.firstName,
                    last_name: org.lastName,
                    sex: org.sex,
                    email: org.email,
                    country: org.country,
                    phone: org.phone,
                    organization_name: org.organizationName,
                });
                if (error) throw error;
            }

            toast({
                title: "Registration successful",
                description: "Welcome to VolunteerVerse! Redirecting to your dashboard…",
            });
            setTimeout(() => {
                window.location.href = role === "organizer" ? "/organizer/dashboard" : "/volunteer/dashboard";
            }, 600);
        } catch (err: any) {
            toast({
                title: "Registration failed",
                description: err?.message ?? "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const handleVolunteerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // LOG 1: Start of submission
        console.log('--- Volunteer Submission Started ---');
        setSubmitting(true);

        try {
            // LOG 2: Fired before validation
            console.log('Action: Running base validation for volunteer.');
            if (!validateBase(volunteerData)) {
                // LOG 3: Fired if validation fails
                console.warn('Validation failed for volunteer data. Returning early.');
                return; // Exits the function
            }

            // LOG 4: Fired before the signup function is called
            console.log('Action: Volunteer data is valid. Calling signup...');
            await signupWithLinkAndMaybeInsert("volunteer", volunteerData);
            console.log("DATA BEING SENT for Volunteer:", volunteerData);

            // LOG 5: Fired after signup function completes successfully
            console.log('Action: Volunteer signup completed successfully.');

        } catch (error) {
            // LOG 6: Fired if any error occurs during the async process
            console.error('An error occurred during volunteer submission:', error);

        } finally {
            // LOG 7: Fired regardless of success or failure
            console.log('Action: Volunteer handler finished. Re-enabling button.');
            setSubmitting(false);
            console.log('--- Volunteer Submission Ended ---');
        }
    };

    const handleOrganizerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // LOG 8: Start of submission
        console.log('--- Organizer Submission Started ---');
        setSubmitting(true);

        try {
            // LOG 9: Fired before organization name check
            console.log('Action: Checking for organization name.');
            if (!organizerData.organizationName) {
                // LOG 10: Fired if the organization name is missing
                console.warn('Validation failed: Organization name is missing.');
                toast({ title: "Missing information", description: "Organization name is required.", variant: "destructive" });
                return; // Exits the function
            }

            // LOG 11: Fired before base validation
            console.log('Action: Running base validation for organizer.');
            if (!validateBase(organizerData)) {
                // LOG 12: Fired if validation fails
                console.warn('Validation failed for organizer data. Returning early.');
                return; // Exits the function
            }

            // LOG 13: Fired before the signup function is called
            console.log('Action: Organizer data is valid. Calling signup...');
            await signupWithLinkAndMaybeInsert("organizer", organizerData);
            console.log("DATA BEING SENT for Organizer:", organizerData);

            // LOG 14: Fired after signup function completes successfully
            console.log('Action: Organizer signup completed successfully.');

        } catch (error) {
            // LOG 15: Fired if any error occurs during the async process
            console.error('An error occurred during organizer submission:', error);

        } finally {
            // LOG 16: Fired regardless of success or failure
            console.log('Action: Organizer handler finished. Re-enabling button.');
            setSubmitting(false);
            console.log('--- Organizer Submission Ended ---');
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

                                <Button
                                    type="submit"
                                    disabled={submitting}
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

                                <Button
                                    type="submit"
                                    disabled={submitting}
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
