"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Camera,
    Mail,
    Phone,
    MapPin,
    Building2,
    Calendar,
    Edit,
} from "lucide-react";

export default function ProfilePage() {
    return (
        <DashboardLayout title="Profile" subtitle="View and edit your profile">
            <div className="max-w-4xl space-y-6">
                {/* Profile Header */}
                <div className="bg-background rounded-xl border border-border overflow-hidden">
                    {/* Cover */}
                    <div className="h-32 bg-gradient-to-r from-primary to-primary/60" />

                    {/* Profile Info */}
                    <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-background border-4 border-background flex items-center justify-center">
                                    <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-primary">AD</span>
                                    </div>
                                </div>
                                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex-1 sm:pb-2">
                                <h1 className="text-xl font-bold text-foreground">Dr. Admin User</h1>
                                <p className="text-muted-foreground">Super Administrator</p>
                            </div>
                            <Button variant="outline" className="sm:mb-2">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 bg-background rounded-xl border border-border p-6">
                        <h2 className="font-semibold text-foreground mb-4">Contact Information</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <span className="text-foreground">admin@icms.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span className="text-foreground">+1 234 567 8900</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span className="text-foreground">Boston, MA</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                <span className="text-foreground">Neurostimulation Department</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="text-foreground">Joined Jan 2024</span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <div className="lg:col-span-2 bg-background rounded-xl border border-border p-6">
                        <h2 className="font-semibold text-foreground mb-4">Personal Information</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" defaultValue="Admin" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" defaultValue="User" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue="admin@icms.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" type="tel" defaultValue="+1 234 567 8900" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Input id="department" defaultValue="Neurostimulation Department" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" defaultValue="Boston, MA" />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="bio">Bio</Label>
                                <textarea
                                    id="bio"
                                    rows={3}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    defaultValue="Super Administrator with full system access. Managing the ICMS platform for the Neurostimulation Department."
                                />
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-border flex justify-end gap-3">
                            <Button variant="outline">Cancel</Button>
                            <Button>Save Changes</Button>
                        </div>
                    </div>
                </div>

                {/* Activity Stats */}
                <div className="bg-background rounded-xl border border-border p-6">
                    <h2 className="font-semibold text-foreground mb-4">Activity Overview</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold text-foreground">156</p>
                            <p className="text-sm text-muted-foreground">Events Created</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold text-foreground">1,248</p>
                            <p className="text-sm text-muted-foreground">Registrations</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold text-foreground">856</p>
                            <p className="text-sm text-muted-foreground">Certificates</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold text-foreground">45</p>
                            <p className="text-sm text-muted-foreground">Speakers Added</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
