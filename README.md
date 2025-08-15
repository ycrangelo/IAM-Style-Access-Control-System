# IAM-Style Access Control System

## Overview
This project is a simplified Identity and Access Management (IAM) system designed for learning and prototyping purposes. It allows you to manage users, groups, roles, and permissions with fine-grained access control.

### Features
- Users can be assigned to one or more groups.
- Groups have roles that define permissions.
- Roles specify CRUD (Create, Read, Update, Delete) permissions on modules.
- Users inherit permissions only through their group memberships.
- Full CRUD operations for all IAM entities via a React frontend.
- JWT-based authentication for secure API access.

## Technologies Used

### Backend
- **Node.js** with **Express.js**
- **SQLite** (in-memory) database for simplicity
- **Middlewares** for validation and authentication
- **JWT** for secure token-based authentication
- Password hashing for secure storage

### Frontend
- **React.js** with **React Router** for navigation
- **Redux Toolkit** for state management (authentication & permissions)
- **Axios** for API communication
- **Tailwind CSS** for styling
- JWT stored in Redux store or `localStorage` for session management

