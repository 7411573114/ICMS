"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Award,
    ArrowLeft,
    Share2,
    Heart,
    Ticket,
    GraduationCap,
    Building2,
    User,
    Crown,
    Medal,
    Star,
    ExternalLink,
    Phone,
    Mail,
    Globe,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Mock event data - in real app, fetch from API
const eventData = {
    id: 1,
    title: "National Neurostimulation Summit 2026",
    description: `Join us for India's premier neurostimulation conference of the year, bringing together leading experts, researchers, and clinicians from across the globe.

This comprehensive 2-day summit will cover the latest advances in deep brain stimulation, spinal cord stimulation, and emerging neurostimulation technologies. Participants will gain insights into cutting-edge research, clinical best practices, and future directions in the field.

**Key Topics:**
- Deep Brain Stimulation for Movement Disorders
- Spinal Cord Stimulation Techniques
- Closed-Loop Neurostimulation Systems
- Non-Invasive Brain Stimulation
- Clinical Outcomes and Patient Selection
- Emerging Technologies and Future Directions`,
    date: "Jan 10-11, 2026",
    startDate: "2026-01-10",
    endDate: "2026-01-11",
    time: "09:00 AM - 05:00 PM",
    location: "Grand Conference Hall, AIIMS, New Delhi",
    address: "Ansari Nagar, New Delhi, Delhi 110029",
    mapLink: "https://maps.google.com",
    type: "Conference",
    registrations: 156,
    capacity: 200,
    status: "upcoming",
    price: 6500,
    earlyBirdPrice: 5000,
    earlyBirdDeadline: "Dec 31, 2025",
    cmeCredits: 16,
    contactEmail: "summit@aiims.edu",
    contactPhone: "+91 11 2659 3000",
    website: "https://neurostim.aiims.edu",
    categories: [
        { name: "Faculty", price: 6500, earlyBirdPrice: 5000, slots: 60, registered: 48 },
        { name: "Resident/Fellow", price: 4000, earlyBirdPrice: 3500, slots: 100, registered: 82 },
        { name: "Student", price: 2000, earlyBirdPrice: 1500, slots: 40, registered: 26 },
    ],
    sponsors: [
        { id: 1, name: "Medtronic India", tier: "platinum", website: "https://medtronic.com", logo: null },
        { id: 2, name: "Boston Scientific", tier: "gold", website: "https://bostonscientific.com", logo: null },
        { id: 3, name: "Abbott Neuromodulation", tier: "gold", website: "https://abbott.com", logo: null },
        { id: 4, name: "Stryker India", tier: "silver", website: "https://stryker.com", logo: null },
        { id: 5, name: "LivaNova", tier: "silver", website: "https://livanova.com", logo: null },
    ],
    speakers: [
        {
            id: 1,
            name: "Dr. Rajesh Kumar",
            designation: "Professor & Head, Neurology",
            institution: "AIIMS, New Delhi",
            topic: "Advances in Deep Brain Stimulation",
            photo: null,
        },
        {
            id: 2,
            name: "Dr. Priya Sharma",
            designation: "Associate Professor, Neurosurgery",
            institution: "CMC Vellore",
            topic: "Minimally Invasive Neurosurgical Techniques",
            photo: null,
        },
        {
            id: 3,
            name: "Dr. Sarah Johnson",
            designation: "Professor, Neuroscience",
            institution: "Johns Hopkins University, USA",
            topic: "Future of Brain-Computer Interfaces",
            photo: null,
        },
        {
            id: 4,
            name: "Dr. Amit Patel",
            designation: "Consultant Neurophysiologist",
            institution: "Kokilaben Hospital, Mumbai",
            topic: "Intraoperative Neurophysiological Monitoring",
            photo: null,
        },
    ],
    schedule: [
        {
            day: "Day 1 - Jan 10, 2026",
            sessions: [
                { time: "09:00 - 09:30", title: "Registration & Welcome Coffee", speaker: null },
                { time: "09:30 - 10:00", title: "Inaugural Session", speaker: null },
                { time: "10:00 - 11:00", title: "Keynote: Future of Neurostimulation", speaker: "Dr. Rajesh Kumar" },
                { time: "11:00 - 11:30", title: "Tea Break", speaker: null },
                { time: "11:30 - 13:00", title: "Panel Discussion: Clinical Challenges", speaker: "Multiple Speakers" },
                { time: "13:00 - 14:00", title: "Lunch Break", speaker: null },
                { time: "14:00 - 15:30", title: "Workshop: DBS Programming Basics", speaker: "Dr. Priya Sharma" },
                { time: "15:30 - 16:00", title: "Tea Break", speaker: null },
                { time: "16:00 - 17:00", title: "Research Presentations", speaker: "Various" },
            ],
        },
        {
            day: "Day 2 - Jan 11, 2026",
            sessions: [
                { time: "09:00 - 10:00", title: "Brain-Computer Interfaces", speaker: "Dr. Sarah Johnson" },
                { time: "10:00 - 11:00", title: "Intraoperative Monitoring", speaker: "Dr. Amit Patel" },
                { time: "11:00 - 11:30", title: "Tea Break", speaker: null },
                { time: "11:30 - 13:00", title: "Case Discussions", speaker: "Panel" },
                { time: "13:00 - 14:00", title: "Lunch Break", speaker: null },
                { time: "14:00 - 15:30", title: "Hands-on Session", speaker: "Faculty" },
                { time: "15:30 - 16:30", title: "Quiz & Awards", speaker: null },
                { time: "16:30 - 17:00", title: "Valedictory & Certificate Distribution", speaker: null },
            ],
        },
    ],
    includes: [
        "Conference kit and materials",
        "Lunch and refreshments on both days",
        "CME Certificate (16 credits)",
        "Access to all sessions and workshops",
        "Networking opportunities",
        "Post-event presentation downloads",
    ],
};

