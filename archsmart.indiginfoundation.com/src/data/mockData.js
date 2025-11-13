// src/data/mockData.js

export const mockProperties = [
  {
    id: 1,
    title: "Luxury Smart Villa in East Legon",
    location: "East Legon, Accra",
    price: 1250000,
    bedrooms: 5,
    bathrooms: 6,
    size: 520,
    type: "Villa",
    images: ["/images/properties/villa1.webp"],
    agent: {
      id: 1,
      name: "Kwame Asante",
      phone: "+233 24 123 4567",
      email: "kwame@archsmart.gh",
      image: "/images/agents/kwame.jpg",
      agency: "ArchSmart Realty"
    },
    description:
      "A luxurious smart villa with cutting-edge automation and elegant design in East Legon.",
    isSmartHome: true
  },
  {
    id: 2,
    title: "Modern Apartment in Airport City",
    location: "Airport City, Accra",
    price: 750000,
    bedrooms: 3,
    bathrooms: 3,
    size: 280,
    type: "Apartment",
    images: ["/images/properties/apartment2.jpg"],
    agent: {
      id: 2,
      name: "Ama Osei",
      phone: "+233 26 987 6543",
      email: "ama@archsmart.gh",
      image: "/images/agents/ama.jpg",
      agency: "ArchSmart Realty"
    },
    description:
      "A sleek, modern apartment located in the heart of Airport City with premium facilities.",
    isSmartHome: false
  },
  {
    id: 3,
    title: "Prime Commercial Land in Tema",
    location: "Tema Industrial Area",
    price: 350000,
    size: 2000,
    type: "Land",
    images: ["/images/properties/PrimeCommercialLand.jpg"],
    agent: {
      id: 3,
      name: "Kofi Mensah",
      phone: "+233 20 765 4321",
      email: "kofi@archsmart.gh",
      image: "/images/agents/kofi.jpg",
      agency: "ArchSmart Realty"
    },
    description: "A well-located parcel of land suitable for commercial development in Tema.",
    isSmartHome: false
  },
  {
    id: 4,
    title: "Affordable 3-Bedroom House in Kumasi",
    location: "Ahodwo, Kumasi",
    price: 220000,
    bedrooms: 3,
    bathrooms: 2,
    size: 160,
    type: "House",
    images: ["/images/properties/Affordable3Bedroom.jpg"],
    agent: {
      id: 4,
      name: "Yaw Boateng",
      phone: "+233 54 111 2222",
      email: "yaw@archsmart.gh",
      image: "/images/agents/yaw.jpg",
      agency: "ArchSmart Realty"
    },
    description: "An affordable 3-bedroom family home in Kumasi’s peaceful Ahodwo suburb.",
    isSmartHome: false
  },
  {
    id: 5,
    title: "Luxury Beachfront Apartment in Takoradi",
    location: "Takoradi Beach Road",
    price: 980000,
    bedrooms: 4,
    bathrooms: 5,
    size: 400,
    type: "Apartment",
    images: ["/images/properties/LuxuryBeachfront.jpeg"],
    agent: {
      id: 5,
      name: "Akosua Mensimah",
      phone: "+233 27 333 5555",
      email: "akosua@archsmart.gh",
      image: "/images/agents/akosua.jpg",
      agency: "ArchSmart Realty"
    },
    description:
      "Enjoy oceanfront living with modern amenities and scenic coastal views.",
    isSmartHome: true
  },
  {
    id: 6,
    title: "Serviced Land in Kumasi Tech Area",
    location: "Kumasi Tech Area",
    price: 150000,
    size: 1000,
    type: "Land",
    images: ["/images/properties/land4.jpg"],
    agent: {
      id: 6,
      name: "Kojo Owusu",
      phone: "+233 50 444 9999",
      email: "kojo@archsmart.gh",
      image: "/images/agents/kojo.jpg",
      agency: "ArchSmart Realty"
    },
    description:
      "A fully serviced plot ideal for building your dream home or investment property.",
    isSmartHome: false
  },
  {
    id: 7,
    title: "Executive Mansion in Cantonments",
    location: "Cantonments, Accra",
    price: 2500000,
    bedrooms: 6,
    bathrooms: 7,
    size: 800,
    type: "Mansion",
    images: ["/images/properties/ExecutiveMansion.jpg"],
    agent: {
      id: 7,
      name: "Esi Tetteh",
      phone: "+233 55 987 1111",
      email: "esi@archsmart.gh",
      image: "/images/agents/esi.jpg",
      agency: "ArchSmart Realty"
    },
    description:
      "A stunning executive mansion offering privacy, elegance, and top-tier features.",
    isSmartHome: true
  },
  {
    id: 8,
    title: "Modern Studio Apartment in Takoradi",
    location: "Takoradi Central",
    price: 180000,
    bedrooms: 1,
    bathrooms: 1,
    size: 85,
    type: "Studio",
    images: ["/images/properties/StudioApartment.jpg"],
    agent: {
      id: 8,
      name: "Kwesi Nyarko",
      phone: "+233 57 888 6666",
      email: "kwesi@archsmart.gh",
      image: "/images/agents/kwesi.jpg",
      agency: "ArchSmart Realty"
    },
    description:
      "Compact yet luxurious — a perfect studio for young professionals or investors.",
    isSmartHome: false
  },
  {
    id: 9,
    title: "Commercial Land in Tema Heavy Industrial Area",
    location: "Tema",
    price: 400000,
    size: 3000,
    type: "Land",
    images: ["/images/properties/land3.jpg"],
    agent: {
      id: 9,
      name: "Nana Kyeremeh",
      phone: "+233 59 999 1234",
      email: "nana@archsmart.gh",
      image: "/images/agents/nana.jpg",
      agency: "ArchSmart Realty"
    },
    description:
      "A prime plot in Tema’s industrial hub — perfect for factories and logistics.",
    isSmartHome: false
  },
  {
    id: 10,
    title: "Cozy 2-Bedroom House in Kumasi",
    location: "Adum, Kumasi",
    price: 180000,
    bedrooms: 2,
    bathrooms: 2,
    size: 120,
    type: "House",
    images: ["/images/properties/Cozy 2-Bedroom.jpeg"],
    agent: {
      id: 10,
      name: "Abena Serwaa",
      phone: "+233 56 321 6543",
      email: "abena@archsmart.gh",
      image: "/images/agents/abena.jpg",
      agency: "ArchSmart Realty"
    },
    description:
      "A cozy, modern 2-bedroom house ideal for small families and first-time buyers.",
    isSmartHome: false
  }
];

export const mockBlogPosts = [];
