"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Users,
    Award,
    Edit,
    Copy,
    Trash2,
    Mail,
    FileText,
    MoreHorizontal,
    TrendingUp,
    IndianRupee,
    UserPlus,
    Download,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    Mic2,
    Building2,
    Eye,
    Send,
    Printer,
    QrCode,
    BarChart3,
    Phone,
    Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock event data - in real app, fetch based on ID
const eventsData: Record<string, typeof eventDetail> = {
    "1": {
        id: 1,
        title: "Epilepsy Management CME Session",
        description: "A comprehensive CME session covering the latest advances in epilepsy diagnosis, medical management, and surgical interventions. This session will provide practical training on patient selection and treatment optimization.",
        date: "Dec 29, 2025",
        endDate: "Dec 29, 2025",
        time: "02:00 PM - 06:00 PM",
        location: "Conference Room A, NIMHANS Bangalore",
        address: "National Institute of Mental Health and Neuro Sciences, Hosur Road, Bangalore - 560029",
        city: "Bangalore",
        mapLink: "https://maps.google.com",
        registrations: 72,
        capacity: 80,
        status: "upcoming",
        type: "CME",
        category: "Neurology",
        revenue: 108000,
        cmeCredits: 4,
        price: 1500,
        earlyBirdPrice: null,
        earlyBirdDeadline: null,
        registrationDeadline: "Dec 28, 2025",
        createdAt: "Nov 15, 2025",
        updatedAt: "Dec 20, 2025",
        organizer: "Department of Neurology, NIMHANS",
        contactEmail: "cme@nimhans.org",
        contactPhone: "+91 80 2699 5000",
        website: "https://nimhans.ac.in/cme",
        speakers: [
            { id: 1, name: "Dr. Sanjay Mehta", title: "Professor of Neurology", organization: "NIMHANS Bangalore", avatar: "SM" },
            { id: 2, name: "Dr. Priya Sharma", title: "Associate Professor", organization: "CMC Vellore", avatar: "PS" },
            { id: 3, name: "Dr. Amit Patel", title: "Epileptologist", organization: "Fortis Hospital", avatar: "AP" },
        ],
        sponsors: [
            { id: 1, name: "Sun Pharma", tier: "gold", logo: "SP", amount: 50000 },
            { id: 2, name: "Cipla Neurosciences", tier: "silver", logo: "CN", amount: 25000 },
        ],
        schedule: [
            { time: "02:00 - 02:15", title: "Registration & Welcome", speaker: "" },
            { time: "02:15 - 03:00", title: "Epilepsy Diagnosis & Classification", speaker: "Dr. Sanjay Mehta" },
            { time: "03:00 - 03:45", title: "Medical Management Updates", speaker: "Dr. Priya Sharma" },
            { time: "03:45 - 04:00", title: "Tea Break", speaker: "" },
            { time: "04:00 - 04:45", title: "Surgical Options in Epilepsy", speaker: "Dr. Amit Patel" },
            { time: "04:45 - 05:30", title: "Case Discussions", speaker: "All Speakers" },
            { time: "05:30 - 06:00", title: "Q&A and Certificate Distribution", speaker: "" },
        ],
        recentRegistrations: [
            { id: 1, name: "Dr. Priya Sharma", email: "priya.s@hospital.com", date: "Dec 29, 2025", amount: 1500, status: "confirmed" },
            { id: 2, name: "Dr. Vikram Singh", email: "vikram.s@clinic.com", date: "Dec 28, 2025", amount: 1500, status: "confirmed" },
            { id: 3, name: "Dr. Ananya Patel", email: "ananya.p@medical.edu", date: "Dec 27, 2025", amount: 1500, status: "confirmed" },
            { id: 4, name: "Dr. Rajesh Kumar", email: "rajesh.k@hospital.org", date: "Dec 26, 2025", amount: 1500, status: "pending" },
            { id: 5, name: "Dr. Meera Krishnan", email: "meera.k@clinic.in", date: "Dec 25, 2025", amount: 1500, status: "confirmed" },
        ],
    },
};

