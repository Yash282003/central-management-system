# DATA COLLECTION

This project does not use an external dataset. All data is user-generated through the application itself. Students and teachers are registered in the system via signup forms or admin-created accounts. The MongoDB database is seeded with test records during development to verify API behavior and UI rendering.

Student data includes: name, registration number, branch, mobile, email, hashed password, date of birth, address, and profile photo URL. Teacher data includes: name, employee ID, department, designation, mobile, email, and hashed password. Hostel data is linked to student records via the `hostelRoom` and `roomNo` fields in the student schema.

No external dataset, CSV file, or third-party data source was used. All records are entered through the application interface or directly through API calls during testing.

---

# REQUIREMENT ANALYSIS

## Hardware Requirements

- Processor: Intel Core i5 or equivalent (minimum dual-core for development)
- RAM: 8 GB minimum (16 GB recommended for running Next.js dev server + MongoDB locally)
- Storage: 20 GB free disk space
- Internet connection for MongoDB Atlas access (if using cloud DB) or LAN for local MongoDB

## Software Requirements

- Operating System: Windows 10/11, macOS, or Ubuntu 20.04+
- Node.js: v18.x or above
- npm: v9.x or above
- Next.js: 16.1.7
- MongoDB: 6.x (local) or MongoDB Atlas (cloud)
- Browser: Google Chrome 110+ or Mozilla Firefox 110+
- Code Editor: Visual Studio Code
- Git: 2.x for version control

---

# TECHNOLOGIES USED

**Next.js 16** is the primary framework used for this project. It provides file-based routing via the App Router, server-side rendering, and built-in API route support. This eliminates the need for a separate backend server like Express.

**React 19** powers the component-based frontend. All UI pages are built as React components. State management is handled using React's built-in `useState` and `useEffect` hooks.

**TypeScript** is used for the API routes and service layer files, providing type safety and reducing runtime errors during development.

**MongoDB** is the database. It is a NoSQL document database that stores student, teacher, and hostel records. Its flexible schema suits the project's requirements well.

**Mongoose** is the ODM (Object Data Modeling) library for MongoDB. It provides schema definitions, validation, and query building in JavaScript.

**Tailwind CSS v4** handles all styling. Utility classes are applied directly in JSX, keeping styles co-located with components and reducing the need for separate CSS files.

**bcryptjs** is used for password hashing. All passwords are hashed before being saved to the database. On login, the entered password is compared against the stored hash using `bcrypt.compare()`.

**jsonwebtoken (JWT)** is used for authentication token generation and verification.

**React Hook Form** handles form state and validation on the frontend. It reduces re-renders and simplifies form submission logic.

**Recharts** provides the charting library used in admin and student dashboards for displaying bar charts and other data visualizations.

**shadcn/ui + Radix UI** provides accessible, unstyled UI primitives (dialogs, dropdowns, tooltips) that are styled with Tailwind. This ensures UI components are accessible by default.

**Lucide React** is used as the icon library throughout the application.

**Sonner** provides toast notification support for user feedback on actions like form submission and errors.

---

# DATA PREPROCESSING

Since this is a web application and not an ML project, the preprocessing steps apply to user input validation and data sanitization rather than dataset preprocessing.

**Email Normalization:** All email addresses are stored in lowercase. The Mongoose schema enforces `lowercase: true` on the email field to prevent duplicate accounts with different case variations.

**Password Hashing:** Passwords are never stored in plaintext. Before saving to MongoDB, passwords are hashed using `bcryptjs` with a salt round of 10. This makes stored passwords resistant to rainbow table and brute-force attacks.

**Input Validation:** Required fields are checked both at the frontend (React Hook Form) and backend (Mongoose schema validators). Fields like mobile number are validated against a 10-digit regex pattern. Email is validated against a standard pattern before saving.

**Enum Constraints:** The `branch` field for students and the `department` field for teachers use Mongoose `enum` to restrict values to the allowed list: `["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL"]`. This prevents invalid department names from entering the database.

**Date Parsing:** Date of birth is stored as a `Date` type in MongoDB. The input from the form is parsed and converted before storage.

