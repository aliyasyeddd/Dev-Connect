# Dev-Connect

> A Tinder-inspired backend platform where developers can discover, connect, and collaborate with other developers.

---

## Overview

Dev-Connect is a Node.js and Express.js backend API built for a developer networking app. It helps developers create profiles, log in securely, browse other developer profiles, send connection requests, review incoming requests, and manage accepted connections. The project is useful for learning how real backend systems handle authentication, protected routes, MongoDB relationships, validation, and API design.

---

## Features

- User signup, login, and logout with JWT-based authentication
- Secure password hashing using bcrypt
- Cookie-based session handling with protected routes
- Profile view, edit, and password update APIs
- Developer feed with pagination
- Send, ignore, accept, and reject connection requests
- View received requests and accepted connections
- MongoDB schema validation, enums, references, and compound indexes
- CORS support for connecting with a frontend app

---

## Tech Stack

| Technology | Purpose |
|-------------|----------|
| **Node.js** | JavaScript runtime for the backend |
| **Express.js** | Building REST APIs and route handlers |
| **MongoDB** | Database for users and connection requests |
| **Mongoose** | Schema modeling, validation, and database queries |
| **bcrypt** | Password hashing |
| **jsonwebtoken** | Creating and verifying JWT tokens |
| **cookie-parser** | Reading authentication cookies |
| **cors** | Allowing frontend-backend communication |
| **validator** | Validating email, password, and URL fields |
| **Nodemon** | Auto-restarting the server during development |

---

## API Routes

### Auth

- `POST /signup`
- `POST /login`
- `POST /logout`

### Profile

- `GET /profile/view`
- `PATCH /profile/edit`
- `PATCH /profile/updatePassword`

### Connection Requests

- `POST /request/send/:status/:toUserId`
- `POST /request/review/:status/:requestId`

### User

- `GET /user/requests/received`
- `GET /user/connections`
- `GET /feed`

---

## Getting Started

Install dependencies:

```bash
npm install
```

Start the server:

```bash
npm run dev
```

The server runs on:

```bash
http://localhost:7777
```

---

## What We Have Studied

Here are the key JavaScript and backend concepts practiced while building this project:

- Creating an Express server
- REST API routing with Express Router
- Middleware and error handling
- Request body parsing using `express.json()`
- Cookie parsing using `cookie-parser`
- CORS configuration with credentials
- MongoDB connection setup
- Mongoose schemas, models, validation, and timestamps
- Password hashing and comparison using bcrypt
- JWT token generation and verification
- Authentication middleware for protected APIs
- Updating user profile data safely
- MongoDB references and `populate()`
- Query operators like `$or`, `$and`, `$nin`, and `$ne`
- Pagination using `skip()` and `limit()`
- Compound indexes for faster database queries

---

## Lessons Learned

> - Backend APIs should validate every incoming request before saving data.
> - Passwords must be hashed before storing them in the database.
> - JWT tokens and cookies make protected routes easier to manage.
> - Express Router helps keep APIs clean and organized.
> - MongoDB relationships become powerful when combined with `ref` and `populate()`.
> - Indexes can improve query performance, especially for frequently searched fields.
> - Clear route structure makes the backend easier to connect with a frontend.

---

## Screenshots / Demo

This is currently a backend API project, so there is no UI screenshot yet.

Live demo: Coming soon

---

## Author

Created by [Aliya](https://github.com/aliyasyeddd)

> "Build. Break. Learn. Repeat."

---
