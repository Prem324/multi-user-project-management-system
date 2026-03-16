# Multi-User Project Management System

A production-quality MERN stack application for team collaboration, similar to Trello or Jira.

## Features

- **Project Management**: Create, update, and delete projects (Owner only).
- **Kanban Board**: Drag-and-drop task management with real-time status updates.
- **Task Details**: Manage descriptions, priorities, due dates, and assignments.
- **Collaborative Comments**: Real-time comment threads on every task.
- **Activity Logging**: Automated project-wide activity history.
- **File Attachments**: Upload and manage project files via Cloudinary.
- **Real-time Updates**: Instant synchronization across clients using Socket.IO.
- **Secure Auth**: JWT-based authentication with role-based access.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Context API, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.IO.
- **Storage**: Cloudinary (Image/File uploads).

## Getting Started

1. **Clone the repository**
2. **Install dependencies**:
   - `cd server && npm install`
   - `cd client && npm install`
3. **Environment Setup**:
   - Create `.env` in `server/` (see `server/.env.example`)
4. **Run development server**:
   - Backend: `npm run dev` (in server folder)
   - Frontend: `npm run dev` (in client folder)
 
 
 
 
 
 
 
 