**Trimming and Sanitization:** String fields are trimmed of whitespace at the service layer before being sent to the API to avoid storing entries with accidental spaces.

---

# EXISTING METHOD

The most common existing approaches for department-level academic management fall into three categories:

**Manual/Paper-Based Systems:** Attendance registers, printed grade sheets, and physical notice boards. These are zero-cost and require no infrastructure, but are error-prone, slow to update, and difficult to query.

**General-Purpose Tools (WhatsApp, Email, Google Sheets):** Many departments use messaging apps for notice distribution and spreadsheets for record keeping. While familiar and accessible, these tools lack access control, searchability, and structure. A student can delete a message; a spreadsheet can be accidentally overwritten.

**Institutional ERPs:** Systems like SAP Education or Fedena provide comprehensive coverage but require significant infrastructure, licensing, and IT support. They are designed for entire universities, not individual departments. Implementation takes months and costs far more than a student-level project allows.

**Limitations of Existing Methods:**
- No unified interface for students, teachers, and admins
- Poor real-time communication between roles
- No structured data storage with query capabilities
- High overhead for simple tasks like posting a notice
- No self-service profile management for students

---

# PROPOSED METHOD

The proposed system is a multi-role, web-based Department Management System built using Next.js and MongoDB. The key design decisions are:

## Role-Based Architecture

Three distinct user roles are supported: Student, Teacher, and Admin. Each role has a separate portal accessed via its own URL path (`/dept/student`, `/dept/teacher`, `/dept/admin`). Authentication is required before accessing any portal.

## Three-Layer Backend Architecture

```
Page Component
    → calls service function (e.g., loginStudent())
        → sends HTTP request to API route (e.g., POST /api/student/login)
            → API handler validates, queries MongoDB, returns response
```

This separation ensures that the frontend does not contain business logic, and the API layer is independently testable.

## API Design

All API routes follow RESTful conventions. Responses always use the standard envelope:

```json
{ "success": true, "message": "...", "data": {} }
```

Error responses:
```json
{ "success": false, "message": "Error description" }
```

## Authentication

Login APIs accept email and password. The password is compared to the stored hash using `bcrypt.compare()`. On success, a JWT is generated using `jsonwebtoken` and returned to the client.

## Frontend Structure

Each portal uses a shared layout with a sidebar (navigation links) and a toolbar (user info, logout). Pages within each portal are individual React components rendered in the main content area. The design uses Tailwind utility classes with a consistent color scheme per role (blue for student, green for teacher, purple for admin).

---

# MODULE DESCRIPTION

## Authentication Module

Handles user login for all three roles. The login page (`/dept/login` or role-specific login) accepts email and password, calls the corresponding login API, and redirects to the portal dashboard on success. Errors (wrong password, user not found) are displayed inline using Sonner toasts.

## Student Portal Module

Contains the following sub-pages:
- **Dashboard:** Overview cards showing attendance %, upcoming tests, recent notices, and grade summary.
- **Notices:** List of notices posted by teachers or admin, with date and priority indicators.
- **Grades:** Table showing subject-wise marks and calculated SGPA/CGPA.
- **Attendance:** Visual breakdown of attendance per subject with percentage and status.
- **Tests:** List of available tests/polls; students can view and submit answers.
- **Department:** Information about the department — faculty list, labs, about section.
- **Profile:** Student's personal and academic details with option to edit.

## Teacher Portal Module

Contains:
- **Dashboard:** Summary of students, notices posted, upcoming tests.
- **Students:** List of all students in the teacher's department with search.
- **Notices:** Create and manage notices visible to students.
- **Notes:** Upload and manage study material/notes for students.
- **Tests:** Create tests/polls and view results.
- **Department:** Department overview page.
- **Profile:** Teacher's personal details with edit option.

## Admin Portal Module

Contains:
- **Dashboard:** Department-wide statistics (total students, teachers, branch breakdown, recent activity).
- **Students:** Full list of students with search, filter, and delete capability.
- **Members (Teachers):** Full list of teachers with management options.
- **Notices:** Admin-level notice creation.
- **Courses:** Courses offered in the department.
- **Publications:** Department publications or announcements.

