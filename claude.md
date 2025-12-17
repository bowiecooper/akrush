# AKPsi Rush Management Platform - Project Plan

## Project Overview
A full-stack web application for managing Alpha Kappa Psi's recruitment process, including rushee applications, file uploads, and brotherhood review portal.

## Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **File Storage**: TBD (AWS S3, Cloudinary, or local storage)
- **Authentication**: JWT-based auth

---

## Phase 1: Project Setup & Infrastructure

### 1.1 Repository Structure
- [ ] Initialize monorepo structure (frontend + backend)
- [ ] Set up `.gitignore` for both client and server
- [ ] Create initial directory structure
  ```
  /client (React + TypeScript)
  /server (Node + Express)
  /shared (shared types/interfaces)
  ```

### 1.2 Backend Setup
- [ ] Initialize Node.js project with TypeScript
- [ ] Install core dependencies:
  - express
  - typescript
  - pg (PostgreSQL client)
  - bcrypt (password hashing)
  - jsonwebtoken (JWT auth)
  - multer (file uploads)
  - cors
  - dotenv
  - express-validator
- [ ] Set up TypeScript configuration
- [ ] Create basic Express server structure
- [ ] Set up environment variables (.env)
- [ ] Configure CORS for frontend-backend communication

### 1.3 Frontend Setup
- [ ] Initialize React project with Vite + TypeScript
- [ ] Install core dependencies:
  - react-router-dom
  - tailwindcss
  - axios/fetch wrapper
  - react-hook-form
  - zod (validation)
- [ ] Configure Tailwind CSS
- [ ] Set up routing structure
- [ ] Create basic component structure
- [ ] Set up API client/service layer

### 1.4 Database Setup
- [ ] Install PostgreSQL locally or set up cloud instance
- [ ] Design database schema (see Phase 2)
- [ ] Set up database connection pool
- [ ] Create migration system (e.g., node-pg-migrate or Knex.js)

---

## Phase 2: Database Design

### 2.1 Core Tables

#### Users Table
```sql
- id (UUID, primary key)
- email (unique, not null)
- password_hash (not null)
- first_name
- last_name
- role (enum: 'rushee', 'brother', 'manager')
- created_at
- updated_at
```

#### Rushee Profiles
```sql
- id (UUID, primary key)
- user_id (foreign key -> users.id)
- major
- year (freshman, sophomore, junior, senior, graduate)
- phone_number
- linkedin_url
- additional_info (JSON for flexible fields)
- created_at
- updated_at
```

#### Applications
```sql
- id (UUID, primary key)
- rushee_id (foreign key -> rushee_profiles.id)
- status (enum: 'draft', 'submitted', 'under_review', 'accepted', 'rejected')
- submitted_at
- reviewed_at
- reviewer_id (foreign key -> users.id, nullable)
- created_at
- updated_at
```

#### Application Essays
```sql
- id (UUID, primary key)
- application_id (foreign key -> applications.id)
- question
- answer (text)
- order_index
- created_at
- updated_at
```

#### Application Files
```sql
- id (UUID, primary key)
- application_id (foreign key -> applications.id)
- file_type (enum: 'resume', 'transcript', 'other')
- file_name
- file_url (or file_path)
- file_size
- mime_type
- uploaded_at
```

#### Brothers (optional, for brother-specific data)
```sql
- id (UUID, primary key)
- user_id (foreign key -> users.id)
- pledge_class
- position (optional)
- bio
- created_at
- updated_at
```

### 2.2 Database Tasks
- [ ] Write SQL migration scripts for all tables
- [ ] Create database indexes for performance
- [ ] Set up foreign key constraints
- [ ] Write seed data for development/testing

---

## Phase 3: Authentication & Authorization

### 3.1 Backend Auth
- [ ] Create auth routes (`/api/auth/register`, `/api/auth/login`, `/api/auth/logout`)
- [ ] Implement password hashing with bcrypt
- [ ] Implement JWT token generation and validation
- [ ] Create authentication middleware
- [ ] Create role-based authorization middleware (rushee/brother/manager)
- [ ] Implement refresh token logic (optional but recommended)

### 3.2 Frontend Auth
- [ ] Create auth context/provider for global auth state
- [ ] Build registration page/form
- [ ] Build login page/form
- [ ] Implement protected routes
- [ ] Handle token storage (localStorage or httpOnly cookies)
- [ ] Implement auto-logout on token expiration
- [ ] Create auth service for API calls

---

## Phase 4: Rushee Portal

### 4.1 Rushee Profile
- [ ] Create API endpoint to get/update rushee profile
- [ ] Build rushee profile page
- [ ] Build profile edit form (major, year, contact info)
- [ ] Implement form validation

### 4.2 Application Form
- [ ] Design application form structure (essays + files)
- [ ] Create API endpoints:
  - GET `/api/applications/:id` (get application)
  - POST `/api/applications` (create application)
  - PUT `/api/applications/:id` (update application)
  - POST `/api/applications/:id/submit` (submit application)
- [ ] Build multi-step application form UI
  - Step 1: Personal information
  - Step 2: Essay questions
  - Step 3: File uploads (resume, transcript)
  - Step 4: Review and submit
- [ ] Implement form state management
- [ ] Add form validation (client + server side)
- [ ] Implement draft auto-save functionality
- [ ] Show application status to rushee

