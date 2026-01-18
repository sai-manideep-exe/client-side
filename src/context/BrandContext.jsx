import React, { createContext, useContext, useEffect, useState } from 'react';

// In a real app, this would fetch from an API based on the Realtor's ID
// This matches the Theme Studio structure for seamless branding
const DEMO_BRANDING = {
    // Realtor Info
    name: "Vandy Elite Group",
    aiName: "Alfred",
    logo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",

    // Theme Colors (from Theme Studio)
    theme: {
        // Foundation Colors (kept neutral for user control)
        background: '#F9FAFB',      // Used minimally, respects dark mode
        surface: '#FFFFFF',          // Used minimally, respects dark mode
        textPrimary: '#111827',      // Used minimally, respects dark mode
        textSecondary: '#6B7280',    // Used minimally, respects dark mode
        border: '#E5E7EB',           // Used minimally, respects dark mode

        // Semantic UI Colors (HEAVILY used for branding)
        primary: '#6366F1',          // Main brand color - sidebar, chat, CTAs
        secondary: '#10B981',        // Secondary actions
        accent: '#F59E0B',           // Highlights, badges
        success: '#10B981',          // Positive states
        warning: '#F59E0B',          // Warnings
        error: '#EF4444',            // Errors
        info: '#3B82F6',             // Info badges
    }
};

const BrandContext = createContext(DEMO_BRANDING);

export function BrandProvider({ children }) {
    const [brand, setBrand] = useState(DEMO_BRANDING);

    useEffect(() => {
        // Inject CSS Variables for dynamic theming
        const root = document.documentElement;

        // Primary brand color (most important)
        root.style.setProperty('--brand-primary', brand.theme.primary);
        root.style.setProperty('--brand-secondary', brand.theme.secondary);
        root.style.setProperty('--brand-accent', brand.theme.accent);
        root.style.setProperty('--brand-success', brand.theme.success);

        // Dynamic Title
        document.title = brand.name;

    }, [brand]);

    return (
        <BrandContext.Provider value={brand}>
            {children}
        </BrandContext.Provider>
    );
}

export function useBrand() {
    return useContext(BrandContext);
}