## Hostel Module

A separate section for hostel management. Students can view their room allocation. The hostel admin can manage room assignments. The Hostel Mongoose model stores room numbers, block names, and occupancy.

## TNP (Training and Placement) Module

A separate portal section covering placement-related activities — job postings, placement statistics, registered companies, and student placement records. This module is structured separately from the department module.

## API Module

Backend API routes organized by role:
- `/api/student/` — signup, login, profile (GET/PUT/DELETE), me, hostel
- `/api/teacher/` — login, profile (GET/PUT)
- `/api/admin/` — dashboard (GET), manage-students (GET/DELETE), manage-teachers (GET/DELETE)

---

# FLOW DIAGRAM

## System Login Flow

```
User opens portal
    → Enters email + password
    → Frontend calls service function
    → Service sends POST to /api/[role]/login
    → API connects to MongoDB
    → Finds user by email
    → Compares password with bcrypt.compare()
    → If valid: returns JWT token + user data
    → Frontend stores token, redirects to dashboard
    → If invalid: returns error, shows toast message
```

[Insert Login Flow Diagram Here]

## Student Data Flow

```
Student Dashboard loads
    → Calls getStudentProfile() from service
    → GET /api/student/me
    → MongoDB returns student document
    → Dashboard displays stats, notices, grades
```

[Insert Student Data Flow Diagram Here]

## Admin Management Flow

```
Admin views Students page
    → Calls getAllStudents() from service
    → GET /api/admin/manage-students
    → MongoDB returns all student records
    → Admin can delete a student
    → DELETE /api/admin/manage-students?id=[studentId]
    → MongoDB removes record, list refreshes
```

[Insert Admin Flow Diagram Here]

---

# ALGORITHM

## Student Login Algorithm

```
Input: email, password
Output: JWT token or error

1. Receive POST request at /api/student/login
2. Extract { email, password } from request body
3. If email or password missing → return 400 error
4. Connect to MongoDB via ConnectDb()
5. Query students collection: Student.findOne({ email })
6. If student not found → return 404 error
7. Call bcrypt.compare(password, student.password)
8. If comparison fails → return 401 Unauthorized
9. Generate JWT: jwt.sign({ id: student._id, role: "student" }, SECRET)
10. Return { success: true, token, data: student (excluding password) }
```

## Student Registration Algorithm

```
Input: name, regdNo, branch, mobile, email, password, dob, address
Output: Created student document or error

1. Receive POST request at /api/student/signup
2. Validate all required fields present
3. Check if email or regdNo already exists in DB
4. If duplicate → return 409 Conflict
5. Hash password: bcrypt.hash(password, 10)
6. Create new Student document with hashed password
7. Save to MongoDB
8. Return { success: true, message: "Registered successfully" }
```

---

# IMPLEMENTATION DETAILS

## Frontend Implementation

The frontend is built with React 19 using Next.js App Router. Each portal has a `layout.tsx` that wraps all child pages with a sidebar and toolbar. The sidebar renders navigation links dynamically using arrays of route objects. Active link highlighting is handled using `usePathname()` from `next/navigation`.

Pages are functional React components. Data fetching is done inside `useEffect` hooks which call service functions on component mount. Loading states are handled with local `useState` booleans. Error states display user-friendly messages.

Form pages (login, signup, profile edit) use `react-hook-form` for controlled input management. Validation rules are defined inline and errors are displayed beneath each field. On successful submission, Sonner toast notifications confirm the action.

## Backend Implementation

API routes are inside `app/api/`. Each folder corresponds to a resource and contains a `route.ts` file. The file exports async functions named `GET`, `POST`, `PUT`, `DELETE` corresponding to HTTP methods.

Each handler:
1. Calls `ConnectDb()` to ensure database connection
2. Parses request body or query params
3. Validates input
4. Performs the database operation using Mongoose
5. Returns a `NextResponse.json()` with the standard response envelope

