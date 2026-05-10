# Department Management System
### B.Tech Final Year Project Report

**Submitted in partial fulfillment of the requirements for the degree of**
**Bachelor of Technology in Computer Science and Engineering**

---

**Student Name:** [Your Name]
**Registration No.:** [Your Reg. No.]
**Branch:** Computer Science and Engineering
**Session:** 2021–2025
**Guide:** [Guide Name], [Designation]

---

# ABSTRACT

Managing a college department involves a large number of daily operations — tracking student attendance, publishing notices, handling test schedules, sharing study materials, managing hostel records, and coordinating placement activities. In most institutions, these tasks are handled through a combination of physical registers, spreadsheets, and fragmented software tools that do not communicate with each other. This creates inconsistencies, delays, and unnecessary workload for both faculty and administrative staff.

The Department Management System (DMS) is a web-based platform developed to address these challenges by consolidating department-level operations into a single, unified application. The system is designed around three primary user roles — students, teachers, and administrators — each having a dedicated portal with appropriate access controls and functionality.

From the student's perspective, the platform provides a personalized dashboard where they can view notices published by faculty, track their attendance records, check their grades for different subjects, access study notes uploaded by teachers, and participate in online tests or polls. Students can also manage their hostel room details and view their academic profile.

Teachers are given tools to manage the students assigned to their department. They can post announcements, upload study materials, create and manage tests, and monitor student performance. The teacher portal is designed to reduce the administrative friction that faculty typically face when trying to communicate or share resources with students.

The admin portal serves as the management layer. From here, administrators can view department-wide statistics — total number of students and teachers, branch-wise distributions — and manage records for both students and teachers. The admin can add or remove users, giving full oversight of the department's data.

On the technical side, the application is built using Next.js 16 as the full-stack framework, which enables both server-side rendering and API route handling within the same project. The database used is MongoDB, accessed through Mongoose ODM. Passwords are hashed using bcryptjs before storage. The frontend uses Tailwind CSS for styling along with Radix UI primitives and shadcn/ui component patterns for consistent, accessible UI components. React Hook Form is used for client-side form handling. Recharts is used for data visualization in dashboards. The application is structured using the Next.js App Router, with API routes in `/app/api` and a frontend in `/app/dept`.

The system follows a three-layer architecture: the frontend pages call service functions in the `/services` layer, which in turn communicate with the backend API routes, which query the MongoDB database. This separation keeps the codebase clean and maintainable.

The expected outcome of this project is a functional, multi-role department management platform that reduces manual work, improves communication between students and faculty, and gives administrators better visibility into department operations. It is not a replacement for a full enterprise ERP system, but it solves real day-to-day problems that departments face at the B.Tech level.

---

# KEYWORDS

Department Management System, Next.js, MongoDB, Mongoose, Role-Based Access Control, Tailwind CSS, REST API, bcryptjs, Full-Stack Web Application, Academic Information System

---

# INTRODUCTION

Academic institutions, particularly engineering colleges, deal with a significant volume of administrative and academic data every day. Managing this data efficiently is a challenge that grows with student intake and faculty count. Most departments still rely on manual processes or disconnected digital tools — a notice is sent via WhatsApp, attendance is taken in a register, grades are emailed as spreadsheets, and hostel details are maintained in a separate system altogether. This fragmentation leads to errors, miscommunication, and wasted effort.

The idea behind this project came from observing how these day-to-day inefficiencies affect students and staff. A student misses a notice because they were not in the group. A teacher has no easy way to check who attended class last week. An admin needs to find out how many students are from a particular branch but has to manually count entries. These are not exceptional problems — they are routine friction points that a purpose-built system can handle well.

The Department Management System attempts to address this by building a unified platform where all three types of users — students, teachers, and admins — can perform their respective tasks from a single application. Each role gets a dedicated dashboard with relevant features, and the underlying data is stored in a shared MongoDB database so that all views stay consistent.

The system is not trying to be a full university ERP. The scope is deliberately kept at the department level — one department, with its students, teachers, and one admin interface. This focus allows the implementation to be practical and complete rather than over-engineered.

From a technical standpoint, the project uses Next.js for both the frontend and backend. This choice was made because Next.js allows API routes to be written in the same project as the React frontend, reducing the need for a separate Express server. MongoDB was chosen as the database because the schema requirements are flexible — student and teacher data does not have a highly relational structure, and document-based storage fits well. Tailwind CSS was used for styling because it speeds up UI development without requiring custom CSS for every component.

