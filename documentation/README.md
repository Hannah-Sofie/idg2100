# Project Setup and Deployment Guide

This guide outlines the process for setting up and deploying the frontend and backend components of the application on a local machine. Additionally, it explains how to seed the database with dummy data for testing purposes.

## Prerequisites

Before starting, ensure you have the following tools installed:

- **Git**
- **Node.js** (version 14 or newer)
- **npm** (version 6 or newer)
- **MongoDB** (MongoDB Atlas)

## Cloning the Repository

Clone the project repository using the following command:

```bash
git clone https://github.com/ntnu-design/idg2100-2024-oblig3-githubteam4.git
cd idg2100-2024-oblig3-githubteam4
```

## Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

### Environment Configuration

Create a `.env` file in the backend directory based on the `.env.example` template. Update it with your specific settings:

```plaintext
PORT=8001
MONGO_URI=your_mongodb_connection_string
TOKEN_SECRET=your_jwt_secret
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:3000
```

### Seeding the Database

To populate your database with initial data, run:

```bash
npm run populate
```

This command executes the `populateDB.js` script to insert predefined data.

Start the backend server:

```bash
npm run dev
```

The backend should now be accessible at `http://localhost:8001`.

## Frontend Setup

In a new terminal window, navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Duplicate the `frontend/.env.example` to `.env` and update it with your configurations:

```plaintext
REACT_APP_API_BASE_URL=http://localhost:8001
```

Start the frontend development server:

```bash
npm start
```

The frontend will be available at `http://localhost:3000`.

## `.env.example` Files

Both frontend and backend directories include `.env.example` files as templates for necessary environment variables. Duplicate these `.env.example` files to `.env` and fill in your specific values. **Never commit your `.env` files with real configuration values to the repository.**

## Development and Testing

During the development and testing phase, you can access and interact with the backend API and frontend application in the following ways:

- Backend API: Accessible at http://localhost:8001/api/..., the backend provides various endpoints for managing users and authentication. These endpoints allow for a range of operations, including creating, retrieving, updating, and deleting user records.
- Frontend Application: The frontend serves as the interface for interacting with the backend. It enables users to perform CRUD operations through a user-friendly UI. However, it's important to note that CRUD operations on user data are restricted to administrators. Ensure you have the appropriate admin credentials to test these functionalities fully.

**Note:** Only users with admin privileges are authorized to perform CRUD operations on user data. This restriction is in place to ensure that sensitive user information is securely managed and only accessible by authorized personnel.

## Deployment

To deploy:

1. Adjust `MONGO_URI` in the backend `.env` for your production database instance.
2. Update `FRONTEND_ORIGIN` in the backend `.env` to match your production frontend URL.
3. Build the frontend for production with `npm run build` in the frontend directory.
4. Deploy both frontend and backend to your preferred hosting service, like Heroku, Vercel, or AWS.

Remember to manage your `.env` files securely and never expose sensitive information.

## Authentication Endpoints

These endpoints relate to user authentication processes, including registration, login, and user role verification:

### Register User

- **Endpoint**: `POST /api/auth/register`
- Registers a new user.
- **Payload**:
  ```json
  {
    "fullName": "Jane Doe",
    "email": "janedoe@example.com",
    "password": "password123",
    "department": "Engineering",
    "university": "University Name",
    "position": "Researcher",
    "role": "user"
  }
  ```

### Login User

- **Endpoint**: `POST /api/auth/login`
- Authenticates a user and generates a JWT stored in a cookie.
- **Payload**:
  ```json
  {
    "email": "janedoe@example.com",
    "password": "password123"
  }
  ```

### Logout User

- **Endpoint**: `POST /api/auth/logout`
- Clears the authentication token cookie, logging out the user.

### Get User Role

- **Endpoint**: `GET /api/auth/role`
- Fetches the role of the logged-in user.

### Verify Token

- **Endpoint**: `GET /api/auth/verify`
- Validates the user's authentication token.

## User Management Endpoints

CRUD operations on user data are supported through the following endpoints:

### List Users

- **Endpoint**: `GET /api/users`
- Retrieves all registered users.

### Get User by ID

- **Endpoint**: `GET /api/users/{id}`
- Fetches detailed information of a specific user.

### Update User

- **Endpoint**: `PUT /api/users/{id}`
- Updates an existing

user's information.

- **Payload**:
  ```json
  {
    "fullName": "John Doe Updated",
    "department": "Updated Department"
  }
  ```

### Information about web component
We used Jon Helges's two webcomponents from oblig 1 just to make sure we had the game on the homepage. (assignment told us to tell whos oblig 1 we used)

### Delete User

- **Endpoint**: `DELETE /api/users/{id}`
- Deletes a specific user from the system.
