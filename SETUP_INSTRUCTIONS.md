# Smart Dustbin Monitoring System

A full-stack web application for real-time monitoring of smart dustbins with IoT integration.

## Tech Stack

- **Frontend**: React + Vite, Leaflet Maps, Socket.IO Client
- **Backend**: Node.js + Express, MongoDB, Socket.IO
- **Database**: MongoDB Atlas
- **Real-time**: WebSockets (Socket.IO)

## Features

### Public Features
- Interactive map showing all dustbins with color-coded markers
- Real-time updates when dustbin status changes
- User geolocation to find nearby dustbins
- Dustbin details with fill level, status, and last updated time
- Search and filter dustbins
- Report issues/complaints for any dustbin

### Admin Features
- Secure admin login (default: username: admin, password: admin123)
- Dashboard with statistics and analytics
- Real-time dustbin monitoring on map
- Add new dustbins with auto-generated IDs
- Delete dustbins
- View and manage all complaints
- Update complaint status (Pending/In Progress/Resolved)
- View alert messages when dustbins become FULL

## Installation

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies

```bash
cd ..
npm install
```

## Running the Application

### Start Backend Server

```bash
cd backend
npm start
```

The backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
# From the root directory
npm run dev
```

The frontend will run on `http://localhost:5173`

## IoT Device Integration

Arduino devices can send data using HTTP GET requests:

```
GET http://localhost:5000/update?id=DB101&level=75&status=MEDIUM&lat=23.25&lng=77.41
```

Parameters:
- `id`: Dustbin ID (e.g., DB101)
- `level`: Fill percentage (0-100)
- `status`: EMPTY, MEDIUM, or FULL
- `lat`: Latitude coordinate
- `lng`: Longitude coordinate

## Default Admin Credentials

- Username: `admin`
- Password: `admin123`

Change these in `backend/.env` file.

## Environment Variables

Backend environment variables are configured in `backend/.env`:

- `MONGODB_URI`: MongoDB connection string
- `PORT`: Server port (default: 5000)
- `ADMIN_USERNAME`: Admin username
- `ADMIN_PASSWORD`: Admin password

## Project Structure

```
├── backend/
│   ├── controllers/
│   │   ├── dustbinController.js
│   │   ├── complaintController.js
│   │   └── messageController.js
│   ├── models/
│   │   ├── Dustbin.js
│   │   ├── Complaint.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── dustbinRoutes.js
│   │   ├── complaintRoutes.js
│   │   └── messageRoutes.js
│   ├── server.js
│   └── package.json
│
├── src/
│   ├── components/
│   │   ├── AdminSidebar.jsx
│   │   ├── ComplaintManagement.jsx
│   │   ├── ComplaintModal.jsx
│   │   ├── DashboardStats.jsx
│   │   ├── DustbinCard.jsx
│   │   ├── DustbinManagement.jsx
│   │   ├── DustbinMap.jsx
│   │   └── MessageManagement.jsx
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   └── Home.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── socket.js
│   ├── hooks/
│   │   └── useGeolocation.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
└── package.json
```

## API Endpoints

### Dustbins
- `GET /update` - Update dustbin data (for IoT devices)
- `GET /api/dustbins` - Get all dustbins
- `POST /api/dustbins` - Add new dustbin
- `DELETE /api/dustbins/:id` - Delete dustbin

### Complaints
- `GET /api/complaints` - Get all complaints
- `POST /api/complaints` - Create complaint
- `PATCH /api/complaints/:id` - Update complaint status

### Messages
- `GET /api/messages` - Get all alert messages

### Auth
- `POST /api/auth/login` - Admin login

## Real-time Events

Socket.IO events emitted by the server:

- `dustbinUpdate` - When dustbin data is updated
- `dustbinAdded` - When new dustbin is added
- `dustbinDeleted` - When dustbin is deleted
- `newComplaint` - When new complaint is created
- `complaintUpdate` - When complaint status is updated
- `newMessage` - When new alert message is created

## Mobile Responsive

The application is fully responsive and works on:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## Color Coding

- **Green**: Empty (0-33% full)
- **Yellow/Orange**: Medium (34-66% full)
- **Red**: Full (67-100% full)

## Security Features

- Admin authentication required for dashboard access
- Session management with localStorage
- CORS enabled for cross-origin requests
- Input validation on all forms
- MongoDB connection with authentication

## Notes

- The system automatically creates alert messages when dustbins become FULL
- All data updates happen in real-time without page refresh
- Maps use OpenStreetMap tiles (no API key required)
- Geolocation requires HTTPS in production or user permission
