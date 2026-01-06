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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, GraduationCap, ArrowRight, Sparkles, ArrowLeft, Shield } from "lucide-react";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
                setIsLoading(false);
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } catch {
            setError("An error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-medical-teal-light via-background to-medical-blue-light flex flex-col">
            {/* Header */}
            <header className="p-4">
                <div className="container mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl gradient-medical flex items-center justify-center shadow-lg shadow-primary/25">
                                <GraduationCap className="w-9 h-9 text-primary-foreground" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-medical-green rounded-full border-2 border-background flex items-center justify-center">
                                <Shield className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    </div>

                    <Card className="shadow-xl border-0">
                        <CardHeader className="text-center pb-2">
                            <CardTitle className="text-2xl">Admin Login</CardTitle>
                            <CardDescription>
                                Sign in to access the ICMS dashboard
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                    {error}
                                </div>
                            )}
                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@icms.com"
                                        icon={<Mail className="w-4 h-4" />}
                                        error={errors.email?.message}
                                        autoComplete="email"
                                        {...register("email")}
                                    />
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password" className="text-sm font-medium">
                                            Password
                                        </Label>
                                        <Link
                                            href="/auth/forgot-password"
                                            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        icon={<Lock className="w-4 h-4" />}
                                        error={errors.password?.message}
                                        autoComplete="current-password"
                                        {...register("password")}
                                    />
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="rememberMe"
                                        {...register("rememberMe")}
                                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                    />
                                    <label
                                        htmlFor="rememberMe"
                                        className="text-sm text-muted-foreground cursor-pointer select-none"
                                    >
                                        Keep me signed in for 30 days
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full h-11 text-base font-semibold group gradient-medical text-white hover:opacity-90"
                                    size="lg"
                                    loading={isLoading}
                                >
                                    Sign In to Dashboard
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card px-3 text-muted-foreground font-medium">
                                        Demo Access
                                    </span>
                                </div>
                            </div>

                            {/* Demo Credentials Card */}
                            <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-muted/50 to-muted p-4">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                            Test Credentials
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Email</p>
                                            <p className="text-sm font-mono font-medium text-foreground bg-background/60 px-2 py-1 rounded border border-border/50">
                                                admin@icms.com
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Password</p>
                                            <p className="text-sm font-mono font-medium text-foreground bg-background/60 px-2 py-1 rounded border border-border/50">
                                                Admin@123
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Footer */}
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Are you an attendee?{" "}
                        <Link href="/" className="font-medium text-primary hover:text-primary/80 transition-colors">
                            Register for events here
                        </Link>
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-4 text-center text-sm text-muted-foreground">
                © 2025 ICMS - Integrated Conference Management System
            </footer>
        </div>
    );
}
