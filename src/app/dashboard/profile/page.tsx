"use client";

import { useEffect, useState } from "react";
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
    Loader2,
    X,
} from "lucide-react";
import { usersService, User } from "@/services/users";
import { toast } from "sonner";
import { format } from "date-fns";

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Form state
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phone: "",
    });

    // Fetch user profile on mount
    useEffect(() => {
        async function fetchProfile() {
            try {
                setLoading(true);
                const response = await usersService.getProfile();
                if (response.success && response.data) {
                    setUser(response.data);
                    setForm({
                        firstName: response.data.firstName || "",
                        lastName: response.data.lastName || "",
                        phone: response.data.phone || "",
                    });
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, []);

    // Handle save
    const handleSave = async () => {
        try {
            setSaving(true);
            const response = await usersService.updateProfile(form);
            if (response.success && response.data) {
                setUser(response.data);
                setIsEditing(false);
                toast.success("Profile updated successfully");
            } else {
                toast.error("Failed to update profile");
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        // Reset form to current user values
        if (user) {
            setForm({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                phone: user.phone || "",
            });
        }
        setIsEditing(false);
    };

    // Get initials for avatar
    const getInitials = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        }
        if (user?.name) {
            const parts = user.name.split(" ");
            if (parts.length >= 2) {
                return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
            }
            return user.name.substring(0, 2).toUpperCase();
        }
        return "U";
    };

    // Get display name
    const getDisplayName = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName} ${user.lastName}`;
        }
        return user?.name || "User";
    };

    // Get role display
    const getRoleDisplay = (role: string) => {
        const roleMap: Record<string, string> = {
            SUPER_ADMIN: "Super Administrator",
            EVENT_MANAGER: "Event Manager",
            REGISTRATION_MANAGER: "Registration Manager",
            CERTIFICATE_MANAGER: "Certificate Manager",
            ATTENDEE: "Attendee",
        };
        return roleMap[role] || role;
    };

    if (loading) {
        return (
            <DashboardLayout title="Profile" subtitle="View and edit your profile">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

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
                                    {user?.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={getDisplayName()}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-primary">{getInitials()}</span>
                                        </div>
                                    )}
                                </div>
                                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex-1 sm:pb-2">
                                <h1 className="text-xl font-bold text-foreground">{getDisplayName()}</h1>
                                <p className="text-muted-foreground">{getRoleDisplay(user?.role || "")}</p>
                            </div>
                            {!isEditing && (
                                <Button variant="outline" className="sm:mb-2" onClick={() => setIsEditing(true)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            )}
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
                                <span className="text-foreground">{user?.email || "-"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span className="text-foreground">{user?.phone || "-"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="text-foreground">
                                    Joined {user?.createdAt ? format(new Date(user.createdAt), "MMM yyyy") : "-"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <div className="lg:col-span-2 bg-background rounded-xl border border-border p-6">
                        <h2 className="font-semibold text-foreground mb-4">Personal Information</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    value={form.firstName}
                                    onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                                    disabled={!isEditing}
                                    className={!isEditing ? "bg-muted" : ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    value={form.lastName}
                                    onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                                    disabled={!isEditing}
                                    className={!isEditing ? "bg-muted" : ""}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                                    disabled={!isEditing}
                                    className={!isEditing ? "bg-muted" : ""}
                                />
                            </div>
                        </div>
                        {isEditing && (
                            <div className="mt-6 pt-6 border-t border-border flex justify-end gap-3">
                                <Button variant="outline" onClick={handleCancel} disabled={saving}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} disabled={saving}>
                                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Activity Stats */}
                <div className="bg-background rounded-xl border border-border p-6">
                    <h2 className="font-semibold text-foreground mb-4">Activity Overview</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold text-foreground">
                                {user?._count?.registrations || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">Registrations</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold text-foreground">-</p>
                            <p className="text-sm text-muted-foreground">Events Attended</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold text-foreground">-</p>
                            <p className="text-sm text-muted-foreground">Certificates</p>
                        </div>
                        <div className="text-center p-4 rounded-lg bg-muted/50">
                            <p className="text-2xl font-bold text-foreground">-</p>
                            <p className="text-sm text-muted-foreground">CME Credits</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
