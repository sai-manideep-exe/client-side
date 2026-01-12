import React, { createContext, useContext, useEffect, useState } from 'react';

// In a real app, this would fetch from an API based on the Realtor's ID
const DEMO_BRANDING = {
    name: "Vandy Elite Group",
    primaryColor: '#6366F1', // Indigo (Default)
    aiName: "Alfred",
    logo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80" // Realtor's face as logo for now
};

const BrandContext = createContext(DEMO_BRANDING);

export function BrandProvider({ children }) {
    const [brand, setBrand] = useState(DEMO_BRANDING);

    useEffect(() => {
        // Inject CSS Variables for Tailwind to use
        const root = document.documentElement;

        // Convert Hex to RGB for Tailwind opacity utility support (e.g. bg-brand-primary/20)
        // We will just use the hex for now and assume basic hex support
        root.style.setProperty('--brand-primary', brand.primaryColor);

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
