"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Users,
    IndianRupee,
    FileText,
    Award,
    Image,
    Plus,
    Trash2,
    GripVertical,
    Info,
    Save,
    Eye,
    AlertCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface SlotCategory {
    id: string;
    name: string;
    description: string;
    totalSlots: number;
    price: number;
    earlyBirdPrice: number;
    earlyBirdDeadline: string;
}

interface Session {
    id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    venue: string;
    speaker: string;
    description: string;
}

export default function CreateEventPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("basic");
    const [slotCategories, setSlotCategories] = useState<SlotCategory[]>([
        {
            id: "1",
            name: "General Registration",
            description: "Standard conference access",
            totalSlots: 100,
            price: 5000,
            earlyBirdPrice: 4000,
            earlyBirdDeadline: "",
        },
    ]);
    const [sessions, setSessions] = useState<Session[]>([]);

    const addSlotCategory = () => {
        setSlotCategories([
            ...slotCategories,
            {
                id: Date.now().toString(),
                name: "",
                description: "",
                totalSlots: 50,
                price: 0,
                earlyBirdPrice: 0,
                earlyBirdDeadline: "",
            },
        ]);
    };

    const removeSlotCategory = (id: string) => {
        setSlotCategories(slotCategories.filter((cat) => cat.id !== id));
    };

    const updateSlotCategory = (id: string, field: keyof SlotCategory, value: string | number) => {
        setSlotCategories(
            slotCategories.map((cat) =>
                cat.id === id ? { ...cat, [field]: value } : cat
            )
        );
    };

    const addSession = () => {
        setSessions([
            ...sessions,
            {
                id: Date.now().toString(),
                title: "",
                date: "",
                startTime: "",
                endTime: "",
                venue: "",
                speaker: "",
                description: "",
            },
        ]);
    };

    const removeSession = (id: string) => {
        setSessions(sessions.filter((session) => session.id !== id));
    };

    const totalSlots = slotCategories.reduce((sum, cat) => sum + cat.totalSlots, 0);

    return (
        <DashboardLayout
            title="Create Event"
            subtitle="Set up a new conference, workshop, or CME session"
        >
            <div className="space-y-6 animate-fadeIn">
                {/* Back Button & Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="hidden xs:inline">Back to Events</span>
                        <span className="xs:hidden">Back</span>
                    </Button>
                    <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
                        <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none">
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">Preview</span>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none">
                            <Save className="h-4 w-4" />
                            <span className="hidden sm:inline">Save Draft</span>
                            <span className="sm:hidden">Save</span>
                        </Button>
                        <Button size="sm" className="gap-2 gradient-medical text-white hover:opacity-90 flex-1 sm:flex-none">
                            <Plus className="h-4 w-4" />
                            <span className="hidden sm:inline">Publish Event</span>
                            <span className="sm:hidden">Publish</span>
                        </Button>
                    </div>
                </div>

                {/* Progress Indicator */}
                <Card className="border-medical-teal/20 bg-gradient-to-r from-medical-teal-light/30 to-medical-blue-light/30">
                    <CardContent className="py-3 sm:py-4">
                        <div className="flex items-center justify-between">
                            {["Basic", "Pricing", "Sessions", "Settings"].map((step, index) => {
                                const fullNames = ["Basic Info", "Slots & Pricing", "Sessions", "Settings"];
                                return (
                                    <div key={step} className="flex items-center">
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={cn(
                                                    "w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors",
                                                    index === ["basic", "slots", "sessions", "settings"].indexOf(activeTab)
                                                        ? "bg-primary text-primary-foreground"
                                                        : index < ["basic", "slots", "sessions", "settings"].indexOf(activeTab)
                                                        ? "bg-medical-green text-white"
                                                        : "bg-muted text-muted-foreground"
                                                )}
                                            >
                                                {index + 1}
                                            </div>
                                            <span className="text-[10px] sm:text-xs mt-1 text-muted-foreground text-center max-w-[60px] sm:max-w-none">
                                                <span className="sm:hidden">{step}</span>
                                                <span className="hidden sm:inline">{fullNames[index]}</span>
                                            </span>
                                        </div>
                                        {index < 3 && (
                                            <div
                                                className={cn(
                                                    "w-6 xs:w-10 sm:w-16 md:w-24 h-0.5 mx-1 sm:mx-2",
                                                    index < ["basic", "slots", "sessions", "settings"].indexOf(activeTab)
                                                        ? "bg-medical-green"
                                                        : "bg-muted"
                                                )}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Main Form */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4 h-10 sm:h-12">
                        <TabsTrigger value="basic" className="gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
                            <FileText className="h-4 w-4 hidden md:block" />
                            <span className="hidden sm:inline">Basic Info</span>
                            <span className="sm:hidden">Basic</span>
                        </TabsTrigger>
                        <TabsTrigger value="slots" className="gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
                            <Users className="h-4 w-4 hidden md:block" />
                            <span className="hidden sm:inline">Slots & Pricing</span>
                            <span className="sm:hidden">Pricing</span>
                        </TabsTrigger>
                        <TabsTrigger value="sessions" className="gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
                            <Calendar className="h-4 w-4 hidden md:block" />
                            Sessions
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="gap-1 sm:gap-2 text-xs sm:text-sm px-1 sm:px-3">
                            <Award className="h-4 w-4 hidden md:block" />
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    {/* Basic Info Tab */}
                    <TabsContent value="basic" className="space-y-6 mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Form */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="card-hover">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <div className="icon-container icon-container-teal">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            Event Details
                                        </CardTitle>
                                        <CardDescription>
                                            Basic information about your event
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Event Title *</Label>
                                            <Input
                                                id="title"
                                                placeholder="e.g., Annual Neurostimulation Conference 2025"
                                                className="text-lg"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="category">Event Category *</Label>
                                                <Select>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="workshop">Workshop</SelectItem>
                                                        <SelectItem value="cme">CME Session</SelectItem>
                                                        <SelectItem value="symposium">Symposium</SelectItem>
                                                        <SelectItem value="conference">Conference</SelectItem>
                                                        <SelectItem value="seminar">Seminar</SelectItem>
                                                        <SelectItem value="training">Training Program</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="type">Event Type *</Label>
                                                <Select>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="in-person">In-Person</SelectItem>
                                                        <SelectItem value="virtual">Virtual</SelectItem>
                                                        <SelectItem value="hybrid">Hybrid</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description">Description *</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Provide a detailed description of the event, topics covered, target audience, learning objectives..."
                                                rows={5}
                                                className="resize-none"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="shortDescription">Short Description</Label>
                                            <Input
                                                id="shortDescription"
                                                placeholder="Brief summary for event cards (max 150 characters)"
                                                maxLength={150}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                This will appear in event listings and cards
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="card-hover">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <div className="icon-container icon-container-blue">
                                                <Calendar className="h-5 w-5" />
                                            </div>
                                            Date & Time
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="startDate">Start Date *</Label>
                                                <Input id="startDate" type="date" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="endDate">End Date *</Label>
                                                <Input id="endDate" type="date" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="startTime">Start Time *</Label>
                                                <Input id="startTime" type="time" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="endTime">End Time *</Label>
                                                <Input id="endTime" type="time" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="timezone">Timezone</Label>
                                            <Select defaultValue="ist">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ist">IST (UTC+5:30)</SelectItem>
                                                    <SelectItem value="utc">UTC</SelectItem>
                                                    <SelectItem value="est">EST (UTC-5)</SelectItem>
                                                    <SelectItem value="pst">PST (UTC-8)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="card-hover">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <div className="icon-container icon-container-green">
                                                <MapPin className="h-5 w-5" />
                                            </div>
                                            Venue Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="venue">Venue Name *</Label>
                                            <Input
                                                id="venue"
                                                placeholder="e.g., Grand Conference Hall, Medical College"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address">Full Address</Label>
                                            <Textarea
                                                id="address"
                                                placeholder="Complete address including city, state, and PIN code"
                                                rows={3}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="city">City</Label>
                                                <Input id="city" placeholder="e.g., Mumbai" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="state">State</Label>
                                                <Input id="state" placeholder="e.g., Maharashtra" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="mapLink">Google Maps Link</Label>
                                            <Input
                                                id="mapLink"
                                                placeholder="https://maps.google.com/..."
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="virtualLink">Virtual Meeting Link</Label>
                                            <Input
                                                id="virtualLink"
                                                placeholder="https://zoom.us/... or https://meet.google.com/..."
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                For virtual or hybrid events
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                <Card className="card-hover">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <div className="icon-container icon-container-purple">
                                                <Image className="h-5 w-5" />
                                            </div>
                                            Event Banner
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                                    <Image className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <p className="text-sm font-medium">
                                                    Upload Banner Image
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Recommended: 1200x630px, PNG or JPG
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="card-hover">
                                    <CardHeader>
                                        <CardTitle className="text-base">Quick Stats</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                            <span className="text-sm text-muted-foreground">
                                                Total Slots
                                            </span>
                                            <Badge variant="secondary" className="text-lg font-bold">
                                                {totalSlots}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                            <span className="text-sm text-muted-foreground">
                                                Categories
                                            </span>
                                            <Badge variant="secondary" className="text-lg font-bold">
                                                {slotCategories.length}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                            <span className="text-sm text-muted-foreground">
                                                Sessions
                                            </span>
                                            <Badge variant="secondary" className="text-lg font-bold">
                                                {sessions.length}
                                            </Badge>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-medical-orange/30 bg-medical-orange-light/30">
                                    <CardContent className="pt-6">
                                        <div className="flex gap-3">
                                            <Info className="h-5 w-5 text-medical-orange shrink-0 mt-0.5" />
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium text-medical-orange">
                                                    Tips for Success
                                                </p>
                                                <ul className="text-xs text-muted-foreground space-y-1">
                                                    <li>• Add a compelling banner image</li>
                                                    <li>• Write detailed descriptions</li>
                                                    <li>• Set early bird pricing</li>
                                                    <li>• Add speaker profiles</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Slots & Pricing Tab */}
                    <TabsContent value="slots" className="space-y-6 mt-6">
                        <Card>
                            <CardHeader className="pb-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                            <div className="icon-container icon-container-teal h-8 w-8 sm:h-10 sm:w-10">
                                                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </div>
                                            Registration Categories
                                        </CardTitle>
                                        <CardDescription className="text-xs sm:text-sm mt-1">
                                            Define different registration types with pricing
                                        </CardDescription>
                                    </div>
                                    <Button onClick={addSlotCategory} size="sm" className="gap-2 w-full sm:w-auto">
                                        <Plus className="h-4 w-4" />
                                        Add Category
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {slotCategories.map((category, index) => (
                                    <div
                                        key={category.id}
                                        className="p-3 sm:p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow animate-fadeIn"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        {/* Mobile: Header with drag and delete */}
                                        <div className="flex items-center justify-between mb-3 sm:hidden">
                                            <div className="flex items-center gap-2">
                                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm font-medium">Category {index + 1}</span>
                                            </div>
                                            {slotCategories.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeSlotCategory(category.id)}
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>

                                        {/* Desktop: Original layout */}
                                        <div className="hidden sm:flex items-start gap-4">
                                            <div className="cursor-grab p-2 text-muted-foreground hover:text-foreground">
                                                <GripVertical className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Category Name *</Label>
                                                        <Input
                                                            value={category.name}
                                                            onChange={(e) =>
                                                                updateSlotCategory(
                                                                    category.id,
                                                                    "name",
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="e.g., Faculty, Student, Professional"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Total Slots *</Label>
                                                        <Input
                                                            type="number"
                                                            value={category.totalSlots}
                                                            onChange={(e) =>
                                                                updateSlotCategory(
                                                                    category.id,
                                                                    "totalSlots",
                                                                    parseInt(e.target.value) || 0
                                                                )
                                                            }
                                                            min={1}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label>Description</Label>
                                                    <Input
                                                        value={category.description}
                                                        onChange={(e) =>
                                                            updateSlotCategory(
                                                                category.id,
                                                                "description",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="What's included in this registration"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Regular Price (₹) *</Label>
                                                        <div className="relative">
                                                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                            <Input
                                                                type="number"
                                                                value={category.price}
                                                                onChange={(e) =>
                                                                    updateSlotCategory(
                                                                        category.id,
                                                                        "price",
                                                                        parseInt(e.target.value) || 0
                                                                    )
                                                                }
                                                                className="pl-10"
                                                                min={0}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Early Bird Price (₹)</Label>
                                                        <div className="relative">
                                                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                            <Input
                                                                type="number"
                                                                value={category.earlyBirdPrice}
                                                                onChange={(e) =>
                                                                    updateSlotCategory(
                                                                        category.id,
                                                                        "earlyBirdPrice",
                                                                        parseInt(e.target.value) || 0
                                                                    )
                                                                }
                                                                className="pl-10"
                                                                min={0}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Early Bird Deadline</Label>
                                                        <Input
                                                            type="date"
                                                            value={category.earlyBirdDeadline}
                                                            onChange={(e) =>
                                                                updateSlotCategory(
                                                                    category.id,
                                                                    "earlyBirdDeadline",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {slotCategories.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeSlotCategory(category.id)}
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>

                                        {/* Mobile: Stacked form fields */}
                                        <div className="sm:hidden space-y-3">
                                            <div className="space-y-2">
                                                <Label className="text-xs">Category Name *</Label>
                                                <Input
                                                    value={category.name}
                                                    onChange={(e) =>
                                                        updateSlotCategory(category.id, "name", e.target.value)
                                                    }
                                                    placeholder="e.g., Faculty, Student"
                                                    className="h-9"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Total Slots *</Label>
                                                    <Input
                                                        type="number"
                                                        value={category.totalSlots}
                                                        onChange={(e) =>
                                                            updateSlotCategory(category.id, "totalSlots", parseInt(e.target.value) || 0)
                                                        }
                                                        min={1}
                                                        className="h-9"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Price (₹) *</Label>
                                                    <Input
                                                        type="number"
                                                        value={category.price}
                                                        onChange={(e) =>
                                                            updateSlotCategory(category.id, "price", parseInt(e.target.value) || 0)
                                                        }
                                                        min={0}
                                                        className="h-9"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <Label className="text-xs">Early Bird (₹)</Label>
                                                    <Input
                                                        type="number"
                                                        value={category.earlyBirdPrice}
                                                        onChange={(e) =>
                                                            updateSlotCategory(category.id, "earlyBirdPrice", parseInt(e.target.value) || 0)
                                                        }
                                                        min={0}
                                                        className="h-9"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs">EB Deadline</Label>
                                                    <Input
                                                        type="date"
                                                        value={category.earlyBirdDeadline}
                                                        onChange={(e) =>
                                                            updateSlotCategory(category.id, "earlyBirdDeadline", e.target.value)
                                                        }
                                                        className="h-9"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Summary Card */}
                                <div className="mt-6 p-4 rounded-xl gradient-medical-light border border-medical-teal/20">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-foreground">
                                                Total Capacity
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Across all categories
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-primary">
                                                {totalSlots}
                                            </p>
                                            <p className="text-xs text-muted-foreground">slots</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Registration Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <div className="icon-container icon-container-orange">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    Registration Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Registration Opens</Label>
                                        <Input type="datetime-local" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Registration Closes</Label>
                                        <Input type="datetime-local" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="space-y-0.5">
                                        <Label>Enable Waitlist</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Allow registrations after slots are full
                                        </p>
                                    </div>
                                    <Switch />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="space-y-0.5">
                                        <Label>Auto-block slots on payment</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Automatically reserve slots when payment is initiated
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="space-y-0.5">
                                        <Label>Show remaining seats</Label>
                                        <p className="text-xs text-muted-foreground">
                                            Display real-time slot availability
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Sessions Tab */}
                    <TabsContent value="sessions" className="space-y-6 mt-6">
                        <Card>
                            <CardHeader className="pb-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                            <div className="icon-container icon-container-blue h-8 w-8 sm:h-10 sm:w-10">
                                                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </div>
                                            Event Sessions
                                        </CardTitle>
                                        <CardDescription className="text-xs sm:text-sm mt-1">
                                            Add individual sessions, talks, or workshops
                                        </CardDescription>
                                    </div>
                                    <Button onClick={addSession} size="sm" className="gap-2 w-full sm:w-auto">
                                        <Plus className="h-4 w-4" />
                                        Add Session
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {sessions.length === 0 ? (
                                    <div className="text-center py-12 border-2 border-dashed rounded-xl">
                                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                                        <h3 className="text-lg font-medium mb-2">No sessions yet</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Add sessions to build your event schedule
                                        </p>
                                        <Button onClick={addSession} variant="outline" className="gap-2">
                                            <Plus className="h-4 w-4" />
                                            Add First Session
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {sessions.map((session, index) => (
                                            <div
                                                key={session.id}
                                                className="p-3 sm:p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow animate-fadeIn"
                                            >
                                                {/* Mobile: Header */}
                                                <div className="flex items-center justify-between mb-3 sm:hidden">
                                                    <div className="flex items-center gap-2">
                                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm font-medium">Session {index + 1}</span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeSession(session.id)}
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                {/* Desktop: Original layout */}
                                                <div className="hidden sm:flex items-start gap-4">
                                                    <div className="cursor-grab p-2 text-muted-foreground hover:text-foreground">
                                                        <GripVertical className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1 space-y-4">
                                                        <div className="space-y-2">
                                                            <Label>Session Title *</Label>
                                                            <Input placeholder="e.g., Keynote: Future of Neurostimulation" />
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div className="space-y-2">
                                                                <Label>Date *</Label>
                                                                <Input type="date" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Start Time *</Label>
                                                                <Input type="time" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>End Time *</Label>
                                                                <Input type="time" />
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label>Venue/Room</Label>
                                                                <Input placeholder="e.g., Hall A, Room 101" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Speaker</Label>
                                                                <Select>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select speaker" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="new">+ Add New Speaker</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label>Session Description</Label>
                                                            <Textarea
                                                                placeholder="Describe what will be covered in this session"
                                                                rows={2}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => removeSession(session.id)}
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                {/* Mobile: Stacked form */}
                                                <div className="sm:hidden space-y-3">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs">Session Title *</Label>
                                                        <Input placeholder="e.g., Keynote Session" className="h-9" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs">Date *</Label>
                                                        <Input type="date" className="h-9" />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-2">
                                                            <Label className="text-xs">Start Time *</Label>
                                                            <Input type="time" className="h-9" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs">End Time *</Label>
                                                            <Input type="time" className="h-9" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs">Venue/Room</Label>
                                                        <Input placeholder="e.g., Hall A" className="h-9" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs">Speaker</Label>
                                                        <Select>
                                                            <SelectTrigger className="h-9">
                                                                <SelectValue placeholder="Select speaker" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="new">+ Add New Speaker</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-4 sm:space-y-6 mt-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                        <div className="icon-container icon-container-green h-8 w-8 sm:h-10 sm:w-10">
                                            <Award className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        CME Credits
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-lg border">
                                        <div className="space-y-0.5">
                                            <Label>Enable CME Credits</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Award CME credits upon completion
                                            </p>
                                        </div>
                                        <Switch />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>CME Credit Hours</Label>
                                        <Input type="number" placeholder="e.g., 8" min={0} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Accrediting Body</Label>
                                        <Input placeholder="e.g., State Medical Council" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>CME Registration Number</Label>
                                        <Input placeholder="e.g., CME/2025/001" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                        <div className="icon-container icon-container-purple h-8 w-8 sm:h-10 sm:w-10">
                                            <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        Certificate Settings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-lg border">
                                        <div className="space-y-0.5">
                                            <Label>Auto-generate Certificates</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Create certificates after event completion
                                            </p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-lg border">
                                        <div className="space-y-0.5">
                                            <Label>Email Certificates</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Automatically email certificates to participants
                                            </p>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Certificate Template</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select template" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="default">Default Certificate</SelectItem>
                                                <SelectItem value="cme">CME Certificate</SelectItem>
                                                <SelectItem value="workshop">Workshop Certificate</SelectItem>
                                                <SelectItem value="custom">Custom Template</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Signatories</Label>
                                        <div className="space-y-2">
                                            <Input placeholder="Signatory 1 Name & Designation" />
                                            <Input placeholder="Signatory 2 Name & Designation" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-base sm:text-lg">Visibility & Access</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Event Status</Label>
                                        <Select defaultValue="draft">
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="published">Published</SelectItem>
                                                <SelectItem value="private">Private</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-lg border">
                                        <div className="space-y-0.5">
                                            <Label>Featured Event</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Show on homepage and featured listings
                                            </p>
                                        </div>
                                        <Switch />
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-lg border">
                                        <div className="space-y-0.5">
                                            <Label>Allow Comments</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Enable discussion on event page
                                            </p>
                                        </div>
                                        <Switch />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-base sm:text-lg">Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Contact Email</Label>
                                        <Input type="email" placeholder="events@medicalcollege.edu" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Contact Phone</Label>
                                        <Input type="tel" placeholder="+91 98765 43210" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Event Website</Label>
                                        <Input type="url" placeholder="https://event.medicalcollege.edu" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t">
                    <Button
                        variant="outline"
                        onClick={() => {
                            const tabs = ["basic", "slots", "sessions", "settings"];
                            const currentIndex = tabs.indexOf(activeTab);
                            if (currentIndex > 0) {
                                setActiveTab(tabs[currentIndex - 1]);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }
                        }}
                        disabled={activeTab === "basic"}
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={() => {
                            const tabs = ["basic", "slots", "sessions", "settings"];
                            const currentIndex = tabs.indexOf(activeTab);
                            if (currentIndex < tabs.length - 1) {
                                setActiveTab(tabs[currentIndex + 1]);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }
                        }}
                        disabled={activeTab === "settings"}
                    >
                        Next Step
                    </Button>
                </div>
            </div>
        </DashboardLayout>
    );
}
