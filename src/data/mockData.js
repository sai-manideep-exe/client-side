export const CLIENT_QUESTIONS = [
    {
        id: 'budget',
        text: "What’s your budget range?",
        options: ['$600k–$800k', '$800k–$1M', '$1M+'],
    },
    {
        id: 'beds',
        text: "How many bedrooms do you need?",
        options: ['2', '3', '4', '5+'],
    },
    {
        id: 'nearby',
        text: "What matters most nearby?",
        options: ['Top Schools', 'Community Centers', 'Shopping Malls', 'High Quality Neighborhood', 'Parks', 'Quiet Area'],
    },
    {
        id: 'type',
        text: "Preferred property type?",
        options: ['Apartment', 'Villa', 'House', 'Townhouse'],
    },
    {
        id: 'commute',
        text: "Commute preference?",
        options: ['Short', 'Flexible', 'Remote'],
    },
];

export const MOCK_MATCHES = [
    {
        id: 1,
        address: '1248 Oakwood Ave',
        city: 'San Jose, CA 95126',
        price: '$985,000',
        beds: 3,
        baths: 2,
        sqft: 1850,
        coordinates: { lat: 37.3100, lng: -121.9000 },
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        description: 'Beautiful historic home with modern updates, pool, and landscaped yard. Located in the heart of Willow Glen.',
        features: [
            '3 spacious bedrooms',
            'Willow Glen rated 9/10',
            'Booksin Elementary (9/10)'
        ],
        nearbyAmenities: [
            { type: 'School', name: 'Elementary', distance: '0.4 mi' },
            { type: 'Park', name: 'River Park', distance: '0.2 mi' },
            { type: 'Shopping', name: 'Lincoln Ave', distance: '0.8 mi' }
        ],
        matchReason: 'Perfect for 3 beds & near top schools.',
        tags: ['Realtor Pick', 'Best Value'],
        aiScore: 98,
        investmentRating: 'A+',
        pros: ['12 min commute to downtown', 'Top-rated school district', 'Recently renovated kitchen'],
        cons: ['Smaller backyard', 'Street parking only'],
    },
    {
        id: 2,
        address: '750 Skyline Blvd',
        city: 'Palo Alto, CA 94301',
        price: '$1,250,000',
        beds: 3,
        baths: 2.5,
        sqft: 2100,
        coordinates: { lat: 37.4419, lng: -122.1430 },
        image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
        description: 'Modern architectural masterpiece with panoramic bay views. Open concept living with high-end finishes.',
        features: [
            'Primary suite with bay views',
            'Palo Alto Hills rated 10/10',
            'Nixon Elementary (9/10)'
        ],
        nearbyAmenities: [
            { type: 'Work', name: 'Tech Park', distance: '1.5 mi' },
            { type: 'Gym', name: 'Equinox', distance: '2.0 mi' },
            { type: 'Shopping', name: 'Stanford', distance: '3.5 mi' }
        ],
        matchReason: 'Slightly over budget, but closer to work.',
        tags: ['Hot Location'],
        aiScore: 89,
        investmentRating: 'A',
        pros: ['Only 5 min commute', 'High appreciation potential', 'Open floor plan'],
        cons: ['Above initial budget', 'HOA fees apply'],
    },
    {
        id: 3,
        address: '3300 Downtown Lofts #4B',
        city: 'San Jose, CA 95113',
        price: '$850,000',
        beds: 2,
        baths: 2,
        sqft: 1200,
        coordinates: { lat: 37.3382, lng: -121.8863 },
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        description: 'Chic industrial loft in the center of downtown. Floor-to-ceiling windows and exposed brick walls.',
        features: [
            '2 master suites',
            'Downtown Walk Score 98/100',
            'Secure underground parking'
        ],
        nearbyAmenities: [
            { type: 'Cafe', name: 'Blue Bottle', distance: '0.1 mi' },
            { type: 'Transit', name: 'Caltrain', distance: '0.3 mi' },
            { type: 'Entertainment', name: 'SAP Center', distance: '0.5 mi' }
        ],
        matchReason: 'Under budget, modern condo style.',
        tags: [],
        aiScore: 82,
        investmentRating: 'B+',
        pros: ['Significantly under budget', 'Gym & Pool in building', 'Walkable to restaurants'],
        cons: ['No dedicated parking', 'Smaller square footage'],
    },
];

export const MOCK_VISITS = [
    { id: 1, date: 'Fri, Mar 15', time: '4:00 PM', property: '1248 Oakwood Ave', status: 'Pending' },
    { id: 2, date: 'Sat, Mar 16', time: '11:00 AM', property: '750 Skyline Blvd', status: 'Confirmed' },
];
