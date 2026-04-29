# 🎯 Task: Generate Remaining Backend APIs for Department Management System

## 📌 Objective

Generate all **remaining backend APIs** for the Department Management System by strictly following the **existing architecture, structure, and coding style** already implemented (e.g., student signup API).

⚠️ Important:

* Maintain **exact same structure and conventions**
* Do NOT redesign or refactor existing code
* Ensure **consistency across all APIs**

---

## 🏗️ Project Architecture (STRICTLY FOLLOW)

The project follows a **3-layer architecture**:

```
Frontend (Pages / Components)
        ↓
Services Layer (/services)
        ↓
API Layer (/app/api)
        ↓
Database (MongoDB with Mongoose)
```

---

## 📂 Folder Structure (MANDATORY)

Follow this exact structure:

```
app/api/
  student/
    signup/
      route.ts
    login/
      route.ts
    profile/
      route.ts

  teacher/
    login/
      route.ts
    profile/
      route.ts

  admin/
    dashboard/
      route.ts
    manage-students/
      route.ts
    manage-teachers/
      route.ts

services/
  student/
    signup.ts
    login.ts
    profile.ts

  teacher/
    login.ts
    profile.ts

  admin/
    dashboard.ts
    manageStudents.ts
    manageTeachers.ts
```

---

## 🔁 Data Flow (DO NOT CHANGE)

```
Page → Service → API → Database
```

* Pages call **service functions**
* Services call **API routes**
* API routes interact with **MongoDB (Mongoose)**

---

## 🧾 Database Schema Reference (Student)

```json
{
  "name": {
    "first": "string",
    "middle": "string",
    "last": "string"
  },
  "regdNo": "string",
  "branch": "CSE | IT | ECE | EEE | MECH | CIVIL",
  "mobile": "string",
  "email": "string",
  "password": "string (hashed)",
  "dob": "date",
  "profileUrl": "string",
  "address": "string"
}
```

---

## 🔧 APIs TO IMPLEMENT

### 🎓 Student APIs

#### 1. Login API

* Endpoint: `/api/student/login`
* Method: POST
* Input: email, password
* Validate credentials
* Use bcrypt to compare password
* Return success or error response

---

#### 2. Get Profile API

* Endpoint: `/api/student/profile`
* Method: GET
* Fetch student data using email or ID
* Exclude password field

---

#### 3. Update Profile API

* Endpoint: `/api/student/profile`
* Method: PUT
* Allow updates:

  * name (object: first, middle, last)
  * mobile
  * address
  * profileUrl

---

#### 4. Delete Student API (Optional)

* Endpoint: `/api/student/profile`
* Method: DELETE
* Delete student safely

---

### 👨‍🏫 Teacher APIs

* Login API
* Get Profile API
* Update Profile API

(Structure same as student APIs)

---

### 🛠 Admin APIs

#### 1. Dashboard API

* Endpoint: `/api/admin/dashboard`
* Return:

  * total students
  * total teachers
  * basic stats (mock allowed)

#### 2. Manage Students API

* Get all students
* Delete student

#### 3. Manage Teachers API

* Get all teachers
* Delete teacher

---

## ⚙️ Backend Implementation Rules

* Use **Next.js App Router (route.ts)**
* Use **mongoose for DB operations**
* Use **bcryptjs for password hashing**
* Always:

  * Validate request body
  * Handle errors using try/catch
  * Return proper HTTP status codes

---

## 📦 API Response Format (STRICT)

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error format:

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## 🔌 Service Layer Rules

Each API must have a corresponding service function.

### Example:

```ts
export async function loginStudent(data) {
  const res = await fetch("/api/student/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
}
```

---

## 🧱 Code Consistency Rules

* Follow same naming conventions as existing signup API
* Use async/await (no promises chaining)
* Keep functions clean and modular
* Use same import style
* Keep folder naming consistent (lowercase)

---

## 🔐 Validation Rules

* Email format validation
* Mobile must be 10 digits
* Password must be hashed before saving
* Required fields must be checked

---

## 🚫 Restrictions

* Do NOT modify existing signup API
* Do NOT change schema structure
* Do NOT introduce new frameworks
* Do NOT use external auth systems (like NextAuth)
* Do NOT overcomplicate logic

---

## ✅ Output Requirements

The AI must generate:

* All `route.ts` API files
* All corresponding `/services` files
* Clean, working, production-ready code
* Proper folder structure
* Consistent coding style with existing code

---

## 💡 Bonus (Optional Enhancements)

* Reusable validation utility
* Common error handler
* Basic token-based auth placeholder (simple implementation only)

---

## 📌 Final Instruction

Ensure the generated code:

* Matches the existing signup API style
* Is easy to integrate with frontend
* Is clean, readable, and maintainable
* Follows best practices without overengineering

---
