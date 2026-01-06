"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Mail,
    Lock,
    GraduationCap,
    ArrowRight,
    ArrowLeft,
    Shield,
    Smartphone,
    Loader2,
    CheckCircle2,
    Info
} from "lucide-react";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [activeTab, setActiveTab] = React.useState("admin");

    // OTP states
    const [phone, setPhone] = React.useState("");
    const [otp, setOtp] = React.useState("");
    const [otpSent, setOtpSent] = React.useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "", rememberMe: false },
    });

    const onAdminSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error === "CredentialsSignin"
                    ? "Invalid email or password"
                    : result.error);
                setIsLoading(false);
                return;
            }

            if (result?.ok) {
                router.push("/dashboard");
                router.refresh();
            } else {
                setError("Login failed. Please try again.");
                setIsLoading(false);
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("An error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    const handleSendOtp = async () => {
        if (!phone || phone.length < 10) {
            setError("Please enter a valid mobile number");
            return;
        }
        setIsLoading(true);
        setError(null);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setOtpSent(true);
        setIsLoading(false);
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length < 4) {
            setError("Please enter a valid OTP");
            return;
        }
        setIsLoading(true);
        setError(null);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setError("OTP login coming soon. Please use admin login.");
        setIsLoading(false);
    };

    const resetOtpState = () => {
        setPhone("");
        setOtp("");
        setOtpSent(false);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 flex flex-col">
            {/* Header */}
            <header className="p-4 lg:p-6">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>
            </header>

            {/* Main */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-[420px]">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-medical shadow-lg shadow-primary/25 mb-4">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold">Sign in to ICMS</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Welcome back! Please enter your details.</p>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border p-6">
                        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setError(null); resetOtpState(); }}>
                            <TabsList className="grid w-full grid-cols-2 h-11 mb-6 bg-muted/60">
                                <TabsTrigger value="public" className="text-sm gap-1.5 rounded-lg">
                                    <Smartphone className="w-4 h-4" />
                                    Public
                                </TabsTrigger>
                                <TabsTrigger value="admin" className="text-sm gap-1.5 rounded-lg">
                                    <Shield className="w-4 h-4" />
                                    Admin
                                </TabsTrigger>
                            </TabsList>

                            {/* Error Alert */}
                            {error && (
                                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-2">
                                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* Public OTP Login */}
                            <TabsContent value="public" className="mt-0 space-y-4">
                                {!otpSent ? (
                                    <>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm">Mobile Number</Label>
                                            <div className="flex gap-2">
                                                <span className="inline-flex items-center px-3 rounded-lg border bg-muted/50 text-sm font-medium text-muted-foreground">
                                                    +91
                                                </span>
                                                <Input
                                                    type="tel"
                                                    placeholder="9876543210"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                                    className="flex-1"
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            className="w-full gradient-medical text-white"
                                            onClick={handleSendOtp}
                                            disabled={phone.length < 10 || isLoading}
                                        >
                                            {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                            Send OTP
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                            <div className="text-sm">
                                                <p className="font-medium text-green-700">OTP Sent</p>
                                                <p className="text-green-600">+91 {phone}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm">Enter OTP</Label>
                                            <Input
                                                type="text"
                                                placeholder="------"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                                className="text-center text-xl tracking-[0.3em] font-mono"
                                                maxLength={6}
                                            />
                                        </div>
                                        <Button
                                            className="w-full gradient-medical text-white"
                                            onClick={handleVerifyOtp}
                                            disabled={otp.length < 4 || isLoading}
                                        >
                                            {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                            Verify & Login
                                        </Button>
                                        <button
                                            type="button"
                                            className="w-full text-sm text-muted-foreground hover:text-foreground"
                                            onClick={resetOtpState}
                                        >
                                            ← Change number
                                        </button>
                                    </>
                                )}
                            </TabsContent>

                            {/* Admin Email Login */}
                            <TabsContent value="admin" className="mt-0 space-y-4">
                                <form onSubmit={handleSubmit(onAdminSubmit)} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="email" className="text-sm">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            icon={<Mail className="w-4 h-4" />}
                                            error={errors.email?.message}
                                            {...register("email")}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex justify-between">
                                            <Label htmlFor="password" className="text-sm">Password</Label>
                                            <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline">
                                                Forgot?
                                            </Link>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            icon={<Lock className="w-4 h-4" />}
                                            error={errors.password?.message}
                                            {...register("password")}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Checkbox id="remember" {...register("rememberMe")} />
                                        <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                                            Remember me
                                        </label>
                                    </div>

                                    <Button type="submit" className="w-full gradient-medical text-white" loading={isLoading}>
                                        Sign In
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </form>

                                {/* Demo Credentials */}
                                <div className="mt-4 p-3 rounded-lg bg-amber-50/80 border border-amber-100">
                                    <p className="text-xs font-medium text-amber-800 mb-2 flex items-center gap-1.5">
                                        <Info className="w-3.5 h-3.5" />
                                        Demo Credentials
                                    </p>
                                    <div className="text-xs space-y-1.5 text-amber-700">
                                        <div className="flex justify-between gap-2">
                                            <span className="text-amber-600">Super Admin:</span>
                                            <code className="font-medium">admin@icms.com / Admin@123</code>
                                        </div>
                                        <div className="flex justify-between gap-2">
                                            <span className="text-amber-600">Event Mgr:</span>
                                            <code className="font-medium">events@icms.com / User@123</code>
                                        </div>
                                        <div className="flex justify-between gap-2">
                                            <span className="text-amber-600">Reg. Mgr:</span>
                                            <code className="font-medium">registrations@icms.com / User@123</code>
                                        </div>
                                        <div className="flex justify-between gap-2">
                                            <span className="text-amber-600">Cert. Mgr:</span>
                                            <code className="font-medium">certificates@icms.com / User@123</code>
                                        </div>
                                        <div className="flex justify-between gap-2">
                                            <span className="text-amber-600">Attendee:</span>
                                            <code className="font-medium">attendee@icms.com / User@123</code>
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Footer Link */}
                    <p className="text-center text-sm text-muted-foreground mt-6">
                        New here?{" "}
                        <Link href="/events" className="text-primary font-medium hover:underline">
                            Browse Events
                        </Link>
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-4 text-center text-xs text-muted-foreground">
                © 2025 ICMS
            </footer>
        </div>
    );
}