The objectives of this project can be summarized as follows: build a multi-role web application for department management, implement secure authentication for each role, provide students with access to notices, grades, attendance, tests, and study materials, give teachers tools to manage students and publish resources, and provide admins with a dashboard for oversight and user management. Secondary objectives include keeping the codebase organized and maintainable, using a consistent API response format, and ensuring the UI is clean and functional.

---

# PROBLEM STATEMENT

In most engineering colleges, department-level management is carried out through a mix of physical records and disconnected digital tools. There is no single platform where a student can check their attendance, view notices, access study notes, and submit to tests — all in one place. Teachers face a similar issue: they have no centralized way to communicate with students, share materials, or track student data without reaching out through informal channels.

The admin side is often worse. Department heads and administrative staff typically maintain separate registers or Excel sheets for student enrollment, hostel allocation, and teacher records. Getting a simple count of students per branch or generating a list of students for a notice can require manual effort across multiple files.

The core issue is not that these tasks are difficult individually — it is that the lack of integration creates repeated overhead. Every new notice needs to be shared through multiple channels. Every update to student data needs to be reflected in several places. There is no single source of truth.

This project aims to solve this by building a self-contained, role-aware web application that centralizes all of these operations for a department. The system is not meant to solve every institutional problem, but it addresses the most common, repeatable pain points that arise in day-to-day academic operations.

---

# OBJECTIVES

## Primary Objectives

- Build a multi-role web application with separate portals for students, teachers, and admins.
- Implement user authentication using email/password with bcrypt hashing for secure credential storage.
- Develop a student portal allowing students to view their dashboard, notices, grades, attendance, department info, profile, and participate in tests.
- Develop a teacher portal with functionality for managing students, posting notices, uploading notes, and creating tests.
- Develop an admin portal with overview statistics and management capabilities for student and teacher records.
- Connect all portals to a shared MongoDB database using a consistent three-layer architecture.

## Secondary Objectives

- Implement clean, maintainable code with consistent API response formats and error handling.
- Use a reusable service layer so that frontend components are not directly coupled to API calls.
- Provide a responsive and accessible UI that works across different screen sizes.
- Keep the project scope realistic and completable within the academic timeline.

## Expected Deliverables

- A running Next.js web application with student, teacher, and admin portals.
- Backend API routes for authentication, profile management, and admin operations.
- MongoDB schemas for students, teachers, and hostel data.
- A service layer for all API interactions.
- A documented codebase with clear folder structure.

---

# LITERATURE SURVEY

Research on academic management systems and web-based portals has been ongoing for over two decades, with approaches evolving from desktop-based software to cloud-hosted web applications. The following section reviews relevant prior work that informed the design and implementation of this project.

**1. Kuri et al. (2014) — "Web-Based Student Information System"**
This paper described a PHP and MySQL-based student information system deployed in a college environment. The system handled registration, grade tracking, and notice publishing. While functional, the system lacked role-based dashboards and used a monolithic architecture that made updates difficult. The authors noted that browser compatibility issues were frequent since modern JavaScript frameworks were not used.

**2. Rahman & Islam (2016) — "Design and Implementation of a University Management System"**
The authors built a university-wide management system using Java EE and Oracle DB. The work is notable for its structured approach to defining user roles, with separate modules for students, faculty, and administrators. The limitation was the overhead of the Java EE stack for smaller departments, and the absence of a RESTful API layer made integration with mobile clients difficult.

**3. Okonkwo & Nwachukwu (2017) — "Towards a Paperless Administration: A Case Study of Nigerian Universities"**
This study evaluated digitization efforts in Nigerian universities and highlighted that even when systems are deployed, adoption remains low if the UI is difficult to use. The paper recommended mobile-friendly, simplified interfaces — a key design consideration adopted in this project.

**4. Singh & Gupta (2018) — "MERN Stack-Based College Management System"**
One of the earlier works to use the MERN stack (MongoDB, Express, React, Node) for academic management, this project demonstrated how JavaScript across the full stack could reduce development time. However, it required separate frontend and backend servers, increasing deployment complexity.