// Default event for IDs not in mock data
const eventDetail = {
    id: 1,
    title: "Epilepsy Management CME Session",
    description: "A comprehensive CME session covering the latest advances in epilepsy diagnosis and management.",
    date: "Dec 29, 2025",
    endDate: "Dec 29, 2025",
    time: "02:00 PM - 06:00 PM",
    location: "Conference Room A, NIMHANS Bangalore",
    address: "National Institute of Mental Health and Neuro Sciences, Hosur Road, Bangalore - 560029",
    city: "Bangalore",
    mapLink: "https://maps.google.com",
    registrations: 72,
    capacity: 80,
    status: "upcoming",
    type: "CME",
    category: "Neurology",
    revenue: 108000,
    cmeCredits: 4,
    price: 1500,
    earlyBirdPrice: null,
    earlyBirdDeadline: null,
    registrationDeadline: "Dec 28, 2025",
    createdAt: "Nov 15, 2025",
    updatedAt: "Dec 20, 2025",
    organizer: "Department of Neurology",
    contactEmail: "contact@event.com",
    contactPhone: "+91 80 2699 5000",
    website: "https://event.com",
    speakers: [
        { id: 1, name: "Dr. Sanjay Mehta", title: "Professor of Neurology", organization: "NIMHANS Bangalore", avatar: "SM" },
    ],
    sponsors: [
        { id: 1, name: "Sun Pharma", tier: "gold", logo: "SP", amount: 50000 },
    ],
    schedule: [
        { time: "02:00 - 03:00", title: "Opening Session", speaker: "Dr. Sanjay Mehta" },
    ],
    recentRegistrations: [
        { id: 1, name: "Dr. Priya Sharma", email: "priya.s@hospital.com", date: "Dec 29, 2025", amount: 1500, status: "confirmed" },
    ],
};

