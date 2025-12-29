"use client";

import { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
    Calendar,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    MapPin,
    Users,
    Clock,
    Eye,
    Edit,
    Copy,
    Trash2,
    UserPlus,
    Award,
    Mail,
    FileText,
    ChevronDown,
    X,
    SlidersHorizontal,
    Grid3X3,
    List,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const events = [
    {
        id: 1,
        title: "Epilepsy Management CME Session",
        date: "Dec 29, 2025",
        time: "02:00 PM - 06:00 PM",
        location: "Conference Room A, NIMHANS Bangalore",
        city: "Bangalore",
        registrations: 72,
        capacity: 80,
        status: "upcoming",
        type: "CME",
        category: "Neurology",
        revenue: 108000,
        cmeCredits: 4,
    },
    {
        id: 2,
        title: "Deep Brain Stimulation Hands-on Workshop",
        date: "Jan 5, 2026",
        time: "09:00 AM - 05:00 PM",
        location: "Simulation Lab, CMC Vellore",
        city: "Vellore",
        registrations: 27,
        capacity: 30,
        status: "upcoming",
        type: "Workshop",
        category: "Surgery",
        revenue: 102600,
        cmeCredits: 8,
    },
    {
        id: 3,
        title: "National Neurostimulation Summit 2026",
        date: "Jan 10-11, 2026",
        time: "09:00 AM - 05:00 PM",
        location: "Grand Conference Hall, AIIMS New Delhi",
        city: "New Delhi",
        registrations: 156,
        capacity: 200,
        status: "upcoming",
        type: "Conference",
        category: "Neurology",
        revenue: 780000,
        cmeCredits: 16,
    },
    {
        id: 4,
        title: "Neural Engineering Research Symposium",
        date: "Jan 18, 2026",
        time: "09:00 AM - 06:00 PM",
        location: "Virtual Event (Zoom)",
        city: "Virtual",
        registrations: 89,
        capacity: 200,
        status: "upcoming",
        type: "Symposium",
        category: "Research",
        revenue: 133500,
        cmeCredits: 8,
    },
    {
        id: 5,
        title: "Spinal Cord Stimulation Masterclass",
        date: "Jan 25, 2026",
        time: "10:00 AM - 04:00 PM",
        location: "Training Center, Apollo Hospital Chennai",
        city: "Chennai",
        registrations: 18,
        capacity: 25,
        status: "upcoming",
        type: "Masterclass",
        category: "Surgery",
        revenue: 86400,
        cmeCredits: 6,
    },
    {
        id: 6,
        title: "Movement Disorders Update 2025",
        date: "Dec 15, 2025",
        time: "09:00 AM - 01:00 PM",
        location: "Auditorium, KEM Hospital Mumbai",
        city: "Mumbai",
        registrations: 65,
        capacity: 65,
        status: "completed",
        type: "Summit",
        category: "Neurology",
        revenue: 78000,
        cmeCredits: 4,
    },
    {
        id: 7,
        title: "Medical AI & Innovation Forum 2026",
        date: "Feb 8, 2026",
        time: "10:00 AM - 06:00 PM",
        location: "HICC, Hyderabad",
        city: "Hyderabad",
        registrations: 95,
        capacity: 250,
        status: "draft",
        type: "Conference",
        category: "Research",
        revenue: 0,
        cmeCredits: 6,
    },
    {
        id: 8,
        title: "Interventional Pain Management Conference",
        date: "Dec 7-8, 2025",
        time: "09:00 AM - 05:00 PM",
        location: "Hotel Taj Palace, New Delhi",
        city: "New Delhi",
        registrations: 180,
        capacity: 180,
        status: "completed",
        type: "Conference",
        category: "Neurology",
        revenue: 900000,
        cmeCredits: 12,
    },
];

const categories = ["All Categories", "Neurology", "Surgery", "General Medicine", "Research", "Pediatrics"];
const eventTypes = ["All Types", "Conference", "Workshop", "CME", "Symposium", "Masterclass", "Summit"];
const locations = ["All Locations", "New Delhi", "Vellore", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune", "Virtual"];
const statuses = ["All Status", "Upcoming", "Completed", "Draft", "Cancelled"];

export default function EventsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedType, setSelectedType] = useState("All Types");
    const [selectedLocation, setSelectedLocation] = useState("All Locations");
    const [selectedStatus, setSelectedStatus] = useState("All Status");
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Filter events
    const filteredEvents = events.filter((event) => {
        const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All Categories" || event.category === selectedCategory;
        const matchesType = selectedType === "All Types" || event.type === selectedType;
        const matchesLocation = selectedLocation === "All Locations" ||
            event.city === selectedLocation ||
            (selectedLocation === "Virtual" && event.city === "Virtual");
        const matchesStatus = selectedStatus === "All Status" ||
            event.status.toLowerCase() === selectedStatus.toLowerCase();
        return matchesSearch && matchesCategory && matchesType && matchesLocation && matchesStatus;
    });

    // Count active filters
    const activeFilterCount = [
        selectedCategory !== "All Categories",
        selectedType !== "All Types",
        selectedLocation !== "All Locations",
        selectedStatus !== "All Status",
    ].filter(Boolean).length;

    // Clear all filters
    const clearFilters = () => {
        setSelectedCategory("All Categories");
        setSelectedType("All Types");
        setSelectedLocation("All Locations");
        setSelectedStatus("All Status");
        setSearchQuery("");
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "upcoming":
                return { label: "Upcoming", className: "bg-blue-100 text-blue-700 border-blue-200", icon: Calendar };
            case "completed":
                return { label: "Completed", className: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 };
            case "draft":
                return { label: "Draft", className: "bg-gray-100 text-gray-700 border-gray-200", icon: FileText };
            case "cancelled":
                return { label: "Cancelled", className: "bg-red-100 text-red-700 border-red-200", icon: AlertCircle };
            default:
                return { label: status, className: "bg-gray-100 text-gray-700 border-gray-200", icon: Calendar };
        }
    };

    const getCapacityStatus = (registrations: number, capacity: number) => {
        const percentage = (registrations / capacity) * 100;
        if (percentage >= 100) return { text: "Sold Out", color: "text-red-600", bgColor: "bg-red-500" };
        if (percentage >= 80) return { text: "Almost Full", color: "text-orange-600", bgColor: "bg-orange-500" };
        if (percentage >= 50) return { text: "Filling Up", color: "text-yellow-600", bgColor: "bg-yellow-500" };
        return { text: "Available", color: "text-green-600", bgColor: "bg-green-500" };
    };

    return (
        <DashboardLayout title="Events" subtitle="Manage your events and sessions">
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col gap-4">
                    {/* Top Row: Search and Create */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-between">
                        <div className="flex flex-1 gap-3">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search events..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-10"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Filter Toggle - Mobile */}
                            <Button
                                variant="outline"
                                className="lg:hidden gap-2"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                Filters
                                {activeFilterCount > 0 && (
                                    <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                                        {activeFilterCount}
                                    </Badge>
                                )}
                                <ChevronDown className={cn("w-4 h-4 transition-transform", showFilters && "rotate-180")} />
                            </Button>

                            {/* View Toggle */}
                            <div className="hidden sm:flex border rounded-lg p-1">
                                <Button
                                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "secondary" : "ghost"}
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <Link href="/dashboard/events/create">
                            <Button className="gradient-medical text-white hover:opacity-90 w-full sm:w-auto">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Event
                            </Button>
                        </Link>
                    </div>

                    {/* Desktop Filters */}
                    <div className="hidden lg:flex flex-wrap gap-3 items-center">
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                {eventTypes.map((type) => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Location" />
                            </SelectTrigger>
                            <SelectContent>
                                {locations.map((loc) => (
                                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((status) => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {activeFilterCount > 0 && (
                            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                                <X className="w-4 h-4 mr-1" />
                                Clear filters
                            </Button>
                        )}
                    </div>

                    {/* Mobile Filters */}
                    {showFilters && (
                        <div className="lg:hidden grid grid-cols-2 gap-3 p-4 bg-muted/50 rounded-xl animate-fadeIn">
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {eventTypes.map((type) => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locations.map((loc) => (
                                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((status) => (
                                        <SelectItem key={status} value={status}>{status}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {activeFilterCount > 0 && (
                                <Button variant="outline" size="sm" onClick={clearFilters} className="col-span-2">
                                    <X className="w-4 h-4 mr-1" />
                                    Clear all filters
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing <span className="font-medium text-foreground">{filteredEvents.length}</span> of {events.length} events
                    </p>
                </div>

                {/* Events Grid */}
                {filteredEvents.length === 0 ? (
                    <div className="text-center py-12 bg-muted/30 rounded-xl">
                        <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2">No events found</h3>
                        <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
                        <Button variant="outline" onClick={clearFilters}>
                            Clear all filters
                        </Button>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredEvents.map((event) => {
                            const statusConfig = getStatusConfig(event.status);
                            const capacityStatus = getCapacityStatus(event.registrations, event.capacity);
                            const StatusIcon = statusConfig.icon;

                            return (
                                <div
                                    key={event.id}
                                    className="bg-background rounded-xl border border-border p-5 hover:shadow-lg transition-all hover:border-primary/20"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={cn("text-xs", statusConfig.className)}>
                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                {statusConfig.label}
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs">
                                                {event.type}
                                            </Badge>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/events/${event.id}`}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/events/${event.id}/edit`}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit Event
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Copy className="mr-2 h-4 w-4" />
                                                    Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/registrations?event=${event.id}`}>
                                                        <UserPlus className="mr-2 h-4 w-4" />
                                                        View Registrations
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Mail className="mr-2 h-4 w-4" />
                                                    Email Attendees
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Award className="mr-2 h-4 w-4" />
                                                    Generate Certificates
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <FileText className="mr-2 h-4 w-4" />
                                                    Export Report
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete Event
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <Link href={`/dashboard/events/${event.id}`}>
                                        <h3 className="font-semibold text-foreground mb-3 line-clamp-2 hover:text-primary transition-colors">
                                            {event.title}
                                        </h3>
                                    </Link>

                                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 shrink-0" />
                                            <span>{event.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 shrink-0" />
                                            <span>{event.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 shrink-0" />
                                            <span className="truncate">{event.location}</span>
                                        </div>
                                    </div>

                                    {/* Capacity Bar */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-muted-foreground">Registrations</span>
                                            <span className={cn("font-medium", capacityStatus.color)}>
                                                {capacityStatus.text}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full transition-all", capacityStatus.bgColor)}
                                                style={{ width: `${Math.min((event.registrations / event.capacity) * 100, 100)}%` }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between text-xs mt-1">
                                            <span className="text-muted-foreground">{event.registrations} / {event.capacity}</span>
                                            <span className="text-muted-foreground">{Math.round((event.registrations / event.capacity) * 100)}%</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-border">
                                        <div className="flex items-center gap-2">
                                            <Award className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-medium">{event.cmeCredits} CME</span>
                                        </div>
                                        {event.revenue > 0 && (
                                            <div className="flex items-center gap-1 text-sm">
                                                <TrendingUp className="w-4 h-4 text-green-600" />
                                                <span className="font-medium text-green-600">
                                                    ₹{(event.revenue / 1000).toFixed(0)}K
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* List View */
                    <div className="bg-background rounded-xl border border-border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50 border-b">
                                    <tr>
                                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Event</th>
                                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3 hidden md:table-cell">Date</th>
                                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Location</th>
                                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Status</th>
                                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Registrations</th>
                                        <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3 hidden xl:table-cell">Revenue</th>
                                        <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredEvents.map((event) => {
                                        const statusConfig = getStatusConfig(event.status);
                                        const StatusIcon = statusConfig.icon;

                                        return (
                                            <tr key={event.id} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-4">
                                                    <div>
                                                        <Link href={`/dashboard/events/${event.id}`}>
                                                            <p className="font-medium hover:text-primary transition-colors line-clamp-1">
                                                                {event.title}
                                                            </p>
                                                        </Link>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge variant="secondary" className="text-xs">{event.type}</Badge>
                                                            <Badge variant="outline" className="text-xs">{event.category}</Badge>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 hidden md:table-cell">
                                                    <div className="text-sm">
                                                        <p>{event.date}</p>
                                                        <p className="text-muted-foreground text-xs">{event.time}</p>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 hidden lg:table-cell">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                                                        <span className="truncate max-w-[200px]">{event.city}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Badge variant="outline" className={cn("text-xs", statusConfig.className)}>
                                                        <StatusIcon className="w-3 h-3 mr-1" />
                                                        {statusConfig.label}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-4 hidden sm:table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-sm font-medium">
                                                            {event.registrations}/{event.capacity}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 hidden xl:table-cell">
                                                    {event.revenue > 0 ? (
                                                        <span className="text-sm font-medium text-green-600">
                                                            ₹{event.revenue.toLocaleString()}
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/dashboard/events/${event.id}`}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Details
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/dashboard/events/${event.id}/edit`}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit Event
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Copy className="mr-2 h-4 w-4" />
                                                                Duplicate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/dashboard/registrations?event=${event.id}`}>
                                                                    <UserPlus className="mr-2 h-4 w-4" />
                                                                    View Registrations
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Mail className="mr-2 h-4 w-4" />
                                                                Email Attendees
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Award className="mr-2 h-4 w-4" />
                                                                Generate Certificates
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <FileText className="mr-2 h-4 w-4" />
                                                                Export Report
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete Event
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