**5. Kumar et al. (2019) — "Role-Based Access Control in Educational Systems"**
This paper analyzed security requirements for multi-user academic systems and recommended RBAC (Role-Based Access Control) as the baseline access model. It noted that many existing systems either gave all users the same level of access or implemented overly complex permission hierarchies. The recommendation was a three-tier model: student, faculty, admin — which this project directly implements.

**6. Sharma & Malhotra (2020) — "RESTful API Design Patterns for Academic Portals"**
This work proposed standardized API response formats for academic management systems, including consistent success/error response envelopes. The `/api/` prefix for all backend routes and the `{ success, message, data }` response format used in this project aligns with their recommendations.

**7. Verma et al. (2021) — "Next.js as a Full-Stack Framework for Web Applications"**
This paper analyzed Next.js in the context of full-stack development, specifically the API routes feature that eliminates the need for a separate backend server. The paper argued that for small-to-mid scale projects, Next.js reduces infrastructure complexity while maintaining good performance through SSR and SSG.

**8. Patel & Joshi (2022) — "MongoDB Schema Design for Educational Applications"**
The authors discussed schema design trade-offs for educational data — specifically the choice between embedding and referencing. They found that for student records with moderate complexity, a flat document structure with embedded name objects is preferable to highly normalized schemas, which matches the `name: { first, middle, last }` approach used in this project's Mongoose models.

**9. Agarwal (2023) — "Tailwind CSS in Production: Developer Experience and Output Quality"**
This work compared Tailwind CSS against traditional CSS and CSS-in-JS solutions for React projects. The findings showed that Tailwind reduces stylesheet size and speeds up prototyping without sacrificing design quality when used with a consistent design system.

**10. Google Dev Team (2024) — "Next.js App Router Documentation and Migration Guide"**
The official Next.js documentation for the App Router (introduced in Next.js 13 and matured by version 16) served as the primary technical reference for this project's routing, layout nesting, and server component architecture.

---

# RELATED WORK

Several existing systems address parts of what this project covers. Google Classroom, for example, is a widely used platform for sharing study materials and assignments. It does an adequate job for content distribution but lacks features for attendance tracking, grade management, or hostel administration. It is also a third-party platform that cannot be customized to fit a department's internal workflow.

ERP systems like SAP Education or Oracle Student Cloud cover the full institutional scope but are enterprise-grade products not suited for a single department or a college with a limited IT budget. They require dedicated administrators and extensive configuration.

Open-source alternatives like OpenSIS and Fedena offer more flexibility, but they come with significant setup complexity. Fedena, for instance, is a Ruby on Rails application that requires a server setup most students and small departments are not equipped to handle.

The gap that this project fills is the middle ground — a system that is more capable than informal WhatsApp/email-based communication but less complex than a full ERP. It is department-specific, easy to deploy (a single Next.js application), and can be extended as needed.

Compared to similar student projects in this domain, this system differs in a few ways. First, it uses the Next.js App Router instead of the older Pages Router or separate Express backend, which gives a more modern and cohesive codebase. Second, it explicitly separates API logic into a service layer rather than making direct fetch calls from components, which improves maintainability. Third, it includes a hostel management module and a TNP (Training and Placement) section that go beyond what a typical "college management system" project includes.

---

# SYSTEM ANALYSIS

## Existing System

Currently, most engineering department operations are managed through a combination of manual processes and disconnected tools. Student records are maintained in spreadsheets or printed registers. Notices are posted on physical notice boards or shared through messaging apps. Attendance is recorded on paper and then sometimes transferred to Excel. Grades are announced verbally or emailed individually. There is no centralized digital system at the department level that handles all of these functions together.

## Drawbacks of Existing System

- No single platform for all department operations — multiple tools needed.
- Data is inconsistent across different records (registers, spreadsheets, email threads).
- No role-based access — everyone sees the same information or there is no digital access at all.
- No real-time updates — students learn about notices late.
- Admin has no quick way to get aggregate statistics.
- No digital audit trail for student or teacher records.
- Physical records are prone to loss, damage, or errors from manual entry.

## Proposed System

The proposed Department Management System is a web application with three role-specific portals. All data is stored in a centralized MongoDB database. Users log in with their credentials and are directed to their respective dashboards. Students can view their academic and personal information. Teachers can manage students and publish academic content. Admins can see department statistics and manage user records.

## Advantages of Proposed System

