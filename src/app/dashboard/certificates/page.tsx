"use client";

import React, { useState } from "react";
import {
    Search,
    Filter,
    Download,
    MoreHorizontal,
    Award,
    FileCheck,
    Send,
    Plus,
    Eye,
    Mail,
    Edit,
    Trash2,
    Calendar,
    User,
    Building2,
    FileText,
    CheckCircle2,
    Clock,
    RefreshCw,
    Settings,
    Printer,
    Copy,
    ExternalLink,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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

const certificates = [
    {
        id: "CERT-2025-001",
        recipient: "Dr. Arun Mehta",
        email: "arun.mehta@hospital.in",
        event: "CME Session 2025",
        eventDate: "2025-01-15",
        type: "CME Certificate",
        credits: 8,
        issuedDate: "2025-01-16",
        status: "issued",
        downloadCount: 3,
        emailSent: true,
        signatory1: "Dr. Rajesh Kumar",
        signatory2: "Dr. Priya Sharma",
    },
    {
        id: "CERT-2025-002",
        recipient: "Dr. Sunita Patel",
        email: "sunita.patel@medcollege.edu",
        event: "CME Session 2025",
        eventDate: "2025-01-15",
        type: "CME Certificate",
        credits: 8,
        issuedDate: "2025-01-16",
        status: "issued",
        downloadCount: 1,
        emailSent: true,
        signatory1: "Dr. Rajesh Kumar",
        signatory2: "Dr. Priya Sharma",
    },
    {
        id: "CERT-2025-003",
        recipient: "Dr. Vikram Singh",
        email: "vikram.singh@gmail.com",
        event: "Workshop - Deep Brain Stimulation",
        eventDate: "2025-01-22",
        type: "Participation Certificate",
        credits: 4,
        issuedDate: null,
        status: "pending",
        downloadCount: 0,
        emailSent: false,
        signatory1: "Dr. Rajesh Kumar",
        signatory2: "Dr. Priya Sharma",
    },
    {
        id: "CERT-2025-004",
        recipient: "Dr. Neha Gupta",
        email: "neha.gupta@aiims.edu",
        event: "Annual Symposium 2025",
        eventDate: "2025-02-10",
        type: "Speaker Certificate",
        credits: 6,
        issuedDate: null,
        status: "scheduled",
        downloadCount: 0,
        emailSent: false,
        signatory1: "Dr. Rajesh Kumar",
        signatory2: "Dr. Priya Sharma",
    },
    {
        id: "CERT-2025-005",
        recipient: "Dr. Amit Joshi",
        email: "amit.joshi@cmc.ac.in",
        event: "CME Session 2025",
        eventDate: "2025-01-15",
        type: "CME Certificate",
        credits: 8,
        issuedDate: "2025-01-16",
        status: "issued",
        downloadCount: 2,
        emailSent: false,
        signatory1: "Dr. Rajesh Kumar",
        signatory2: "Dr. Priya Sharma",
    },
];

const templates = [
    { id: "cme", name: "CME Certificate", description: "For CME accredited events" },
    { id: "participation", name: "Participation Certificate", description: "For workshop attendees" },
    { id: "speaker", name: "Speaker Certificate", description: "For event speakers" },
    { id: "organizer", name: "Organizer Certificate", description: "For organizing committee" },
];

export default function CertificatesPage() {
    const [selectedTab, setSelectedTab] = useState("all");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedCertificates, setSelectedCertificates] = useState<string[]>([]);
    const [selectedCert, setSelectedCert] = useState<typeof certificates[0] | null>(null);

    const filteredCertificates = certificates.filter((cert) => {
        if (selectedTab === "all") return true;
        return cert.status === selectedTab;
    });

    const issuedCount = certificates.filter((c) => c.status === "issued").length;
    const pendingCount = certificates.filter((c) => c.status === "pending").length;
    const scheduledCount = certificates.filter((c) => c.status === "scheduled").length;

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { class: string; icon: React.ElementType; label: string }> = {
            issued: { class: "status-active", icon: CheckCircle2, label: "Issued" },
            pending: { class: "status-pending", icon: Clock, label: "Pending" },
            scheduled: { class: "status-upcoming", icon: Calendar, label: "Scheduled" },
            failed: { class: "bg-destructive/10 text-destructive", icon: RefreshCw, label: "Failed" },
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

    const toggleCertificate = (id: string) => {
        setSelectedCertificates((prev) =>
            prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selectedCertificates.length === filteredCertificates.length) {
            setSelectedCertificates([]);
        } else {
            setSelectedCertificates(filteredCertificates.map((c) => c.id));
        }
    };

    return (
        <DashboardLayout
            title="Certificates"
            subtitle="Generate, manage, and distribute certificates"
        >
            <div className="space-y-6 animate-fadeIn">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <Card className="card-hover">
                        <CardContent className="p-3 sm:pt-6 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="icon-container icon-container-teal h-10 w-10 sm:h-12 sm:w-12">
                                    <Award className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-bold">{certificates.length}</p>
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
                                    <p className="text-xl sm:text-2xl font-bold">{issuedCount}</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Issued</p>
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
                                    <p className="text-xl sm:text-2xl font-bold">{pendingCount}</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Pending</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="card-hover">
                        <CardContent className="p-3 sm:pt-6 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="icon-container icon-container-blue h-10 w-10 sm:h-12 sm:w-12">
                                    <Send className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-bold">
                                        {certificates.filter((c) => c.emailSent).length}
                                    </p>
                                    <p className="text-xs sm:text-sm text-muted-foreground">Emailed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Certificate Templates */}
                <Card className="border-primary/10">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Certificate Templates
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                            {templates.map((template) => (
                                <div
                                    key={template.id}
                                    className="p-3 sm:p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
                                >
                                    <div className="h-12 sm:h-16 w-full rounded-lg bg-gradient-to-br from-medical-teal-light to-medical-blue-light flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-105 transition-transform">
                                        <Award className="h-6 w-6 sm:h-8 sm:w-8 text-primary/60" />
                                    </div>
                                    <h4 className="font-medium text-xs sm:text-sm">{template.name}</h4>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 line-clamp-2">
                                        {template.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex flex-1 gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Search by recipient, event, or ID..." className="pl-10" />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        {selectedCertificates.length > 0 && (
                            <>
                                <Button variant="outline" className="gap-2">
                                    <Download className="w-4 h-4" />
                                    Download ({selectedCertificates.length})
                                </Button>
                                <Button variant="outline" className="gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email ({selectedCertificates.length})
                                </Button>
                            </>
                        )}
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2 gradient-medical text-white hover:opacity-90">
                                    <Plus className="w-4 h-4" />
                                    Generate Certificate
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Generate Certificates</DialogTitle>
                                    <DialogDescription>
                                        Create certificates for event participants
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Select Event *</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose an event" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cme2025">CME Session 2025</SelectItem>
                                                <SelectItem value="workshop">Workshop - Deep Brain Stimulation</SelectItem>
                                                <SelectItem value="symposium">Annual Symposium 2025</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Certificate Template *</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select template" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cme">CME Certificate</SelectItem>
                                                <SelectItem value="participation">Participation Certificate</SelectItem>
                                                <SelectItem value="speaker">Speaker Certificate</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="section-divider-gradient my-2" />

                                    <div className="space-y-2">
                                        <Label>Recipients</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select recipients" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Participants</SelectItem>
                                                <SelectItem value="attended">Attended Only</SelectItem>
                                                <SelectItem value="paid">Paid Registrations</SelectItem>
                                                <SelectItem value="custom">Custom Selection</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-muted-foreground">
                                            45 participants will receive certificates
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>CME Credits</Label>
                                            <Input type="number" placeholder="8" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Credit Hours</Label>
                                            <Input type="number" placeholder="8" />
                                        </div>
                                    </div>

                                    <div className="section-divider-gradient my-2" />

                                    <div className="space-y-2">
                                        <Label>Signatory 1</Label>
                                        <Input placeholder="Dr. Rajesh Kumar, Director" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Signatory 2</Label>
                                        <Input placeholder="Dr. Priya Sharma, Course Coordinator" />
                                    </div>

                                    <div className="section-divider-gradient my-2" />

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                            <div className="space-y-0.5">
                                                <Label>Auto-email certificates</Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Send certificates to recipients via email
                                                </p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                            <div className="space-y-0.5">
                                                <Label>Enable download from portal</Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Allow participants to download from website
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
                                    <Button variant="outline" className="gap-2">
                                        <Eye className="h-4 w-4" />
                                        Preview
                                    </Button>
                                    <Button onClick={() => setIsCreateOpen(false)}>
                                        Generate Certificates
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Certificate Preview Dialog */}
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogContent className="max-w-3xl">
                        {selectedCert && (
                            <>
                                <DialogHeader>
                                    <DialogTitle>Certificate Preview</DialogTitle>
                                    <DialogDescription>
                                        {selectedCert.id} - {selectedCert.type}
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    {/* Certificate Preview */}
                                    <div className="aspect-[1.414/1] bg-gradient-to-br from-white to-blue-50 border-8 border-double border-primary/20 rounded-lg p-8 relative overflow-hidden">
                                        {/* Decorative Elements */}
                                        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-br-full" />
                                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary/10 to-transparent rounded-tl-full" />

                                        <div className="text-center space-y-4 relative z-10">
                                            <div className="flex justify-center mb-4">
                                                <Award className="h-16 w-16 text-primary" />
                                            </div>
                                            <h2 className="text-2xl font-serif font-bold text-primary">
                                                Certificate of {selectedCert.type.replace("Certificate", "").trim()}
                                            </h2>
                                            <p className="text-muted-foreground">This is to certify that</p>
                                            <h3 className="text-3xl font-serif font-bold text-foreground">
                                                {selectedCert.recipient}
                                            </h3>
                                            <p className="text-muted-foreground max-w-md mx-auto">
                                                has successfully completed the
                                            </p>
                                            <h4 className="text-xl font-semibold text-primary">
                                                {selectedCert.event}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                held on {selectedCert.eventDate}
                                            </p>
                                            {selectedCert.credits > 0 && (
                                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
                                                    <Award className="h-4 w-4" />
                                                    {selectedCert.credits} CME Credits
                                                </div>
                                            )}
                                            <div className="flex justify-between mt-8 pt-8 border-t border-dashed border-border">
                                                <div className="text-center">
                                                    <div className="w-32 border-b border-foreground mb-1" />
                                                    <p className="text-xs text-muted-foreground">
                                                        {selectedCert.signatory1}
                                                    </p>
                                                </div>
                                                <div className="text-center">
                                                    <div className="w-32 border-b border-foreground mb-1" />
                                                    <p className="text-xs text-muted-foreground">
                                                        {selectedCert.signatory2}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-4">
                                                Certificate ID: {selectedCert.id}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                                        Close
                                    </Button>
                                    <Button variant="outline" className="gap-2">
                                        <Printer className="h-4 w-4" />
                                        Print
                                    </Button>
                                    <Button className="gap-2">
                                        <Download className="h-4 w-4" />
                                        Download PDF
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Certificates Table */}
                <Card>
                    <CardHeader className="pb-3 px-3 sm:px-6">
                        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                            <TabsList className="w-full sm:w-auto h-auto flex-wrap sm:flex-nowrap gap-1 p-1">
                                <TabsTrigger value="all" className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                                    All
                                </TabsTrigger>
                                <TabsTrigger value="issued" className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                                    Issued ({issuedCount})
                                </TabsTrigger>
                                <TabsTrigger value="pending" className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                                    Pending ({pendingCount})
                                </TabsTrigger>
                                <TabsTrigger value="scheduled" className="flex-1 sm:flex-none text-xs sm:text-sm px-2 sm:px-3 py-1.5">
                                    <span className="hidden sm:inline">Scheduled</span>
                                    <span className="sm:hidden">Sched</span> ({scheduledCount})
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={selectedCertificates.length === filteredCertificates.length}
                                                onCheckedChange={toggleAll}
                                            />
                                        </TableHead>
                                        <TableHead>Certificate ID</TableHead>
                                        <TableHead>Recipient</TableHead>
                                        <TableHead className="hidden md:table-cell">Event</TableHead>
                                        <TableHead className="hidden lg:table-cell">Type</TableHead>
                                        <TableHead className="hidden sm:table-cell">Credits</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCertificates.map((cert, index) => (
                                        <TableRow
                                            key={cert.id}
                                            className="animate-fadeIn table-row-hover"
                                            style={{ animationDelay: `${index * 0.03}s` }}
                                        >
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedCertificates.includes(cert.id)}
                                                    onCheckedChange={() => toggleCertificate(cert.id)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-mono text-sm">{cert.id}</p>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{cert.recipient}</p>
                                                    <p className="text-xs text-muted-foreground">{cert.email}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <p className="text-sm truncate max-w-[200px]">{cert.event}</p>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                <Badge variant="outline">{cert.type}</Badge>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <p className="text-sm font-medium">{cert.credits} CME</p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(cert.status)}
                                                    {cert.emailSent && (
                                                        <Mail className="h-3 w-3 text-muted-foreground" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => {
                                                            setSelectedCert(cert);
                                                            setIsPreviewOpen(true);
                                                        }}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Download className="w-4 h-4" />
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
                                                                    setSelectedCert(cert);
                                                                    setIsPreviewOpen(true);
                                                                }}
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                Preview
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Download className="mr-2 h-4 w-4" />
                                                                Download PDF
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Printer className="mr-2 h-4 w-4" />
                                                                Print
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem>
                                                                <Mail className="mr-2 h-4 w-4" />
                                                                Send Email
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Copy className="mr-2 h-4 w-4" />
                                                                Copy Link
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem>
                                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                                Regenerate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Revoke
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

                        {filteredCertificates.length === 0 && (
                            <div className="text-center py-12">
                                <Award className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                <h3 className="text-lg font-medium mb-2">No certificates found</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {selectedTab === "all"
                                        ? "Generate your first certificate to get started"
                                        : "No certificates match this filter"}
                                </p>
                                {selectedTab === "all" && (
                                    <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Generate Certificate
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
