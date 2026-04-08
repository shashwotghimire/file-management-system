# File Management System

A RESTful API backend for managing files and folders, built with Node.js, TypeScript, Express, and PostgreSQL (via Prisma ORM).

## Features

- **User Authentication** — Register and log in with JWT-based authentication
- **File Uploads** — Upload files to your personal storage or directly into a folder
- **Folder Management** — Create, rename, delete, and list folders; move files between folders
- **File Downloads** — Download files by ID or by name
- **Analytics** — View total files uploaded and total storage used
- **Security** — Password hashing with bcrypt, rate limiting on all routes, and request validation with Zod

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express 5 |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JSON Web Tokens (JWT) |
| File Uploads | Multer |
| Validation | Zod |
| Password Hashing | bcrypt |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/shashwotghimire/file-management-system.git
   cd file-management-system
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   JWT_SECRET="your_jwt_secret"
   PORT=8000
   ```

4. **Run database migrations**

   ```bash
   npx prisma migrate deploy
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:8000`.

### Build for Production

```bash
npm run build
```

## API Reference

All routes are prefixed with `/api`. Protected routes require a `Bearer <token>` header.

### Auth — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/register` | Register a new user | No |
| `POST` | `/login` | Log in and receive a JWT | No |

### Files — `/api/files`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/upload` | Upload a file | Yes |
| `POST` | `/upload/folder/:folderId` | Upload a file into a folder | Yes |
| `GET` | `/` | List all files for the authenticated user | Yes |
| `GET` | `/download/id/:fileId` | Download a file by its ID | Yes |
| `GET` | `/download/name/:fileName` | Download a file by its name | Yes |

### Folders — `/api/folders`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/create` | Create a new folder | Yes |
| `PATCH` | `/rename/:folderId` | Rename a folder | Yes |
| `DELETE` | `/delete/:folderId` | Delete a folder | Yes |
| `GET` | `/list` | List all folders for the authenticated user | Yes |
| `GET` | `/:folderId/files` | List all files inside a folder | Yes |
| `PATCH` | `/organize/:fileId` | Move a file into a folder | Yes |

### Analytics — `/api/analytics`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/` | Get total files uploaded and storage used | Yes |

## File Upload Constraints

- **Allowed types:** JPEG, PNG, GIF, PDF, Plain Text, MS Word (`.doc`)
- **Maximum file size:** 10 MB

## Project Structure

```
src/
├── app.ts                  # Express app setup and route mounting
├── server.ts               # Server entry point
├── controllers/            # Route handler logic
├── middlewares/            # Auth, rate limiting, validation, error handling, multer
├── routes/                 # Express router definitions
├── utils/                  # Shared utilities (Prisma client, etc.)
└── validations/            # Zod schemas for request validation
prisma/
├── schema.prisma           # Database models (User, Folder, File)
└── migrations/             # Auto-generated migration files
```

## Data Models

- **User** — `id`, `username`, `email`, `password`, `createdAt`
- **Folder** — `id`, `name`, `ownerId`, `uploadedAt` (unique per owner)
- **File** — `id`, `name`, `path`, `size`, `mimeType`, `uploadDate`, `folderId` (optional), `userId`

## License

ISC
