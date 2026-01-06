"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    MapPin,
    Award,
    GraduationCap,
    User,
    Mail,
    CreditCard,
    CheckCircle2,
    Shield,
    Ticket,
    AlertCircle,
    Loader2,
    Users,
    Hotel,
    Utensils,
    Heart,
    Plus,
    Minus,
    X,
    Car,
    Plane,
    Info,
    Eye,
    Clock,
    Building2,
    Phone,
    Globe,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { eventsService, Event } from "@/services/events";
import { registrationsService, CreateRegistrationData } from "@/services/registrations";

interface EventDisplayData {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    address: string | null;
    cmeCredits: number | null;
    price: number;
    earlyBirdPrice: number | null;
    earlyBirdDeadline: string | null;
    isEarlyBird: boolean;
    capacity: number;
    registrations: number;
    description: string | null;
    type: string;
    organizer: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    website: string | null;
    includes: string[];
    speakers: { name: string; designation: string | null; institution: string | null }[];
    sponsors: { name: string; logo: string | null; tier: string }[];
}

type Step = "category" | "details" | "preferences" | "payment" | "confirmation";

interface FamilyMember {
    id: string;
    name: string;
    relation: string;
    age: string;
    dietaryPreference: string;
}

export default function RegisterPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;
    const [currentStep, setCurrentStep] = useState<Step>("details");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [registrationId, setRegistrationId] = useState<string | null>(null);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    // Event data from API
    const [eventData, setEventData] = useState<EventDisplayData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check if page was opened as preview from dashboard
    useEffect(() => {
        if (typeof window !== "undefined") {
            const hasOpener = window.opener !== null;
            const fromDashboard = document.referrer.includes("/dashboard");
            setIsPreviewMode(hasOpener || fromDashboard);
        }
    }, []);

    // Fetch event data
    useEffect(() => {
        async function fetchEvent() {
            try {
                setLoading(true);
                const response = await eventsService.getPublicById(eventId);
                if (response.success && response.data) {
                    const event = response.data;
                    const startDate = new Date(event.startDate);
                    const earlyBirdDate = event.earlyBirdDeadline ? new Date(event.earlyBirdDeadline) : null;
                    const isEarlyBird = earlyBirdDate ? new Date() < earlyBirdDate : false;

                    setEventData({
                        id: event.id,
                        title: event.title,
                        date: startDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
                        time: event.startTime ? `${event.startTime} - ${event.endTime || ""}` : "TBA",
                        location: [event.location, event.city].filter(Boolean).join(", ") || "TBA",
                        address: [event.address, event.city, event.state, event.country].filter(Boolean).join(", ") || null,
                        cmeCredits: event.cmeCredits,
                        price: Number(event.price),
                        earlyBirdPrice: event.earlyBirdPrice ? Number(event.earlyBirdPrice) : null,
                        earlyBirdDeadline: earlyBirdDate?.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) || null,
                        isEarlyBird,
                        capacity: event.capacity,
                        registrations: event._count?.registrations || 0,
                        description: event.description,
                        type: event.type,
                        organizer: event.organizer,
                        contactEmail: event.contactEmail,
                        contactPhone: event.contactPhone,
                        website: event.website,
                        includes: event.includes || [],
                        speakers: event.eventSpeakers?.map(es => ({
                            name: es.speaker.name,
                            designation: es.speaker.designation,
                            institution: es.speaker.institution,
                        })) || [],
                        sponsors: event.eventSponsors?.map(es => ({
                            name: es.sponsor.name,
                            logo: es.sponsor.logo,
                            tier: es.tier,
                        })) || [],
                    });
                } else {
                    setError("Event not found");
                }
            } catch {
                setError("Failed to load event");
            } finally {
                setLoading(false);
            }
        }
        if (eventId) fetchEvent();
    }, [eventId]);

    // Form state
    const [selectedCategory, setSelectedCategory] = useState("general");
    const [paymentMethod, setPaymentMethod] = useState("razorpay");
    const [formData, setFormData] = useState({
        title: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        institution: "",
        designation: "",
        city: "",
        state: "",
        medicalCouncilNumber: "",
        agreeTerms: false,
        agreeUpdates: true,
    });

    // Preferences state
    const [preferences, setPreferences] = useState({
        // Family
        bringingFamily: false,
        familyMembers: [] as FamilyMember[],
        // Accommodation
        needAccommodation: false,
        accommodationType: "",
        checkInDate: "",
        checkOutDate: "",
        numberOfNights: 2,
        specialRoomRequests: "",
        // Food
        dietaryPreference: "veg",
        foodAllergies: "",
        mealPlan: "",
        // Transportation
        needAirportPickup: false,
        flightDetails: "",
        needLocalTransport: false,
        // Other
        wheelchairAccess: false,
        specialAssistance: "",
        workshopPreferences: [] as string[],
        networkingInterests: "",
    });

    const basePrice = eventData
        ? eventData.isEarlyBird && eventData.earlyBirdPrice
            ? Number(eventData.earlyBirdPrice)
            : Number(eventData.price)
        : 0;

    // Calculate additional costs (simplified - can be expanded later)
    const additionalCosts = { accommodation: 0, meals: 0, transport: 0, total: 0 };
    const totalPrice = basePrice + additionalCosts.total;

    const steps: { key: Step; label: string; icon: React.ElementType }[] = [
        { key: "details", label: "Details", icon: User },
        { key: "payment", label: "Payment", icon: CreditCard },
        { key: "confirmation", label: "Done", icon: CheckCircle2 },
    ];

    const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

    const handleCategorySelect = (categoryId: string) => {
        setSelectedCategory(categoryId);
    };

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handlePreferenceChange = (field: string, value: unknown) => {
        setPreferences((prev) => ({ ...prev, [field]: value }));
    };

    const addFamilyMember = () => {
        const newMember: FamilyMember = {
            id: Date.now().toString(),
            name: "",
            relation: "",
            age: "",
            dietaryPreference: "veg",
        };
        setPreferences(prev => ({
            ...prev,
            familyMembers: [...prev.familyMembers, newMember]
        }));
    };

    const removeFamilyMember = (id: string) => {
        setPreferences(prev => ({
            ...prev,
            familyMembers: prev.familyMembers.filter(m => m.id !== id)
        }));
    };

    const updateFamilyMember = (id: string, field: string, value: string) => {
        setPreferences(prev => ({
            ...prev,
            familyMembers: prev.familyMembers.map(m =>
                m.id === id ? { ...m, [field]: value } : m
            )
        }));
    };

    const handleNextStep = () => {
        // "preferences" removed for demo
        const stepOrder: Step[] = ["category", "details", "payment", "confirmation"];
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex < stepOrder.length - 1) {
            setCurrentStep(stepOrder[currentIndex + 1]);
        }
    };

    const handlePrevStep = () => {
        // "preferences" removed for demo
        const stepOrder: Step[] = ["category", "details", "payment", "confirmation"];
        const currentIndex = stepOrder.indexOf(currentStep);
        if (currentIndex > 0) {
            setCurrentStep(stepOrder[currentIndex - 1]);
        }
    };

    const handlePayment = async () => {
        if (!eventData) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const registrationData: CreateRegistrationData = {
                eventId: eventData.id,
                name: `${formData.title} ${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                phone: formData.phone || undefined,
                organization: formData.institution || undefined,
                designation: formData.designation || undefined,
                category: selectedCategory || undefined,
                amount: totalPrice,
                specialRequests: preferences.foodAllergies || undefined,
            };

            const response = await registrationsService.create(registrationData);

            if (response.success && response.data) {
                setRegistrationId(response.data.id);
                setCurrentStep("confirmation");
            } else {
                setError("Failed to complete registration. Please try again.");
            }
        } catch {
            setError("An error occurred during registration. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const canProceedFromCategory = selectedCategory !== "";
    const canProceedFromDetails =
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.phone &&
        formData.institution &&
        formData.agreeTerms;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error && !eventData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <h1 className="text-xl font-semibold">{error}</h1>
                <Link href="/events">
                    <Button variant="outline">Back to Events</Button>
                </Link>
            </div>
        );
    }

    if (!eventData) return null;

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg gradient-medical flex items-center justify-center">
                                <GraduationCap className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-xl">MedConf</span>
                        </Link>
                        <div className="flex items-center gap-3">
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
            <div className="border-b bg-muted/30">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => isPreviewMode ? window.close() : router.back()}
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {isPreviewMode ? "Close Preview" : "Back"}
                        </button>
                        {isPreviewMode && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300">
                                Preview Mode
                            </Badge>
                        )}
                    </div>
                    {/* View Details Modal */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Eye className="h-4 w-4" />
                                View Event Details
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[85vh]">
                            <DialogHeader>
                                <DialogTitle className="text-xl">{eventData?.title}</DialogTitle>
                                <DialogDescription>
                                    <Badge variant="outline" className="mt-1">{eventData?.type}</Badge>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="max-h-[60vh] overflow-y-auto pr-4">
                                <div className="space-y-6">
                                    {/* Date, Time, Location */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3">
                                            <Calendar className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="font-medium">{eventData?.date}</p>
                                                <p className="text-sm text-muted-foreground">{eventData?.time}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                            <div>
                                                <p className="font-medium">{eventData?.location}</p>
                                                {eventData?.address && (
                                                    <p className="text-sm text-muted-foreground">{eventData.address}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    {eventData?.description && (
                                        <div>
                                            <h4 className="font-semibold mb-2">About This Event</h4>
                                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                                                {eventData.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* What's Included */}
                                    {eventData?.includes && eventData.includes.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold mb-2">What's Included</h4>
                                            <ul className="space-y-2">
                                                {eventData.includes.map((item, index) => (
                                                    <li key={index} className="flex items-center gap-2 text-sm">
                                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Speakers */}
                                    {eventData?.speakers && eventData.speakers.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold mb-2">Speakers</h4>
                                            <div className="space-y-2">
                                                {eventData.speakers.map((speaker, index) => (
                                                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                            <User className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">{speaker.name}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {[speaker.designation, speaker.institution].filter(Boolean).join(", ")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Sponsors */}
                                    {eventData?.sponsors && eventData.sponsors.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold mb-2">Sponsors</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {eventData.sponsors.map((sponsor, index) => (
                                                    <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-muted/30">
                                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm font-medium">{sponsor.name}</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {sponsor.tier}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Pricing & CME */}
                                    {eventData && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-3 rounded-lg bg-primary/5">
                                                <p className="text-xs text-muted-foreground">Registration Fee</p>
                                                <p className="text-lg font-bold text-primary">
                                                    ₹{(eventData.isEarlyBird && eventData.earlyBirdPrice ? eventData.earlyBirdPrice : eventData.price).toLocaleString()}
                                                </p>
                                                {eventData.isEarlyBird && eventData.earlyBirdPrice && (
                                                    <p className="text-xs text-green-600">Early bird price!</p>
                                                )}
                                            </div>
                                            {(eventData.cmeCredits ?? 0) > 0 && (
                                                <div className="p-3 rounded-lg bg-green-50">
                                                    <p className="text-xs text-muted-foreground">CME Credits</p>
                                                    <p className="text-lg font-bold text-green-600">
                                                        {eventData.cmeCredits} Credits
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Contact Information */}
                                    {eventData && (eventData.organizer || eventData.contactEmail || eventData.contactPhone) && (
                                        <div>
                                            <h4 className="font-semibold mb-2">Contact Information</h4>
                                            <div className="space-y-2 text-sm">
                                                {eventData.organizer && (
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                                        <span>{eventData.organizer}</span>
                                                    </div>
                                                )}
                                                {eventData.contactEmail && (
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                                        <a href={`mailto:${eventData.contactEmail}`} className="text-primary hover:underline">
                                                            {eventData.contactEmail}
                                                        </a>
                                                    </div>
                                                )}
                                                {eventData.contactPhone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                                        <a href={`tel:${eventData.contactPhone}`}>{eventData.contactPhone}</a>
                                                    </div>
                                                )}
                                                {eventData.website && (
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                                        <a href={eventData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                                            Event Website
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    {/* Event Summary */}
                    <Card className="mb-8 border-0 shadow-lg animate-fadeIn">
                        <CardContent className="pt-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <Badge className="bg-primary/10 text-primary border-primary/20 mb-2">
                                        Event Registration
                                    </Badge>
                                    <h1 className="text-xl font-bold">{eventData.title}</h1>
                                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4 text-primary" />
                                            {eventData.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4 text-primary" />
                                            {eventData.location}
                                        </span>
                                        {(eventData.cmeCredits ?? 0) > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Award className="h-4 w-4 text-primary" />
                                                {eventData.cmeCredits} CME Credits
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {totalPrice > 0 && currentStep !== "confirmation" && (
                                    <div className="text-right bg-primary/5 px-4 py-3 rounded-xl">
                                        <p className="text-xs text-muted-foreground">Total Amount</p>
                                        <p className="text-2xl font-bold text-primary">
                                            ₹{totalPrice.toLocaleString()}
                                        </p>
                                        {additionalCosts.total > 0 && (
                                            <p className="text-xs text-muted-foreground">
                                                (includes ₹{additionalCosts.total.toLocaleString()} add-ons)
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Progress Steps */}
                    <div className="mb-8 animate-fadeIn stagger-1">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => {
                                const StepIcon = step.icon;
                                const isActive = currentStepIndex === index;
                                const isCompleted = currentStepIndex > index;
                                return (
                                    <React.Fragment key={step.key}>
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={cn(
                                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm",
                                                    isCompleted
                                                        ? "bg-green-500 text-white"
                                                        : isActive
                                                        ? "bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20"
                                                        : "bg-muted text-muted-foreground"
                                                )}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle2 className="h-5 w-5" />
                                                ) : (
                                                    <StepIcon className="h-5 w-5" />
                                                )}
                                            </div>
                                            <span
                                                className={cn(
                                                    "text-xs mt-2 hidden sm:block",
                                                    isActive ? "text-foreground font-medium" : "text-muted-foreground"
                                                )}
                                            >
                                                {step.label}
                                            </span>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div
                                                className={cn(
                                                    "flex-1 h-1 mx-2 rounded-full transition-colors",
                                                    isCompleted ? "bg-green-500" : "bg-muted"
                                                )}
                                            />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="animate-fadeIn stagger-2">
                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
                                {error}
                            </div>
                        )}

                        {/* Step 1: Personal Details */}
                        {currentStep === "details" && (
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5 text-primary" />
                                        Your Details
                                    </CardTitle>
                                    <CardDescription>
                                        Please provide your information for registration and certificate
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Name */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label>Title</Label>
                                            <Select
                                                value={formData.title}
                                                onValueChange={(v) => handleInputChange("title", v)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="dr">Dr.</SelectItem>
                                                    <SelectItem value="mr">Mr.</SelectItem>
                                                    <SelectItem value="ms">Ms.</SelectItem>
                                                    <SelectItem value="prof">Prof.</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>First Name *</Label>
                                            <Input
                                                value={formData.firstName}
                                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                placeholder="John"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Last Name *</Label>
                                            <Input
                                                value={formData.lastName}
                                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                                placeholder="Smith"
                                            />
                                        </div>
                                    </div>

                                    <div className="h-px bg-border" />

                                    {/* Contact */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Email Address *</Label>
                                            <Input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange("email", e.target.value)}
                                                placeholder="john.smith@hospital.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Phone Number *</Label>
                                            <Input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>

                                    <div className="h-px bg-border" />

                                    {/* Professional */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Institution/Hospital *</Label>
                                            <Input
                                                value={formData.institution}
                                                onChange={(e) => handleInputChange("institution", e.target.value)}
                                                placeholder="AIIMS, New Delhi"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Designation</Label>
                                            <Input
                                                value={formData.designation}
                                                onChange={(e) => handleInputChange("designation", e.target.value)}
                                                placeholder="Senior Resident"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>City</Label>
                                            <Input
                                                value={formData.city}
                                                onChange={(e) => handleInputChange("city", e.target.value)}
                                                placeholder="New Delhi"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>State</Label>
                                            <Input
                                                value={formData.state}
                                                onChange={(e) => handleInputChange("state", e.target.value)}
                                                placeholder="Delhi"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Medical Council Registration Number</Label>
                                        <Input
                                            value={formData.medicalCouncilNumber}
                                            onChange={(e) => handleInputChange("medicalCouncilNumber", e.target.value)}
                                            placeholder="MCI/DMC Registration Number"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Required for CME credit certificate
                                        </p>
                                    </div>

                                    <div className="h-px bg-border" />

                                    {/* Terms */}
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                id="terms"
                                                checked={formData.agreeTerms}
                                                onCheckedChange={(checked) =>
                                                    handleInputChange("agreeTerms", checked as boolean)
                                                }
                                            />
                                            <div className="grid gap-1.5 leading-none">
                                                <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                                                    I agree to the terms and conditions *
                                                </label>
                                                <p className="text-xs text-muted-foreground">
                                                    By registering, you agree to our cancellation and refund policy
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                id="updates"
                                                checked={formData.agreeUpdates}
                                                onCheckedChange={(checked) =>
                                                    handleInputChange("agreeUpdates", checked as boolean)
                                                }
                                            />
                                            <div className="grid gap-1.5 leading-none">
                                                <label htmlFor="updates" className="text-sm font-medium cursor-pointer">
                                                    Keep me updated about future events
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <Button
                                            onClick={handleNextStep}
                                            disabled={!canProceedFromDetails}
                                            className="gap-2 gradient-medical text-white"
                                            size="lg"
                                        >
                                            Continue to Payment
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 2: Payment */}
                        {currentStep === "payment" && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <Card className="border-0 shadow-lg">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <CreditCard className="h-5 w-5 text-primary" />
                                                Payment
                                            </CardTitle>
                                            <CardDescription>
                                                Complete your registration by making payment
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-4">
                                                <Label>Select Payment Method</Label>
                                                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                                                    <label className={cn(
                                                        "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors",
                                                        paymentMethod === "razorpay" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                                                    )}>
                                                        <div className="flex items-center gap-4">
                                                            <RadioGroupItem value="razorpay" />
                                                            <div>
                                                                <p className="font-medium">Online Payment</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Credit/Debit Card, UPI, Net Banking
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <CreditCard className="h-6 w-6 text-muted-foreground" />
                                                    </label>
                                                </RadioGroup>
                                            </div>

                                            <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3">
                                                <Shield className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-green-800">Secure Payment</p>
                                                    <p className="text-xs text-green-700">
                                                        Your payment information is encrypted and secure. We do not store card details.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between pt-4">
                                                <Button variant="outline" onClick={handlePrevStep} className="gap-2">
                                                    <ArrowLeft className="h-4 w-4" />
                                                    Back
                                                </Button>
                                                <Button
                                                    onClick={handlePayment}
                                                    disabled={isSubmitting}
                                                    className="gap-2 gradient-medical text-white"
                                                    size="lg"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Pay ₹{totalPrice.toLocaleString()}
                                                            <ArrowRight className="h-4 w-4" />
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Order Summary */}
                                <div>
                                    <Card className="border-0 shadow-lg sticky top-24">
                                        <CardHeader>
                                            <CardTitle className="text-base">Order Summary</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-3">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Registration Fee</span>
                                                    <span>₹{eventData.price.toLocaleString()}</span>
                                                </div>
                                                {eventData.isEarlyBird && eventData.earlyBirdPrice && (
                                                    <div className="flex justify-between text-sm text-green-600">
                                                        <span>Early Bird Discount</span>
                                                        <span>
                                                            -₹{(eventData.price - eventData.earlyBirdPrice).toLocaleString()}
                                                        </span>
                                                    </div>
                                                )}

                                            </div>

                                            <div className="h-px bg-border" />

                                            <div className="flex justify-between font-bold text-lg">
                                                <span>Total</span>
                                                <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
                                            </div>

                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {/* Step 5: Confirmation */}
                        {currentStep === "confirmation" && (
                            <Card className="text-center border-0 shadow-lg">
                                <CardContent className="pt-12 pb-8">
                                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
                                    <p className="text-muted-foreground mb-6">
                                        Thank you for registering for {eventData.title}
                                    </p>

                                    <div className="max-w-md mx-auto space-y-4 text-left mb-8">
                                        <div className="p-4 rounded-xl bg-muted/50">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground">Registration ID</p>
                                                    <p className="font-mono font-bold">{registrationId || "Pending"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Amount Paid</p>
                                                    <p className="font-bold text-primary">₹{totalPrice.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Name</p>
                                                    <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                                                </div>
                                                {(eventData.cmeCredits ?? 0) > 0 && (
                                                    <div>
                                                        <p className="text-muted-foreground">CME Credits</p>
                                                        <p className="font-medium">{eventData.cmeCredits} Credits</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                                            <p className="text-sm text-blue-700">
                                                <Mail className="h-4 w-4 inline mr-2" />
                                                A confirmation email has been sent to {formData.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Button variant="outline" className="gap-2">
                                            <CreditCard className="h-4 w-4" />
                                            Download Receipt
                                        </Button>
                                        <Link href="/events">
                                            <Button className="gap-2 gradient-medical text-white">
                                                Browse More Events
                                                <ArrowRight className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
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
                            <span className="font-bold">MedConf</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © 2025 MedConf. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
