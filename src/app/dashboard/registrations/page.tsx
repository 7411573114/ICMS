"use client";

import React, { useState } from "react";
import {
    Search,
    Filter,
    Download,
    MoreHorizontal,
    Mail,
    Phone,
    Eye,
    Edit,
    Trash2,
    CheckCircle2,
    XCircle,
    Clock,
    Send,
    CreditCard,
    Receipt,
    Users,
    Calendar,
    IndianRupee,
    FileText,
    RefreshCw,
    Ban,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const registrations = [
    {
        id: "REG-2026-0001",
        name: "Dr. Priya Sharma",
        email: "priya.sharma@aiims.edu",
        phone: "+91 98765 43210",
        event: "National Neurostimulation Summit 2026",
        eventDate: "Jan 10-11, 2026",
        category: "Faculty",
        registrationDate: "Dec 29, 2025",
        status: "confirmed",
        paymentStatus: "paid",
        amount: 5000,
        attendanceStatus: null,
    },
    {
        id: "REG-2026-0002",
        name: "Dr. Rajesh Kumar",
        email: "rajesh.kumar@cmc.ac.in",
        phone: "+91 87654 32109",
        event: "National Neurostimulation Summit 2026",
        eventDate: "Jan 10-11, 2026",
        category: "Resident/Fellow",
        registrationDate: "Dec 29, 2025",
        status: "pending",
        paymentStatus: "pending",
        amount: 3500,
        attendanceStatus: null,
    },
    {
        id: "REG-2026-0003",
        name: "Dr. Ananya Patel",
        email: "ananya.patel@nimhans.org",
        phone: "+91 76543 21098",
        event: "Deep Brain Stimulation Workshop",
        eventDate: "Jan 5, 2026",
        category: "Faculty",
        registrationDate: "Dec 28, 2025",
        status: "confirmed",
        paymentStatus: "paid",
        amount: 3800,
        attendanceStatus: null,
    },
    {
        id: "REG-2026-0004",
        name: "Dr. Vikram Singh",
        email: "vikram.singh@apollo.com",
        phone: "+91 65432 10987",
        event: "Epilepsy Management CME Session",
        eventDate: "Dec 29, 2025",
        category: "Faculty",
        registrationDate: "Dec 27, 2025",
        status: "confirmed",
        paymentStatus: "paid",
        amount: 1500,
        attendanceStatus: null,
    },
    {
        id: "REG-2026-0005",
        name: "Dr. Meera Krishnan",
        email: "meera.k@fortis.com",
        phone: "+91 54321 09876",
        event: "Neural Engineering Research Symposium",
        eventDate: "Jan 18, 2026",
        category: "Resident/Fellow",
        registrationDate: "Dec 26, 2025",
        status: "confirmed",
        paymentStatus: "paid",
        amount: 1500,
        attendanceStatus: null,
    },
    {
        id: "REG-2026-0006",
        name: "Dr. Sanjay Reddy",
        email: "sanjay.reddy@hospital.in",
        phone: "+91 43210 98765",
        event: "National Neurostimulation Summit 2026",
        eventDate: "Jan 10-11, 2026",
        category: "Faculty",
        registrationDate: "Dec 25, 2025",
        status: "waitlist",
        paymentStatus: "pending",
        amount: 5000,
        attendanceStatus: null,
    },
];

export default function RegistrationsPage() {
    const [selectedTab, setSelectedTab] = useState("all");
    const [selectedRegistrations, setSelectedRegistrations] = useState<string[]>([]);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedReg, setSelectedReg] = useState<typeof registrations[0] | null>(null);

    const filteredRegistrations = registrations.filter((reg) => {
        if (selectedTab === "all") return true;
        return reg.status === selectedTab;
    });

    const confirmedCount = registrations.filter((r) => r.status === "confirmed").length;
    const pendingCount = registrations.filter((r) => r.status === "pending").length;
    const waitlistCount = registrations.filter((r) => r.status === "waitlist").length;
    const totalRevenue = registrations
        .filter((r) => r.paymentStatus === "paid")
        .reduce((sum, r) => sum + r.amount, 0);

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { class: string; icon: React.ElementType; label: string }> = {
            confirmed: { class: "status-active", icon: CheckCircle2, label: "Confirmed" },
            pending: { class: "status-pending", icon: Clock, label: "Pending" },
            waitlist: { class: "status-upcoming", icon: Users, label: "Waitlist" },
            cancelled: { class: "bg-red-50 text-red-700", icon: XCircle, label: "Cancelled" },
        };
        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;
        return (
            <Badge variant="outline" className={cn("gap-1 border-0", config.class)}>
                <Icon className="h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    const getPaymentBadge = (status: string) => {
        const paymentConfig: Record<string, { class: string; label: string }> = {
            paid: { class: "bg-green-50 text-green-700", label: "Paid" },
            pending: { class: "bg-amber-50 text-amber-700", label: "Pending" },
            refunded: { class: "bg-gray-100 text-gray-600", label: "Refunded" },
            failed: { class: "bg-red-50 text-red-700", label: "Failed" },
        };
        const config = paymentConfig[status] || paymentConfig.pending;
        return (
            <Badge variant="outline" className={cn("text-xs border-0", config.class)}>
                {config.label}
            </Badge>
        );
    };

    const getInitials = (name: string) => {
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const toggleRegistration = (id: string) => {
        setSelectedRegistrations((prev) =>
            prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selectedRegistrations.length === filteredRegistrations.length) {
            setSelectedRegistrations([]);
        } else {
            setSelectedRegistrations(filteredRegistrations.map((r) => r.id));
        }
    };

    return (
        <DashboardLayout title="Registrations" subtitle="Manage event registrations and attendees">
            <div className="space-y-6 animate-fadeIn">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <Card className="card-hover">
                        <CardContent className="p-3 sm:pt-6 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="icon-container icon-container-teal h-10 w-10 sm:h-12 sm:w-12">
                                    <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-bold">{registrations.length}</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="card-hover">
                        <CardContent className="p-3 sm:pt-6 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="icon-container icon-container-green h-10 w-10 sm:h-12 sm:w-12">
                                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-bold">{confirmedCount}</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Confirmed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="card-hover">
                        <CardContent className="p-3 sm:pt-6 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="icon-container icon-container-orange h-10 w-10 sm:h-12 sm:w-12">
                                    <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-bold">{pendingCount + waitlistCount}</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Pending</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="card-hover">
                        <CardContent className="p-3 sm:pt-6 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="icon-container icon-container-purple h-10 w-10 sm:h-12 sm:w-12">
                                    <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-bold">₹{(totalRevenue / 1000).toFixed(1)}K</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Revenue</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Header Actions */}
                <div className="flex flex-col gap-3">
                    {/* Search Row */}
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search..." className="pl-10 h-9 sm:h-10" />
                        </div>
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[120px] sm:w-[180px] h-9 sm:h-10">
                                <SelectValue placeholder="Event" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Events</SelectItem>
                                <SelectItem value="conference">Neurostimulation Conference</SelectItem>
                                <SelectItem value="workshop">DBS Workshop</SelectItem>
                                <SelectItem value="symposium">Research Symposium</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 shrink-0">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-end">
                        {selectedRegistrations.length > 0 && (
                            <Button variant="outline" size="sm" className="gap-2">
                                <Mail className="w-4 h-4" />
                                <span className="hidden sm:inline">Email</span> ({selectedRegistrations.length})
                            </Button>
                        )}
                        <Button variant="outline" size="sm" className="gap-2">
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export</span>
                        </Button>
                    </div>
                </div>

                {/* View Registration Dialog */}
                <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                    <DialogContent className="max-w-2xl">
                        {selectedReg && (
                            <>
                                <DialogHeader>
                                    <DialogTitle>Registration Details</DialogTitle>
                                    <DialogDescription>
                                        {selectedReg.id}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6 py-4">
                                    {/* Attendee Info */}
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-16 w-16">
                                            <AvatarFallback className="bg-primary/10 text-primary text-lg">
                                                {getInitials(selectedReg.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold">{selectedReg.name}</h3>
                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Mail className="h-4 w-4" />
                                                    {selectedReg.email}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Phone className="h-4 w-4" />
                                                    {selectedReg.phone}
                                                </span>
                                            </div>
                                            <div className="flex gap-2 mt-2">
                                                {getStatusBadge(selectedReg.status)}
                                                {getPaymentBadge(selectedReg.paymentStatus)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="section-divider-gradient" />

                                    {/* Event Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-lg bg-muted/50">
                                            <p className="text-xs text-muted-foreground mb-1">Event</p>
                                            <p className="font-medium">{selectedReg.event}</p>
                                            <p className="text-sm text-muted-foreground">{selectedReg.eventDate}</p>
                                        </div>
                                        <div className="p-4 rounded-lg bg-muted/50">
                                            <p className="text-xs text-muted-foreground mb-1">Category</p>
                                            <p className="font-medium">{selectedReg.category}</p>
                                        </div>
                                    </div>

                                    {/* Payment Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-lg bg-muted/50">
                                            <p className="text-xs text-muted-foreground mb-1">Amount</p>
                                            <p className="text-xl font-bold text-primary">
                                                ₹{selectedReg.amount.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-lg bg-muted/50">
                                            <p className="text-xs text-muted-foreground mb-1">Registration Date</p>
                                            <p className="font-medium">{selectedReg.registrationDate}</p>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                                        Close
                                    </Button>
                                    <Button variant="outline" className="gap-2">
                                        <Receipt className="h-4 w-4" />
                                        Download Receipt
                                    </Button>
                                    <Button className="gap-2">
                                        <Mail className="h-4 w-4" />
                                        Send Email
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Registrations Table */}
                <Card>
                    <CardHeader className="pb-3 px-3 sm:px-6">
                        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                            <TabsList className="w-full sm:w-auto h-auto flex-wrap sm:flex-nowrap gap-1 p-1">
                                <TabsTrigger value="all" className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                                    All ({registrations.length})
                                </TabsTrigger>
                                <TabsTrigger value="confirmed" className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                                    <span className="hidden sm:inline">Confirmed</span>
                                    <span className="sm:hidden">OK</span> ({confirmedCount})
                                </TabsTrigger>
                                <TabsTrigger value="pending" className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                                    <span className="hidden sm:inline">Pending</span>
                                    <span className="sm:hidden">Pend</span> ({pendingCount})
                                </TabsTrigger>
                                <TabsTrigger value="waitlist" className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                                    <span className="hidden sm:inline">Waitlist</span>
                                    <span className="sm:hidden">Wait</span> ({waitlistCount})
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-6">
                        {/* Desktop Table View */}
                        <div className="hidden sm:block rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={selectedRegistrations.length === filteredRegistrations.length}
                                                onCheckedChange={toggleAll}
                                            />
                                        </TableHead>
                                        <TableHead>Attendee</TableHead>
                                        <TableHead className="hidden md:table-cell">Event</TableHead>
                                        <TableHead className="hidden lg:table-cell">Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRegistrations.map((reg, index) => (
                                        <TableRow
                                            key={reg.id}
                                            className="animate-fadeIn"
                                            style={{ animationDelay: `${index * 0.03}s` }}
                                        >
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedRegistrations.includes(reg.id)}
                                                    onCheckedChange={() => toggleRegistration(reg.id)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarFallback className="bg-primary/10 text-primary">
                                                            {getInitials(reg.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0">
                                                        <p className="font-medium truncate">{reg.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate">
                                                            {reg.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <p className="text-sm truncate max-w-[200px]">{reg.event}</p>
                                                <p className="text-xs text-muted-foreground">{reg.eventDate}</p>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <Badge variant="outline">{reg.category}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    {getStatusBadge(reg.status)}
                                                    <div>{getPaymentBadge(reg.paymentStatus)}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium">₹{reg.amount.toLocaleString()}</p>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => {
                                                            setSelectedReg(reg);
                                                            setIsViewOpen(true);
                                                        }}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setSelectedReg(reg);
                                                                    setIsViewOpen(true);
                                                                }}
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Registration
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem>
                                                                <Mail className="mr-2 h-4 w-4" />
                                                                Send Email
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Receipt className="mr-2 h-4 w-4" />
                                                                Download Receipt
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <FileText className="mr-2 h-4 w-4" />
                                                                Generate Certificate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            {reg.status === "pending" && (
                                                                <DropdownMenuItem>
                                                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                    Confirm Registration
                                                                </DropdownMenuItem>
                                                            )}
                                                            {reg.status === "waitlist" && (
                                                                <DropdownMenuItem>
                                                                    <RefreshCw className="mr-2 h-4 w-4" />
                                                                    Move to Confirmed
                                                                </DropdownMenuItem>
                                                            )}
                                                            {reg.paymentStatus === "pending" && (
                                                                <DropdownMenuItem>
                                                                    <CreditCard className="mr-2 h-4 w-4" />
                                                                    Mark as Paid
                                                                </DropdownMenuItem>
                                                            )}
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-destructive">
                                                                <Ban className="mr-2 h-4 w-4" />
                                                                Cancel Registration
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="sm:hidden space-y-3">
                            {filteredRegistrations.map((reg, index) => (
                                <div
                                    key={reg.id}
                                    className="p-3 rounded-lg border bg-card animate-fadeIn"
                                    style={{ animationDelay: `${index * 0.03}s` }}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <Checkbox
                                                checked={selectedRegistrations.includes(reg.id)}
                                                onCheckedChange={() => toggleRegistration(reg.id)}
                                            />
                                            <Avatar className="h-9 w-9 shrink-0">
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                    {getInitials(reg.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-sm truncate">{reg.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{reg.email}</p>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => { setSelectedReg(reg); setIsViewOpen(true); }}>
                                                    <Eye className="mr-2 h-4 w-4" /> View
                                                </DropdownMenuItem>
                                                <DropdownMenuItem><Mail className="mr-2 h-4 w-4" /> Email</DropdownMenuItem>
                                                <DropdownMenuItem><Receipt className="mr-2 h-4 w-4" /> Receipt</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">
                                                    <Ban className="mr-2 h-4 w-4" /> Cancel
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <div className="mt-2 pt-2 border-t">
                                        <p className="text-xs text-muted-foreground truncate mb-1">{reg.event}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-1">
                                                {getStatusBadge(reg.status)}
                                                {getPaymentBadge(reg.paymentStatus)}
                                            </div>
                                            <p className="text-sm font-semibold">₹{reg.amount.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredRegistrations.length === 0 && (
                            <div className="text-center py-12">
                                <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                <h3 className="text-lg font-medium mb-2">No registrations found</h3>
                                <p className="text-sm text-muted-foreground">
                                    {selectedTab === "all"
                                        ? "No registrations yet"
                                        : "No registrations match this filter"}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
