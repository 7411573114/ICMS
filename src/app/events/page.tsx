"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    Search,
    ChevronRight,
    Award,
    Crown,
    Medal,
    ArrowRight,
    Ticket,
    GraduationCap,
    Sparkles,
    TrendingUp,
    Zap,
    Globe,
    Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const events = [
    {
        id: 1,
        title: "National Neurostimulation Summit 2026",
        shortDescription: "Join 200+ leading neurologists and neurosurgeons for India's premier neurostimulation conference featuring live surgical demonstrations and panel discussions.",
        date: "Jan 10-11, 2026",
        time: "09:00 AM - 05:00 PM",
        location: "Grand Conference Hall, AIIMS, New Delhi",
        type: "Conference",
        registrations: 156,
        capacity: 200,
        status: "upcoming",
        price: 6500,
        earlyBirdPrice: 5000,
        earlyBirdDeadline: "Dec 31, 2025",
        cmeCredits: 16,
        image: null,
        featured: true,
        sponsors: [
            { name: "Medtronic India", tier: "platinum", logo: null },
            { name: "Boston Scientific", tier: "gold", logo: null },
            { name: "Abbott Neuromodulation", tier: "gold", logo: null },
            { name: "Stryker India", tier: "silver", logo: null },
        ],
        speakers: 12,
        sessions: 16,
    },
    {
        id: 2,
        title: "Deep Brain Stimulation Hands-on Workshop",
        shortDescription: "Intensive hands-on workshop on DBS programming, troubleshooting, and patient management with cadaveric demonstrations.",
        date: "Jan 5, 2026",
        time: "09:00 AM - 05:00 PM",
        location: "Simulation Lab, CMC Vellore",
        type: "Workshop",
        registrations: 27,
        capacity: 30,
        status: "upcoming",
        price: 4500,
        earlyBirdPrice: 3800,
        earlyBirdDeadline: "Dec 30, 2025",
        cmeCredits: 8,
        image: null,
        featured: false,
        sponsors: [
            { name: "Medtronic India", tier: "gold", logo: null },
            { name: "BioMed Instruments", tier: "silver", logo: null },
        ],
        speakers: 5,
        sessions: 6,
    },
    {
        id: 3,
        title: "Epilepsy Management CME Session",
        shortDescription: "Comprehensive CME covering latest advances in epilepsy diagnosis, medical management, and surgical interventions.",
        date: "Dec 29, 2025",
        time: "02:00 PM - 06:00 PM",
        location: "Conference Room A, NIMHANS, Bangalore",
        type: "CME Session",
        registrations: 72,
        capacity: 80,
        status: "upcoming",
        price: 1500,
        earlyBirdPrice: null,
        earlyBirdDeadline: null,
        cmeCredits: 4,
        image: null,
        featured: false,
        sponsors: [
            { name: "Sun Pharma", tier: "gold", logo: null },
            { name: "Cipla Neurosciences", tier: "silver", logo: null },
        ],
        speakers: 4,
        sessions: 4,
    },
    {
        id: 4,
        title: "Neural Engineering Research Symposium",
        shortDescription: "Presenting cutting-edge research in brain-computer interfaces, neuroprosthetics, and computational neuroscience.",
        date: "Jan 18, 2026",
        time: "09:00 AM - 06:00 PM",
        location: "Virtual Event (Zoom)",
        type: "Symposium",
        registrations: 89,
        capacity: 200,
        status: "upcoming",
        price: 2000,
        earlyBirdPrice: 1500,
        earlyBirdDeadline: "Jan 10, 2026",
        cmeCredits: 8,
        image: null,
        featured: false,
        sponsors: [
            { name: "IIT Delhi", tier: "platinum", logo: null },
            { name: "DBT India", tier: "gold", logo: null },
        ],
        speakers: 15,
        sessions: 10,
    },
    {
        id: 5,
        title: "Spinal Cord Stimulation Masterclass",
        shortDescription: "Advanced masterclass on SCS implantation techniques, patient selection, and outcome optimization strategies.",
        date: "Jan 25, 2026",
        time: "10:00 AM - 04:00 PM",
        location: "Training Center, Apollo Hospital, Chennai",
        type: "Workshop",
        registrations: 18,
        capacity: 25,
        status: "upcoming",
        price: 5500,
        earlyBirdPrice: 4800,
        earlyBirdDeadline: "Jan 15, 2026",
        cmeCredits: 6,
        image: null,
        featured: false,
        sponsors: [
            { name: "Boston Scientific", tier: "gold", logo: null },
            { name: "Nevro Corp", tier: "silver", logo: null },
        ],
        speakers: 3,
        sessions: 5,
    },
    {
        id: 6,
        title: "Movement Disorders Update 2025",
        shortDescription: "Annual update on Parkinson's disease, dystonia, and essential tremor management with focus on device-aided therapies.",
        date: "Dec 15, 2025",
        time: "09:00 AM - 01:00 PM",
        location: "Auditorium, KEM Hospital, Mumbai",
        type: "Seminar",
        registrations: 65,
        capacity: 65,
        status: "completed",
        price: 1200,
        earlyBirdPrice: null,
        earlyBirdDeadline: null,
        cmeCredits: 4,
        image: null,
        featured: false,
        sponsors: [
            { name: "Abbott India", tier: "gold", logo: null },
        ],
        speakers: 4,
        sessions: 4,
    },
    {
        id: 7,
        title: "Interventional Pain Management Conference",
        shortDescription: "Multi-disciplinary conference on advanced interventional techniques for chronic pain including neuromodulation approaches.",
        date: "Dec 7-8, 2025",
        time: "09:00 AM - 05:00 PM",
        location: "Hotel Taj Palace, New Delhi",
        type: "Conference",
        registrations: 180,
        capacity: 180,
        status: "completed",
        price: 5000,
        earlyBirdPrice: null,
        earlyBirdDeadline: null,
        cmeCredits: 12,
        image: null,
        featured: false,
        sponsors: [
            { name: "Medtronic India", tier: "platinum", logo: null },
            { name: "St. Jude Medical", tier: "gold", logo: null },
            { name: "Bioness Inc", tier: "silver", logo: null },
        ],
        speakers: 10,
        sessions: 14,
    },
    {
        id: 8,
        title: "Pediatric Neurology CME Workshop",
        shortDescription: "Focused workshop on pediatric epilepsy surgery evaluation and vagus nerve stimulation in children.",
        date: "Nov 22, 2025",
        time: "10:00 AM - 03:00 PM",
        location: "PGIMER, Chandigarh",
        type: "Workshop",
        registrations: 35,
        capacity: 35,
        status: "completed",
        price: 2500,
        earlyBirdPrice: null,
        earlyBirdDeadline: null,
        cmeCredits: 5,
        image: null,
        featured: false,
        sponsors: [
            { name: "LivaNova", tier: "gold", logo: null },
        ],
        speakers: 6,
        sessions: 5,
    },
];