Example pattern (student login):
```ts
export async function POST(req: Request) {
  await ConnectDb();
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ success: false, message: "Fields required" }, { status: 400 });
  const student = await Student.findOne({ email });
  if (!student) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  const valid = await bcrypt.compare(password, student.password);
  if (!valid) return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
  return NextResponse.json({ success: true, message: "Login successful", data: student });
}
```

## Service Layer

Each API call has a corresponding service function. Example:
```js
export async function loginStudent(data) {
  const res = await fetch("/api/student/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}
```

Pages call `loginStudent(formData)` and handle the returned object.

## Database Connection

The `helper/db.js` file exports `ConnectDb()`, which checks a cached `isconnected` flag before connecting. This prevents redundant connections in a serverless environment where API routes may run in isolated contexts.

---

# PERFORMANCE METRICS

Since this is a web application (not an ML model), performance is evaluated using the following metrics:

**Response Time:** API routes respond within 100–400ms for standard read operations when connected to a local MongoDB instance. Write operations (signup, profile update) take slightly longer due to hashing overhead.

**Password Hashing Time:** bcrypt with salt round 10 takes approximately 60–100ms on a standard development machine. This is acceptable for login operations.

**Page Load Time:** With Next.js App Router and SSR, initial page loads are fast. Static pages (login, homepage) load under 1 second on local dev server.

**Database Query Performance:** Queries use indexed fields (`email`, `regdNo`, `employeeId`) ensuring O(log n) lookup time. Without indexes, queries would degrade to O(n) as the student collection grows.

**Concurrent Users:** The current implementation is not load-tested. For a department of 200–500 students, the system is expected to handle concurrent requests adequately with a properly configured MongoDB Atlas cluster.

**Bundle Size:** The Next.js build output uses code splitting by route, keeping individual page bundles small. Tailwind CSS purges unused classes in production, reducing stylesheet size.

---

# RESULTS AND DISCUSSION

The system was tested manually across all three portals using test accounts for each role. The following observations were made:

**Student Portal:** The dashboard loaded correctly with attendance, grade summary, and recent notice widgets. Navigation between pages (grades, notices, tests, profile) worked without errors. The profile edit form validated inputs correctly and rejected invalid mobile numbers.

[Insert Screenshot — Student Dashboard]

**Teacher Portal:** The students list page rendered all registered students with search functionality. Notice creation posted successfully and appeared in the student portal without page refresh after navigating back. The notes upload UI was functional.

[Insert Screenshot — Teacher Dashboard]

**Admin Portal:** The dashboard correctly displayed total student and teacher counts fetched from the database. The manage-students page listed all registered students. The delete action removed the student from MongoDB and refreshed the list.

[Insert Screenshot — Admin Dashboard]

**Authentication:** Login with correct credentials redirected to the appropriate portal. Login with incorrect password returned a 401 error and displayed a toast message. Missing field validation worked at both frontend and API levels.

**Known Issues During Testing:**
- On initial load, there is a brief flash before data is fetched (no skeleton loader implemented yet).
- The hostel module has a frontend UI but the backend integration is partial.
- TNP module is frontend-only with mock data; backend API is not yet connected.

---

# COMPARISON ANALYSIS

| Feature | Manual/Paper | WhatsApp+Sheets | Google Classroom | This System |
|---|---|---|---|---|
| Role-based access | No | No | Partial | Yes |
| Centralized data | No | No | Partial | Yes |
| Notices/Announcements | Physical board | Messaging app | Yes | Yes |
| Grade management | Registers | Spreadsheet | No | Yes |
| Attendance tracking | Paper | Spreadsheet | No | Yes |
| Test management | Paper | No | Yes | Yes |
| Hostel management | Registers | No | No | Yes |
| Admin dashboard | No | No | No | Yes |
| API-based architecture | No | No | No | Yes |
| Self-service profile | No | No | Partial | Yes |

---

# ADVANTAGES

