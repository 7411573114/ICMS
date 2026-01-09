// Default tenant configuration - used when no tenant is specified

import { TenantConfig, GalleryImage, GalleryVideo, AboutFeature } from "./types";

// Default gallery images
export const defaultGalleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80",
    alt: "Medical Conference Keynote",
    category: "Conference",
    event: "Annual Medical Summit",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    alt: "Workshop Session",
    category: "Workshop",
    event: "Surgical Techniques Workshop",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
    alt: "Networking Event",
    category: "Networking",
    event: "Healthcare Leaders Meet",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80",
    alt: "Medical Equipment Exhibition",
    category: "Exhibition",
    event: "MedTech Expo",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&q=80",
    alt: "CME Training Session",
    category: "Training",
    event: "CME Credit Program",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&q=80",
    alt: "Panel Discussion",
    category: "Conference",
    event: "Healthcare Innovation Forum",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    alt: "Award Ceremony",
    category: "Awards",
    event: "Excellence in Medicine Awards",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800&q=80",
    alt: "Hands-on Workshop",
    category: "Workshop",
    event: "Practical Skills Training",
  },
];

// Default gallery videos
export const defaultGalleryVideos: GalleryVideo[] = [
  {
    id: 1,
    thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    title: "Annual Medical Conference - Highlights",
    category: "Conference",
    duration: "12:45",
    youtubeId: "dQw4w9WgXcQ",
    event: "Annual Medical Summit",
  },
  {
    id: 2,
    thumbnail: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&q=80",
    title: "Surgical Techniques Workshop - Full Session",
    category: "Workshop",
    duration: "45:30",
    youtubeId: "dQw4w9WgXcQ",
    event: "Surgical Skills Training",
  },
  {
    id: 3,
    thumbnail: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
    title: "Healthcare Innovation Panel Discussion",
    category: "Conference",
    duration: "32:15",
    youtubeId: "dQw4w9WgXcQ",
    event: "Healthcare Innovation Forum",
  },
  {
    id: 4,
    thumbnail: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&q=80",
    title: "MedTech Expo - Event Recap",
    category: "Exhibition",
    duration: "8:20",
    youtubeId: "dQw4w9WgXcQ",
    event: "MedTech Expo",
  },
];

// Default about features
export const defaultAboutFeatures: AboutFeature[] = [
  {
    icon: "GraduationCap",
    title: "CME Accredited",
    description: "All our conferences are accredited for Continuing Medical Education credits.",
  },
  {
    icon: "Users",
    title: "Expert Speakers",
    description: "Learn from leading medical professionals and researchers worldwide.",
  },
  {
    icon: "Globe",
    title: "Global Network",
    description: "Connect with healthcare professionals from around the world.",
  },
  {
    icon: "Award",
    title: "Quality Events",
    description: "High-quality, well-organized medical conferences and workshops.",
  },
];

// Default tenant configuration
export const defaultTenantConfig: TenantConfig = {
  id: "default",
  slug: "default",
  isActive: true,

  branding: {
    name: "MedConf",
    tagline: "Medical Conference Portal",
    logo: undefined,
    favicon: undefined,
  },

  theme: {
    primaryColor: "#0d9488", // teal-600
    secondaryColor: "#0891b2", // cyan-600
    accentColor: "#10b981", // emerald-500
  },

  contact: {
    email: "info@medconf.com",
    phone: "+91 1234567890",
    address: "123 Medical Center",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    website: "https://medconf.com",
  },

  social: {
    facebook: "https://facebook.com/medconf",
    twitter: "https://twitter.com/medconf",
    linkedin: "https://linkedin.com/company/medconf",
    instagram: "https://instagram.com/medconf",
    youtube: "https://youtube.com/@medconf",
  },

  sections: {
    hero: true,
    events: true,
    gallery: true,
    sponsors: true,
    about: true,
    contact: true,
  },

  hero: {
    title: "Advance Your Medical Career",
    subtitle: "Register for upcoming medical conferences, workshops, and CME programs. Earn credits while learning from industry experts.",
    bgImage: undefined,
  },

  about: {
    title: "Why Choose MedConf?",
    description: "We are dedicated to advancing medical education through high-quality conferences, workshops, and training programs.",
    features: defaultAboutFeatures,
  },

  gallery: {
    images: defaultGalleryImages,
    videos: defaultGalleryVideos,
  },

  footer: {
    text: "Empowering medical professionals through quality education and networking.",
    copyrightText: "MedConf. All rights reserved.",
  },

  settings: {
    defaultCurrency: "INR",
    defaultTimezone: "Asia/Kolkata",
  },
};

// Merge tenant config with defaults (for partial configs)
export function mergeTenantConfig(partial: Partial<TenantConfig>): TenantConfig {
  return {
    ...defaultTenantConfig,
    ...partial,
    branding: { ...defaultTenantConfig.branding, ...partial.branding },
    theme: { ...defaultTenantConfig.theme, ...partial.theme },
    contact: { ...defaultTenantConfig.contact, ...partial.contact },
    social: { ...defaultTenantConfig.social, ...partial.social },
    sections: { ...defaultTenantConfig.sections, ...partial.sections },
    hero: { ...defaultTenantConfig.hero, ...partial.hero },
    about: { ...defaultTenantConfig.about, ...partial.about },
    gallery: {
      images: partial.gallery?.images || defaultTenantConfig.gallery.images,
      videos: partial.gallery?.videos || defaultTenantConfig.gallery.videos,
    },
    footer: { ...defaultTenantConfig.footer, ...partial.footer },
    settings: { ...defaultTenantConfig.settings, ...partial.settings },
  };
}