const tierConfig = {
    platinum: { icon: Crown, bgClass: "bg-slate-100", textClass: "text-slate-700", borderClass: "border-slate-300" },
    gold: { icon: Award, bgClass: "bg-yellow-50", textClass: "text-yellow-700", borderClass: "border-yellow-300" },
    silver: { icon: Medal, bgClass: "bg-gray-100", textClass: "text-gray-600", borderClass: "border-gray-300" },
};

export default function EventDetailPage() {
    const params = useParams();
    const event = eventData; // In real app, fetch by params.id
    const [activeTab, setActiveTab] = useState("overview");

    const slotsRemaining = event.capacity - event.registrations;
    const isAlmostFull = slotsRemaining <= 20;

    const getInitials = (name: string) => {
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg gradient-medical flex items-center justify-center">
                                <GraduationCap className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-xl">ICMS</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon">
                                <Share2 className="h-4 w-4" />
                            </Button>
                            <Link href="/">
                                <Button variant="outline" size="sm">
                                    Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Back Navigation */}
            <div className="border-b">
                <div className="container mx-auto px-4 py-4">
                    <Link href="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Events
                    </Link>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Event Header */}
                        <div className="animate-fadeIn">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge className="status-upcoming">{event.status}</Badge>
                                <Badge variant="outline">{event.type}</Badge>
                                {event.cmeCredits > 0 && (
                                    <Badge variant="outline" className="gap-1 status-active">
                                        <Award className="h-3 w-3" />
                                        {event.cmeCredits} CME Credits
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
                            <div className="flex flex-wrap gap-4 text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    {event.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    {event.time}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    {event.location}
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fadeIn stagger-1">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                                <TabsTrigger value="speakers">Speakers</TabsTrigger>
                                <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview" className="space-y-6 mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>About This Event</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                                            {event.description}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>What's Included</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {event.includes.map((item, index) => (
                                                <li key={index} className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-5 w-5 text-medical-green shrink-0" />
                                                    <span className="text-sm">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Venue</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h4 className="font-medium">{event.location}</h4>
                                            <p className="text-sm text-muted-foreground">{event.address}</p>
                                        </div>
                                        <Button variant="outline" className="gap-2" asChild>
                                            <a href={event.mapLink} target="_blank" rel="noopener noreferrer">
                                                <MapPin className="h-4 w-4" />
                                                View on Google Maps
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="schedule" className="space-y-6 mt-6">
                                {event.schedule.map((day, dayIndex) => (
                                    <Card key={dayIndex}>
                                        <CardHeader>
                                            <CardTitle>{day.day}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {day.sessions.map((session, sessionIndex) => (
                                                    <div
                                                        key={sessionIndex}
                                                        className={cn(
                                                            "flex gap-4 p-3 rounded-lg",
                                                            session.speaker ? "bg-muted/50" : "bg-muted/30"
                                                        )}
                                                    >
                                                        <div className="w-28 shrink-0 font-mono text-sm text-muted-foreground">
                                                            {session.time}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{session.title}</p>
                                                            {session.speaker && (
                                                                <p className="text-sm text-muted-foreground">
                                                                    {session.speaker}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>

                            <TabsContent value="speakers" className="space-y-6 mt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {event.speakers.map((speaker) => (
                                        <Card key={speaker.id} className="card-hover">
                                            <CardContent className="pt-6">
                                                <div className="flex items-start gap-4">
                                                    <Avatar className="h-16 w-16">
                                                        <AvatarImage src={speaker.photo || undefined} />
                                                        <AvatarFallback className="bg-primary/10 text-primary text-lg">
                                                            {getInitials(speaker.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h3 className="font-semibold">{speaker.name}</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {speaker.designation}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {speaker.institution}
                                                        </p>
                                                        <div className="mt-2">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {speaker.topic}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>

                            <TabsContent value="sponsors" className="space-y-6 mt-6">
                                {(["platinum", "gold", "silver"] as const).map((tier) => {
                                    const tierSponsors = event.sponsors.filter((s) => s.tier === tier);
                                    if (tierSponsors.length === 0) return null;
                                    const config = tierConfig[tier];
                                    const TierIcon = config.icon;

                                    return (
                                        <Card key={tier}>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 capitalize">
                                                    <TierIcon className={cn("h-5 w-5", config.textClass)} />
                                                    {tier} Sponsors
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className={cn(
                                                    "grid gap-4",
                                                    tier === "platinum" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-2 md:grid-cols-3"
                                                )}>
                                                    {tierSponsors.map((sponsor) => (
                                                        <a
                                                            key={sponsor.id}
                                                            href={sponsor.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={cn(
                                                                "flex items-center gap-3 p-4 rounded-xl border-2 transition-all hover:shadow-md",
                                                                config.bgClass,
                                                                config.borderClass
                                                            )}
                                                        >
                                                            <div className="h-12 w-12 rounded-lg bg-white flex items-center justify-center shrink-0">
                                                                <Building2 className="h-6 w-6 text-muted-foreground" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className={cn("font-medium truncate", config.textClass)}>
                                                                    {sponsor.name}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                                    Visit website <ExternalLink className="h-3 w-3" />
                                                                </p>
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Registration Card */}
                        <Card className="sticky top-24 animate-fadeIn">
                            <CardHeader>
                                <CardTitle>Register Now</CardTitle>
                                {isAlmostFull && (
                                    <div className="flex items-center gap-2 text-medical-orange text-sm">
                                        <AlertCircle className="h-4 w-4" />
                                        Only {slotsRemaining} slots remaining!
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Pricing */}
                                <div className="space-y-3">
                                    {event.categories.map((category, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                                        >
                                            <div>
                                                <p className="font-medium">{category.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {category.slots - category.registered} slots left
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                {category.earlyBirdPrice && (
                                                    <p className="text-xs text-muted-foreground line-through">
                                                        ₹{category.price.toLocaleString()}
                                                    </p>
                                                )}
                                                <p className="font-bold text-primary">
                                                    ₹{(category.earlyBirdPrice || category.price).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {event.earlyBirdDeadline && (
                                    <div className="p-3 rounded-lg bg-medical-orange-light border border-medical-orange/20">
                                        <p className="text-sm text-medical-orange font-medium">
                                            Early bird pricing ends {event.earlyBirdDeadline}
                                        </p>
                                    </div>
                                )}

                                {/* Progress */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Registration Progress</span>
                                        <span className="font-medium">
                                            {event.registrations}/{event.capacity}
                                        </span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                <Link href={`/events/${event.id}/register`} className="block">
                                    <Button className="w-full gap-2 gradient-medical text-white hover:opacity-90" size="lg">
                                        <Ticket className="h-5 w-5" />
                                        Register Now
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Contact Card */}
                        <Card className="animate-fadeIn stagger-1">
                            <CardHeader>
                                <CardTitle className="text-base">Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <a
                                    href={`mailto:${event.contactEmail}`}
                                    className="flex items-center gap-3 text-sm hover:text-primary"
                                >
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    {event.contactEmail}
                                </a>
                                <a
                                    href={`tel:${event.contactPhone}`}
                                    className="flex items-center gap-3 text-sm hover:text-primary"
                                >
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    {event.contactPhone}
                                </a>
                                <a
                                    href={event.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-sm hover:text-primary"
                                >
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                    Event Website
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t py-8 bg-muted/30 mt-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg gradient-medical flex items-center justify-center">
                                <GraduationCap className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold">ICMS</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © 2025 Medical College. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
