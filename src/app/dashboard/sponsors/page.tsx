"use client";

import React, { useState } from "react";
import {
    Search,
    Plus,
    Filter,
    MoreHorizontal,
    Globe,
    Mail,
    Building2,
    Edit,
    Trash2,
    Eye,
    ExternalLink,
    Upload,
    Crown,
    Award,
    Medal,
    Star,
    IndianRupee,
    Calendar,
    Link2,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const sponsors = [
    {
        id: 1,
        name: "MedTech Solutions Pvt Ltd",
        logo: null,
        tier: "platinum",
        contact: "Rahul Verma",
        email: "rahul@medtech.in",
        phone: "+91 98765 43210",
        website: "https://www.medtech.in",
        description: "Leading provider of neurostimulation devices and medical equipment in South Asia.",
        events: ["CME Session 2025", "Annual Symposium 2025"],
        amount: 500000,
        startDate: "2024-01-01",
        endDate: "2025-12-31",
        isActive: true,
        displayOnWebsite: true,
    },
    {
        id: 2,
        name: "NeuroDevices India",
        logo: null,
        tier: "gold",
        contact: "Dr. Anita Sharma",
        email: "anita@neurodevices.in",
        phone: "+91 87654 32109",
        website: "https://www.neurodevices.in",
        description: "Specializing in advanced neural monitoring and diagnostic equipment.",
        events: ["Workshop - Deep Brain Stimulation"],
        amount: 250000,
        startDate: "2024-06-01",
        endDate: "2025-06-30",
        isActive: true,
        displayOnWebsite: true,
    },
    {
        id: 3,
        name: "Healthcare Partners Foundation",
        logo: null,
        tier: "gold",
        contact: "Sanjay Gupta",
        email: "sanjay@hcpf.org",
        phone: "+91 76543 21098",
        website: "https://www.hcpf.org",
        description: "Non-profit organization supporting medical education and research.",
        events: ["Research Conference 2025"],
        amount: 250000,
        startDate: "2024-01-01",
        endDate: "2025-12-31",
        isActive: true,
        displayOnWebsite: true,
    },
    {
        id: 4,
        name: "PharmaCorp India",
        logo: null,
        tier: "silver",
        contact: "Priya Menon",
        email: "priya@pharmacorp.in",
        phone: "+91 65432 10987",
        website: "https://www.pharmacorp.in",
        description: "Pharmaceutical company focused on neurological treatments.",
        events: ["CME Session 2025"],
        amount: 100000,
        startDate: "2024-09-01",
        endDate: "2025-08-31",
        isActive: true,
        displayOnWebsite: false,
    },
    {
        id: 5,
        name: "BioMed Research Labs",
        logo: null,
        tier: "silver",
        contact: "Dr. Vijay Kumar",
        email: "vijay@biomedlabs.com",
        phone: "+91 54321 09876",
        website: "https://www.biomedlabs.com",
        description: "Research laboratory specializing in neural tissue engineering.",
        events: ["Annual Symposium 2025"],
        amount: 100000,
        startDate: "2024-06-01",
        endDate: "2025-05-31",
        isActive: false,
        displayOnWebsite: false,
    },
];

const tierConfig = {
    platinum: {
        label: "Platinum",
        icon: Crown,
        className: "tier-platinum",
        textClass: "text-slate-700",
        bgClass: "bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100",
        borderClass: "border-slate-300",
        iconClass: "text-slate-600",
    },
    gold: {
        label: "Gold",
        icon: Award,
        className: "tier-gold",
        textClass: "text-yellow-700",
        bgClass: "bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50",
        borderClass: "border-yellow-300",
        iconClass: "text-yellow-600",
    },
    silver: {
        label: "Silver",
        icon: Medal,
        className: "tier-silver",
        textClass: "text-gray-600",
        bgClass: "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100",
        borderClass: "border-gray-300",
        iconClass: "text-gray-500",
    },
    bronze: {
        label: "Bronze",
        icon: Star,
        className: "",
        textClass: "text-orange-700",
        bgClass: "bg-gradient-to-r from-orange-50 via-orange-100 to-orange-50",
        borderClass: "border-orange-300",
        iconClass: "text-orange-600",
    },
};

export default function SponsorsPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedSponsor, setSelectedSponsor] = useState<typeof sponsors[0] | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState("all");

    const filteredSponsors = sponsors.filter((sponsor) => {
        if (selectedTab === "all") return true;
        if (selectedTab === "active") return sponsor.isActive;
        return sponsor.tier === selectedTab;
    });

    const getTierBadge = (tier: string) => {
        const config = tierConfig[tier as keyof typeof tierConfig];
        if (!config) return null;
        const TierIcon = config.icon;
        return (
            <Badge
                variant="outline"
                className={cn(
                    "gap-1 font-medium border",
                    config.bgClass,
                    config.textClass,
                    config.borderClass
                )}
            >
                <TierIcon className={cn("h-3 w-3", config.iconClass)} />
                {config.label}
            </Badge>
        );
    };

    const totalSponsorship = sponsors.reduce((sum, s) => sum + s.amount, 0);
    const activeSponsors = sponsors.filter((s) => s.isActive).length;

    return (
        <DashboardLayout
            title="Sponsors"
            subtitle="Manage event sponsors and partnerships"
        >
            <div className="space-y-6 animate-fadeIn">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <Card className="card-hover">
                        <CardContent className="p-3 sm:pt-6 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="icon-container icon-container-teal h-10 w-10 sm:h-12 sm:w-12">
                                    <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-bold">{sponsors.length}</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="card-hover">
                        <CardContent className="p-3 sm:pt-6 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="icon-container icon-container-green h-10 w-10 sm:h-12 sm:w-12">
                                    <Crown className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-bold">{activeSponsors}</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Active</p>
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
                                    <p className="text-xl sm:text-2xl font-bold">
                                        {(totalSponsorship / 100000).toFixed(1)}L
                                    </p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Value</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="card-hover">
                        <CardContent className="p-3 sm:pt-6 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="icon-container icon-container-orange h-10 w-10 sm:h-12 sm:w-12">
                                    <Globe className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-bold">
                                        {sponsors.filter((s) => s.displayOnWebsite).length}
                                    </p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Website</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tier Overview */}
                <Card className="border-primary/10">
                    <CardHeader>
                        <CardTitle className="text-base">Sponsorship Tiers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                            {(["platinum", "gold", "silver", "bronze"] as const).map((tier) => {
                                const config = tierConfig[tier];
                                const count = sponsors.filter((s) => s.tier === tier).length;
                                const TierIcon = config.icon;
                                return (
                                    <div
                                        key={tier}
                                        className={cn(
                                            "p-3 sm:p-4 rounded-xl border-2 text-center transition-all hover:scale-105 cursor-pointer",
                                            config.bgClass,
                                            config.borderClass
                                        )}
                                        onClick={() => setSelectedTab(tier)}
                                    >
                                        <TierIcon className={cn("h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-1 sm:mb-2", config.iconClass)} />
                                        <p className={cn("text-sm sm:text-base font-semibold", config.textClass)}>
                                            {config.label}
                                        </p>
                                        <p className="text-xl sm:text-2xl font-bold mt-1">{count}</p>
                                        <p className="text-[10px] sm:text-xs text-muted-foreground">sponsors</p>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex flex-1 gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search sponsors..." className="pl-10" />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 gradient-medical text-white hover:opacity-90">
                                <Plus className="w-4 h-4" />
                                Add Sponsor
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add New Sponsor</DialogTitle>
                                <DialogDescription>
                                    Add a sponsor or partner for your events
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {/* Logo Upload */}
                                <div className="flex items-center gap-4">
                                    <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed border-border">
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-1">
                                        <Button variant="outline" size="sm">
                                            Upload Logo
                                        </Button>
                                        <p className="text-xs text-muted-foreground">
                                            Recommended: 400x200px, PNG with transparency
                                        </p>
                                    </div>
                                </div>

                                <div className="section-divider-gradient my-2" />

                                {/* Basic Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 space-y-2">
                                        <Label htmlFor="name">Company/Organization Name *</Label>
                                        <Input id="name" placeholder="MedTech Solutions Pvt Ltd" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="tier">Sponsorship Tier *</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select tier" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="platinum">
                                                    <div className="flex items-center gap-2">
                                                        <Crown className="h-4 w-4 text-slate-600" />
                                                        Platinum
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="gold">
                                                    <div className="flex items-center gap-2">
                                                        <Award className="h-4 w-4 text-yellow-600" />
                                                        Gold
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="silver">
                                                    <div className="flex items-center gap-2">
                                                        <Medal className="h-4 w-4 text-gray-500" />
                                                        Silver
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="bronze">
                                                    <div className="flex items-center gap-2">
                                                        <Star className="h-4 w-4 text-orange-600" />
                                                        Bronze
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Sponsorship Amount (₹)</Label>
                                        <Input id="amount" type="number" placeholder="500000" />
                                    </div>
                                </div>

                                <div className="section-divider-gradient my-2" />

                                {/* Contact Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="contact">Contact Person *</Label>
                                        <Input id="contact" placeholder="Rahul Verma" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input id="email" type="email" placeholder="rahul@company.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" type="tel" placeholder="+91 98765 43210" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="website">Website</Label>
                                        <Input id="website" placeholder="https://www.company.com" />
                                    </div>
                                </div>

                                <div className="section-divider-gradient my-2" />

                                {/* Duration */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="startDate">Partnership Start</Label>
                                        <Input id="startDate" type="date" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="endDate">Partnership End</Label>
                                        <Input id="endDate" type="date" />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Label htmlFor="description">About the Sponsor</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Brief description about the company and their involvement..."
                                        rows={3}
                                    />
                                </div>

                                {/* Events */}
                                <div className="space-y-2">
                                    <Label>Associated Events</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select events" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cme2025">CME Session 2025</SelectItem>
                                            <SelectItem value="symposium2025">Annual Symposium 2025</SelectItem>
                                            <SelectItem value="workshop">Workshop - Deep Brain Stimulation</SelectItem>
                                            <SelectItem value="research">Research Conference 2025</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Display Settings */}
                                <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Active Partnership</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Mark this partnership as currently active
                                            </p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Display on Website</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Show this sponsor on event pages
                                            </p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={() => setIsCreateOpen(false)}>Add Sponsor</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Sponsor View Dialog */}
                <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                    <DialogContent className="max-w-2xl">
                        {selectedSponsor && (
                            <>
                                <DialogHeader>
                                    <div className="flex items-start gap-4">
                                        <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center">
                                            <Building2 className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between">
                                                <DialogTitle className="text-xl">
                                                    {selectedSponsor.name}
                                                </DialogTitle>
                                                {getTierBadge(selectedSponsor.tier)}
                                            </div>
                                            <DialogDescription className="mt-2">
                                                {selectedSponsor.description}
                                            </DialogDescription>
                                        </div>
                                    </div>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                    <div className="section-divider-gradient" />

                                    {/* Sponsorship Details */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-lg bg-muted/50">
                                            <p className="text-xs text-muted-foreground mb-1">
                                                Sponsorship Value
                                            </p>
                                            <p className="text-xl font-bold text-primary">
                                                ₹{selectedSponsor.amount.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-lg bg-muted/50">
                                            <p className="text-xs text-muted-foreground mb-1">
                                                Partnership Period
                                            </p>
                                            <p className="text-sm font-medium">
                                                {selectedSponsor.startDate} to {selectedSponsor.endDate}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Contact */}
                                    <div>
                                        <h4 className="font-semibold mb-3">Contact Information</h4>
                                        <div className="space-y-2 text-sm">
                                            <p>
                                                <span className="text-muted-foreground">Contact:</span>{" "}
                                                <span className="font-medium">{selectedSponsor.contact}</span>
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                                <a
                                                    href={`mailto:${selectedSponsor.email}`}
                                                    className="text-primary hover:underline"
                                                >
                                                    {selectedSponsor.email}
                                                </a>
                                            </p>
                                            {selectedSponsor.phone && (
                                                <p className="flex items-center gap-2">
                                                    <span className="text-muted-foreground">Phone:</span>
                                                    {selectedSponsor.phone}
                                                </p>
                                            )}
                                            {selectedSponsor.website && (
                                                <p className="flex items-center gap-2">
                                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                                    <a
                                                        href={selectedSponsor.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline flex items-center gap-1"
                                                    >
                                                        {selectedSponsor.website}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Associated Events */}
                                    <div>
                                        <h4 className="font-semibold mb-3">Sponsored Events</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedSponsor.events.map((event, index) => (
                                                <Badge key={index} variant="secondary" className="gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {event}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="flex gap-2">
                                        {selectedSponsor.isActive ? (
                                            <Badge className="status-active border-0">Active</Badge>
                                        ) : (
                                            <Badge variant="outline">Inactive</Badge>
                                        )}
                                        {selectedSponsor.displayOnWebsite && (
                                            <Badge className="status-upcoming border-0">On Website</Badge>
                                        )}
                                    </div>
                                </div>
                                <DialogFooter className="mt-4">
                                    <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                                        Close
                                    </Button>
                                    <Button>Edit Sponsor</Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Sponsors List */}
                <Card>
                    <CardHeader className="pb-3 px-3 sm:px-6">
                        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                            <TabsList className="w-full sm:w-auto h-auto flex-wrap sm:flex-nowrap gap-1 p-1">
                                <TabsTrigger value="all" className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                                    All
                                </TabsTrigger>
                                <TabsTrigger value="platinum" className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                                    Platinum
                                </TabsTrigger>
                                <TabsTrigger value="gold" className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                                    Gold
                                </TabsTrigger>
                                <TabsTrigger value="silver" className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                                    Silver
                                </TabsTrigger>
                                <TabsTrigger value="active" className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                                    Active
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredSponsors.map((sponsor, index) => {
                                const config = tierConfig[sponsor.tier as keyof typeof tierConfig];
                                return (
                                    <div
                                        key={sponsor.id}
                                        className={cn(
                                            "p-4 rounded-xl border-2 bg-card card-hover animate-fadeIn",
                                            config?.borderClass || "border-border"
                                        )}
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-lg flex items-center justify-center",
                                                    config?.bgClass || "bg-muted"
                                                )}>
                                                    <Building2 className={cn(
                                                        "w-6 h-6",
                                                        config?.iconClass || "text-muted-foreground"
                                                    )} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-foreground line-clamp-1">
                                                        {sponsor.name}
                                                    </h3>
                                                    {getTierBadge(sponsor.tier)}
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedSponsor(sponsor);
                                                            setIsViewOpen(true);
                                                        }}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Link2 className="mr-2 h-4 w-4" />
                                                        Visit Website
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                            {sponsor.description}
                                        </p>

                                        <div className="space-y-1 text-sm text-muted-foreground mb-3">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3 h-3" />
                                                <span className="truncate">{sponsor.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-3 h-3" />
                                                <span className="truncate">
                                                    {sponsor.website?.replace("https://", "")}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-border">
                                            <div className="flex items-center gap-2">
                                                {sponsor.isActive ? (
                                                    <Badge variant="outline" className="status-active border-0 text-xs">
                                                        Active
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-xs">
                                                        Inactive
                                                    </Badge>
                                                )}
                                            </div>
                                            <span className="text-sm font-semibold text-foreground">
                                                ₹{(sponsor.amount / 100000).toFixed(1)}L
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {filteredSponsors.length === 0 && (
                            <div className="text-center py-12">
                                <Building2 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                <h3 className="text-lg font-medium mb-2">No sponsors found</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {selectedTab === "all"
                                        ? "Add your first sponsor to get started"
                                        : "No sponsors match this filter"}
                                </p>
                                {selectedTab === "all" && (
                                    <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Add Sponsor
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
