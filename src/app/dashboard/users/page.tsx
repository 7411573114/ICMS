"use client";

import React, { useState } from "react";
import {
    Search,
    Plus,
    Filter,
    MoreHorizontal,
    Mail,
    Shield,
    UserCheck,
    UserX,
    Edit,
    Trash2,
    Eye,
    Key,
    Settings,
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Users,
    Lock,
    Unlock,
    Send,
    Copy,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const users = [
    {
        id: 1,
        name: "Dr. Admin User",
        email: "admin@icms.com",
        phone: "+91 98765 43210",
        role: "Super Admin",
        department: "Administration",
        status: "active",
        lastActive: "Just now",
        createdAt: "2024-01-15",
        permissions: ["all"],
    },
    {
        id: 2,
        name: "Dr. Sarah Johnson",
        email: "s.johnson@icms.com",
        phone: "+91 87654 32109",
        role: "Event Manager",
        department: "Events",
        status: "active",
        lastActive: "2 hours ago",
        createdAt: "2024-03-20",
        permissions: ["events.view", "events.create", "events.edit", "speakers.view", "speakers.edit", "sponsors.view"],
    },
    {
        id: 3,
        name: "Dr. Michael Chen",
        email: "m.chen@icms.com",
        phone: "+91 76543 21098",
        role: "Registration Manager",
        department: "Registration",
        status: "active",
        lastActive: "1 day ago",
        createdAt: "2024-05-10",
        permissions: ["registrations.view", "registrations.edit", "events.view", "certificates.view"],
    },
    {
        id: 4,
        name: "Dr. Emily Davis",
        email: "e.davis@icms.com",
        phone: "+91 65432 10987",
        role: "Certificate Manager",
        department: "Certificates",
        status: "inactive",
        lastActive: "1 week ago",
        createdAt: "2024-06-05",
        permissions: ["certificates.view", "certificates.create", "certificates.edit", "events.view"],
    },
    {
        id: 5,
        name: "Dr. Robert Wilson",
        email: "r.wilson@icms.com",
        phone: "+91 54321 09876",
        role: "Viewer",
        department: "Research",
        status: "active",
        lastActive: "3 days ago",
        createdAt: "2024-08-15",
        permissions: ["events.view", "speakers.view", "sponsors.view", "registrations.view"],
    },
];

const roles = [
    {
        id: "super_admin",
        name: "Super Admin",
        description: "Full access to all features and settings",
        color: "bg-purple-50 text-purple-700 border-purple-200",
        userCount: 1,
    },
    {
        id: "event_manager",
        name: "Event Manager",
        description: "Manage events, speakers, and sponsors",
        color: "bg-blue-50 text-blue-700 border-blue-200",
        userCount: 2,
    },
    {
        id: "registration_manager",
        name: "Registration Manager",
        description: "Handle registrations and attendee management",
        color: "bg-green-50 text-green-700 border-green-200",
        userCount: 1,
    },
    {
        id: "certificate_manager",
        name: "Certificate Manager",
        description: "Generate and distribute certificates",
        color: "bg-amber-50 text-amber-700 border-amber-200",
        userCount: 1,
    },
    {
        id: "viewer",
        name: "Viewer",
        description: "View-only access to dashboard",
        color: "bg-gray-100 text-gray-700 border-gray-200",
        userCount: 3,
    },
];

const permissionGroups = [
    {
        name: "Events",
        permissions: [
            { id: "events.view", label: "View Events" },
            { id: "events.create", label: "Create Events" },
            { id: "events.edit", label: "Edit Events" },
            { id: "events.delete", label: "Delete Events" },
        ],
    },
    {
        name: "Speakers",
        permissions: [
            { id: "speakers.view", label: "View Speakers" },
            { id: "speakers.create", label: "Add Speakers" },
            { id: "speakers.edit", label: "Edit Speakers" },
            { id: "speakers.delete", label: "Delete Speakers" },
        ],
    },
    {
        name: "Sponsors",
        permissions: [
            { id: "sponsors.view", label: "View Sponsors" },
            { id: "sponsors.create", label: "Add Sponsors" },
            { id: "sponsors.edit", label: "Edit Sponsors" },
            { id: "sponsors.delete", label: "Delete Sponsors" },
        ],
    },
    {
        name: "Registrations",
        permissions: [
            { id: "registrations.view", label: "View Registrations" },
            { id: "registrations.edit", label: "Manage Registrations" },
            { id: "registrations.export", label: "Export Data" },
        ],
    },
    {
        name: "Certificates",
        permissions: [
            { id: "certificates.view", label: "View Certificates" },
            { id: "certificates.create", label: "Generate Certificates" },
            { id: "certificates.edit", label: "Edit Certificates" },
            { id: "certificates.send", label: "Send Certificates" },
        ],
    },
    {
        name: "Users",
        permissions: [
            { id: "users.view", label: "View Users" },
            { id: "users.create", label: "Create Users" },
            { id: "users.edit", label: "Edit Users" },
            { id: "users.delete", label: "Delete Users" },
        ],
    },
];

const roleColors: Record<string, string> = {
    "Super Admin": "bg-purple-50 text-purple-700 border-purple-200",
    "Event Manager": "bg-blue-50 text-blue-700 border-blue-200",
    "Registration Manager": "bg-green-50 text-green-700 border-green-200",
    "Certificate Manager": "bg-amber-50 text-amber-700 border-amber-200",
    "Viewer": "bg-gray-100 text-gray-700 border-gray-200",
};

export default function UsersPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
    const [selectedTab, setSelectedTab] = useState("users");
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

    const getInitials = (name: string) => {
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const activeUsers = users.filter((u) => u.status === "active").length;
    const inactiveUsers = users.filter((u) => u.status === "inactive").length;

    return (
        <DashboardLayout title="User Management" subtitle="Manage system users, roles, and permissions">
            <div className="space-y-6 animate-fadeIn">
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <Card className="card-hover">
                        <CardContent className="p-3 sm:pt-6 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="icon-container icon-container-teal h-10 w-10 sm:h-12 sm:w-12">
                                    <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-bold">{users.length}</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="card-hover">
                        <CardContent className="p-3 sm:pt-6 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="icon-container icon-container-green h-10 w-10 sm:h-12 sm:w-12">
                                    <UserCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-bold">{activeUsers}</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="card-hover">
                        <CardContent className="p-3 sm:pt-6 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="icon-container icon-container-orange h-10 w-10 sm:h-12 sm:w-12">
                                    <UserX className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-bold">{inactiveUsers}</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Inactive</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="card-hover">
                        <CardContent className="p-3 sm:pt-6 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="icon-container icon-container-purple h-10 w-10 sm:h-12 sm:w-12">
                                    <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-bold">{roles.length}</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Roles</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex flex-1 gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search users..." className="pl-10" />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 gradient-medical text-white hover:opacity-90">
                                <Plus className="w-4 h-4" />
                                Add User
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <DialogHeader>
                                <DialogTitle>Create New User</DialogTitle>
                                <DialogDescription>
                                    Add a new user and assign their role and permissions
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Full Name *</Label>
                                        <Input placeholder="Dr. John Smith" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email Address *</Label>
                                        <Input type="email" placeholder="john.smith@icms.com" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Phone Number</Label>
                                        <Input type="tel" placeholder="+91 98765 43210" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Department</Label>
                                        <Input placeholder="Events" />
                                    </div>
                                </div>

                                <div className="section-divider-gradient my-2" />

                                <div className="space-y-2">
                                    <Label>Role *</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((role) => (
                                                <SelectItem key={role.id} value={role.id}>
                                                    <div className="flex items-center gap-2">
                                                        <Shield className="h-4 w-4" />
                                                        {role.name}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        Role determines the default permissions for this user
                                    </p>
                                </div>

                                <div className="section-divider-gradient my-2" />

                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <div className="space-y-0.5">
                                        <Label>Send Welcome Email</Label>
                                        <p className="text-xs text-muted-foreground">
                                            User will receive login credentials via email
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <div className="space-y-0.5">
                                        <Label>Activate Account</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Allow user to login immediately
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={() => setIsCreateOpen(false)}>Create User</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Permissions Dialog */}
                <Dialog open={isPermissionsOpen} onOpenChange={setIsPermissionsOpen}>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {selectedUser ? `Permissions for ${selectedUser.name}` : "Manage Permissions"}
                            </DialogTitle>
                            <DialogDescription>
                                Customize what this user can access and do in the system
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            {selectedUser && (
                                <div className="p-4 rounded-lg bg-muted/50 mb-6">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                {getInitials(selectedUser.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{selectedUser.name}</p>
                                            <p className="text-sm text-muted-foreground">{selectedUser.role}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-6">
                                {permissionGroups.map((group) => (
                                    <div key={group.name} className="space-y-3">
                                        <h4 className="font-semibold flex items-center gap-2">
                                            <Key className="h-4 w-4 text-primary" />
                                            {group.name}
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3 ml-6">
                                            {group.permissions.map((permission) => (
                                                <div
                                                    key={permission.id}
                                                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                                                >
                                                    <Checkbox
                                                        id={permission.id}
                                                        checked={selectedUser?.permissions.includes(permission.id) || selectedUser?.permissions.includes("all")}
                                                        disabled={selectedUser?.permissions.includes("all")}
                                                    />
                                                    <Label htmlFor={permission.id} className="cursor-pointer">
                                                        {permission.label}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsPermissionsOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => setIsPermissionsOpen(false)}>Save Permissions</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Main Content */}
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                    <TabsList className="w-full sm:w-auto h-auto flex-wrap sm:flex-nowrap gap-1 p-1">
                        <TabsTrigger value="users" className="flex-1 sm:flex-none gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                            Users
                        </TabsTrigger>
                        <TabsTrigger value="roles" className="flex-1 sm:flex-none gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                            Roles
                        </TabsTrigger>
                    </TabsList>

                    {/* Users Tab */}
                    <TabsContent value="users" className="mt-6">
                        <Card>
                            <CardContent className="p-0">
                                <div className="rounded-lg border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                <TableHead>User</TableHead>
                                                <TableHead className="hidden md:table-cell">Role</TableHead>
                                                <TableHead className="hidden lg:table-cell">Department</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="hidden sm:table-cell">Last Active</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {users.map((user, index) => (
                                                <TableRow
                                                    key={user.id}
                                                    className="animate-fadeIn"
                                                    style={{ animationDelay: `${index * 0.05}s` }}
                                                >
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-10 w-10">
                                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                                    {getInitials(user.name)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="min-w-0">
                                                                <p className="font-medium truncate">{user.name}</p>
                                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                                    <Mail className="w-3 h-3" />
                                                                    {user.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell">
                                                        <Badge
                                                            variant="outline"
                                                            className={cn("font-medium", roleColors[user.role])}
                                                        >
                                                            {user.role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="hidden lg:table-cell">
                                                        <p className="text-sm text-muted-foreground">{user.department}</p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "border-0",
                                                                user.status === "active"
                                                                    ? "status-active"
                                                                    : "bg-red-50 text-red-700"
                                                            )}
                                                        >
                                                            {user.status === "active" ? (
                                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                            ) : (
                                                                <XCircle className="h-3 w-3 mr-1" />
                                                            )}
                                                            {user.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="hidden sm:table-cell">
                                                        <p className="text-sm text-muted-foreground">{user.lastActive}</p>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <MoreHorizontal className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Profile
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit User
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setSelectedUser(user);
                                                                        setIsPermissionsOpen(true);
                                                                    }}
                                                                >
                                                                    <Key className="mr-2 h-4 w-4" />
                                                                    Manage Permissions
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem>
                                                                    <Send className="mr-2 h-4 w-4" />
                                                                    Send Password Reset
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>
                                                                    {user.status === "active" ? (
                                                                        <>
                                                                            <Lock className="mr-2 h-4 w-4" />
                                                                            Deactivate
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Unlock className="mr-2 h-4 w-4" />
                                                                            Activate
                                                                        </>
                                                                    )}
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-destructive">
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete User
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Roles Tab */}
                    <TabsContent value="roles" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {roles.map((role, index) => (
                                <Card
                                    key={role.id}
                                    className="card-hover animate-fadeIn"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("p-2 rounded-lg", role.color.split(" ")[0])}>
                                                    <Shield className={cn("h-5 w-5", role.color.split(" ")[1])} />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-base">{role.name}</CardTitle>
                                                    <CardDescription className="text-xs">
                                                        {role.userCount} users
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Users
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Role
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Key className="mr-2 h-4 w-4" />
                                                        Edit Permissions
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Copy className="mr-2 h-4 w-4" />
                                                        Duplicate Role
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete Role
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            {role.description}
                                        </p>
                                        <Button variant="outline" className="w-full gap-2" size="sm">
                                            <Settings className="h-4 w-4" />
                                            Manage Permissions
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Add New Role Card */}
                            <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
                                <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                        <Plus className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <p className="font-medium">Create New Role</p>
                                    <p className="text-sm text-muted-foreground">
                                        Define custom permissions
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
}
