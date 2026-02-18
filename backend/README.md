# 🎶 AAROHA 2026 - Battle of Bands: SARGAM - Backend

Backend API for the AAROHA 2026 Battle of Bands event registration system.

## Event Details

- **Event**: Battle of Bands - SARGAM
- **Total Prize Pool**: ₹60,000
- **Event Time**: 12:00 PM – 6:00 PM
- **Reporting Time**: 10:00 AM (2 hours prior - Mandatory)
- **Registration Fee**: ₹1200 per team

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Validation**: express-validator

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env` with your Supabase project URL and anon key:

```
PORT=3000
NODE_ENV=development
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Supabase Database

Run the SQL from `database/schema.sql` in your Supabase SQL Editor to create the required tables.

### 4. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Check server status

### Event Information
- `GET /api/registrations/event-info` - Get event details
- `GET /api/registrations/stats` - Get registration statistics

### Registration Management
- `POST /api/registrations/register` - Register a new team
- `GET /api/registrations` - Get all registrations
- `GET /api/registrations/:id` - Get registration by ID
- `PUT /api/registrations/:id` - Update registration
- `PATCH /api/registrations/:id/payment` - Update payment status
- `DELETE /api/registrations/:id` - Delete registration

## Registration Request Body

```json
{
  "team_name": "The Rockers",
  "college_name": "XYZ Engineering College",
  "team_leader_name": "John Doe",
  "team_leader_email": "john@example.com",
  "team_leader_phone": "9876543210",
  "team_members": [
    { "name": "John Doe", "role": "Lead Vocalist" },
    { "name": "Jane Smith", "role": "Lead Guitar" },
    { "name": "Bob Wilson", "role": "Bass Guitar" },
    { "name": "Alice Brown", "role": "Drums" },
    { "name": "Charlie Davis", "role": "Keyboard" }
  ],
  "num_microphones": 4,
  "drum_setup": "Full acoustic drum kit with double bass pedal",
  "additional_requirements": "Need 2 guitar amplifiers and 1 bass amplifier"
}
```

## Query Parameters

### GET /api/registrations

- `status` - Filter by registration status (pending, confirmed, rejected)
- `payment_status` - Filter by payment status (pending, completed, failed, refunded)

Example: `GET /api/registrations?status=confirmed&payment_status=completed`

## Response Format

All responses follow this format:

```json
{
  "success": true/false,
  "message": "Description",
  "data": { ... }
}
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## License

ISC
