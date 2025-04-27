# CV Management System

This project consists of two parts running on the same VM (IP: 192.168.7.90):

1. **Backend** - Express.js API server for CV reception and management
2. **Frontend** - React.js application with Tailwind CSS for CV submission and listing

## Deployment Steps (VM IP: 192.168.7.90)

1. Copy both `frontend` and `backend` directories to the VM.

2. Set up the Backend:
   ```bash
   cd backend
   npm install
   npm start
   ```
   The backend server will run on port 5000.

3. Set up the Frontend (in a new terminal):
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The frontend will run on port 3000 and connect to the backend API at `http://192.168.7.90:5000`.

## Features

- Submit CV with name, email, phone, and file upload
- View list of submitted CVs
- Download CV files
- Delete CV entries

## Production Deployment

For production deployment:

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Use a process manager (like PM2) to run the backend:
   ```bash
   npm install -g pm2
   cd backend
   pm2 start server.js
   ```

3. Set up Nginx to serve the frontend build and proxy requests to the backend:
   ```nginx
   server {
       listen 80;
       server_name 192.168.7.90;

       # Serve frontend
       location / {
           root /path/to/frontend/build;
           try_files $uri $uri/ /index.html;
       }

       # Proxy backend requests
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       # Serve uploaded files
       location /uploads {
           proxy_pass http://localhost:5000;
       }
   }
   ```

## Notes

- Uploaded CV files are stored in the backend `uploads` folder
- This is a simple implementation using in-memory storage for CV metadata. For production, consider using a database