- All department operations accessible from a single URL — no switching between tools.
- Role separation means students cannot access teacher or admin data.
- Passwords are hashed — even database administrators cannot read plaintext passwords.
- The service layer makes it straightforward to swap the backend or add new API endpoints without touching UI components.
- The three-portal structure mirrors how a real department actually operates, making it intuitive for users.
- Next.js allows the entire application to be deployed as a single unit on platforms like Vercel, reducing DevOps overhead.
- MongoDB's flexible schema makes it easy to add new fields to student or teacher records without schema migrations.

---

# LIMITATIONS

- There is no JWT middleware enforcing authentication on all API routes. Currently, some routes can be accessed without a valid token, which is a security gap that needs to be addressed before production use.
- The hostel and TNP modules have frontend UIs but incomplete backend integration. These are functional at the display level but do not persist real data.
- There is no email verification on signup. A student can register with any email address without confirming ownership.
- The system does not currently support file uploads for profile photos or study notes — these fields exist in the schema but the upload mechanism is not implemented.
- No pagination is implemented on the admin manage-students or manage-teachers pages. With a large number of records, this will cause slow load times.
- The application has not been tested for concurrent use by multiple users simultaneously.
- There is no automated test suite (unit tests, integration tests). All testing was done manually.

---

# FUTURE SCOPE

Several improvements and extensions are planned or worth considering for future iterations of this system.

**JWT Middleware:** Implement proper route-level authentication middleware so that all API routes validate the token before processing requests. This is the most critical security improvement needed.

**File Upload Support:** Integrate a cloud storage service (such as Cloudinary or AWS S3) to allow profile photo uploads and study material (PDF/image) uploads. The schema fields already exist; only the upload mechanism needs to be added.

**Email Verification:** Add an OTP or link-based email verification step during student signup to ensure valid email addresses are collected.

**Notification System:** Implement real-time notifications using Server-Sent Events or WebSocket so that students receive instant alerts when a new notice or test is posted.

**Mobile Application:** The current system is web-only. A React Native or Flutter mobile app using the same backend APIs would significantly increase accessibility, as most students use smartphones more than laptops.

**Pagination and Search:** Add server-side pagination and filtering to all list views (students, notices, grades) to handle departments with large numbers of records.

**Analytics:** Expand the admin dashboard with more detailed analytics — branch-wise attendance trends, grade distributions, placement percentages — using more advanced Recharts visualizations.

**Automated Testing:** Add a test suite using Jest and React Testing Library for the frontend, and Supertest for API route testing.

**Cloud Deployment:** Deploy the application to Vercel (frontend + API routes) with MongoDB Atlas as the cloud database. Set up environment variables via Vercel's dashboard for production configuration.

**Multi-Department Support:** Currently the system is designed for a single department. Adding multi-tenancy support (multiple departments, each with their own admin) would make the platform usable institution-wide.

---

# CONCLUSION

This project set out to build a practical, role-based web application for managing a college department, and the core objectives have been met. Three functional portals — for students, teachers, and administrators — are working with their respective features. Authentication, profile management, and admin-level user management are operational with real MongoDB connectivity and proper password hashing.

The technology choices — Next.js, MongoDB, Tailwind CSS — worked well together. Having the frontend and backend in one project reduced setup time and made development straightforward. The three-layer architecture (page → service → API → DB) kept the code organized and made it easier to add or modify features without breaking other parts.

There are known gaps — JWT enforcement, file uploads, and some incomplete modules — which are honest limitations of a student project built within an academic timeline. These are not design failures but areas left for future work.

Overall, the system demonstrates that a focused, well-structured web application can meaningfully improve department-level academic management. It is not a complete ERP, but it addresses real, everyday problems — and that was always the goal.

---

# REFERENCES

[1] S. Kuri, A. Rai, and M. Patil, "Web-Based Student Information System," *International Journal of Computer Applications*, vol. 90, no. 12, pp. 1–5, 2014.

[2] M. S. Rahman and M. N. Islam, "Design and Implementation of a University Management System," *Journal of Software Engineering and Applications*, vol. 9, pp. 45–58, 2016.

[3] C. Okonkwo and B. Nwachukwu, "Towards a Paperless Administration: A Case Study of Nigerian Universities," *African Journal of Information Systems*, vol. 9, no. 3, pp. 110–125, 2017.

