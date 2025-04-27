# CV Management System

This project consists of two parts:

1. **Backend** - Express.js API server for CV reception and management.
2. **Frontend** - React.js application with Tailwind CSS for CV submission and listing.

## Backend Setup (VM IP: 192.168.7.91)

1. Navigate to the `backend` directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```
   The backend server will run on port 3001.

## Frontend Setup (VM IP: 192.168.7.90)

1. Navigate to the `frontend` directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```
   The frontend will run on port 3000 and connect to the backend API at `http://192.168.7.91:3001`.

## Features

- Submit CV with name, email, phone, and file upload.
- View list of submitted CVs.
- Download CV files.
- Delete CV entries.

## Notes

- Uploaded CV files are stored in the backend `uploads` folder.
- This is a simple implementation using in-memory storage for CV metadata. For production, consider using a database.
