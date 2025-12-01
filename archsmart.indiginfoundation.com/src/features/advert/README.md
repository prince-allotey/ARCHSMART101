# Advert Feature

This feature allows businesses to submit advertisement requests on the ArchSmart real estate platform.

## Features

### Advanced Multi-Step Form
- **Step 1: Business Information**
  - Business name and category selection
  - Contact details (name, email, phone)
  - Optional website URL

- **Step 2: Advert Details**
  - Detailed advert description
  - Target audience selection (buyers, sellers, renters, investors, all)
  - Optional business logo upload (max 2MB, image files only)

- **Step 3: Pricing & Duration**
  - Multiple duration options with pricing:
    - 1 Month: Ghs 50,000
    - 3 Months: Ghs 135,000 (10% discount)
    - 6 Months: Ghs 240,000 (20% discount)
    - 12 Months: Ghs 420,000 (30% discount)

### Enhanced User Experience
- Progress indicator showing current step
- Form validation with error messages
- File upload with preview
- Responsive design
- Real-time form validation

### Backend Features
- File upload handling for logos
- Comprehensive validation
- Status tracking (pending, approved, rejected, paid)
- Payment integration ready

## API Endpoints

### POST /api/advert-requests
Submit a new advert request with the following fields:
- `business_name` (required)
- `business_category` (required)
- `contact_name` (required)
- `contact_email` (required)
- `contact_phone` (required)
- `website_url` (optional)
- `advert_details` (required)
- `target_audience` (required)
- `duration_months` (required)
- `budget` (optional)
- `logo` (optional file upload)

### GET /api/advert-requests (Admin only)
List all advert requests

### PUT /api/advert-requests/{id}/status (Admin only)
Update request status (approved/rejected)

### PUT /api/advert-requests/{id}/paid (Admin only)
Mark request as paid

## Database Schema

The `advert_requests` table includes:
- Basic business and contact information
- Advert details and targeting
- Duration and pricing information
- File paths for uploaded logos
- Status tracking and payment information

## Usage

1. Navigate to `/advertise` on the frontend
2. Fill out the 3-step form
3. Upload optional business logo
4. Select duration and review pricing
5. Submit request
6. Wait for admin approval
7. Complete payment when approved

## Admin Dashboard

Admins can:
- View all submitted requests
- Approve or reject requests
- Mark approved requests as paid
- View payment details and references</content>
<parameter name="filePath">c:\laragon\www\archsmart\archsmart.indiginfoundation.com\src\features\advert\README.md