const tierConfig = {
    platinum: { label: "Platinum", className: "bg-slate-100 text-slate-700 border-slate-300" },
    gold: { label: "Gold", className: "bg-yellow-100 text-yellow-700 border-yellow-300" },
    silver: { label: "Silver", className: "bg-gray-100 text-gray-600 border-gray-300" },
};

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const eventId = params.id as string;
    const event = eventsData[eventId] || { ...eventDetail, id: parseInt(eventId) || 1 };

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

    const statusConfig = getStatusConfig(event.status);
    const StatusIcon = statusConfig.icon;
    const capacityPercentage = Math.round((event.registrations / event.capacity) * 100);

    return (
        <DashboardLayout title="Event Details" subtitle={event.title}>
            <div className="space-y-6">
                {/* Back Button & Actions */}
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <Link
                        href="/dashboard/events"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Events
                    </Link>

                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="h-4 w-4" />
                            Preview
                        </Button>
                        <Link href={`/dashboard/events/${event.id}/edit`}>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicate Event
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <QrCode className="mr-2 h-4 w-4" />
                                    Generate QR Code
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Printer className="mr-2 h-4 w-4" />
                                    Print Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Email All Attendees
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
                                <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => setDeleteDialogOpen(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Event
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Event Header Card */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Event Info */}
                            <div className="flex-1 space-y-4">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="outline" className={cn("text-xs", statusConfig.className)}>
                                        <StatusIcon className="w-3 h-3 mr-1" />
                                        {statusConfig.label}
                                    </Badge>
                                    <Badge variant="secondary">{event.type}</Badge>
                                    <Badge variant="outline">{event.category}</Badge>
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                        <Award className="w-3 h-3 mr-1" />
                                        {event.cmeCredits} CME Credits
                                    </Badge>
                                </div>

                                <h1 className="text-2xl font-bold">{event.title}</h1>
                                <p className="text-muted-foreground">{event.description}</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">{event.date}</p>
                                            <p className="text-sm text-muted-foreground">{event.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">{event.location}</p>
                                            <p className="text-sm text-muted-foreground">{event.city}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:w-64">
                                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                                    <div className="flex items-center gap-2 text-blue-600 mb-1">
                                        <Users className="h-4 w-4" />
                                        <span className="text-xs font-medium">Registrations</span>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-700">
                                        {event.registrations}/{event.capacity}
                                    </p>
                                    <div className="mt-2">
                                        <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-600 rounded-full"
                                                style={{ width: `${capacityPercentage}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-blue-600 mt-1">{capacityPercentage}% filled</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                                    <div className="flex items-center gap-2 text-green-600 mb-1">
                                        <TrendingUp className="h-4 w-4" />
                                        <span className="text-xs font-medium">Revenue</span>
                                    </div>
                                    <p className="text-2xl font-bold text-green-700">
                                        ₹{event.revenue.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-green-600 mt-1">
                                        Avg: ₹{Math.round(event.revenue / event.registrations).toLocaleString()}/registration
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 lg:w-auto lg:inline-grid">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="registrations">Registrations</TabsTrigger>
                        <TabsTrigger value="schedule">Schedule</TabsTrigger>
                        <TabsTrigger value="speakers">Speakers</TabsTrigger>
                        <TabsTrigger value="sponsors">Sponsors</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Event Details */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle>Event Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Event Type</p>
                                            <p className="font-medium">{event.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Category</p>
                                            <p className="font-medium">{event.category}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Registration Fee</p>
                                            <p className="font-medium">₹{event.price.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Early Bird Price</p>
                                            <p className="font-medium">{event.earlyBirdPrice ?? "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Early Bird Deadline</p>
                                            <p className="font-medium">{event.earlyBirdDeadline}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Registration Deadline</p>
                                            <p className="font-medium">{event.registrationDeadline}</p>
                                        </div>
                                    </div>

                                    <div className="border-t pt-4">
                                        <p className="text-sm text-muted-foreground mb-2">Venue Address</p>
                                        <p className="font-medium">{event.address}</p>
                                        <a
                                            href={event.mapLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                                        >
                                            <MapPin className="h-4 w-4" />
                                            View on Google Maps
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact & Meta */}
                            <div className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Contact Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Organizer</p>
                                            <p className="font-medium">{event.organizer}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <a href={`mailto:${event.contactEmail}`} className="text-sm text-primary hover:underline">
                                                {event.contactEmail}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <a href={`tel:${event.contactPhone}`} className="text-sm">
                                                {event.contactPhone}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4 text-muted-foreground" />
                                            <a href={event.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                                Website
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Meta Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Created</span>
                                            <span>{event.createdAt}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Last Updated</span>
                                            <span>{event.updatedAt}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Event ID</span>
                                            <span className="font-mono">EVT-{event.id.toString().padStart(4, '0')}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                                        <UserPlus className="h-5 w-5" />
                                        <span className="text-xs">Add Registration</span>
                                    </Button>
                                    <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                                        <Mail className="h-5 w-5" />
                                        <span className="text-xs">Send Email</span>
                                    </Button>
                                    <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                                        <Award className="h-5 w-5" />
                                        <span className="text-xs">Certificates</span>
                                    </Button>
                                    <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                                        <BarChart3 className="h-5 w-5" />
                                        <span className="text-xs">View Report</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Registrations Tab */}
                    <TabsContent value="registrations" className="space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Recent Registrations</CardTitle>
                                    <CardDescription>Latest 5 registrations for this event</CardDescription>
                                </div>
                                <Link href={`/dashboard/registrations?event=${event.id}`}>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        View All
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead className="hidden sm:table-cell">Email</TableHead>
                                            <TableHead className="hidden md:table-cell">Date</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {event.recentRegistrations.map((reg) => (
                                            <TableRow key={reg.id}>
                                                <TableCell className="font-medium">{reg.name}</TableCell>
                                                <TableCell className="hidden sm:table-cell text-muted-foreground">
                                                    {reg.email}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell text-muted-foreground">
                                                    {reg.date}
                                                </TableCell>
                                                <TableCell>₹{reg.amount.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            "text-xs",
                                                            reg.status === "confirmed"
                                                                ? "bg-green-100 text-green-700 border-green-200"
                                                                : "bg-yellow-100 text-yellow-700 border-yellow-200"
                                                        )}
                                                    >
                                                        {reg.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Schedule Tab */}
                    <TabsContent value="schedule" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Schedule</CardTitle>
                                <CardDescription>{event.date}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {event.schedule.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                        >
                                            <div className="w-32 shrink-0">
                                                <p className="font-medium text-primary">{item.time}</p>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{item.title}</p>
                                                {item.speaker && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        <Mic2 className="h-3 w-3 inline mr-1" />
                                                        {item.speaker}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Speakers Tab */}
                    <TabsContent value="speakers" className="space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Speakers</CardTitle>
                                    <CardDescription>{event.speakers.length} speakers for this event</CardDescription>
                                </div>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Add Speaker
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {event.speakers.map((speaker) => (
                                        <div
                                            key={speaker.id}
                                            className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                                    {speaker.avatar}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold truncate">{speaker.name}</p>
                                                    <p className="text-sm text-muted-foreground truncate">{speaker.title}</p>
                                                    <p className="text-sm text-muted-foreground truncate">{speaker.organization}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Sponsors Tab */}
                    <TabsContent value="sponsors" className="space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Sponsors</CardTitle>
                                    <CardDescription>
                                        Total sponsorship: ₹{event.sponsors.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
                                    </CardDescription>
                                </div>
                                <Button variant="outline" size="sm" className="gap-2">
                                    <Building2 className="h-4 w-4" />
                                    Add Sponsor
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {event.sponsors.map((sponsor) => {
                                        const tier = tierConfig[sponsor.tier as keyof typeof tierConfig];
                                        return (
                                            <div
                                                key={sponsor.id}
                                                className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center font-bold text-muted-foreground">
                                                        {sponsor.logo}
                                                    </div>
                                                    <Badge variant="outline" className={tier.className}>
                                                        {tier.label}
                                                    </Badge>
                                                </div>
                                                <p className="font-semibold">{sponsor.name}</p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    ₹{sponsor.amount.toLocaleString()}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Event</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;{event.title}&quot;? This action cannot be undone.
                            All registrations and data associated with this event will be permanently removed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                setDeleteDialogOpen(false);
                                router.push("/dashboard/events");
                            }}
                        >
                            Delete Event
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
