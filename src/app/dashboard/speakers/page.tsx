"use client";

import React, { useState } from "react";
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Mail,
    Phone,
    Building2,
    Calendar,
    Clock,
    Upload,
    User,
    GraduationCap,
    Linkedin,
    Twitter,
    Globe,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const speakers = [
    {
        id: 1,
        name: "Dr. Rajesh Kumar",
        photo: null,
        designation: "Professor & Head",
        department: "Neurology",
        institution: "AIIMS, New Delhi",
        email: "rajesh.kumar@aiims.edu",
        phone: "+91 98765 43210",
        topic: "Advances in Deep Brain Stimulation",
        sessionDate: "2025-01-15",
        sessionTime: "09:00 AM - 10:30 AM",
        biography: "Dr. Rajesh Kumar is a renowned neurologist with over 25 years of experience in movement disorders and deep brain stimulation. He has published over 150 research papers and trained numerous specialists.",
        status: "confirmed",
        isPublished: true,
        linkedin: "https://linkedin.com/in/drrajeshkumar",
        twitter: "https://twitter.com/drrajeshk",
    },
    {
        id: 2,
        name: "Dr. Priya Sharma",
        photo: null,
        designation: "Associate Professor",
        department: "Neurosurgery",
        institution: "CMC Vellore",
        email: "priya.sharma@cmcvellore.ac.in",
        phone: "+91 87654 32109",
        topic: "Minimally Invasive Neurosurgical Techniques",
        sessionDate: "2025-01-15",
        sessionTime: "11:00 AM - 12:30 PM",
        biography: "Dr. Priya Sharma specializes in minimally invasive neurosurgery and has pioneered several techniques in endoscopic surgery. She is an award-winning researcher and educator.",
        status: "confirmed",
        isPublished: true,
        linkedin: "https://linkedin.com/in/drpriyasharma",
    },
    {
        id: 3,
        name: "Dr. Amit Patel",
        photo: null,
        designation: "Consultant Neurophysiologist",
        department: "Clinical Neurophysiology",
        institution: "Kokilaben Hospital, Mumbai",
        email: "amit.patel@kokilaben.com",
        phone: "+91 76543 21098",
        topic: "Intraoperative Neurophysiological Monitoring",
        sessionDate: "2025-01-16",
        sessionTime: "09:00 AM - 10:00 AM",
        biography: "Dr. Amit Patel is an expert in intraoperative neurophysiological monitoring with experience in over 5000 surgeries.",
        status: "pending",
        isPublished: false,
    },
    {
        id: 4,
        name: "Dr. Sarah Johnson",
        photo: null,
        designation: "Professor",
        department: "Neuroscience",
        institution: "Johns Hopkins University, USA",
        email: "sjohnson@jhu.edu",
        phone: "+1 410 555 0123",
        topic: "Future of Brain-Computer Interfaces",
        sessionDate: "2025-01-16",
        sessionTime: "02:00 PM - 03:30 PM",
        biography: "Dr. Sarah Johnson is a leading researcher in brain-computer interfaces and neural engineering. She leads a team of 30 researchers at Johns Hopkins.",
        status: "invited",
        isPublished: false,
        website: "https://www.sarahjohnsonlab.com",
    },
];

