export const CLIENT_QUESTIONS = [
    {
        id: 'beds',
        text: "How many bedrooms do you need?",
        options: ['2', '3', '4', '5+'],
    },
    {
        id: 'budget',
        text: "What’s your budget range?",
        options: ['$600k–$800k', '$800k–$1M', '$1M+'],
    },
    {
        id: 'nearby',
        text: "What matters most nearby?",
        options: ['Schools', 'Hospitals', 'Office', 'Shopping'],
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
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
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
        image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',  // Updated image
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
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
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
