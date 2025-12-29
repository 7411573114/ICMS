"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";
import {
    Calendar,
    Users,
    Award,
    DollarSign,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CalendarDays,
} from "lucide-react";

// Stats data
const stats = [
    {
        title: "Total Events",
        value: "24",
        change: "+12%",
        trend: "up",
        icon: Calendar,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
    },
    {
        title: "Registrations",
        value: "1,248",
        change: "+8%",
        trend: "up",
        icon: Users,
        color: "text-green-600",
        bgColor: "bg-green-50",
    },
    {
        title: "Certificates Issued",
        value: "856",
        change: "+23%",
        trend: "up",
        icon: Award,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
    },
    {
        title: "Revenue",
        value: "$48,290",
        change: "-3%",
        trend: "down",
        icon: DollarSign,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
    },
];

// Upcoming events data
const upcomingEvents = [
    {
        id: 1,
        title: "Epilepsy Management CME Session",
        date: "Dec 29, 2025",
        time: "02:00 PM",
        registrations: 72,
        capacity: 80,
    },
    {
        id: 2,
        title: "Deep Brain Stimulation Workshop",
        date: "Jan 5, 2026",
        time: "09:00 AM",
        registrations: 27,
        capacity: 30,
    },
    {
        id: 3,
        title: "National Neurostimulation Summit 2026",
        date: "Jan 10-11, 2026",
        time: "09:00 AM",
        registrations: 156,
        capacity: 200,
    },
];

// Recent registrations data
const recentRegistrations = [
    {
        id: 1,
        name: "Dr. Priya Sharma",
        event: "Epilepsy Management CME",
        date: "15 minutes ago",
        status: "confirmed",
    },
    {
        id: 2,
        name: "Dr. Rajesh Kumar",
        event: "Neurostimulation Summit 2026",
        date: "1 hour ago",
        status: "pending",
    },
    {
        id: 3,
        name: "Dr. Ananya Patel",
        event: "DBS Workshop",
        date: "3 hours ago",
        status: "confirmed",
    },
    {
        id: 4,
        name: "Dr. Vikram Singh",
        event: "Neurostimulation Summit 2026",
        date: "5 hours ago",
        status: "confirmed",
    },
];

export default function DashboardPage() {
    const { sidebarCollapsed } = useUIStore();

    return (
        <div className="min-h-screen bg-muted/30">
            <Sidebar />
            <Header title="Dashboard" subtitle="Welcome back, Dr. Admin" />

            {/* Main content */}
            <main className={cn(
                "pt-16 min-h-screen transition-all duration-300",
                sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-64",
                "pl-0"
            )}>
                <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="bg-background rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className={cn("p-2.5 rounded-lg", stat.bgColor)}>
                                        <stat.icon className={cn("w-5 h-5", stat.color)} />
                                    </div>
                                    <div className={cn(
                                        "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                                        stat.trend === "up"
                                            ? "text-green-700 bg-green-50"
                                            : "text-red-700 bg-red-50"
                                    )}>
                                        {stat.trend === "up" ? (
                                            <ArrowUpRight className="w-3 h-3" />
                                        ) : (
                                            <ArrowDownRight className="w-3 h-3" />
                                        )}
                                        {stat.change}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                                    <p className="text-sm text-muted-foreground mt-0.5">{stat.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        {/* Upcoming Events */}
                        <div className="lg:col-span-3 bg-background rounded-xl border border-border">
                            <div className="p-5 border-b border-border flex items-center justify-between">
                                <div>
                                    <h2 className="font-semibold text-foreground">Upcoming Events</h2>
                                    <p className="text-sm text-muted-foreground">Next scheduled events</p>
                                </div>
                                <button className="text-sm text-primary font-medium hover:underline">
                                    View all
                                </button>
                            </div>
                            <div className="divide-y divide-border">
                                {upcomingEvents.map((event) => (
                                    <div key={event.id} className="p-5 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <CalendarDays className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-foreground truncate">
                                                    {event.title}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {event.date}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {event.time}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-sm font-medium text-foreground">
                                                    {event.registrations}/{event.capacity}
                                                </p>
                                                <div className="w-20 h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary rounded-full"
                                                        style={{
                                                            width: `${(event.registrations / event.capacity) * 100}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Registrations */}
                        <div className="lg:col-span-2 bg-background rounded-xl border border-border">
                            <div className="p-5 border-b border-border flex items-center justify-between">
                                <div>
                                    <h2 className="font-semibold text-foreground">Recent Registrations</h2>
                                    <p className="text-sm text-muted-foreground">Latest sign-ups</p>
                                </div>
                                <button className="text-sm text-primary font-medium hover:underline">
                                    View all
                                </button>
                            </div>
                            <div className="divide-y divide-border">
                                {recentRegistrations.map((registration) => (
                                    <div key={registration.id} className="p-4 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm font-medium text-primary">
                                                    {registration.name.split(" ").map(n => n[0]).join("")}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-foreground truncate">
                                                    {registration.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {registration.event}
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <span className={cn(
                                                    "inline-flex text-xs font-medium px-2 py-0.5 rounded-full",
                                                    registration.status === "confirmed"
                                                        ? "text-green-700 bg-green-50"
                                                        : "text-amber-700 bg-amber-50"
                                                )}>
                                                    {registration.status}
                                                </span>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {registration.date}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-background rounded-xl border border-border p-5">
                        <h2 className="font-semibold text-foreground mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { label: "Create Event", icon: Calendar, color: "bg-blue-500" },
                                { label: "Add Speaker", icon: Users, color: "bg-green-500" },
                                { label: "Issue Certificate", icon: Award, color: "bg-purple-500" },
                                { label: "View Reports", icon: TrendingUp, color: "bg-amber-500" },
                            ].map((action, index) => (
                                <button
                                    key={index}
                                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:bg-muted/50 hover:border-primary/20 transition-all group"
                                >
                                    <div className={cn("p-3 rounded-lg text-white", action.color)}>
                                        <action.icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                        {action.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
