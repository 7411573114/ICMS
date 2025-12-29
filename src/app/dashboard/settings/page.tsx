"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Bell,
    Globe,
    Lock,
    Mail,
    Palette,
    Shield,
    User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const settingsSections = [
    {
        id: "profile",
        title: "Profile Settings",
        description: "Manage your personal information",
        icon: User,
    },
    {
        id: "security",
        title: "Security",
        description: "Password and authentication settings",
        icon: Lock,
    },
    {
        id: "notifications",
        title: "Notifications",
        description: "Configure how you receive notifications",
        icon: Bell,
    },
    {
        id: "appearance",
        title: "Appearance",
        description: "Customize the look and feel",
        icon: Palette,
    },
];

export default function SettingsPage() {
    return (
        <DashboardLayout title="Settings" subtitle="Manage your account settings">
            <div className="max-w-4xl space-y-6">
                {/* Profile Section */}
                <div className="bg-background rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-foreground">Profile Settings</h2>
                            <p className="text-sm text-muted-foreground">Manage your personal information</p>
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" defaultValue="Admin" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" defaultValue="User" />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" defaultValue="admin@icms.com" />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" defaultValue="+1 234 567 8900" />
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border flex justify-end">
                        <Button>Save Changes</Button>
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-background rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Lock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-foreground">Security</h2>
                            <p className="text-sm text-muted-foreground">Password and authentication settings</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                            <div>
                                <p className="font-medium text-foreground">Change Password</p>
                                <p className="text-sm text-muted-foreground">Update your password regularly</p>
                            </div>
                            <Button variant="outline">Change</Button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                            <div>
                                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                            </div>
                            <Switch />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                            <div>
                                <p className="font-medium text-foreground">Active Sessions</p>
                                <p className="text-sm text-muted-foreground">Manage your logged in devices</p>
                            </div>
                            <Button variant="outline">Manage</Button>
                        </div>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="bg-background rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Bell className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-foreground">Notifications</h2>
                            <p className="text-sm text-muted-foreground">Configure how you receive notifications</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                            <div>
                                <p className="font-medium text-foreground">Email Notifications</p>
                                <p className="text-sm text-muted-foreground">Receive updates via email</p>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                            <div>
                                <p className="font-medium text-foreground">New Registration Alerts</p>
                                <p className="text-sm text-muted-foreground">Get notified for new registrations</p>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                            <div>
                                <p className="font-medium text-foreground">Payment Notifications</p>
                                <p className="text-sm text-muted-foreground">Receive payment confirmations</p>
                            </div>
                            <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                            <div>
                                <p className="font-medium text-foreground">Marketing Updates</p>
                                <p className="text-sm text-muted-foreground">News and feature announcements</p>
                            </div>
                            <Switch />
                        </div>
                    </div>
                </div>

                {/* Appearance Section */}
                <div className="bg-background rounded-xl border border-border p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <Palette className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-foreground">Appearance</h2>
                            <p className="text-sm text-muted-foreground">Customize the look and feel</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                            <div>
                                <p className="font-medium text-foreground">Dark Mode</p>
                                <p className="text-sm text-muted-foreground">Toggle dark theme</p>
                            </div>
                            <Switch />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                            <div>
                                <p className="font-medium text-foreground">Compact View</p>
                                <p className="text-sm text-muted-foreground">Use smaller spacing in lists</p>
                            </div>
                            <Switch />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
