# Tawk.to AI Assistant Setup Guide for ArchSmartGH

## 0. Getting Your Tawk.to Credentials

1. **Create a Tawk.to Account**:
   - Go to https://www.tawk.to/
   - Sign up for a free account

2. **Get Your Widget Credentials**:
   - Log in to https://dashboard.tawk.to/
   - Go to **Administration** > **Channels**
   - Select your property/website
   - Copy the **Property ID** and **Widget ID** from the embed code
   - The embed code looks like: `https://embed.tawk.to/PROPERTY_ID/WIDGET_ID`

3. **Configure Environment Variables**:
   - Open `.env.local` in the frontend folder
   - Add your credentials:
   ```bash
   VITE_TAWK_PROPERTY_ID=your_property_id_here
   VITE_TAWK_WIDGET_ID=your_widget_id_here
   ```
   - Restart your development server for changes to take effect

4. **Disable Chat Widget** (optional):
   - Leave the environment variables empty or remove them to disable the widget
   - No errors will be shown if credentials are not configured

---

## 1. Basic Configuration

### Widget Customization
- **Widget Name**: ArchSmartGH Assistant
- **Widget Color**: #3B82F6 (Blue to match your brand)
- **Position**: Bottom Right
- **Welcome Message**: "👋 Welcome to ArchSmartGH! How can I help you find your dream property today?"

---

## 2. AI Shortcuts & Responses

### General Real Estate Questions

**Trigger**: "properties", "listings", "available"
**Response**:
```
🏠 We have 500+ verified properties across Ghana including:
• Houses in Accra, Kumasi, Takoradi
• Luxury Apartments
• Commercial Properties
• Land for Sale

Click here to browse: [Your Website]/properties

What type of property interests you?
```

---

**Trigger**: "price", "cost", "budget", "how much"
**Response**:
```
💰 Our properties range from:
• Under GH₵200,000
• GH₵200k - GH₵500k
• GH₵500k - GH₵1M
• Above GH₵1M

What's your budget range? I can help you find the perfect match! 🎯
```

---

**Trigger**: "location", "where", "area", "region"
**Response**:
```
📍 We cover major locations in Ghana:
• Accra (East Legon, Cantonments, Dzorwulu)
• Kumasi (Asokwa, Ahodwo, Nhyiaeso)
• Takoradi (European Quarters, Market Circle)
• Tema (Community 25, Sakumono)
• Cape Coast

Which area are you interested in?
```

---

**Trigger**: "smart home", "automation", "smart living"
**Response**:
```
⚡ Smart Living Features:
• Smart Lighting Control
• Security Systems & CCTV
• Climate Control (AC/Heating)
• Home Automation
• Energy Management

We offer installation and consultation services!
Want to learn more about smart home integration? 🏡✨
```

---

**Trigger**: "agent", "contact agent", "speak to agent"
**Response**:
```
👨‍💼 Our Expert Agents Are Ready!
We have 50+ professional agents available.

Options:
1️⃣ Fill out the contact form
2️⃣ Call: +233 XX XXX XXXX
3️⃣ Email: info@archsmartgh.com
4️⃣ Continue chatting - I'll connect you to an agent

What works best for you?
```

---

**Trigger**: "buy", "purchase", "buying process"
**Response**:
```
📝 Our Buying Process:
1. Browse & Select Property
2. Schedule Site Visit
3. Property Verification
4. Legal Documentation
5. Payment & Transfer
6. Key Handover

We guide you through every step! Our success rate is 98% 🎉

Ready to start? Let me know what property type interests you!
```

---

**Trigger**: "rent", "rental", "lease"
**Response**:
```
🏠 Property Rentals Available!

Rental Options:
• Monthly Rentals
• Yearly Leases
• Short-term Stays
• Furnished/Unfurnished

Average Prices:
• 1 Bedroom: GH₵800-2,000/month
• 2 Bedroom: GH₵1,500-4,000/month
• 3 Bedroom: GH₵2,500-8,000/month

What's your preference?
```

---

**Trigger**: "invest", "investment", "roi"
**Response**:
```
💼 Real Estate Investment Consulting

Our Services:
✅ Market Analysis
✅ ROI Projections
✅ Property Valuation
✅ Investment Strategies
✅ Portfolio Management

Ghana's real estate market offers 15-25% annual ROI!

Want to schedule a consultation with our investment expert? 📊
```

---

**Trigger**: "verify", "legitimate", "scam", "trust"
**Response**:
```
🛡️ Your Security is Our Priority!

All Properties Are:
✅ Thoroughly Verified
✅ Legally Documented
✅ Authenticated by Experts
✅ Insured & Secure

We're Ghana's Award-Winning Real Estate Platform with:
• 2,000+ Happy Clients
• 98% Success Rate
• Licensed & Registered

Your peace of mind matters to us! 🔒
```

---

**Trigger**: "visit", "viewing", "see property", "tour"
**Response**:
```
👀 Schedule a Property Viewing

Steps:
1. Choose your property
2. Select preferred date/time
3. We arrange the visit
4. Free transport available

Our agents are available:
📅 Monday - Saturday: 8AM - 6PM
📅 Sunday: 10AM - 4PM

Which property would you like to see?
```

---

