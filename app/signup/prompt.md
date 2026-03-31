# 🎯 Task: Generate Student Signup Page (Frontend Only)

## 📌 Objective
Create a **modern, clean, and professional Student Signup Page UI** for a Department Management System.

⚠️ Important:
- Only generate **frontend code (React / Next.js preferred)**
- **NO backend, NO API, NO database logic**
- Use **static/mock data where needed**
- Focus on **UI + form validation + interactivity**

---

## 🎨 Design Requirements
- Clean, formal, and presentable design (not flashy)
- Use proper spacing, typography, and alignment
- Responsive (desktop + tablet + mobile)
- Card-based centered form layout
- Subtle shadows and rounded corners
- Light/Dark mode support (optional but preferred)

---

## 🧾 Form Fields (Based on Schema)

### 👤 Name Section
- First Name (required)
- Middle Name (optional)
- Last Name (required)

### 🎓 Academic Info
- Registration Number (required, unique)
- Branch (dropdown)
  - Options: CSE, IT, ECE, EEE, MECH, CIVIL

### 📞 Contact Info
- Mobile Number (required, 10-digit validation)
- Email (required, proper email validation)

### 🔐 Authentication
- Password (required)
- Confirm Password

### 🎂 Personal Info
- Date of Birth (date picker)

### 🖼 Profile
- Profile Image URL (optional input OR file upload UI)

### 🏠 Address
- Address (textarea)

---

## ⚙️ Functional Requirements

- Real-time form validation:
  - Required fields
  - Email format
  - Mobile number (10 digits)
  - Password match
- Show error messages below inputs
- Disable submit button until valid
- On submit:
  - Show success message (mock, no API)
- Include:
  - "Already have an account? Login" link
  - Password visibility toggle
  - Loading state on submit button

---

## 🧩 UI Components to Include

- Navbar (simple, with app name/logo)
- Centered signup card
- Input fields with icons (optional)
- Dropdown for branch
- Date picker
- File upload or image URL input
- Submit button
- Footer (optional)

---

## 🛠 Tech Stack

- React / Next.js (App Router preferred)
- Tailwind CSS for styling
- Use functional components and hooks
- Clean, modular code structure

---

## 🚫 Restrictions

- Do NOT include:
  - Backend code
  - API calls
  - Database logic
  - Authentication logic

---

## ✅ Output Expected

- Fully working frontend page
- Proper validation and UX
- Clean, readable, production-like code
- Ready to integrate with backend later

---

## 💡 Bonus (Optional Enhancements)

- Animated transitions (Framer Motion)
- Step-based form (multi-step UI)
- Profile image preview before upload
- Toast notifications for success
