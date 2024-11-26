# Admin User Management API

This is an Express-based API integrated with JSON Server for managing user authentication, statistics, and user data in an admin-based system.

## Features

- **User Authentication:**
  - Admin user signup (`/auth/signup`): Create an admin user with email and password.
  - Admin user login (`/auth/login`): Authenticate admin user and get a JWT token.
  - JWT-based authentication for protected routes.

- **User Management:**
  - **Add User** (`/auth/add-user`): Admin can add new users with details such as name, email, phone, age, etc.
  - **User Statistics** (`/auth/user-statistics`): Admin can view statistics about the total number of users, active/inactive users, and users registered today.

- **Roles & Permissions:**
  - Admin role is required to access user management and statistics routes.

## Installation

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd <repo-name>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000` by default.

## API Endpoints

### 1. `/auth/signup`

**Method**: POST  
**Description**: Create an admin user.

**Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```

**Response**:
```json
{
  "message": "Admin user created successfully"
}
```

### 2. `/auth/login`

**Method**: POST  
**Description**: Login an admin user and receive a JWT token.

**Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```

**Response**:
```json
{
  "token": "jwt_token_here"
}
```

### 3. `/auth/user-statistics`

**Method**: GET  
**Description**: Retrieve statistics on users (Total users, active users, users registered today, inactive users).

**Authorization**: Requires a valid JWT token in the `Authorization` header.

**Response**:
```json
{
  "totalUsers": 50,
  "usersRegisteredToday": 5,
  "activeUsers": 40,
  "inactiveUsers": 10
}
```

### 4. `/auth/add-user`

**Method**: POST  
**Description**: Add a new user to the system.

**Authorization**: Requires a valid JWT token in the `Authorization` header.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "phone": "1234567890",
  "age": 30,
  "status": "active",
  "role": "user",
  "permissions": ["read", "write"]
}
```

**Response**:
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

## Middleware & Authentication

- JWT tokens are used for authenticating and authorizing access to certain routes.
- The `authenticate` middleware ensures that the user has a valid token and that their role is `admin` for routes that require admin access.

## Database

The project uses a local `db.json` file as a mock database for storing user and admin data. This file is read and written to using helper functions.

## Tech Stack

- **Node.js** (Express.js)
- **JSON Server** for mocking API endpoints
- **JWT** for authentication and authorization

## License
