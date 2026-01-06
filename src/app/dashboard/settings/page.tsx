"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
    Bell,
    Lock,
    Palette,
    User,
    Loader2,
    Eye,
    EyeOff,
    Monitor,
    Smartphone,
    Tablet,
    Globe,
    Trash2,
    LogOut,
    Clock,
    MapPin,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { usersService, User as UserType, UserSession } from "@/services/users";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export default function SettingsPage() {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        firstName: "",
        lastName: "",
        phone: "",
    });

    // Notification preferences state
    const [notifications, setNotifications] = useState({
        notifyEmail: true,
        notifyRegistrations: true,
        notifyPayments: true,
    });
    const [savingNotifications, setSavingNotifications] = useState(false);

    // Password dialog state
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    // Sessions dialog state
    const [isSessionsDialogOpen, setIsSessionsDialogOpen] = useState(false);
    const [sessions, setSessions] = useState<UserSession[]>([]);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const [revokingSession, setRevokingSession] = useState<string | null>(null);
    const [revokingAll, setRevokingAll] = useState(false);

    // Fetch user profile on mount
    useEffect(() => {
        async function fetchProfile() {
            try {
                setLoading(true);
                const response = await usersService.getProfile();
                if (response.success && response.data) {
                    setUser(response.data);
                    setProfileForm({
                        firstName: response.data.firstName || "",
                        lastName: response.data.lastName || "",
                        phone: response.data.phone || "",
                    });
                    setNotifications({
                        notifyEmail: response.data.notifyEmail ?? true,
                        notifyRegistrations: response.data.notifyRegistrations ?? true,
                        notifyPayments: response.data.notifyPayments ?? true,
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

    // Fetch sessions when dialog opens
    const handleOpenSessionsDialog = async () => {
        setIsSessionsDialogOpen(true);
        await fetchSessions();
    };

    const fetchSessions = async () => {
        try {
            setLoadingSessions(true);
            const response = await usersService.getSessions();
            if (response.success && response.data) {
                setSessions(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch sessions:", error);
            toast.error("Failed to load sessions");
        } finally {
            setLoadingSessions(false);
        }
    };

    // Handle notification toggle
    const handleNotificationToggle = async (key: keyof typeof notifications) => {
        const newValue = !notifications[key];
        const prevValue = notifications[key];

        // Optimistic update
        setNotifications((prev) => ({ ...prev, [key]: newValue }));

        try {
            setSavingNotifications(true);
            const response = await usersService.updateProfile({ [key]: newValue });
            if (response.success) {
                toast.success("Notification preference updated");
            } else {
                // Revert on failure
                setNotifications((prev) => ({ ...prev, [key]: prevValue }));
                toast.error("Failed to update preference");
            }
        } catch (error) {
            console.error("Failed to update notification:", error);
            setNotifications((prev) => ({ ...prev, [key]: prevValue }));
            toast.error("Failed to update preference");
        } finally {
            setSavingNotifications(false);
        }
    };

    // Handle profile save
    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            const response = await usersService.updateProfile(profileForm);
            if (response.success && response.data) {
                setUser(response.data);
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

    // Handle password change
    const handleChangePassword = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        try {
            setChangingPassword(true);
            const response = await usersService.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
                confirmPassword: passwordForm.confirmPassword,
            });
            if (response.success) {
                toast.success("Password changed successfully");
                setIsPasswordDialogOpen(false);
                setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } else {
                toast.error(response.error?.message || "Failed to change password");
            }
        } catch (error) {
            console.error("Failed to change password:", error);
            toast.error("Failed to change password");
        } finally {
            setChangingPassword(false);
        }
    };

    // Revoke a single session
    const handleRevokeSession = async (sessionId: string) => {
        try {
            setRevokingSession(sessionId);
            const response = await usersService.revokeSession(sessionId);
            if (response.success) {
                toast.success("Session revoked");
                setSessions((prev) => prev.filter((s) => s.id !== sessionId));
            } else {
                toast.error(response.error?.message || "Failed to revoke session");
            }
        } catch (error) {
            console.error("Failed to revoke session:", error);
            toast.error("Failed to revoke session");
        } finally {
            setRevokingSession(null);
        }
    };

    // Revoke all other sessions
    const handleRevokeAllSessions = async () => {
        try {
            setRevokingAll(true);
            const response = await usersService.revokeAllSessions();
            if (response.success) {
                toast.success(`Logged out from ${response.data?.revokedCount || 0} device(s)`);
                // Refresh sessions list
                await fetchSessions();
            } else {
                toast.error("Failed to revoke sessions");
            }
        } catch (error) {
            console.error("Failed to revoke sessions:", error);
            toast.error("Failed to revoke sessions");
        } finally {
            setRevokingAll(false);
        }
    };

    // Get device icon
    const getDeviceIcon = (deviceType: string | null) => {
        switch (deviceType?.toLowerCase()) {
            case "mobile":
                return <Smartphone className="h-5 w-5" />;
            case "tablet":
                return <Tablet className="h-5 w-5" />;
            default:
                return <Monitor className="h-5 w-5" />;
        }
    };

    if (loading) {
        return (
            <DashboardLayout title="Settings" subtitle="Manage your account settings">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

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
                            <Input
                                id="firstName"
                                value={profileForm.firstName}
                                onChange={(e) => setProfileForm((prev) => ({ ...prev, firstName: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={profileForm.lastName}
                                onChange={(e) => setProfileForm((prev) => ({ ...prev, lastName: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={profileForm.phone}
                                onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border flex justify-end">
                        <Button onClick={handleSaveProfile} disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
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
                            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)}>
                                Change
                            </Button>
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
                            <Button variant="outline" onClick={handleOpenSessionsDialog}>
                                Manage
                            </Button>
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
                            <Switch
                                checked={notifications.notifyEmail}
                                onCheckedChange={() => handleNotificationToggle("notifyEmail")}
                                disabled={savingNotifications}
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                            <div>
                                <p className="font-medium text-foreground">New Registration Alerts</p>
                                <p className="text-sm text-muted-foreground">Get notified for new registrations</p>
                            </div>
                            <Switch
                                checked={notifications.notifyRegistrations}
                                onCheckedChange={() => handleNotificationToggle("notifyRegistrations")}
                                disabled={savingNotifications}
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                            <div>
                                <p className="font-medium text-foreground">Payment Notifications</p>
                                <p className="text-sm text-muted-foreground">Receive payment confirmations</p>
                            </div>
                            <Switch
                                checked={notifications.notifyPayments}
                                onCheckedChange={() => handleNotificationToggle("notifyPayments")}
                                disabled={savingNotifications}
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border border-border opacity-60">
                            <div>
                                <p className="font-medium text-foreground">Marketing Updates</p>
                                <p className="text-sm text-muted-foreground">News and feature announcements (Coming soon)</p>
                            </div>
                            <Switch disabled />
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

            {/* Change Password Dialog */}
            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                            Enter your current password and choose a new password.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsPasswordDialogOpen(false)}
                            disabled={changingPassword}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleChangePassword}
                            disabled={changingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                        >
                            {changingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Change Password
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Active Sessions Dialog */}
            <Dialog open={isSessionsDialogOpen} onOpenChange={setIsSessionsDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Active Sessions</DialogTitle>
                        <DialogDescription>
                            Manage your logged in devices. You can log out from other devices here.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        {loadingSessions ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                        ) : sessions.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No active sessions found
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                {sessions.map((session) => (
                                    <div
                                        key={session.id}
                                        className={`p-4 rounded-lg border ${session.isCurrent ? "border-primary bg-primary/5" : "border-border"}`}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-3">
                                                <div className="p-2 rounded-lg bg-muted">
                                                    {getDeviceIcon(session.deviceType)}
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium text-foreground">
                                                            {session.deviceName || `${session.browser || "Unknown"} on ${session.os || "Unknown"}`}
                                                        </p>
                                                        {session.isCurrent && (
                                                            <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                                                                Current
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                                        {session.ipAddress && (
                                                            <span className="flex items-center gap-1">
                                                                <Globe className="h-3 w-3" />
                                                                {session.ipAddress}
                                                            </span>
                                                        )}
                                                        {session.location && (
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="h-3 w-3" />
                                                                {session.location}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {formatDistanceToNow(new Date(session.lastActiveAt), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {!session.isCurrent && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    onClick={() => handleRevokeSession(session.id)}
                                                    disabled={revokingSession === session.id}
                                                >
                                                    {revokingSession === session.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        {sessions.filter((s) => !s.isCurrent).length > 0 && (
                            <Button
                                variant="outline"
                                className="text-destructive hover:text-destructive"
                                onClick={handleRevokeAllSessions}
                                disabled={revokingAll}
                            >
                                {revokingAll ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <LogOut className="mr-2 h-4 w-4" />
                                )}
                                Log out all other devices
                            </Button>
                        )}
                        <Button variant="outline" onClick={() => setIsSessionsDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
