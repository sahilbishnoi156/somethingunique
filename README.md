# Something Unique

A dedicated platform for college students to interact, share, and collaborate within their universities. Built with a focus on anonymity, modern design, and engaging user experiences.

## Key Features

- **University Forums**: Discuss topics specific to your university.
- **Lost & Found Section**: Locate or report missing items.
- **Anonymous Confessions**: Share thoughts anonymously.
- **Profile Management**: Customize profiles with anonymity options.
- **AI Moderation (Future Scope)**: Automated moderation for posts.
- **Role-Based Access**: Super Admin, College Admins, Club Admins, and Students.

## Functional Requirements

- User registration/login via student email and OTP.
- Forums for each university with search functionality.
- Ability to create posts with attachments (images/videos).
- Admin roles for managing content and users.
- Anonymous posting with username visibility for moderation.

## Non-Functional Requirements

- Scalability to support additional colleges.
- Secure data handling and user privacy.
- Fun and intuitive interface tailored for Gen Z.

## Technology Stack

### Frontend Tech
- **React**
- **React Router**
- **Tailwind CSS**
- **Framer Motion**

### Backend Tech
- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **Bcrypt**
- **JWT**
- **Multer**

### Tools
- **Postman**

## Architecture

- **Frontend Layer**: Next.js for routing, state management, and components.
- **Backend Layer**: Express.js for API routing, authentication, and middleware.
- **Database Layer**: MongoDB with Mongoose for data management.

## API Endpoints

### Posts (`/api/feed`)
- **GET /get-by-category**: Fetch posts by category.
- **GET /get-post**: Retrieve a single post.
- **POST /vote-post**: Upvote or downvote a post.
- **DELETE /delete-post**: Remove a post.

### Comments (`/api/comments`)
- **POST /add**: Add a comment.
- **DELETE /delete**: Remove a comment.
- **GET /get-comments-for-post**: Retrieve comments for a post.

### User Authentication (`/api/auth`)
- **POST /create-user**: Register a new user.
- **POST /send-otp**: Send OTP for email verification.
- **POST /verify-otp**: Verify OTP for login.

## Security Measures

- **Authentication**: JWT tokens for secure sessions.
- **Password Protection**: Bcrypt for hashing user passwords.
- **Data Validation**: Client-side and server-side checks for data integrity.

## Roles and Permissions

- **Super Admin**: Full platform control, including adding colleges.
- **College Admins**: Manage posts and clubs for specific universities.
- **Club Admins**: Post updates about college events.
- **Students**: Interact with posts anonymously.

## Developers

- **Sahil Poonia**: Full-stack Developer
  - Responsibilities: Frontend design, backend API routes, and platform security.
- **Utsav Singh**: Backend Developer
  - Responsibilities: Database models, authentication, and scalability.

## How to Run

1. Clone the repository.
2. Install dependencies:
  ```bash
    npm install
  ```
3. Run the backen server:
  ```bash
    npm run dev
  ```
4. Run the frontend server:
  ```
    npm start
  ```
5. Visit http://localhost:3000 in your browser.

## Folder Structure 
```
SomethingUnique/
├── frontend/             
│   ├── public/           # Static assets like images and public files
│   └── src/
│       ├── assets/       # Fonts, images, and other asset files
│       ├── components/   # Reusable UI components
│       ├── context/      # Context API for state management
│       ├── pages/        # Next.js pages structure
│       │   ├── feed/     # Forum and post-related pages
│       │   ├── login/    # User login and authentication
│       │   ├── profile/  # Profile-related pages
│       │   ├── register/ # Registration pages
│       │   ├── settings/ # Settings pages
│       └── utils/        # Helper functions and utilities
│
├── backend/              
│   ├── middleware/       # Middleware for request validation and authentication
│   ├── models/           # Database models (e.g., User, Post)
│   ├── routes/           # API routes for authentication, posts, comments, etc.
│   ├── services/         # Business logic and services
│   └── utils/            # Helper utilities for the backend
│
└── shared/               # Shared resources
    ├── constants/        # Shared constants between frontend and backend
    ├── types/            # Type definitions for TypeScript (if applicable)
    └── docs/             # Documentation files (e.g., design document, README)
```

## Future Scope

### Features
- Real-time updates using mail services.
- Notifications and customer service using Socket.IO.
- Separate organization accounts for direct brand connections.

### Technology
- **Socket.IO** for direct communication.
- Mail services like **Nodemailer**.
- **MySQL** database for extended functionality.


### License
This project is licensed under the MIT License. Contributions are welcome!