**Trigger**: "finance", "loan", "mortgage", "payment plan"
**Response**:
```
💳 Flexible Payment Options Available!

We Work With:
🏦 Major Banks (GCB, Ecobank, Stanbic)
💰 Mortgage Providers
📅 Installment Plans
💵 Cash Payments

Typical Mortgage Terms:
• Down Payment: 10-30%
• Interest Rates: 18-28% p.a.
• Tenure: 5-20 years

Need help with financing? Let's connect you with our partners! 🤝
```

---

**Trigger**: "interior", "design", "decoration", "furnishing"
**Response**:
```
🎨 Interior Design Services

We Offer:
• Modern Design Concepts
• Space Planning
• Furniture Selection
• Color Consultation
• Project Management

Transform your space into a dream home! 

Free consultation for property buyers! 🏡✨
Want to see our portfolio?
```

---

**Trigger**: "document", "paperwork", "legal", "title"
**Response**:
```
📄 Legal Documentation & Support

We Handle:
✅ Title Verification
✅ Land Registry Searches
✅ Contract Preparation
✅ Transfer Documents
✅ Lawyer Connections

All transactions are legally compliant with Ghana Land Law!

Our legal team ensures 100% secure transfers. Need more info? 👨‍⚖️
```

---

**Trigger**: "commercial", "business", "office", "shop"
**Response**:
```
🏢 Commercial Properties Available

Types:
• Office Spaces
• Retail Shops
• Warehouses
• Shopping Centers
• Industrial Land

Locations:
📍 Accra CBD
📍 Tema Industrial Area
📍 Kumasi Central
📍 Takoradi Harbor Area

What type of commercial space do you need?
```

---

**Trigger**: "land", "plot", "acres", "development"
**Response**:
```
🌍 Land for Sale & Development

Available:
• Residential Plots (50x100 ft)
• Commercial Land
• Agricultural Land
• Beachfront Property

Popular Areas:
📍 Prampram
📍 Oyibi
📍 Tsopoli
📍 Dodowa

Prices from GH₵30,000

With registered documents! Ready to develop? 🏗️
```

---

## 3. Pre-Chat Form Questions

Set up these fields:
1. **Name** (Required)
2. **Email** (Required)
3. **Phone Number** (Optional)
4. **Property Interest**: Dropdown
   - Buy
   - Rent
   - Invest
   - Smart Home Services
5. **Budget Range**: Dropdown
   - Under GH₵200k
   - GH₵200k-500k
   - GH₵500k-1M
   - Above GH₵1M

---

## 4. Automated Triggers

### Time-Based Triggers

**After 30 seconds on homepage:**
```
👋 Hi there! Looking for property in Ghana? 
I'm here to help you find the perfect home! 

Quick search:
🏠 Houses | 🏢 Apartments | 🌍 Land
```

**After 60 seconds on properties page:**
```
💡 Need help narrowing down options?
I can filter by:
• Location
• Price Range
• Property Type
• Amenities

Just let me know what you're looking for!
```

**Before leaving site (exit intent):**
```
⏰ Wait! Before you go...
Get a FREE property consultation!

📧 Leave your email and we'll send you:
• Latest property listings
• Market insights
• Exclusive deals

Don't miss out! 🎁
```

---

## 5. Offline Messages

When agents are offline:
```
💤 We're currently offline but we'll respond ASAP!

Our Hours:
🕐 Mon-Fri: 8:00 AM - 8:00 PM
🕐 Sat: 9:00 AM - 6:00 PM
🕐 Sun: 10:00 AM - 4:00 PM

Leave a message and we'll get back within 2 hours! 📧

Or call us directly: +233 XX XXX XXXX
```

---

## 6. Keywords to Monitor

Set alerts for these high-intent keywords:
- "buy now"
- "ready to purchase"
- "schedule visit"
- "speak to manager"
- "urgent"
- "today"
- "cash buyer"

---

## 7. Integration with Your System

### Custom Variables
```javascript
window.Tawk_API.setAttributes({
    'name': user.name,
    'email': user.email,
    'role': user.role, // user, agent, admin
    'page': window.location.pathname
});
```

### Track Conversions
```javascript
// When user submits inquiry
window.Tawk_API.addEvent('property-inquiry', {
    property_id: propertyId,
    property_name: propertyName,
    price: price
});
```

---

## 8. Best Practices

1. **Response Time**: Aim for < 60 seconds
2. **Personalization**: Use customer's name
3. **Emojis**: Make conversations friendly (but professional)
4. **Clear CTAs**: Always end with a question or action
5. **Follow-up**: Send email summary after chat

---

## 9. Training Your Team

### Agent Scripts

**Opening**:
"Hello [Name]! I'm [Agent Name] from ArchSmartGH. I see you're interested in [property type]. How can I help you today?"

**Qualification Questions**:
1. What's your budget range?
2. Preferred location?
3. How soon are you looking to move?
4. First-time buyer or investor?

**Closing**:
"I've found [X] properties that match your needs. Shall I schedule viewings for this week?"

---

## 10. Analytics to Track

- **Chat Volume**: Peak hours
- **Common Questions**: Update shortcuts
- **Conversion Rate**: Chats → Inquiries
- **Response Time**: Team performance
- **Customer Satisfaction**: Post-chat surveys

---

## Support Contact

For technical issues:
- Tawk.to Support: help.tawk.to
- Your Dev Team: dev@archsmartgh.com

---

**Last Updated**: November 7, 2025
**Version**: 1.0