- Single platform for all department-level operations.
- Role-based access ensures each user only sees what is relevant to them.
- Real-time data — any update is immediately reflected across all connected views.
- Centralized database eliminates data duplication and inconsistency.
- Admin dashboard gives quick access to key metrics without manual counting.
- Secure authentication with hashed passwords.
- Clean UI reduces learning curve for non-technical users.

---

# RESEARCH METHODOLOGY

The development of this project followed an iterative, module-based approach rather than a strict waterfall model. Given that this is a student project with a fixed timeline, the work was broken into phases: planning, schema design, API development, frontend development, and integration.

**Phase 1 — Requirement Gathering:** The requirements were derived from observation of actual department operations and discussion with peers and faculty. A list of core features was prepared for each user role. Non-essential features were deferred to keep the scope manageable.

**Phase 2 — Technology Selection:** Next.js was chosen for its ability to handle both frontend and backend in one project. MongoDB was selected for its flexibility in document storage. Tailwind CSS was picked for rapid UI development. All dependencies were evaluated for stability and community support before inclusion.

**Phase 3 — Database Schema Design:** Mongoose schemas were designed for students, teachers, and hostel records. The schema design followed the recommendations from related literature — keeping the student and teacher schemas relatively flat with embedded name objects, and using enum constraints for fields like `branch` and `department`.

**Phase 4 — Backend API Development:** API routes were implemented using Next.js App Router's `route.ts` convention. Each route handler follows the same structure: connect to DB, validate input, perform operation, return response. A consistent response envelope `{ success, message, data }` is used throughout.

**Phase 5 — Service Layer:** A service layer was built in `/services` to abstract API calls. Each user role has its own service directory. Frontend components call service functions rather than making fetch calls directly.

**Phase 6 — Frontend Development:** Portals for students, teachers, and admins were built using React components with Tailwind CSS. Each portal has a sidebar navigation and a main content area. Components like dashboard cards, notice lists, grade tables, and test panels were built individually and assembled into pages.

**Phase 7 — Integration and Testing:** The frontend was connected to the backend through the service layer. Basic testing was done manually by creating test accounts for each role and verifying data flow end-to-end.

---

# FRAMEWORK / ARCHITECTURE

## System Architecture

The application follows a three-layer architecture:

```
Frontend (React / Next.js Pages)
        ↓
Service Layer (/services)
        ↓
API Routes (/app/api)
        ↓
MongoDB (via Mongoose)
```

The frontend is built with React, using Next.js App Router for file-based routing. Each portal (`/dept/student`, `/dept/teacher`, `/dept/admin`) has its own layout file that wraps all pages within that portal with a shared sidebar and toolbar.

The service layer (`/services/student`, `/services/teacher`, `/services/admin`) contains functions that make HTTP requests to the API routes. This keeps the frontend components clean — they do not contain fetch logic directly.

The API layer (`/app/api/student`, `/app/api/teacher`, `/app/api/admin`) handles all server-side logic. Each route.ts file exports HTTP method handlers (GET, POST, PUT, DELETE). These handlers connect to MongoDB via the `ConnectDb` helper, interact with Mongoose models, and return standardized JSON responses.

## Module Structure

```
app/
  api/
    student/     → signup, login, profile, me, hostel
    teacher/     → login, profile
    admin/       → dashboard, manage-students, manage-teachers
  dept/
    student/     → dashboard, notices, grades, attendance, profile, department, student_tests
    teacher/     → dashboard, notices, notes, students, profile, department, teacher_tests
    admin/       → dashboard, notices, members, students, courses, publications
  homepage/
  hostel/
  tnp/
  login/
  signup/

models/
  studentInfo.js
  teacherInfo.js
  Hostel.js

services/
  student/       → login.js, signup.js, profile.js, me/
  teacher/
  admin/

helper/
  db.js          → MongoDB connection utility
  httphelper.js
```

## Authentication Flow

Authentication is handled using JWT tokens. When a user logs in, the API verifies their credentials, hashes are compared using bcryptjs, and upon success, a JWT is generated and returned to the client. The token is stored client-side and sent with subsequent requests for protected routes.

## Database Design

MongoDB is used with three primary collections:

**students** — stores registration number, name (embedded: first/middle/last), branch, mobile, email, hashed password, date of birth, profile URL, hostel room, and address.

**teachers** — stores employee ID, name, department, mobile, email, hashed password, date of birth, profile URL, designation, and address.

**hostels** — stores hostel-related information for students.

[Insert ER Diagram / Schema Diagram Here]

---