export default function SpeakersPage() {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedSpeaker, setSelectedSpeaker] = useState<typeof speakers[0] | null>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState("all");

    const filteredSpeakers = speakers.filter((speaker) => {
        if (selectedTab === "all") return true;
        if (selectedTab === "published") return speaker.isPublished;
        return speaker.status === selectedTab;
    });

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { class: string; label: string }> = {
            confirmed: { class: "status-active", label: "Confirmed" },
            pending: { class: "status-pending", label: "Pending" },
            invited: { class: "status-upcoming", label: "Invited" },
            declined: { class: "bg-destructive/10 text-destructive", label: "Declined" },
        };
        const config = statusConfig[status] || statusConfig.pending;
        return (
            <Badge variant="outline" className={cn("border-0", config.class)}>
                {config.label}
            </Badge>
        );
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <DashboardLayout
            title="Speakers"
            subtitle="Manage speaker profiles and session assignments"
        >
            <div className="space-y-6 animate-fadeIn">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <Card className="card-hover">
                        <CardContent className="p-3 sm:pt-6 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="icon-container icon-container-teal h-10 w-10 sm:h-12 sm:w-12">
                                    <User className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-bold">{speakers.length}</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="card-hover">
                        <CardContent className="p-3 sm:pt-6 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="icon-container icon-container-green h-10 w-10 sm:h-12 sm:w-12">
                                    <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-bold">
                                        {speakers.filter((s) => s.status === "confirmed").length}
                                    </p>
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
                                    <p className="text-xl sm:text-2xl font-bold">
                                        {speakers.filter((s) => s.status === "pending" || s.status === "invited").length}
                                    </p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Pending</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="card-hover">
                        <CardContent className="p-3 sm:pt-6 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="icon-container icon-container-blue h-10 w-10 sm:h-12 sm:w-12">
                                    <Globe className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-bold">
                                        {speakers.filter((s) => s.isPublished).length}
                                    </p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Published</p>
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
                            <Input placeholder="Search speakers..." className="pl-10" />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2 gradient-medical text-white hover:opacity-90">
                                <Plus className="w-4 h-4" />
                                Add Speaker
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Add New Speaker</DialogTitle>
                                <DialogDescription>
                                    Add a speaker profile for your event
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                {/* Photo Upload */}
                                <div className="flex items-center gap-4">
                                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-1">
                                        <Button variant="outline" size="sm">
                                            Upload Photo
                                        </Button>
                                        <p className="text-xs text-muted-foreground">
                                            Recommended: 400x400px, JPG or PNG
                                        </p>
                                    </div>
                                </div>

                                <div className="section-divider-gradient my-2" />

                                {/* Basic Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="sm:col-span-2 space-y-2">
                                        <Label htmlFor="name" className="text-xs sm:text-sm">Full Name *</Label>
                                        <Input id="name" placeholder="Dr. John Smith" className="h-9 sm:h-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="designation" className="text-xs sm:text-sm">Designation *</Label>
                                        <Input id="designation" placeholder="Professor & Head" className="h-9 sm:h-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="department" className="text-xs sm:text-sm">Department</Label>
                                        <Input id="department" placeholder="Neurology" className="h-9 sm:h-10" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="institution">Institution *</Label>
                                    <Input id="institution" placeholder="Medical College Name" />
                                </div>

                                <div className="section-divider-gradient my-2" />

                                {/* Contact Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-xs sm:text-sm">Email *</Label>
                                        <Input id="email" type="email" placeholder="speaker@institution.edu" className="h-9 sm:h-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-xs sm:text-sm">Phone</Label>
                                        <Input id="phone" type="tel" placeholder="+91 98765 43210" className="h-9 sm:h-10" />
                                    </div>
                                </div>

                                <div className="section-divider-gradient my-2" />

                                {/* Session Info */}
                                <div className="space-y-2">
                                    <Label htmlFor="topic" className="text-xs sm:text-sm">Topic / Session Title *</Label>
                                    <Input id="topic" placeholder="Advances in Neurostimulation" className="h-9 sm:h-10" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="sessionDate" className="text-xs sm:text-sm">Session Date</Label>
                                        <Input id="sessionDate" type="date" className="h-9 sm:h-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="startTime" className="text-xs sm:text-sm">Start Time</Label>
                                        <Input id="startTime" type="time" className="h-9 sm:h-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="endTime" className="text-xs sm:text-sm">End Time</Label>
                                        <Input id="endTime" type="time" className="h-9 sm:h-10" />
                                    </div>
                                </div>

                                <div className="section-divider-gradient my-2" />

                                {/* Biography */}
                                <div className="space-y-2">
                                    <Label htmlFor="biography">Short Biography *</Label>
                                    <Textarea
                                        id="biography"
                                        placeholder="A brief introduction about the speaker's background, achievements, and expertise..."
                                        rows={4}
                                    />
                                </div>

                                {/* Social Links */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="linkedin" className="text-xs sm:text-sm">LinkedIn URL</Label>
                                        <Input id="linkedin" placeholder="https://linkedin.com/in/..." className="h-9 sm:h-10" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="website" className="text-xs sm:text-sm">Website</Label>
                                        <Input id="website" placeholder="https://..." className="h-9 sm:h-10" />
                                    </div>
                                </div>

                                {/* Status & Publish */}
                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <div className="space-y-0.5">
                                        <Label>Publish on Event Page</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Make this speaker visible to attendees
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={() => setIsCreateOpen(false)}>Add Speaker</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Speaker View Dialog */}
                <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                    <DialogContent className="max-w-2xl">
                        {selectedSpeaker && (
                            <>
                                <DialogHeader>
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage src={selectedSpeaker.photo || undefined} />
                                            <AvatarFallback className="text-lg bg-primary/10 text-primary">
                                                {getInitials(selectedSpeaker.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <DialogTitle className="text-xl">
                                                {selectedSpeaker.name}
                                            </DialogTitle>
                                            <DialogDescription className="mt-1">
                                                <span className="font-medium text-foreground">
                                                    {selectedSpeaker.designation}
                                                </span>
                                                {selectedSpeaker.department && `, ${selectedSpeaker.department}`}
                                            </DialogDescription>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{selectedSpeaker.institution}</span>
                                            </div>
                                            <div className="flex gap-2 mt-3">
                                                {getStatusBadge(selectedSpeaker.status)}
                                                {selectedSpeaker.isPublished && (
                                                    <Badge variant="secondary">Published</Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                    <div className="section-divider-gradient" />

                                    {/* Session Info */}
                                    <div className="p-4 rounded-lg gradient-medical-light border border-primary/10">
                                        <h4 className="font-semibold mb-2">Session Details</h4>
                                        <p className="text-sm font-medium text-primary mb-2">
                                            {selectedSpeaker.topic}
                                        </p>
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {selectedSpeaker.sessionDate}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {selectedSpeaker.sessionTime}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Biography */}
                                    <div>
                                        <h4 className="font-semibold mb-2">Biography</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            {selectedSpeaker.biography}
                                        </p>
                                    </div>

                                    {/* Contact */}
                                    <div>
                                        <h4 className="font-semibold mb-2">Contact</h4>
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <a
                                                href={`mailto:${selectedSpeaker.email}`}
                                                className="flex items-center gap-1 text-primary hover:underline"
                                            >
                                                <Mail className="h-4 w-4" />
                                                {selectedSpeaker.email}
                                            </a>
                                            {selectedSpeaker.phone && (
                                                <a
                                                    href={`tel:${selectedSpeaker.phone}`}
                                                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                                                >
                                                    <Phone className="h-4 w-4" />
                                                    {selectedSpeaker.phone}
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Social Links */}
                                    {(selectedSpeaker.linkedin || selectedSpeaker.twitter || selectedSpeaker.website) && (
                                        <div>
                                            <h4 className="font-semibold mb-2">Links</h4>
                                            <div className="flex gap-2">
                                                {selectedSpeaker.linkedin && (
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href={selectedSpeaker.linkedin} target="_blank" rel="noopener noreferrer">
                                                            <Linkedin className="h-4 w-4 mr-1" />
                                                            LinkedIn
                                                        </a>
                                                    </Button>
                                                )}
                                                {selectedSpeaker.twitter && (
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href={selectedSpeaker.twitter} target="_blank" rel="noopener noreferrer">
                                                            <Twitter className="h-4 w-4 mr-1" />
                                                            Twitter
                                                        </a>
                                                    </Button>
                                                )}
                                                {selectedSpeaker.website && (
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href={selectedSpeaker.website} target="_blank" rel="noopener noreferrer">
                                                            <Globe className="h-4 w-4 mr-1" />
                                                            Website
                                                        </a>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <DialogFooter className="mt-4">
                                    <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                                        Close
                                    </Button>
                                    <Button>Edit Speaker</Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Speakers Grid */}
                <Card>
                    <CardHeader className="pb-3 px-3 sm:px-6">
                        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                            <TabsList className="w-full sm:w-auto h-auto flex-wrap sm:flex-nowrap gap-1 p-1">
                                <TabsTrigger value="all" className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                                    All
                                </TabsTrigger>
                                <TabsTrigger value="confirmed" className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                                    Confirmed
                                </TabsTrigger>
                                <TabsTrigger value="pending" className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                                    Pending
                                </TabsTrigger>
                                <TabsTrigger value="published" className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                                    Published
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredSpeakers.map((speaker, index) => (
                                <div
                                    key={speaker.id}
                                    className="p-4 rounded-xl border border-border bg-card card-hover animate-fadeIn"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="flex items-start gap-3">
                                        <Avatar className="h-14 w-14">
                                            <AvatarImage src={speaker.photo || undefined} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                {getInitials(speaker.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-semibold truncate">{speaker.name}</h3>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {speaker.designation}
                                                    </p>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedSpeaker(speaker);
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
                                                            <Mail className="mr-2 h-4 w-4" />
                                                            Send Email
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive">
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                                        <Building2 className="h-3 w-3" />
                                        <span className="truncate">{speaker.institution}</span>
                                    </div>

                                    <div className="mt-3 p-3 rounded-lg bg-muted/50">
                                        <p className="text-sm font-medium text-foreground line-clamp-2">
                                            {speaker.topic}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {speaker.sessionDate}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {speaker.sessionTime?.split(" - ")[0]}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        {getStatusBadge(speaker.status)}
                                        {speaker.isPublished && (
                                            <Badge variant="outline" className="bg-medical-green-light text-medical-green border-0">
                                                Published
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredSpeakers.length === 0 && (
                            <div className="text-center py-12">
                                <User className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                <h3 className="text-lg font-medium mb-2">No speakers found</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {selectedTab === "all"
                                        ? "Add your first speaker to get started"
                                        : "No speakers match this filter"}
                                </p>
                                {selectedTab === "all" && (
                                    <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Add Speaker
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