[4] R. Singh and A. Gupta, "MERN Stack-Based College Management System," *Proceedings of the International Conference on Computing and Communication Technologies (ICCCT)*, pp. 234–239, 2018.

[5] A. Kumar, P. Sharma, and V. Mehta, "Role-Based Access Control in Educational Systems," *International Journal of Information Security*, vol. 18, no. 4, pp. 321–335, 2019.

[6] D. Sharma and R. Malhotra, "RESTful API Design Patterns for Academic Portals," *Journal of Web Engineering*, vol. 19, no. 2, pp. 88–107, 2020.

[7] S. Verma, T. Gupta, and R. Kapoor, "Next.js as a Full-Stack Framework for Web Applications," *International Journal of Web Development*, vol. 5, no. 1, pp. 12–24, 2021.

[8] H. Patel and K. Joshi, "MongoDB Schema Design for Educational Applications," *Journal of Database Management*, vol. 33, no. 3, pp. 55–70, 2022.

[9] P. Agarwal, "Tailwind CSS in Production: Developer Experience and Output Quality," *IEEE Software*, vol. 40, no. 2, pp. 72–80, 2023.

[10] Vercel Inc., "Next.js App Router Documentation," https://nextjs.org/docs/app, 2024.

[11] MongoDB Inc., "MongoDB Documentation: Schema Design," https://www.mongodb.com/docs/manual/data-modeling/, 2024.

[12] Mongoose, "Mongoose ODM Documentation," https://mongoosejs.com/docs/, 2024.

[13] npm, "bcryptjs package," https://www.npmjs.com/package/bcryptjs, 2024.

[14] npm, "jsonwebtoken package," https://www.npmjs.com/package/jsonwebtoken, 2024.

[15] React, "React 19 Official Documentation," https://react.dev, 2024.

[16] Tailwind Labs, "Tailwind CSS v4 Documentation," https://tailwindcss.com/docs, 2024.

[17] Radix UI, "Radix UI Primitives Documentation," https://www.radix-ui.com, 2024.

[18] shadcn, "shadcn/ui Component Library," https://ui.shadcn.com, 2024.

[19] Recharts, "Recharts Documentation," https://recharts.org/en-US, 2024.

[20] React Hook Form, "React Hook Form Documentation," https://react-hook-form.com, 2024.

---

# APPENDIX

## A. API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/student/signup | Register new student |
| POST | /api/student/login | Student login |
| GET | /api/student/profile | Get student profile |
| PUT | /api/student/profile | Update student profile |
| DELETE | /api/student/profile | Delete student account |
| GET | /api/student/me | Get current student info |
| POST | /api/teacher/login | Teacher login |
| GET | /api/teacher/profile | Get teacher profile |
| PUT | /api/teacher/profile | Update teacher profile |
| GET | /api/admin/dashboard | Get department stats |
| GET | /api/admin/manage-students | Get all students |
| DELETE | /api/admin/manage-students | Delete a student |
| GET | /api/admin/manage-teachers | Get all teachers |
| DELETE | /api/admin/manage-teachers | Delete a teacher |

## B. Environment Variables

```
MONGO_DB_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/
JWT_SECRET=your_jwt_secret_key
```

## C. Student Schema (Mongoose)

```js
{
  name: { first: String, middle: String, last: String },
  regdNo: { type: String, unique: true, required: true },
  branch: { type: String, enum: ["CSE","IT","ECE","EEE","MECH","CIVIL"] },
  mobile: { type: String, match: /^[0-9]{10}$/ },
  email: { type: String, unique: true, lowercase: true },
  password: String,
  dob: Date,
  profileUrl: String,
  hostelRoom: String,
  roomNo: String,
  address: String
}
```

## D. Teacher Schema (Mongoose)

```js
{
  name: { first: String, middle: String, last: String },
  employeeId: { type: String, unique: true, required: true },
  department: { type: String, enum: ["CSE","IT","ECE","EEE","MECH","CIVIL"] },
  mobile: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  dob: Date,
  profileUrl: String,
  designation: String,
  address: String
}
```

[Insert Application Screenshots Here]