### 4.3 File Upload
- [ ] Choose file storage solution (AWS S3, Cloudinary, or local)
- [ ] Set up file storage configuration
- [ ] Create file upload API endpoint with multer
- [ ] Implement file validation (type, size limits)
- [ ] Build file upload component with drag-and-drop
- [ ] Show upload progress
- [ ] Handle file deletion/replacement
- [ ] Generate secure file URLs for viewing

---

## Phase 5: Brotherhood Portal

### 5.1 Application Viewing (Brother View)
- [ ] Create API endpoint to list all submitted applications
- [ ] Build applications list page with filters:
  - Filter by status
  - Filter by major
  - Filter by year
  - Search by name
- [ ] Build individual application detail view
- [ ] Display rushee profile information
- [ ] Display essay responses
- [ ] Show uploaded files (downloadable links)
- [ ] Implement pagination for application list

### 5.2 Manager View (Additional Features)
- [ ] Create manager dashboard with statistics:
  - Total applications
  - Applications by status
  - Applications by major/year
- [ ] Add application status management:
  - Update status (under review, accepted, rejected)
  - Add review notes
- [ ] Create API endpoints for status updates
- [ ] Build status management UI
- [ ] Implement filtering/sorting options
- [ ] Add bulk actions (if needed)

### 5.3 Access Control
- [ ] Implement role-based access:
  - Brothers can view applications (read-only)
  - Managers can view and modify applications
- [ ] Add authorization checks to API endpoints
- [ ] Implement UI permissions (hide/show features based on role)

---

## Phase 6: Additional Features

### 6.1 Email Notifications (Optional)
- [ ] Set up email service (SendGrid, AWS SES, or nodemailer)
- [ ] Send confirmation email on registration
- [ ] Send notification email on application submission
- [ ] Send status update emails to rushees

### 6.2 Analytics & Reporting
- [ ] Create admin dashboard with recruitment metrics
- [ ] Export applications to CSV/PDF
- [ ] Generate recruitment reports

### 6.3 Rush Events (Future Enhancement)
- [ ] Create events table
- [ ] Allow rushees to RSVP to events
- [ ] Track event attendance

---

## Phase 7: Testing & Quality Assurance

### 7.1 Backend Testing
- [ ] Set up testing framework (Jest)
- [ ] Write unit tests for auth logic
- [ ] Write unit tests for API endpoints
- [ ] Write integration tests for database operations
- [ ] Test file upload functionality
- [ ] Test authorization middleware

### 7.2 Frontend Testing
- [ ] Set up testing framework (Vitest + React Testing Library)
- [ ] Write unit tests for components
- [ ] Write integration tests for forms
- [ ] Test protected routes and auth flows
- [ ] Test file upload UI

### 7.3 Manual Testing
- [ ] Test complete rushee flow (registration → application → submission)
- [ ] Test brotherhood views with different roles
- [ ] Test file uploads with various file types
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing

---

## Phase 8: Deployment

### 8.1 Deployment Preparation
- [ ] Set up production environment variables
- [ ] Configure production database (AWS RDS, Railway, etc.)
- [ ] Set up file storage for production
- [ ] Configure CORS for production domains
- [ ] Set up SSL/HTTPS

### 8.2 Frontend Deployment
- [ ] Build production React app
- [ ] Deploy to hosting platform (Vercel, Netlify, AWS S3)
- [ ] Configure custom domain (if applicable)
- [ ] Set up environment variables

### 8.3 Backend Deployment
- [ ] Deploy Node.js backend (Railway, Heroku, AWS EC2, DigitalOcean)
- [ ] Run database migrations on production
- [ ] Set up monitoring and logging
- [ ] Configure health check endpoints

### 8.4 Post-Deployment
- [ ] Test production deployment end-to-end
- [ ] Set up backup strategy for database
- [ ] Document deployment process
- [ ] Create runbook for common issues

---

## Phase 9: Documentation & Handoff

- [ ] Write API documentation
- [ ] Create user guides for rushees
- [ ] Create admin guide for brothers/managers
- [ ] Document environment setup for developers
- [ ] Create maintenance and troubleshooting guide

---

## Design Decisions to Make

### Immediate Decisions Needed:
1. **Manager vs Brother Views**: Determine exact permission differences
   - Should brothers be able to leave comments/notes?
   - Should brothers see all applications or filtered subset?
   - What actions can managers perform that brothers cannot?

2. **File Storage**: Choose between:
   - AWS S3 (scalable, costs money)
   - Cloudinary (easy, has free tier)
   - Local storage (free, but not scalable)

3. **Essay Questions**: Define the specific essay questions for the application

4. **Application Status Workflow**: Define the exact statuses and transitions
   - Draft → Submitted → Under Review → Accepted/Rejected?
   - Can rushees edit after submission?

5. **Brother Accounts**: How will brother accounts be created?
   - Admin creates them?
   - Invitation system?
   - Self-registration with approval?

### Future Considerations:
- Should there be a public-facing landing page?
- Do you need interview scheduling functionality?
- Should there be a messaging/communication system?
- Do you need analytics on who views which applications?

---

## Getting Started

### First Steps:
1. Set up the project structure (Phase 1.1)
2. Initialize both frontend and backend projects (Phase 1.2, 1.3)
3. Design and implement the database schema (Phase 2)
4. Build authentication system (Phase 3)
5. Start with rushee portal (Phase 4)
6. Then build brotherhood portal (Phase 5)

### Development Best Practices:
- Use Git branches for features
- Write clear commit messages
- Keep frontend and backend in sync (shared types)
- Test as you build, not at the end
- Deploy early and often to catch issues
- Keep environment variables secure
- Use TypeScript for type safety
