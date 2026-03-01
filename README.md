# Expense Management System — Backend API

A RESTful backend API for managing personal and project-based expenses and incomes, built with **Node.js**, **Express 5**, and **MongoDB**.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema / Models](#database-schema--models)
- [Authentication Mechanism](#authentication-mechanism)
- [Middleware](#middleware)
- [Error Handling Strategy](#error-handling-strategy)
- [Standard API Response Structures](#standard-api-response-structures)
- [Environment Variables](#environment-variables)
- [Setup & Run Locally](#setup--run-locally)
- [API Endpoints](#api-endpoints)
  - [Users / Auth](#1-users--auth)
  - [Category](#2-category)
  - [Subcategory](#3-subcategory)
  - [Expense](#4-expense)
  - [Income](#5-income)
  - [People](#6-people)
  - [Project](#7-project)
- [Authentication Flow for Frontend Developers](#authentication-flow-for-frontend-developers)
- [Example API Calls](#example-api-calls)
- [Common Mistakes to Avoid (Frontend)](#common-mistakes-to-avoid-frontend)
- [Changelog — Resolved Issues](#changelog--resolved-issues)

---

## Tech Stack

| Layer         | Technology             |
| ------------- | ---------------------- |
| Runtime       | Node.js                |
| Framework     | Express 5.2            |
| Database      | MongoDB (via Mongoose 7.5) |
| Auth          | JSON Web Tokens (jsonwebtoken) |
| Password Hash | bcrypt                 |
| CORS          | cors                   |
| Config        | dotenv                 |

---

## Project Structure

```
├── index.js                  # Application entry point — Express setup, MongoDB connection, route mounting
├── constant.js               # Application-wide constants (currently unused)
├── package.json              # Dependencies and project metadata
├── .env.sample               # Template for environment variables
│
├── middlewares/
│   └── auth.middleware.js    # JWT authentication middleware
│
├── models/                   # Mongoose schema definitions
│   ├── user.model.js         # User account schema
│   ├── category.model.js     # Expense/Income category schema
│   ├── subcategory.model.js  # Subcategory (child of category) schema
│   ├── expense.model.js      # Expense transaction schema
│   ├── income.model.js       # Income transaction schema
│   ├── people.model.js       # People/contacts schema
│   └── project.model.js      # Project schema
│
├── routes/                   # Express routers (define endpoints)
│   ├── users.route.js        # /users routes
│   ├── category.route.js     # /category routes
│   ├── subcategory.route.js  # /subcategory routes
│   ├── expense.route.js      # /expense routes
│   ├── income.route.js       # /income routes
│   ├── people.route.js       # /people routes
│   └── project.route.js      # /project routes
│
├── services/                 # Business logic handlers (controller functions)
│   ├── users.service.js      # User CRUD + login logic
│   ├── category.service.js   # Category CRUD
│   ├── subcategory.service.js# Subcategory CRUD
│   ├── expense.service.js    # Expense CRUD
│   ├── income.service.js     # Income CRUD
│   ├── people.service.js     # People CRUD
│   └── project.service.js    # Project CRUD
│
└── scripts/
    └── seed-user.js          # (Commented out) Seed script for creating a demo admin user
```

---

## Database Schema / Models

All models include automatic timestamps mapped to `created` and `modified` fields.

### User

| Field          | Type     | Required | Unique | Description              |
| -------------- | -------- | -------- | ------ | ------------------------ |
| `userName`     | String   | Yes      | No     | Display / login name     |
| `emailAddress` | String   | Yes      | Yes    | User email               |
| `password`     | String   | Yes      | No     | Bcrypt-hashed password   |
| `mobileNo`     | String   | No       | No     | Mobile phone number      |
| `profileImage` | String   | No       | No     | Profile image path / URL |

### Category

| Field          | Type      | Required | Default | Description                       |
| -------------- | --------- | -------- | ------- | --------------------------------- |
| `categoryName` | String    | Yes      | —       | Name of the category              |
| `logoPath`     | String    | No       | —       | Logo image path                   |
| `isExpense`    | Boolean   | No       | `false` | Whether used for expenses         |
| `isIncome`     | Boolean   | No       | `false` | Whether used for incomes          |
| `isActive`     | Boolean   | No       | `true`  | Soft-active flag                  |
| `description`  | String    | No       | —       | Description                       |
| `sequence`     | Number    | No       | —       | Display order                     |
| `userId`       | ObjectId  | Yes      | —       | Reference → `User`                |

### SubCategory

| Field             | Type      | Required | Default | Description                    |
| ----------------- | --------- | -------- | ------- | ------------------------------ |
| `categoryId`      | ObjectId  | Yes      | —       | Reference → `Category`         |
| `subCategoryName` | String    | Yes      | —       | Name of the subcategory        |
| `logoPath`        | String    | No       | —       | Logo image path                |
| `isExpense`       | Boolean   | No       | —       | Whether used for expenses      |
| `isIncome`        | Boolean   | No       | —       | Whether used for incomes       |
| `isActive`        | Boolean   | No       | `true`  | Soft-active flag               |
| `description`     | String    | No       | —       | Description                    |
| `sequence`        | Number    | No       | —       | Display order                  |
| `userId`          | ObjectId  | Yes      | —       | Reference → `User`             |

### Expense

| Field            | Type      | Required | Description                   |
| ---------------- | --------- | -------- | ----------------------------- |
| `expenseDate`    | Date      | Yes      | Date of the expense           |
| `categoryId`     | ObjectId  | No       | Reference → `Category`        |
| `subCategoryId`  | ObjectId  | No       | Reference → `SubCategory`     |
| `peopleId`       | ObjectId  | Yes      | Reference → `People`          |
| `projectId`      | ObjectId  | No       | Reference → `Project`         |
| `amount`         | Number    | Yes      | Expense amount                |
| `expenseDetail`  | String    | No       | Short detail text             |
| `attachmentPath` | String    | No       | File attachment path          |
| `description`    | String    | No       | Additional description        |
| `userId`         | ObjectId  | Yes      | Reference → `User`            |

### Income

| Field            | Type      | Required | Description                   |
| ---------------- | --------- | -------- | ----------------------------- |
| `incomeDate`     | Date      | Yes      | Date of the income            |
| `categoryId`     | ObjectId  | No       | Reference → `Category`        |
| `subCategoryId`  | ObjectId  | No       | Reference → `SubCategory`     |
| `peopleId`       | ObjectId  | Yes      | Reference → `People`          |
| `projectId`      | ObjectId  | No       | Reference → `Project`         |
| `amount`         | Number    | Yes      | Income amount                 |
| `incomeDetail`   | String    | No       | Short detail text             |
| `attachmentPath` | String    | No       | File attachment path          |
| `description`    | String    | No       | Additional description        |
| `userId`         | ObjectId  | Yes      | Reference → `User`            |

### People

| Field        | Type      | Required | Default | Description                 |
| ------------ | --------- | -------- | ------- | --------------------------- |
| `peopleCode` | String    | No       | —       | Identifier code             |
| `password`   | String    | Yes      | —       | Password                    |
| `peopleName` | String    | Yes      | —       | Full name                   |
| `email`      | String    | Yes      | —       | Email address               |
| `mobileNo`   | String    | No       | —       | Mobile phone number         |
| `description`| String    | No       | —       | Description                 |
| `userId`     | ObjectId  | Yes      | —       | Reference → `User`          |
| `isActive`   | Boolean   | No       | `true`  | Soft-active flag            |

### Project

| Field              | Type      | Required | Default | Description              |
| ------------------ | --------- | -------- | ------- | ------------------------ |
| `projectName`      | String    | Yes      | —       | Project name             |
| `projectLogo`      | String    | No       | —       | Logo path                |
| `projectStartDate` | Date      | No       | —       | Start date               |
| `projectEndDate`   | Date      | No       | —       | End date                 |
| `projectDetail`    | String    | No       | —       | Detail text              |
| `description`      | String    | No       | —       | Description              |
| `isActive`         | Boolean   | No       | `true`  | Soft-active flag         |
| `userId`           | ObjectId  | Yes      | —       | Reference → `User`       |

---

## Authentication Mechanism

- **Type:** Bearer Token (JWT)
- **Token lifetime:** 1 hour
- **Token payload:** `{ id, userName }`
- **Header format:** `Authorization: Bearer <token>`

### Flow

1. Client sends `POST /users/login` with `{ userName, password }`.
2. Server validates credentials against the `User` collection (supports both bcrypt-hashed and legacy plaintext passwords; plaintext passwords are automatically re-hashed on successful login).
3. On success, server returns a signed JWT in the response body (`data` field).
4. Client stores the token and sends it in the `Authorization` header for every subsequent request.
5. The `authMiddleware` intercepts all non-login requests, verifies the JWT, and either calls `next()` or responds with `401`.

---

## Middleware

### Auth Middleware (`middlewares/auth.middleware.js`)

- Applied at the router level on every resource router **after** the `/login` route.
- Checks if the request URL contains the string `"login"` — if so, it passes through without verification.
- For all other requests, it extracts the token from `Authorization: Bearer <token>`, verifies it with `process.env.JWT_SECRET`, and calls `next()` on success.
- Returns `401 { error: true, message: "unauthorized" }` on failure.

### Built-in Middleware (in `index.js`)

| Middleware         | Purpose                                     |
| ------------------ | ------------------------------------------- |
| `cors()`           | Enables Cross-Origin Resource Sharing       |
| `express.json()`   | Parses incoming JSON request bodies         |

---

## Error Handling Strategy

- Each route handler / service function is wrapped in a `try/catch` block.
- **404 Not Found:** Returned when a document lookup by ID yields `null`.
- **401 Unauthorized:** Returned by the auth middleware or the login handler on invalid credentials.
- **500 Internal Server Error:** Catch-all for unexpected errors; the raw error object or `err.message` is sent back.
- There is no centralized Express error-handling middleware; errors are handled per-handler.

---

## Standard API Response Structures

### Success Response

```json
{
  "message": "resource fetched successfully",
  "<resourceKey>": { ... }
}
```

The resource key varies by endpoint (e.g., `allusers`, `allcategory`, `user`, `category`, `expense`, etc.).

### Login Success Response

```json
{
  "error": false,
  "data": "<jwt_token_string>",
  "message": "Login successful"
}
```

### Login Failure Response

```json
{
  "error": true,
  "message": "UserName/Password does not match"
}
```

### Error Response (401 Unauthorized — Middleware)

```json
{
  "error": true,
  "message": "unauthorized"
}
```

### Error Response (404 Not Found)

```json
{
  "message": "User not found"
}
```

### Error Response (500 Internal Server Error)

The raw Mongoose/JS error object is sent. Shape varies.

### Pagination

There is **no pagination** implemented. All `GET /` endpoints return every document in the collection.

---

## Environment Variables

Create a `.env` file in the project root. Reference `.env.sample`:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/expense_db
JWT_SECRET=your_strong_random_secret_here
```

| Variable      | Required | Default                                  | Description                  |
| ------------- | -------- | ---------------------------------------- | ---------------------------- |
| `PORT`        | No       | `3001`                                   | Server listen port           |
| `MONGODB_URI` | No       | `mongodb://localhost:27017/expense_db`   | MongoDB connection string    |
| `JWT_SECRET`  | **Yes**  | —                                        | Secret key for signing JWTs  |

> **Warning:** If `JWT_SECRET` is not set, login will return `"Server configuration error"` instead of a token.

---

## Setup & Run Locally

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** running locally or a remote MongoDB Atlas URI

### Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd Expense-Management-System-Backend--main

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.sample .env
# Edit .env and set your MONGODB_URI and JWT_SECRET

# 4. Start the server
node index.js
```

The server will start on the configured `PORT` (default `3001`).

```
Server is running on port 3001
Connected to MongoDB
```

### Database Setup

No manual database or collection creation is required. Mongoose auto-creates the database and collections on first write.

### Seed Script (Optional)

A seed script exists at `scripts/seed-user.js` (currently commented out). To use it, uncomment the code and run:

```bash
node scripts/seed-user.js
```

This creates a demo user: `admin` / `admin123`.

---

## API Endpoints

**Base URL:** `http://localhost:3001`

All protected endpoints require the header:

```
Authorization: Bearer <jwt_token>
```

---

### 1. Users / Auth

#### POST `/users/login`

Login and obtain a JWT token.

| Property       | Value                            |
| -------------- | -------------------------------- |
| Auth Required  | **No**                           |
| Content-Type   | `application/json`               |

**Request Body:**

```json
{
  "userName": "admin",
  "password": "admin123"
}
```

**Success Response (`200`):**

```json
{
  "error": false,
  "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

**Error Response (`401`):**

```json
{
  "error": true,
  "message": "UserName/Password does not match"
}
```

**Error Response (`500`):**

```json
{
  "error": true,
  "message": "Something went wrong"
}
```

---

#### GET `/users`

Get all users.

| Property       | Value              |
| -------------- | ------------------ |
| Auth Required  | **Yes**            |

**Success Response (`200`):**

```json
{
  "message": "users fetched successfully",
  "allusers": [
    {
      "_id": "665a1b2c3d4e5f6a7b8c9d0e",
      "userName": "admin",
      "emailAddress": "admin@example.com",
      "password": "$2b$10$...",
      "mobileNo": "1234567890",
      "profileImage": null,
      "created": "2025-01-15T10:30:00.000Z",
      "modified": "2025-01-15T10:30:00.000Z",
      "__v": 0
    }
  ]
}
```

---

#### GET `/users/:id`

Get a single user by ID.

| Property        | Value                      |
| --------------- | -------------------------- |
| Auth Required   | **Yes**                    |
| Path Parameter  | `id` — MongoDB ObjectId    |

**Success Response (`200`):**

```json
{
  "message": "user fetched successfully",
  "user": {
    "_id": "665a1b2c3d4e5f6a7b8c9d0e",
    "userName": "admin",
    "emailAddress": "admin@example.com",
    "password": "$2b$10$...",
    "mobileNo": "1234567890",
    "created": "2025-01-15T10:30:00.000Z",
    "modified": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Response (`404`):**

```json
{
  "message": "User not found"
}
```

---

#### POST `/users`

Create a new user. Password is automatically bcrypt-hashed.

| Property       | Value              |
| -------------- | ------------------ |
| Auth Required  | **Yes**            |
| Content-Type   | `application/json` |

**Request Body:**

```json
{
  "userName": "john",
  "emailAddress": "john@example.com",
  "password": "securePass123",
  "mobileNo": "9876543210",
  "profileImage": "https://example.com/photo.jpg"
}
```

**Required fields:** `userName`, `emailAddress`, `password`

**Success Response (`200`):**

```json
{
  "message": "user created successfully",
  "user": {
    "_id": "665b2c3d4e5f6a7b8c9d0e1f",
    "userName": "john",
    "emailAddress": "john@example.com",
    "password": "$2b$10$...",
    "mobileNo": "9876543210",
    "profileImage": "https://example.com/photo.jpg",
    "created": "2025-06-01T12:00:00.000Z",
    "modified": "2025-06-01T12:00:00.000Z"
  }
}
```

---

#### PATCH `/users/:id`

Update an existing user.

| Property        | Value                      |
| --------------- | -------------------------- |
| Auth Required   | **Yes**                    |
| Content-Type    | `application/json`         |
| Path Parameter  | `id` — MongoDB ObjectId    |

**Request Body (partial update):**

```json
{
  "mobileNo": "1111111111"
}
```

**Success Response (`200`):**

```json
{
  "message": "user updated successfully",
  "user": { ... }
}
```

**Error Response (`404`):**

```json
{
  "message": "User not found"
}
```

---

#### DELETE `/users/:id`

Delete a user by ID.

| Property        | Value                      |
| --------------- | -------------------------- |
| Auth Required   | **Yes**                    |
| Path Parameter  | `id` — MongoDB ObjectId    |

**Success Response (`200`):**

```json
{
  "message": "user deleted successfully",
  "user": { ... }
}
```

**Error Response (`404`):**

```json
{
  "message": "User not found"
}
```

---

### 2. Category

#### GET `/category`

Get all categories.

| Property       | Value   |
| -------------- | ------- |
| Auth Required  | **Yes** |

**Success Response (`200`):**

```json
{
  "message": "category fetched successfully",
  "allcategory": [
    {
      "_id": "665c...",
      "categoryName": "Food",
      "logoPath": null,
      "isExpense": true,
      "isIncome": false,
      "isActive": true,
      "description": "Food and dining",
      "sequence": 1,
      "userId": "665a...",
      "created": "2025-06-01T12:00:00.000Z",
      "modified": "2025-06-01T12:00:00.000Z"
    }
  ]
}
```

---

#### GET `/category/:id`

Get a single category by ID.

| Property        | Value                      |
| --------------- | -------------------------- |
| Auth Required   | **Yes**                    |
| Path Parameter  | `id` — MongoDB ObjectId    |

**Success Response (`200`):**

```json
{
  "message": "category fetched successfully",
  "category": { ... }
}
```

**Error Response (`404`):**

```json
{
  "message": "category not found"
}
```

---

#### POST `/category`

Create a new category.

| Property       | Value              |
| -------------- | ------------------ |
| Auth Required  | **Yes**            |
| Content-Type   | `application/json` |

**Request Body:**

```json
{
  "categoryName": "Transport",
  "userId": "665a1b2c3d4e5f6a7b8c9d0e"
}
```

**Required fields:** `categoryName`, `userId`

**Success Response (`200`):**

```json
{
  "message": "category created successfully",
  "category": {
    "_id": "665d...",
    "categoryName": "Transport",
    "isExpense": false,
    "isIncome": false,
    "isActive": true,
    "userId": "665a...",
    "created": "2025-06-01T12:00:00.000Z",
    "modified": "2025-06-01T12:00:00.000Z"
  }
}
```

---

#### PATCH `/category/:id`

Update a category.

| Property        | Value                      |
| --------------- | -------------------------- |
| Auth Required   | **Yes**                    |
| Content-Type    | `application/json`         |
| Path Parameter  | `id` — MongoDB ObjectId    |

**Request Body (any field):**

```json
{
  "isExpense": true,
  "description": "Updated description"
}
```

**Success Response (`200`):**

```json
{
  "message": "category updated successfully",
  "category": { ... }
}
```

**Error Response (`404`):**

```json
{
  "message": "category not found"
}
```

---

#### DELETE `/category/:id`

Delete a category.

| Property        | Value                      |
| --------------- | -------------------------- |
| Auth Required   | **Yes**                    |
| Path Parameter  | `id` — MongoDB ObjectId    |

**Success Response (`200`):**

```json
{
  "message": "category deleted successfully",
  "category": { ... }
}
```

**Error Response (`404`):**

```json
{
  "message": "category not found"
}
```

---

### 3. Subcategory

#### GET `/subcategory`

Get all subcategories.

| Property       | Value   |
| -------------- | ------- |
| Auth Required  | **Yes** |

**Success Response (`200`):**

```json
{
  "message": "subcategory fetched successfully",
  "allsubcategory": [
    {
      "_id": "665e...",
      "categoryId": "665c...",
      "subCategoryName": "Breakfast",
      "logoPath": null,
      "isExpense": true,
      "isIncome": false,
      "isActive": true,
      "description": "Morning meals",
      "sequence": 1,
      "userId": "665a...",
      "created": "2025-06-01T12:00:00.000Z",
      "modified": "2025-06-01T12:00:00.000Z"
    }
  ]
}
```

---

#### GET `/subcategory/:id`

Get a single subcategory by ID.

| Property        | Value                      |
| --------------- | -------------------------- |
| Auth Required   | **Yes**                    |
| Path Parameter  | `id` — MongoDB ObjectId    |

**Success Response (`200`):**

```json
{
  "message": "subcategory fetched successfully",
  "subcategory": { ... }
}
```

**Error Response (`404`):**

```json
{
  "message": "Subcategory not found"
}
```

---

#### POST `/subcategory`

Create a new subcategory.

| Property       | Value              |
| -------------- | ------------------ |
| Auth Required  | **Yes**            |
| Content-Type   | `application/json` |

**Request Body:**

```json
{
  "subCategoryName": "Breakfast",
  "description": "Morning meals",
  "categoryId": "665c...",
  "userId": "665a...",
  "logoPath": "/logos/breakfast.png"
}
```

**Required fields:** `subCategoryName`, `categoryId`, `userId`

**Success Response (`200`):**

```json
{
  "message": "subcategory created successfully",
  "subcategory": { ... }
}
```

---

#### PATCH `/subcategory/:id`

Update a subcategory.

| Property        | Value                      |
| --------------- | -------------------------- |
| Auth Required   | **Yes**                    |
| Content-Type    | `application/json`         |
| Path Parameter  | `id` — MongoDB ObjectId    |

**Request Body (any field):**

```json
{
  "subCategoryName": "Lunch",
  "isActive": false
}
```

**Success Response (`200`):**

```json
{
  "message": "subcategory updated successfully",
  "subcategory": { ... }
}
```

**Error Response (`404`):**

```json
{
  "message": "Subcategory not found"
}
```

---

#### DELETE `/subcategory/:id`

Delete a subcategory.

| Property        | Value                      |
| --------------- | -------------------------- |
| Auth Required   | **Yes**                    |
| Path Parameter  | `id` — MongoDB ObjectId    |

**Success Response (`200`):**

```json
{
  "message": "subcategory deleted successfully",
  "subcategory": { ... }
}
```

**Error Response (`404`):**

```json
{
  "message": "Subcategory not found"
}
```

---

### 4. Expense

#### GET `/expense`

Get all expenses.

| Property       | Value   |
| -------------- | ------- |
| Auth Required  | **Yes** |

**Success Response (`200`):**

```json
{
  "message": "expense fetched successfully",
  "allexpense": [
    {
      "_id": "665f...",
      "expenseDate": "2025-06-01T00:00:00.000Z",
      "categoryId": "665c...",
      "subCategoryId": "665e...",
      "peopleId": "665g...",
      "projectId": "665h...",
      "amount": 250.50,
      "expenseDetail": "Lunch with client",
      "attachmentPath": null,
      "description": "Business lunch",
      "userId": "665a...",
      "created": "2025-06-01T12:00:00.000Z",
      "modified": "2025-06-01T12:00:00.000Z"
    }
  ]
}
```

---

#### GET `/expense/:id`

Get a single expense by ID.

| Property        | Value                      |
| --------------- | -------------------------- |
| Auth Required   | **Yes**                    |
| Path Parameter  | `id` — MongoDB ObjectId    |

**Success Response (`200`):**

```json
{
  "message": "expense fetched successfully",
  "expense": { ... }
}
```

**Error Response (`404`):**

```json
{
  "message": "expense not found"
}
```

---

#### POST `/expense`

Create a new expense.

| Property       | Value              |
| -------------- | ------------------ |
| Auth Required  | **Yes**            |
| Content-Type   | `application/json` |

**Request Body:**

```json
{
  "expenseDate": "2025-06-01",
  "peopleId": "665g...",
  "amount": 250.50,
  "userId": "665a..."
}
```

**Required fields:** `expenseDate`, `peopleId`, `amount`, `userId`

**Optional fields (via PATCH):** `categoryId`, `subCategoryId`, `projectId`, `expenseDetail`, `attachmentPath`, `description`

**Success Response (`200`):**

```json
{
  "message": "expense created successfully",
  "expense": { ... }
}
```

---

#### PATCH `/expense/:id`

Update an expense.

| Property        | Value                      |
| --------------- | -------------------------- |
| Auth Required   | **Yes**                    |
| Content-Type    | `application/json`         |
| Path Parameter  | `id` — MongoDB ObjectId    |

**Request Body (any field):**

```json
{
  "amount": 300,
  "description": "Updated description"
}
```

**Success Response (`200`):**

```json
{
  "message": "expense updated successfully",
  "expense": { ... }
}
```

**Error Response (`404`):**

```json
{
  "message": "expense not found"
}
```

---

#### DELETE `/expense/:id`

Delete an expense.

| Property        | Value                      |
| --------------- | -------------------------- |
| Auth Required   | **Yes**                    |
| Path Parameter  | `id` — MongoDB ObjectId    |

**Success Response (`200`):**

```json
{
  "message": "expense deleted successfully",
  "expense": { ... }
}
```

**Error Response (`404`):**

```json
{
  "message": "expense not found"
}
```

---

### 5. Income

#### GET `/income`

Get all incomes.

| Property       | Value   |
| -------------- | ------- |
| Auth Required  | **Yes** |

**Success Response (`200`):**

```json
{
  "message": "income fetched successfully",
  "allincomes": [
    {
      "_id": "665i...",
      "incomeDate": "2025-06-01T00:00:00.000Z",
      "categoryId": "665c...",
      "subCategoryId": "665e...",
      "peopleId": "665g...",
      "projectId": "665h...",
      "amount": 5000,
      "incomeDetail": "Freelance payment",
      "attachmentPath": null,
      "description": "Web project",
      "userId": "665a...",
      "created": "2025-06-01T12:00:00.000Z",
      "modified": "2025-06-01T12:00:00.000Z"
    }
  ]
}
```

---

#### GET `/income/:id`

Get a single income by ID.

| Property        | Value                      |
| --------------- | -------------------------- |
| Auth Required   | **Yes**                    |
| Path Parameter  | `id` — MongoDB ObjectId    |

**Success Response (`200`):**

```json
{
  "message": "income fetched successfully",
  "income": { ... }
}
```

**Error Response (`404`):**

```json
{
  "message": "income not found"
}
```

---

#### POST `/income`

Create a new income.

| Property       | Value              |
| -------------- | ------------------ |
| Auth Required  | **Yes**            |
| Content-Type   | `application/json` |

**Request Body:**

```json
{
  "incomeDate": "2025-06-01",
  "peopleId": "665g...",
  "amount": 5000,
  "userId": "665a..."
}
```

**Required fields:** `incomeDate`, `peopleId`, `amount`, `userId`

**Optional fields (via PATCH):** `categoryId`, `subCategoryId`, `projectId`, `incomeDetail`, `attachmentPath`, `description`

**Success Response (`200`):**

```json
{
  "message": "user created successfully",
  "income": { ... }
}
```

> **Note:** The success message incorrectly says `"user created successfully"` instead of `"income created successfully"`. This is a minor bug in the codebase.

---

#### PATCH `/income/:id`

Update an income.

| Property        | Value                      |
| --------------- | -------------------------- |
| Auth Required   | **Yes**                    |
| Content-Type    | `application/json`         |
| Path Parameter  | `id` — MongoDB ObjectId    |

**Request Body (any field):**

```json
{
  "amount": 6000
}
```

**Success Response (`200`):**

```json
{
  "message": "income updated successfully",
  "income": { ... }
}
```

**Error Response (`404`):**

```json
{
  "message": "income not found"
}
```

---

#### DELETE `/income/:id`

Delete an income.

| Property        | Value                      |
| --------------- | -------------------------- |
| Auth Required   | **Yes**                    |
| Path Parameter  | `id` — MongoDB ObjectId    |

**Success Response (`200`):**

```json
{
  "message": "income deleted successfully",
  "income": { ... }
}
```

**Error Response (`404`):**

```json
{
  "message": "Income not found"
}
```

---

### 6. People

#### GET `/people`

Get all people.

| Property       | Value   |
| -------------- | ------- |
| Auth Required  | **Yes** |

**Success Response (`200`):**

```json
{
  "message": "people fetched successfully",
  "allpeoples": [
    {
      "_id": "665g...",
      "peopleCode": "P001",
      "password": "...",
      "peopleName": "John Doe",
      "email": "john@example.com",
      "mobileNo": "5551234567",
      "description": "Vendor",
      "userId": "665a...",
      "isActive": true,
      "created": "2025-06-01T12:00:00.000Z",
      "modified": "2025-06-01T12:00:00.000Z"
    }
  ]
}
```

---

#### GET `/people/:id`

Get a single person by ID.

| Property        | Value                      |
| --------------- | -------------------------- |
| Auth Required   | **Yes**                    |
| Path Parameter  | `id` — MongoDB ObjectId    |

**Success Response (`200`):**

```json
{
  "message": "peoples fetched successfully",
  "peoples": { ... }
}
```

**Error Response (`404`):**

```json
{
  "message": "peoples not found"
}
```

---

#### POST `/people`

Create a new person.

| Property       | Value              |
| -------------- | ------------------ |
| Auth Required  | **Yes**            |
| Content-Type   | `application/json` |

**Request Body:**

```json
{
  "password": "pass123",
  "peopleName": "Jane Smith",
  "email": "jane@example.com",
  "userId": "665a..."
}
```

**Required fields:** `password`, `peopleName`, `email`, `userId`

**Success Response (`200`):**

```json
{
  "message": "peoples created successfully",
  "peoples": { ... }
}
```

---

#### PATCH `/people/:id`

Update a person.

| Property        | Value                      |
| --------------- | -------------------------- |
| Auth Required   | **Yes**                    |
| Content-Type    | `application/json`         |
| Path Parameter  | `id` — MongoDB ObjectId    |

**Request Body (any field):**

```json
{
  "mobileNo": "5559876543",
  "isActive": false
}
```

**Success Response (`200`):**

```json
{
  "message": "peoples updated successfully",
  "peoples": { ... }
}
```

**Error Response (`404`):**

```json
{
  "message": "peoples not found"
}
```

---

#### DELETE `/people/:id`

Delete a person.

| Property        | Value                      |
| --------------- | -------------------------- |
| Auth Required   | **Yes**                    |
| Path Parameter  | `id` — MongoDB ObjectId    |

**Success Response (`200`):**

```json
{
  "message": "peoples deleted successfully",
  "peoples": { ... }
}
```

**Error Response (`404`):**

```json
{
  "message": "peoples not found"
}
```

---

### 7. Project

> **⚠️ Critical Bug:** The project routes currently import service functions from `users.service.js` instead of `project.service.js`, and `project.service.js` references an undefined `Project` variable. See [Critical Issues](#critical-issues-found-during-review) below.

#### GET `/project`

Get all projects.

| Property       | Value   |
| -------------- | ------- |
| Auth Required  | **Yes** |

**Expected Success Response (`200`):**

```json
{
  "message": "project fetched successfully",
  "allProject": [
    {
      "_id": "665h...",
      "projectName": "Website Redesign",
      "projectLogo": null,
      "projectStartDate": "2025-01-01T00:00:00.000Z",
      "projectEndDate": "2025-06-30T00:00:00.000Z",
      "projectDetail": "Redesign the company website",
      "description": "Major project",
      "isActive": true,
      "userId": "665a...",
      "created": "2025-01-15T12:00:00.000Z",
      "modified": "2025-01-15T12:00:00.000Z"
    }
  ]
}
```

---

#### GET `/project/:id`

Get a single project by ID.

| Property        | Value                      |
| --------------- | -------------------------- |
| Auth Required   | **Yes**                    |
| Path Parameter  | `id` — MongoDB ObjectId    |

**Expected Success Response (`200`):**

```json
{
  "message": "project fetched successfully",
  "projects": { ... }
}
```

**Error Response (`404`):**

```json
{
  "message": "project not found"
}
```

---

#### POST `/project`

Create a new project.

| Property       | Value              |
| -------------- | ------------------ |
| Auth Required  | **Yes**            |
| Content-Type   | `application/json` |

**Request Body:**

```json
{
  "projectName": "Website Redesign",
  "isActive": true,
  "userId": "665a..."
}
```

**Required fields:** `projectName`, `userId`

**Expected Success Response (`200`):**

```json
{
  "message": "project created successfully",
  "project": { ... }
}
```

---

#### PATCH `/project/:id`

Update a project.

| Property        | Value                      |
| --------------- | -------------------------- |
| Auth Required   | **Yes**                    |
| Content-Type    | `application/json`         |
| Path Parameter  | `id` — MongoDB ObjectId    |

**Request Body (any field):**

```json
{
  "projectEndDate": "2025-12-31",
  "isActive": false
}
```

**Expected Success Response (`200`):**

```json
{
  "message": "project updated successfully",
  "project": { ... }
}
```

**Error Response (`404`):**

```json
{
  "message": "project not found"
}
```

---

#### DELETE `/project/:id`

Delete a project.

| Property        | Value                      |
| --------------- | -------------------------- |
| Auth Required   | **Yes**                    |
| Path Parameter  | `id` — MongoDB ObjectId    |

**Expected Success Response (`200`):**

```json
{
  "message": "project deleted successfully",
  "project": { ... }
}
```

**Error Response (`404`):**

```json
{
  "message": "project not found"
}
```

---

## API Endpoints Summary Table

| Method   | Route              | Description              | Auth |
| -------- | ------------------ | ------------------------ | ---- |
| `POST`   | `/users/login`     | User login (get JWT)     | No   |
| `GET`    | `/users`           | Get all users            | Yes  |
| `GET`    | `/users/:id`       | Get user by ID           | Yes  |
| `POST`   | `/users`           | Create user              | Yes  |
| `PATCH`  | `/users/:id`       | Update user              | Yes  |
| `DELETE` | `/users/:id`       | Delete user              | Yes  |
| `GET`    | `/category`        | Get all categories       | Yes  |
| `GET`    | `/category/:id`    | Get category by ID       | Yes  |
| `POST`   | `/category`        | Create category          | Yes  |
| `PATCH`  | `/category/:id`    | Update category          | Yes  |
| `DELETE` | `/category/:id`    | Delete category          | Yes  |
| `GET`    | `/subcategory`     | Get all subcategories    | Yes  |
| `GET`    | `/subcategory/:id` | Get subcategory by ID    | Yes  |
| `POST`   | `/subcategory`     | Create subcategory       | Yes  |
| `PATCH`  | `/subcategory/:id` | Update subcategory       | Yes  |
| `DELETE` | `/subcategory/:id` | Delete subcategory       | Yes  |
| `GET`    | `/expense`         | Get all expenses         | Yes  |
| `GET`    | `/expense/:id`     | Get expense by ID        | Yes  |
| `POST`   | `/expense`         | Create expense           | Yes  |
| `PATCH`  | `/expense/:id`     | Update expense           | Yes  |
| `DELETE` | `/expense/:id`     | Delete expense           | Yes  |
| `GET`    | `/income`          | Get all incomes          | Yes  |
| `GET`    | `/income/:id`      | Get income by ID         | Yes  |
| `POST`   | `/income`          | Create income            | Yes  |
| `PATCH`  | `/income/:id`      | Update income            | Yes  |
| `DELETE` | `/income/:id`      | Delete income            | Yes  |
| `GET`    | `/people`          | Get all people           | Yes  |
| `GET`    | `/people/:id`      | Get person by ID         | Yes  |
| `POST`   | `/people`          | Create person            | Yes  |
| `PATCH`  | `/people/:id`      | Update person            | Yes  |
| `DELETE` | `/people/:id`      | Delete person            | Yes  |
| `GET`    | `/project`         | Get all projects         | Yes  |
| `GET`    | `/project/:id`     | Get project by ID        | Yes  |
| `POST`   | `/project`         | Create project           | Yes  |
| `PATCH`  | `/project/:id`     | Update project           | Yes  |
| `DELETE` | `/project/:id`     | Delete project           | Yes  |

---

## HTTP Status Codes Used

| Code  | Meaning                | Where Used                                             |
| ----- | ---------------------- | ------------------------------------------------------ |
| `200` | OK                     | All successful operations (including create & delete)  |
| `401` | Unauthorized           | Invalid/missing JWT; incorrect login credentials       |
| `404` | Not Found              | Document not found by ID                               |
| `500` | Internal Server Error  | Unhandled exceptions / database errors                 |

---

## Authentication Flow for Frontend Developers

### Step-by-Step

```
1.  POST /users/login
    Body: { "userName": "admin", "password": "admin123" }

2.  Response: { "error": false, "data": "<JWT_TOKEN>", "message": "Login successful" }

3.  Store the token (localStorage, sessionStorage, or state management).

4.  For every subsequent API call, attach the header:
    Authorization: Bearer <JWT_TOKEN>

5.  Token expires after 1 hour. On receiving a 401 response,
    redirect to login or refresh the token.
```

### Token Handling

- **Storage:** Store the JWT string from the `data` field of the login response.
- **Usage:** Send as `Authorization: Bearer <token>` header on every request.
- **Expiry:** 1 hour. No refresh-token mechanism exists — the user must re-login.
- **Decoding (optional):** The token payload contains `{ id, userName, iat, exp }`. You can decode it client-side (e.g., via `jwt-decode`) to read user info or check expiry.

---

## Example API Calls

### Login (using fetch)

```javascript
const response = await fetch("http://localhost:3001/users/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userName: "admin",
    password: "admin123"
  })
});
const data = await response.json();
// data.data contains the JWT token
const token = data.data;
```

### Get All Expenses (using fetch)

```javascript
const response = await fetch("http://localhost:3001/expense", {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
const data = await response.json();
// data.allexpense contains the array of expenses
```

### Create a New Expense (using axios)

```javascript
const { data } = await axios.post(
  "http://localhost:3001/expense",
  {
    expenseDate: "2025-06-15",
    peopleId: "665g...",
    amount: 150.75,
    userId: "665a..."
  },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);
// data.expense contains the newly created expense
```

### Update a Category (using fetch)

```javascript
const response = await fetch("http://localhost:3001/category/665c...", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({
    isExpense: true,
    description: "Updated"
  })
});
const data = await response.json();
```

### Delete a Person (using fetch)

```javascript
const response = await fetch("http://localhost:3001/people/665g...", {
  method: "DELETE",
  headers: {
    "Authorization": `Bearer ${token}`
  }
});
const data = await response.json();
```

---

## Common Mistakes to Avoid (Frontend)

| #  | Mistake                                                       | Fix                                                                                                  |
| -- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| 1  | Forgetting `Bearer ` prefix in `Authorization` header         | Always send `Authorization: Bearer <token>` — note the space after `Bearer`                          |
| 2  | Not setting `Content-Type: application/json` on POST/PATCH    | Include the header; otherwise `req.body` will be `undefined`                                         |
| 3  | Sending `PUT` instead of `PATCH` for updates                  | This API uses `PATCH` for partial updates, not `PUT`                                                 |
| 4  | Not handling 401 responses globally                           | Implement an HTTP interceptor to catch 401s and redirect to login                                    |
| 5  | Assuming paginated responses                                  | All `GET /` endpoints return the **full collection** — handle large lists client-side                |
| 6  | Using wrong response keys                                     | Each resource uses different keys (e.g., `allusers`, `allcategory`, `allexpense`) — check docs above |
| 7  | Sending dates as non-ISO strings                              | Send dates in ISO 8601 format: `"2025-06-15"` or `"2025-06-15T00:00:00.000Z"`                       |
| 8  | Not passing `userId` in create requests                       | Most create endpoints require a `userId` field in the body — it is not auto-inferred from the token  |
| 9  | Assuming token auto-refreshes                                 | Tokens expire after 1 hour with no refresh mechanism — prompt re-login on expiry                     |
| 10 | Calling login on non-user resource paths (e.g., `/category/login`) | Only `POST /users/login` exists — no other resource exposes a login route                            |

---

## Changelog — Resolved Issues

The following critical issues were identified during the initial codebase review and have been **resolved**:

### 1. Project Route Was Importing Wrong Service (Fixed)

**File:** `routes/project.route.js`

**Problem:** The project router imported CRUD functions from `users.service.js` instead of `project.service.js`, causing all `/project` endpoints to operate on the **User** model.

**Fix:** Changed the import to `require("../services/project.service.js")`.

### 2. Project Service Was Importing Wrong Model (Fixed)

**File:** `services/project.service.js`

**Problem:** The file imported the `Subcategory` model but referenced `Project` throughout, causing `ReferenceError: Project is not defined`.

**Fix:** Changed the import to `require("../models/project.model.js")`.

### 3. Duplicated Login Logic Removed from Non-User Resources (Fixed)

**Files:** All route and service files except `users.route.js` / `users.service.js`

**Problem:** Every service file contained a copy of `checkLogin()` and `getByUserName()` that referenced an undefined `User` variable. Each router also exposed a non-functional `POST /login` route.

**Fix:**
- Removed the duplicate `checkLogin()` and `getByUserName()` functions from all non-user service files.
- Removed the unused `POST /login` routes from all non-user route files.
- Removed unused `jsonwebtoken` and `bcrypt` imports from non-user service files.
- Login is now exclusively handled via `POST /users/login`.

---

## License

ISC
