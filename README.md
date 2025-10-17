# MERN Departmental Student Board

A full-stack, real-time information board for university departments built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This platform allows administrators and staff to post announcements, schedule events, and manage timetables, while students can view this information in a modern, responsive, and real-time interface.

## Features

- **Real-Time Updates**: New content appears instantly for all users without needing a page refresh, powered by Socket.io.
- **Role-Based Authentication**: Secure JWT-based authentication with distinct roles (student, staff, admin).
- **Full CRUD Functionality**: Administrators can create, read, update, and delete announcements, events, and timetable entries.
- **Rich Content Creation**: A WYSIWYG editor for creating detailed announcements.
- **Image Uploads**: Admins can upload featured images for announcements and events, stored in the cloud via Cloudinary.
- **Dynamic Filtering**: Users can filter the class timetable by academic level and department.
- **Responsive Design**: A mobile-first interface that looks great on all devices, from phones to desktops.
- **Dark Mode**: A user-toggleable dark theme for comfortable viewing in low-light environments.
- **Secure & Robust**: Features content protection for logged-in users, protected API routes, and graceful handling of expired sessions.

## Tech Stack

### Backend

- **Node.js & Express.js**: Server environment.
- **MongoDB with Mongoose**: Database.
- **JSON Web Tokens (JWT)**: Authentication.
- **Socket.io**: Real-time communication.
- **Cloudinary**: Cloud-based image storage.
- **Multer**: Handling file uploads.
- **bcryptjs**: Password hashing.
- **ES Modules**: Modern JavaScript syntax.

### Frontend

- **React.js (with Vite)**: User interface.
- **React Router**: Client-side routing.
- **React Hook Form**: Efficient form management.
- **Axios**: API communication.
- **Socket.io-client**: Real-time frontend updates.
- **Tailwind CSS**: Styling, with a class-based dark mode.
- **date-fns**: Date formatting.
- **lucide-react**: Icons.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm
- A MongoDB database (local or via MongoDB Atlas)
- A Cloudinary account for image uploads

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` root and add the following variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=a_strong_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```
4.  Start the server:
    ```bash
    npm start
    ```
    The backend will run on `http://localhost:5000`.

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  (Optional) Create a `.env.local` file in the `frontend` root to specify the backend URL if it's not on the default port:
    ```env
    VITE_API_BASE_URL=http://localhost:5000
    ```
4.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will run on `http://localhost:5173`.

