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
- **Nextjs**
- **Tailwind CSS**
- **ShadCn**
- **Sonner**

### Backend Tech
- **Express.js**
- **Mongoose**
- **Bcryptjs**
- **Jsonwebtoken**
- **Nodemailer**

### Helping Tools
- **Thunderclient**
- **Excalidraw**

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
- **Password Protection**: Bcryptjs for hashing user passwords.
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

1. Clone the repositories:
   1. Frontend:
      ```bash
         git clone https://github.com/sahilbishnoi156/somethingunique.git
      ```
    2. Backend:
       ***
         Still in progress, will update soon
       ***
3. Install dependencies:
  ```bash
    npm install
  ```
3. Backend Scrips:
   1. Start the express server using nodemon :
      ```bash
        npm run start
      ```
    2. Start the express server without using nodemon :
       ```bash
         node ./index.js
       ```
4. Frontend Scripts:
   1. Start in development mode : 
      ```bash
        npm run dev
      ```
    2. Build the project :
       ```bash
         npm run build
       ```
    3. Start the build :
       ```bash
         npm run start
       ```
6. Visit http://localhost:3000 in your browser.

## Folder Structure 
```
SomethingUnique/
├── frontend/             
│   ├── public/           # Static assets like images and public files
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── constants/    # Reusable constant variables 
│       ├── app/          # Next.js route structure
│       │   ├── app/      # Main app where posts will be shown
│       │   ├── login/    # User login and authentication
│       │   ├── profile/  # Profile-related pages
│       │   ├── register/ # Registration pages
│       │   ├── settings/ # Settings pages
│       │   ├── lib/      # Helper functions and utilities
│       └── types/        # Type for arguments and variables (For TypeScript)
│
├── backend/              
    ├── middleware/       # Middleware for request validation and authentication
    ├── models/           # Database models (e.g., User, Post)
    ├── routes/           # API routes for authentication, posts, comments, etc.
    └── utils/            # Helper utilities for the backend
```

## Future Scope

### Features
- Real-time video calls using webrtc.
- Notifications and customer service using Socket.IO.

### Technology
- **Socket.IO** for direct communication.
- **MySQL** database for extended functionality.
