export interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  size: number;
  type: string;
  images: string[];
  agent: {
    id: number;
    name: string;
    phone: string;
    email: string;
    image: string;
    agency: string;
  };
  description: string;
  area?: string;          
  features?: string[];   
  isSmartHome?: boolean;   
}


export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: 'real-estate' | 'smart-living' | 'interior-design' | 'investment';
  author: string;
  publishedAt: string;
  readTime: number;
  slug: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'user';
  avatar?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  propertyId?: string;
}