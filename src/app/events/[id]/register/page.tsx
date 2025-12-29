"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    Clock,
    MapPin,
    Award,
    GraduationCap,
    User,
    Mail,
    Phone,
    Building2,
    CreditCard,
    CheckCircle2,
    Shield,
    Ticket,
    IndianRupee,
    AlertCircle,
    Loader2,
    Users,
    Hotel,
    Utensils,
    Heart,
    Baby,
    Plus,
    Minus,
    X,
    Car,
    Plane,
    Info,
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
import { cn } from "@/lib/utils";

// Mock event data
const eventData = {
    id: 1,
    title: "Annual Neurostimulation Conference 2025",
    date: "Jan 15-16, 2025",
    time: "09:00 AM - 05:00 PM",
    location: "Grand Conference Hall, AIIMS, New Delhi",
    cmeCredits: 12,
    categories: [
        { id: "faculty", name: "Faculty", price: 5000, earlyBirdPrice: 4000, slotsAvailable: 15 },
        { id: "resident", name: "Resident/Fellow", price: 3000, earlyBirdPrice: 2500, slotsAvailable: 22 },
        { id: "student", name: "Student", price: 1500, earlyBirdPrice: 1200, slotsAvailable: 18 },
    ],
    earlyBirdDeadline: "Dec 31, 2024",
    isEarlyBird: true,
    // Add-on options
    accommodationOptions: [
        { id: "single", name: "Single Room", price: 3500, perNight: true },
        { id: "double", name: "Double Room", price: 5000, perNight: true },
        { id: "suite", name: "Suite", price: 8000, perNight: true },
    ],
    mealOptions: [
        { id: "breakfast", name: "Breakfast Only", price: 500, perDay: true },
        { id: "lunch", name: "Lunch Only", price: 800, perDay: true },
        { id: "full", name: "Full Board (All Meals)", price: 1500, perDay: true },
    ],
    eventDays: 2,
};

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
    const [currentStep, setCurrentStep] = useState<Step>("category");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [selectedCategory, setSelectedCategory] = useState("");
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

    const selectedCategoryData = eventData.categories.find((c) => c.id === selectedCategory);
    const basePrice = selectedCategoryData
        ? eventData.isEarlyBird
            ? selectedCategoryData.earlyBirdPrice
            : selectedCategoryData.price
        : 0;

    // Calculate additional costs
    const calculateAdditionalCosts = () => {
        let accommodation = 0;
        let meals = 0;
        let transport = 0;

        if (preferences.needAccommodation && preferences.accommodationType) {
            const room = eventData.accommodationOptions.find(o => o.id === preferences.accommodationType);
            if (room) {
                accommodation = room.price * preferences.numberOfNights;
            }
        }

        if (preferences.mealPlan) {
            const meal = eventData.mealOptions.find(o => o.id === preferences.mealPlan);
            if (meal) {
                meals = meal.price * eventData.eventDays;
            }
        }

        if (preferences.needAirportPickup) {
            transport += 1500;
        }
        if (preferences.needLocalTransport) {
            transport += 500 * eventData.eventDays;
        }

        return { accommodation, meals, transport, total: accommodation + meals + transport };
    };

    const additionalCosts = calculateAdditionalCosts();
    const totalPrice = basePrice + additionalCosts.total;

    const steps: { key: Step; label: string; icon: React.ElementType }[] = [
        { key: "category", label: "Category", icon: Ticket },
        { key: "details", label: "Details", icon: User },
        // { key: "preferences", label: "Preferences", icon: Heart }, // Hidden for demo
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
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setCurrentStep("confirmation");
    };

    const canProceedFromCategory = selectedCategory !== "";
    const canProceedFromDetails =
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.phone &&
        formData.institution &&
        formData.agreeTerms;

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
                <div className="container mx-auto px-4 py-4">
                    <Link
                        href={`/events/${params.id}`}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Event Details
                    </Link>
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
                                        <span className="flex items-center gap-1">
                                            <Award className="h-4 w-4 text-primary" />
                                            {eventData.cmeCredits} CME Credits
                                        </span>
                                    </div>
                                </div>
                                {selectedCategoryData && currentStep !== "confirmation" && (
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
                        {/* Step 1: Select Category */}
                        {currentStep === "category" && (
                            <Card className="border-0 shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Ticket className="h-5 w-5 text-primary" />
                                        Select Registration Category
                                    </CardTitle>
                                    <CardDescription>
                                        Choose the category that best describes your professional status
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <RadioGroup
                                        value={selectedCategory}
                                        onValueChange={handleCategorySelect}
                                        className="space-y-3"
                                    >
                                        {eventData.categories.map((category) => (
                                            <label
                                                key={category.id}
                                                className={cn(
                                                    "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
                                                    selectedCategory === category.id
                                                        ? "border-primary bg-primary/5 shadow-md"
                                                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <RadioGroupItem value={category.id} />
                                                    <div>
                                                        <p className="font-semibold">{category.name}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {category.slotsAvailable} slots remaining
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {eventData.isEarlyBird && category.earlyBirdPrice && (
                                                        <p className="text-sm text-muted-foreground line-through">
                                                            ₹{category.price.toLocaleString()}
                                                        </p>
                                                    )}
                                                    <p className="text-xl font-bold text-primary">
                                                        ₹{(eventData.isEarlyBird ? category.earlyBirdPrice : category.price).toLocaleString()}
                                                    </p>
                                                </div>
                                            </label>
                                        ))}
                                    </RadioGroup>

                                    {eventData.isEarlyBird && (
                                        <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                                            <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                                                <Award className="h-4 w-4" />
                                                Early bird pricing available until {eventData.earlyBirdDeadline}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex justify-end pt-4">
                                        <Button
                                            onClick={handleNextStep}
                                            disabled={!canProceedFromCategory}
                                            className="gap-2 gradient-medical text-white"
                                            size="lg"
                                        >
                                            Continue
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Step 2: Personal Details */}
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

                                    <div className="flex justify-between pt-4">
                                        <Button variant="outline" onClick={handlePrevStep} className="gap-2">
                                            <ArrowLeft className="h-4 w-4" />
                                            Back
                                        </Button>
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

                        {/* Step 3: Preferences */}
                        {currentStep === "preferences" && (
                            <div className="space-y-6">
                                {/* Family Members */}
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="h-5 w-5 text-primary" />
                                            Family & Accompanying Guests
                                        </CardTitle>
                                        <CardDescription>
                                            Will any family members be accompanying you to the event?
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                                            <div className="flex items-center gap-3">
                                                <Users className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">Bringing Family Members</p>
                                                    <p className="text-sm text-muted-foreground">Spouse, children, or other guests</p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={preferences.bringingFamily}
                                                onCheckedChange={(checked) => handlePreferenceChange("bringingFamily", checked)}
                                            />
                                        </div>

                                        {preferences.bringingFamily && (
                                            <div className="space-y-4 animate-fadeIn">
                                                {preferences.familyMembers.map((member, index) => (
                                                    <div key={member.id} className="p-4 rounded-xl border bg-white space-y-4">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="font-medium text-sm">Family Member {index + 1}</h4>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-destructive"
                                                                onClick={() => removeFamilyMember(member.id)}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs">Full Name</Label>
                                                                <Input
                                                                    value={member.name}
                                                                    onChange={(e) => updateFamilyMember(member.id, "name", e.target.value)}
                                                                    placeholder="Name"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs">Relation</Label>
                                                                <Select
                                                                    value={member.relation}
                                                                    onValueChange={(v) => updateFamilyMember(member.id, "relation", v)}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="spouse">Spouse</SelectItem>
                                                                        <SelectItem value="child">Child</SelectItem>
                                                                        <SelectItem value="parent">Parent</SelectItem>
                                                                        <SelectItem value="other">Other</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs">Age</Label>
                                                                <Input
                                                                    value={member.age}
                                                                    onChange={(e) => updateFamilyMember(member.id, "age", e.target.value)}
                                                                    placeholder="Age"
                                                                    type="number"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs">Dietary Pref.</Label>
                                                                <Select
                                                                    value={member.dietaryPreference}
                                                                    onValueChange={(v) => updateFamilyMember(member.id, "dietaryPreference", v)}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="veg">Vegetarian</SelectItem>
                                                                        <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                                                                        <SelectItem value="vegan">Vegan</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}

                                                <Button
                                                    variant="outline"
                                                    onClick={addFamilyMember}
                                                    className="w-full gap-2 border-dashed"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                    Add Family Member
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Accommodation */}
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Hotel className="h-5 w-5 text-primary" />
                                            Accommodation
                                        </CardTitle>
                                        <CardDescription>
                                            Do you need hotel accommodation during the event?
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                                            <div className="flex items-center gap-3">
                                                <Hotel className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">Need Accommodation</p>
                                                    <p className="text-sm text-muted-foreground">Partner hotels available at special rates</p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={preferences.needAccommodation}
                                                onCheckedChange={(checked) => handlePreferenceChange("needAccommodation", checked)}
                                            />
                                        </div>

                                        {preferences.needAccommodation && (
                                            <div className="space-y-4 animate-fadeIn">
                                                <div className="space-y-3">
                                                    <Label>Room Type</Label>
                                                    <RadioGroup
                                                        value={preferences.accommodationType}
                                                        onValueChange={(v) => handlePreferenceChange("accommodationType", v)}
                                                        className="grid grid-cols-1 md:grid-cols-3 gap-3"
                                                    >
                                                        {eventData.accommodationOptions.map((option) => (
                                                            <label
                                                                key={option.id}
                                                                className={cn(
                                                                    "flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all text-center",
                                                                    preferences.accommodationType === option.id
                                                                        ? "border-primary bg-primary/5"
                                                                        : "border-border hover:border-primary/50"
                                                                )}
                                                            >
                                                                <RadioGroupItem value={option.id} className="sr-only" />
                                                                <p className="font-medium">{option.name}</p>
                                                                <p className="text-lg font-bold text-primary mt-1">
                                                                    ₹{option.price.toLocaleString()}/night
                                                                </p>
                                                            </label>
                                                        ))}
                                                    </RadioGroup>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Number of Nights</Label>
                                                        <div className="flex items-center gap-3">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => handlePreferenceChange("numberOfNights", Math.max(1, preferences.numberOfNights - 1))}
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </Button>
                                                            <span className="w-12 text-center font-bold text-lg">{preferences.numberOfNights}</span>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                onClick={() => handlePreferenceChange("numberOfNights", preferences.numberOfNights + 1)}
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Special Room Requests</Label>
                                                    <Textarea
                                                        value={preferences.specialRoomRequests}
                                                        onChange={(e) => handlePreferenceChange("specialRoomRequests", e.target.value)}
                                                        placeholder="E.g., Non-smoking room, high floor, connecting rooms..."
                                                        rows={2}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Food & Dietary */}
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Utensils className="h-5 w-5 text-primary" />
                                            Food & Dietary Preferences
                                        </CardTitle>
                                        <CardDescription>
                                            Help us cater to your dietary requirements
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3">
                                            <Label>Dietary Preference *</Label>
                                            <RadioGroup
                                                value={preferences.dietaryPreference}
                                                onValueChange={(v) => handlePreferenceChange("dietaryPreference", v)}
                                                className="flex flex-wrap gap-3"
                                            >
                                                {[
                                                    { id: "veg", label: "Vegetarian", icon: "🥗" },
                                                    { id: "non-veg", label: "Non-Vegetarian", icon: "🍖" },
                                                    { id: "vegan", label: "Vegan", icon: "🌱" },
                                                    { id: "jain", label: "Jain", icon: "🙏" },
                                                ].map((option) => (
                                                    <label
                                                        key={option.id}
                                                        className={cn(
                                                            "flex items-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all",
                                                            preferences.dietaryPreference === option.id
                                                                ? "border-primary bg-primary/5"
                                                                : "border-border hover:border-primary/50"
                                                        )}
                                                    >
                                                        <RadioGroupItem value={option.id} className="sr-only" />
                                                        <span>{option.icon}</span>
                                                        <span className="font-medium">{option.label}</span>
                                                    </label>
                                                ))}
                                            </RadioGroup>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Food Allergies / Restrictions</Label>
                                            <Input
                                                value={preferences.foodAllergies}
                                                onChange={(e) => handlePreferenceChange("foodAllergies", e.target.value)}
                                                placeholder="E.g., Nuts, Gluten, Dairy, Shellfish..."
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label>Meal Plan (Optional)</Label>
                                            <RadioGroup
                                                value={preferences.mealPlan}
                                                onValueChange={(v) => handlePreferenceChange("mealPlan", v)}
                                                className="grid grid-cols-1 md:grid-cols-3 gap-3"
                                            >
                                                {eventData.mealOptions.map((option) => (
                                                    <label
                                                        key={option.id}
                                                        className={cn(
                                                            "flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all text-center",
                                                            preferences.mealPlan === option.id
                                                                ? "border-primary bg-primary/5"
                                                                : "border-border hover:border-primary/50"
                                                        )}
                                                    >
                                                        <RadioGroupItem value={option.id} className="sr-only" />
                                                        <p className="font-medium">{option.name}</p>
                                                        <p className="text-lg font-bold text-primary mt-1">
                                                            ₹{option.price.toLocaleString()}/day
                                                        </p>
                                                    </label>
                                                ))}
                                            </RadioGroup>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Info className="h-3 w-3" />
                                                Tea/coffee breaks are included in registration
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Transportation */}
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Car className="h-5 w-5 text-primary" />
                                            Transportation
                                        </CardTitle>
                                        <CardDescription>
                                            Need help with travel arrangements?
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                                            <div className="flex items-center gap-3">
                                                <Plane className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">Airport Pickup/Drop</p>
                                                    <p className="text-sm text-muted-foreground">₹1,500 (round trip)</p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={preferences.needAirportPickup}
                                                onCheckedChange={(checked) => handlePreferenceChange("needAirportPickup", checked)}
                                            />
                                        </div>

                                        {preferences.needAirportPickup && (
                                            <div className="space-y-2 animate-fadeIn">
                                                <Label>Flight Details</Label>
                                                <Textarea
                                                    value={preferences.flightDetails}
                                                    onChange={(e) => handlePreferenceChange("flightDetails", e.target.value)}
                                                    placeholder="Please provide your arrival flight number, date, and time"
                                                    rows={2}
                                                />
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                                            <div className="flex items-center gap-3">
                                                <Car className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">Local Transport</p>
                                                    <p className="text-sm text-muted-foreground">₹500/day (Hotel to Venue)</p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={preferences.needLocalTransport}
                                                onCheckedChange={(checked) => handlePreferenceChange("needLocalTransport", checked)}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Special Assistance */}
                                <Card className="border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Heart className="h-5 w-5 text-primary" />
                                            Special Requirements
                                        </CardTitle>
                                        <CardDescription>
                                            Any other assistance you may need
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    ♿
                                                </div>
                                                <div>
                                                    <p className="font-medium">Wheelchair Access Required</p>
                                                    <p className="text-sm text-muted-foreground">We&apos;ll ensure accessible seating</p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={preferences.wheelchairAccess}
                                                onCheckedChange={(checked) => handlePreferenceChange("wheelchairAccess", checked)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Any Other Special Requests</Label>
                                            <Textarea
                                                value={preferences.specialAssistance}
                                                onChange={(e) => handlePreferenceChange("specialAssistance", e.target.value)}
                                                placeholder="Please let us know if you have any other special requirements..."
                                                rows={3}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Navigation */}
                                <div className="flex justify-between pt-4">
                                    <Button variant="outline" onClick={handlePrevStep} className="gap-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleNextStep}
                                        className="gap-2 gradient-medical text-white"
                                        size="lg"
                                    >
                                        Continue to Payment
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Payment */}
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
                                                    <span className="text-muted-foreground">Category</span>
                                                    <span className="font-medium">{selectedCategoryData?.name}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">Registration Fee</span>
                                                    <span>₹{selectedCategoryData?.price.toLocaleString()}</span>
                                                </div>
                                                {eventData.isEarlyBird && selectedCategoryData && (
                                                    <div className="flex justify-between text-sm text-green-600">
                                                        <span>Early Bird Discount</span>
                                                        <span>
                                                            -₹{(selectedCategoryData.price - selectedCategoryData.earlyBirdPrice).toLocaleString()}
                                                        </span>
                                                    </div>
                                                )}

                                                {additionalCosts.accommodation > 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">
                                                            Accommodation ({preferences.numberOfNights} nights)
                                                        </span>
                                                        <span>₹{additionalCosts.accommodation.toLocaleString()}</span>
                                                    </div>
                                                )}

                                                {additionalCosts.meals > 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">
                                                            Meals ({eventData.eventDays} days)
                                                        </span>
                                                        <span>₹{additionalCosts.meals.toLocaleString()}</span>
                                                    </div>
                                                )}

                                                {additionalCosts.transport > 0 && (
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Transportation</span>
                                                        <span>₹{additionalCosts.transport.toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="h-px bg-border" />

                                            <div className="flex justify-between font-bold text-lg">
                                                <span>Total</span>
                                                <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
                                            </div>

                                            {/* Preferences Summary */}
                                            <div className="pt-2 space-y-2">
                                                <p className="text-xs font-medium text-muted-foreground uppercase">Your Preferences</p>
                                                <div className="flex flex-wrap gap-1">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {preferences.dietaryPreference === "veg" ? "🥗 Veg" :
                                                         preferences.dietaryPreference === "non-veg" ? "🍖 Non-Veg" :
                                                         preferences.dietaryPreference === "vegan" ? "🌱 Vegan" : "🙏 Jain"}
                                                    </Badge>
                                                    {preferences.bringingFamily && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            👨‍👩‍👧 {preferences.familyMembers.length} Guest(s)
                                                        </Badge>
                                                    )}
                                                    {preferences.needAccommodation && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            🏨 Hotel
                                                        </Badge>
                                                    )}
                                                    {preferences.needAirportPickup && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            ✈️ Pickup
                                                        </Badge>
                                                    )}
                                                </div>
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
                                                    <p className="font-mono font-bold">REG-2025-0001</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Amount Paid</p>
                                                    <p className="font-bold text-primary">₹{totalPrice.toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">Category</p>
                                                    <p className="font-medium">{selectedCategoryData?.name}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">CME Credits</p>
                                                    <p className="font-medium">{eventData.cmeCredits} Credits</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                                            <p className="text-sm text-blue-700">
                                                <Mail className="h-4 w-4 inline mr-2" />
                                                A confirmation email has been sent to {formData.email}
                                            </p>
                                        </div>

                                        {(preferences.needAccommodation || preferences.bringingFamily) && (
                                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                                                <p className="text-sm text-amber-700">
                                                    <Info className="h-4 w-4 inline mr-2" />
                                                    Our team will contact you to confirm accommodation and guest arrangements.
                                                </p>
                                            </div>
                                        )}
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