const tierIcons = {
    platinum: Crown,
    gold: Award,
    silver: Medal,
};

const typeColors: Record<string, { bg: string; text: string; icon: string }> = {
    Conference: { bg: "bg-medical-blue-light", text: "text-medical-blue", icon: "bg-medical-blue" },
    Workshop: { bg: "bg-medical-purple-light", text: "text-medical-purple", icon: "bg-medical-purple" },
    Symposium: { bg: "bg-medical-teal-light", text: "text-medical-teal", icon: "bg-medical-teal" },
    Seminar: { bg: "bg-medical-green-light", text: "text-medical-green", icon: "bg-medical-green" },
    "CME Session": { bg: "bg-medical-orange-light", text: "text-medical-orange", icon: "bg-medical-orange" },
};

const typeIcons: Record<string, React.ElementType> = {
    Conference: Globe,
    Workshop: Zap,
    Symposium: TrendingUp,
    Seminar: GraduationCap,
    "CME Session": Award,
};

export default function PublicEventsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("upcoming");

    const filteredEvents = events.filter((event) => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === "all" || event.type.toLowerCase() === filterType.toLowerCase();
        const matchesStatus = filterStatus === "all" || event.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const featuredEvent = filteredEvents.find(e => e.featured && e.status === "upcoming");
    const regularEvents = filteredEvents.filter(e => !(e.featured && e.status === "upcoming"));

    const getSlotsInfo = (event: typeof events[0]) => {
        const remaining = event.capacity - event.registrations;
        const percentage = (event.registrations / event.capacity) * 100;
        if (remaining <= 0) return { text: "Sold Out", color: "text-destructive", percentage: 100, urgent: true };
        if (remaining <= 10) return { text: `${remaining} left`, color: "text-medical-orange", percentage, urgent: true };
        return { text: `${remaining} available`, color: "text-medical-green", percentage, urgent: false };
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-xl gradient-medical flex items-center justify-center">
                                <GraduationCap className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-xl">ICMS</span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/events" className="text-sm font-medium text-primary">
                                Events
                            </Link>
                            <Link href="/speakers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Speakers
                            </Link>
                            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                About
                            </Link>
                        </nav>
                        <div className="flex items-center gap-3">
                            <Link href="/">
                                <Button variant="outline" size="sm" className="rounded-full">
                                    Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0 wavy-bg" />
                <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-medical-teal/5 blur-3xl animate-float-slow" />
                <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-medical-blue/5 blur-3xl animate-float" />

                <div className="container mx-auto px-4 relative">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fadeIn">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Medical Education & CME Programs</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                            Discover Medical
                            <span className="text-gradient block mt-2">Conferences & Events</span>
                        </h1>
                        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                            Register for the latest medical conferences, CME sessions, workshops, and symposiums from leading healthcare institutions.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-xl mx-auto animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                            <div className="relative flex items-center">
                                <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Search events by name..."
                                    className="pl-12 pr-4 h-14 rounded-2xl text-base bg-background/80 backdrop-blur border-border/50 shadow-lg shadow-primary/5 focus:shadow-primary/10 transition-shadow"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="py-6 border-y bg-background/50 backdrop-blur">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">{events.filter(e => e.status === 'upcoming').length}</div>
                            <div className="text-sm text-muted-foreground">Upcoming Events</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">{events.reduce((acc, e) => acc + e.speakers, 0)}</div>
                            <div className="text-sm text-muted-foreground">Expert Speakers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">{events.reduce((acc, e) => acc + e.cmeCredits, 0)}</div>
                            <div className="text-sm text-muted-foreground">CME Credits Available</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-primary">{events.reduce((acc, e) => acc + e.registrations, 0)}+</div>
                            <div className="text-sm text-muted-foreground">Registrations</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex flex-wrap gap-3">
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="w-[160px] rounded-xl">
                                    <SelectValue placeholder="Event Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="conference">Conference</SelectItem>
                                    <SelectItem value="workshop">Workshop</SelectItem>
                                    <SelectItem value="symposium">Symposium</SelectItem>
                                    <SelectItem value="seminar">Seminar</SelectItem>
                                    <SelectItem value="cme">CME Session</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-[160px] rounded-xl">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Events</SelectItem>
                                    <SelectItem value="upcoming">Upcoming</SelectItem>
                                    <SelectItem value="completed">Past Events</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Showing <span className="font-semibold text-foreground">{filteredEvents.length}</span> events
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Event */}
            {featuredEvent && (
                <section className="pb-8">
                    <div className="container mx-auto px-4">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-medical-blue/10 border border-primary/20 p-1">
                            <div className="relative overflow-hidden rounded-[22px] bg-background">
                                <div className="grid lg:grid-cols-2 gap-0">
                                    {/* Featured Image Section */}
                                    <div className="relative h-64 lg:h-auto min-h-[320px] bg-gradient-to-br from-primary via-medical-blue to-medical-teal flex items-center justify-center">
                                        <div className="absolute inset-0 opacity-20">
                                            <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-2 border-white/30 animate-pulse-slow" />
                                            <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full border-2 border-white/20 animate-float" />
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/10" />
                                        </div>
                                        <div className="relative text-center text-white p-8">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur mb-4">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-medium">Featured Event</span>
                                            </div>
                                            <Calendar className="h-20 w-20 mx-auto mb-4 opacity-90" />
                                            <div className="text-2xl font-bold">{featuredEvent.date}</div>
                                        </div>
                                    </div>

                                    {/* Featured Content */}
                                    <div className="p-8 lg:p-10 flex flex-col justify-center">
                                        <div className="flex flex-wrap items-center gap-2 mb-4">
                                            <Badge className={cn("rounded-full", typeColors[featuredEvent.type]?.bg, typeColors[featuredEvent.type]?.text)}>
                                                {featuredEvent.type}
                                            </Badge>
                                            {featuredEvent.cmeCredits > 0 && (
                                                <Badge variant="outline" className="rounded-full gap-1 status-active">
                                                    <Award className="h-3 w-3" />
                                                    {featuredEvent.cmeCredits} CME Credits
                                                </Badge>
                                            )}
                                        </div>

                                        <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                                            <Link href={`/events/${featuredEvent.id}`} className="hover:text-primary transition-colors">
                                                {featuredEvent.title}
                                            </Link>
                                        </h2>

                                        <p className="text-muted-foreground mb-6 text-lg">
                                            {featuredEvent.shortDescription}
                                        </p>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Clock className="h-4 w-4 text-primary" />
                                                {featuredEvent.time}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="h-4 w-4 text-primary" />
                                                {featuredEvent.location.split(',')[0]}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Users className="h-4 w-4 text-primary" />
                                                {featuredEvent.speakers} Speakers
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Ticket className="h-4 w-4 text-primary" />
                                                {featuredEvent.sessions} Sessions
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t">
                                            <div>
                                                {featuredEvent.earlyBirdPrice && (
                                                    <span className="text-sm text-muted-foreground line-through mr-2">
                                                        ₹{featuredEvent.price.toLocaleString()}
                                                    </span>
                                                )}
                                                <span className="text-3xl font-bold text-primary">
                                                    ₹{(featuredEvent.earlyBirdPrice || featuredEvent.price).toLocaleString()}
                                                </span>
                                                {featuredEvent.earlyBirdDeadline && (
                                                    <p className="text-xs text-medical-orange mt-1">
                                                        Early bird until {featuredEvent.earlyBirdDeadline}
                                                    </p>
                                                )}
                                            </div>
                                            <Link href={`/events/${featuredEvent.id}/register`}>
                                                <Button size="lg" className="rounded-xl gap-2 gradient-medical text-white hover:opacity-90 shadow-lg shadow-primary/25">
                                                    <Ticket className="h-5 w-5" />
                                                    Register Now
                                                    <ArrowRight className="h-5 w-5" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Events Grid */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {regularEvents.length > 0 && (
                        <>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-10 w-1 rounded-full gradient-medical" />
                                <h2 className="text-2xl font-bold">All Events</h2>
                            </div>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {regularEvents.map((event, index) => {
                                    const slots = getSlotsInfo(event);
                                    const TypeIcon = typeIcons[event.type] || Calendar;
                                    const colors = typeColors[event.type] || typeColors.Seminar;

                                    return (
                                        <div
                                            key={event.id}
                                            className={cn(
                                                "group relative bg-card rounded-2xl border border-border/50 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2",
                                                event.status === "completed" && "opacity-75"
                                            )}
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            {/* Card Header / Image Area */}
                                            <div className={cn(
                                                "relative h-48 flex items-center justify-center overflow-hidden",
                                                "bg-gradient-to-br from-muted/50 to-muted"
                                            )}>
                                                {/* Background Pattern */}
                                                <div className="absolute inset-0 opacity-30">
                                                    <div className="absolute top-4 right-4 w-20 h-20 rounded-full border border-primary/20" />
                                                    <div className="absolute bottom-8 left-8 w-12 h-12 rounded-full border border-primary/10" />
                                                </div>

                                                {/* Type Icon */}
                                                <div className={cn(
                                                    "relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3",
                                                    colors.icon
                                                )}>
                                                    <TypeIcon className="h-10 w-10 text-white" />
                                                </div>

                                                {/* Status Badge */}
                                                <div className="absolute top-4 left-4">
                                                    <Badge
                                                        className={cn(
                                                            "rounded-full shadow-sm",
                                                            event.status === "upcoming"
                                                                ? "bg-medical-green text-white"
                                                                : "bg-muted text-muted-foreground"
                                                        )}
                                                    >
                                                        {event.status === "upcoming" ? "Upcoming" : "Completed"}
                                                    </Badge>
                                                </div>

                                                {/* CME Credits */}
                                                {event.cmeCredits > 0 && (
                                                    <div className="absolute top-4 right-4">
                                                        <Badge variant="secondary" className="rounded-full gap-1 bg-white/90 text-foreground shadow-sm">
                                                            <Award className="h-3 w-3 text-medical-gold" />
                                                            {event.cmeCredits} CME
                                                        </Badge>
                                                    </div>
                                                )}

                                                {/* Date Overlay */}
                                                <div className="absolute bottom-4 left-4 right-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur shadow-sm">
                                                            <Calendar className="h-4 w-4 text-primary" />
                                                            <span className="text-sm font-medium">{event.date}</span>
                                                        </div>
                                                        <Badge variant="outline" className={cn("rounded-full bg-white/90", colors.text)}>
                                                            {event.type}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Card Content */}
                                            <div className="p-6">
                                                <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                    <Link href={`/events/${event.id}`}>
                                                        {event.title}
                                                    </Link>
                                                </h3>

                                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                                    {event.shortDescription}
                                                </p>

                                                {/* Event Details */}
                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Clock className="h-4 w-4 shrink-0" />
                                                        <span className="truncate">{event.time}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <MapPin className="h-4 w-4 shrink-0" />
                                                        <span className="truncate">{event.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Users className="h-4 w-4 shrink-0" />
                                                        <span>{event.speakers} Speakers • {event.sessions} Sessions</span>
                                                    </div>
                                                </div>

                                                {/* Sponsors Preview */}
                                                {event.sponsors.length > 0 && (
                                                    <div className="flex items-center gap-1 mb-4">
                                                        {event.sponsors.slice(0, 3).map((sponsor, idx) => {
                                                            const TierIcon = tierIcons[sponsor.tier as keyof typeof tierIcons] || Star;
                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    className={cn(
                                                                        "w-8 h-8 rounded-full flex items-center justify-center border-2 -ml-2 first:ml-0",
                                                                        sponsor.tier === "platinum" && "bg-slate-100 border-slate-300",
                                                                        sponsor.tier === "gold" && "bg-yellow-50 border-yellow-300",
                                                                        sponsor.tier === "silver" && "bg-gray-100 border-gray-300"
                                                                    )}
                                                                    title={sponsor.name}
                                                                >
                                                                    <TierIcon className={cn(
                                                                        "h-4 w-4",
                                                                        sponsor.tier === "platinum" && "text-slate-600",
                                                                        sponsor.tier === "gold" && "text-yellow-600",
                                                                        sponsor.tier === "silver" && "text-gray-500"
                                                                    )} />
                                                                </div>
                                                            );
                                                        })}
                                                        {event.sponsors.length > 3 && (
                                                            <span className="text-xs text-muted-foreground ml-1">
                                                                +{event.sponsors.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Progress & Slots */}
                                                <div className="mb-5">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs text-muted-foreground">
                                                            {event.registrations}/{event.capacity} registered
                                                        </span>
                                                        <span className={cn("text-xs font-medium", slots.color)}>
                                                            {slots.urgent && <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-1 animate-pulse" />}
                                                            {slots.text}
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                                        <div
                                                            className={cn(
                                                                "h-full rounded-full transition-all duration-700",
                                                                slots.percentage >= 90 ? "bg-destructive" :
                                                                slots.percentage >= 70 ? "bg-medical-orange" : "bg-medical-teal"
                                                            )}
                                                            style={{ width: `${slots.percentage}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Footer */}
                                                <div className="flex items-center justify-between pt-4 border-t">
                                                    {event.status === "upcoming" ? (
                                                        <>
                                                            <div>
                                                                {event.earlyBirdPrice && (
                                                                    <span className="text-xs text-muted-foreground line-through mr-1">
                                                                        ₹{event.price.toLocaleString()}
                                                                    </span>
                                                                )}
                                                                <span className="text-xl font-bold text-primary">
                                                                    ₹{(event.earlyBirdPrice || event.price).toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <Link href={`/events/${event.id}/register`}>
                                                                <Button size="sm" className="rounded-xl gap-1 gradient-medical text-white hover:opacity-90">
                                                                    Register
                                                                    <ArrowRight className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </>
                                                    ) : (
                                                        <Link href={`/events/${event.id}`} className="w-full">
                                                            <Button variant="outline" size="sm" className="w-full rounded-xl gap-1">
                                                                View Details
                                                                <ChevronRight className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {filteredEvents.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-muted flex items-center justify-center">
                                <Calendar className="h-12 w-12 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">No events found</h3>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                Try adjusting your search or filters to discover more events
                            </p>
                            <Button variant="outline" className="rounded-xl" onClick={() => {
                                setSearchQuery("");
                                setFilterType("all");
                                setFilterStatus("all");
                            }}>
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-10 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl gradient-medical flex items-center justify-center">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <span className="font-bold text-lg">ICMS</span>
                                <p className="text-sm text-muted-foreground">
                                    Integrated Conference Management System
                                </p>
                            </div>
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
