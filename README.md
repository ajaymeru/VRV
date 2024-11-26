# Admin User Management API

This project includes a backend API hosted on [Render](https://vrv-vzqr.onrender.com) and a frontend hosted on [Vercel](https://vrv-ajay.vercel.app/login). The backend provides authentication, user management, and statistics functionalities for admins.

## Features

- **Admin Authentication:**
  - **Signup:** Admins can create an account with email, password, and role (admin).
  - **Login:** Admins can log in and receive a JWT token for authentication.
  - JWT token used for secured routes.

- **User Management:**
  - **Add User:** Admin can add new users.
  - **Edit User:** Admin can modify user details (e.g., name, email, role, status).
  - **Delete User:** Admin can remove users from the system.
  - **View Users:** Admins can view a list of all users or a single user's details.

- **User Statistics:**
  - **Total Users:** Displays the total number of users.
  - **Users Registered Today:** Counts users who registered today.
  - **Active Users:** Counts users with an "active" status.
  - **Inactive Users:** Counts users with an "inactive" status.

## Deployment

- **Backend:** [Deployed on Render](https://vrv-vzqr.onrender.com)
- **Frontend:** [Deployed on Vercel](https://vrv-ajay.vercel.app/login)

### **Test Login Credentials**
For testing purposes, you can use the following login details:

**Request Body:**
Test Login Credentials
Use the following credentials to test the login functionality:

<div style="background-color: purple; color: white; padding: 10px; border: 1px solid #b3e0ff; border-radius: 8px; font-family: 'Courier New', monospace;"> <b>Credentials:</b> <pre> { 
    "email": "admin@gmail.com", 
    "password": "admin123" 
} </pre> </div>

### How to Clone and Run the Project Locally

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd <repo-name>
   ```

2. Run the backend API locally:

   ```bash
   npm run dev
   ```

3. Run the frontend locally:

   ```bash
   npm run dev
   ```

## API Endpoints

### 1. `/auth/signup`

**Method:** POST  
**Description:** Create an admin user.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "adminpassword",
  "role": "admin"
}
```

**Response:**
```json
{
  "message": "Admin account created successfully."
}
```

### 2. `/auth/login`

**Method:** POST  
**Description:** Login and receive a JWT token.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```

**Response:**
```json
{
  "message": "Login Successful",
  "token": "jwt_token_here"
}
```

### 3. `/auth/add-user`

**Method:** POST  
**Description:** Admin can add a new user.

**Authorization:** Requires a valid JWT token.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "phone": "1234567890",
  "age": 30,
  "role": "user",
  "permissions": ["read", "write"]
}
```

**Response:**
```json
{
  "message": "User added successfully",
  "user": {
    "id": 1690999999999,
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "1234567890",
    "age": 30,
    "status": "active",
    "role": "user",
    "permissions": ["read", "write"]
  }
}
```

### 4. `/auth/users`

**Method:** GET  
**Description:** Get a list of all users.

**Authorization:** Requires a valid JWT token.

**Response:**
```json
{
  "users": [
    {
      "id": 1690999999999,
      "name": "John Doe",
      "email": "johndoe@example.com",
      "phone": "1234567890",
      "age": 30,
      "status": "active",
      "role": "user",
      "permissions": ["read", "write"]
    }
  ]
}
```

### 5. `/auth/users/:id`

**Method:** GET  
**Description:** Get details of a single user.

**Authorization:** Requires a valid JWT token.

**Response:**
```json
{
  "user": {
    "id": 1690999999999,
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "1234567890",
    "age": 30,
    "status": "active",
    "role": "user",
    "permissions": ["read", "write"]
  }
}
```

### 6. `/auth/edituser/:id`

**Method:** PUT  
**Description:** Edit a user's details.

**Authorization:** Requires a valid JWT token.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "phone": "0987654321",
  "status": "inactive",
  "role": "user",
  "permissions": ["read"]
}
```

**Response:**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": 1690999999999,
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "0987654321",
    "status": "inactive",
    "role": "user",
    "permissions": ["read"]
  }
}
```

### 7. `/auth/deleteuser/:id`

**Method:** DELETE  
**Description:** Delete a user.

**Authorization:** Requires a valid JWT token.

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

### 8. `/auth/user-statistics`

**Method:** GET  
**Description:** Get user statistics.

**Authorization:** Requires a valid JWT token.

**Response:**
```json
{
  "totalUsers": 50,
  "usersRegisteredToday": 5,
  "activeUsers": 40,
  "inactiveUsers": 10
}
```

## Tech Stack

- **React.js** (Frontend)
- **Node.js** (Backend)
- **JSON Server** for mocking API endpoints
- **JWT** for authentication and authorization
- **Vercel** for frontend deployment
- **Render** for backend deployment
