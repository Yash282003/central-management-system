// Mock data for the Department Management System

export const departments = [
  { id: 1, name: "Computer Science", code: "CS", head: "Dr. Sarah Johnson", students: 245 },
  { id: 2, name: "Electrical Engineering", code: "EE", head: "Dr. Michael Chen", students: 189 },
  { id: 3, name: "Mechanical Engineering", code: "ME", head: "Dr. Robert Smith", students: 201 },
];

export const currentUser = {
  student: {
    id: "CS2021001",
    name: "Alex Morgan",
    email: "alex.morgan@university.edu",
    department: "Computer Science",
    semester: 6,
    cgpa: 3.78,
    avatar: "AM"
  },
  teacher: {
    id: "TCH001",
    name: "Dr. Emily Carter",
    email: "emily.carter@university.edu",
    department: "Computer Science",
    designation: "Associate Professor",
    avatar: "EC"
  },
  admin: {
    id: "ADM001",
    name: "John Williams",
    email: "john.williams@university.edu",
    role: "Department Administrator",
    avatar: "JW"
  }
};

export const notifications = [
  { id: 1, title: "New Assignment Posted", message: "Data Structures assignment due next week", category: "academic", time: "5 min ago", read: false },
  { id: 2, title: "Semester Results", message: "Your semester results are now available", category: "academic", time: "2 hours ago", read: false },
  { id: 3, title: "Campus Event", message: "Tech fest registration opens tomorrow", category: "alert", time: "1 day ago", read: true },
  { id: 4, title: "Fee Payment Reminder", message: "Last date to pay fees: March 31", category: "alert", time: "2 days ago", read: true },
  { id: 5, title: "New Message", message: "Dr. Carter sent you a message", category: "message", time: "3 days ago", read: true },
];
type Priority = "high" | "medium" | "low";

export const notices: {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: Priority;
  author: string;
}[] = [
  { id: 1, title: "Mid-Semester Exam Schedule", content: "Mid-semester exams will be conducted from April 10-20, 2026", date: "2026-03-28", priority: "high", author: "Admin Office" },
  { id: 2, title: "Workshop on Machine Learning", content: "Join us for an intensive ML workshop this Saturday", date: "2026-03-27", priority: "medium", author: "Dr. Sarah Johnson" },
  { id: 3, title: "Holiday Notice", content: "University will remain closed on April 1st", date: "2026-03-25", priority: "low", author: "Admin Office" },
  { id: 4, title: "Project Submission Deadline", content: "Final year projects must be submitted by April 15", date: "2026-03-24", priority: "high", author: "HOD Office" },
  { id: 5, title: "Guest Lecture Series", content: "Industry experts will deliver talks on emerging technologies", date: "2026-03-22", priority: "medium", author: "Dr. Michael Chen" },
];

export const studentGrades = [
  { id: 1, course: "Data Structures", code: "CS301", credits: 4, grade: "A", gpa: 4.0, semester: 5 },
  { id: 2, course: "Algorithm Design", code: "CS302", credits: 4, grade: "A-", gpa: 3.7, semester: 5 },
  { id: 3, course: "Database Systems", code: "CS303", credits: 3, grade: "B+", gpa: 3.3, semester: 5 },
  { id: 4, course: "Computer Networks", code: "CS304", credits: 3, grade: "A", gpa: 4.0, semester: 5 },
  { id: 5, course: "Operating Systems", code: "CS305", credits: 4, grade: "A-", gpa: 3.7, semester: 5 },
];

export const attendance = [
  { id: 1, course: "Data Structures", code: "CS301", attended: 28, total: 30, percentage: 93.3 },
  { id: 2, course: "Algorithm Design", code: "CS302", attended: 26, total: 30, percentage: 86.7 },
  { id: 3, course: "Database Systems", code: "CS303", attended: 27, total: 28, percentage: 96.4 },
  { id: 4, course: "Computer Networks", code: "CS304", attended: 25, total: 28, percentage: 89.3 },
  { id: 5, course: "Operating Systems", code: "CS305", attended: 29, total: 30, percentage: 96.7 },
];

export const tests = [
  { id: 1, title: "Data Structures Quiz 2", course: "CS301", date: "2026-04-05", duration: "30 min", totalMarks: 20, status: "upcoming" },
  { id: 2, title: "Algorithm Analysis Test", course: "CS302", date: "2026-04-08", duration: "45 min", totalMarks: 25, status: "upcoming" },
  { id: 3, title: "Database Design Quiz", course: "CS303", date: "2026-03-28", duration: "30 min", totalMarks: 15, status: "completed", obtained: 13 },
  { id: 4, title: "Networking Concepts", course: "CS304", date: "2026-03-25", duration: "40 min", totalMarks: 20, status: "completed", obtained: 18 },
];

export const polls = [
  { id: 1, title: "Preferred Time for Extra Classes", options: ["Morning (8-10 AM)", "Afternoon (2-4 PM)", "Evening (4-6 PM)"], votes: [45, 32, 58], totalVotes: 135, status: "active", endDate: "2026-04-01" },
  { id: 2, title: "Tech Stack for Final Project", options: ["React + Node", "Angular + Java", "Vue + Python"], votes: [78, 34, 23], totalVotes: 135, status: "closed", endDate: "2026-03-20" },
];

export const students = [
  { id: "CS2021001", name: "Alex Morgan", email: "alex.morgan@university.edu", semester: 6, cgpa: 3.78, attendance: 92.5, status: "active" },
  { id: "CS2021002", name: "Emma Wilson", email: "emma.wilson@university.edu", semester: 6, cgpa: 3.92, attendance: 95.8, status: "active" },
  { id: "CS2021003", name: "James Brown", email: "james.brown@university.edu", semester: 6, cgpa: 3.45, attendance: 87.3, status: "active" },
  { id: "CS2021004", name: "Sophia Davis", email: "sophia.davis@university.edu", semester: 6, cgpa: 3.88, attendance: 94.2, status: "active" },
  { id: "CS2021005", name: "Oliver Martinez", email: "oliver.martinez@university.edu", semester: 6, cgpa: 3.23, attendance: 78.5, status: "warning" },
  { id: "CS2021006", name: "Ava Anderson", email: "ava.anderson@university.edu", semester: 6, cgpa: 4.00, attendance: 98.0, status: "active" },
  { id: "CS2021007", name: "William Taylor", email: "william.taylor@university.edu", semester: 6, cgpa: 3.67, attendance: 91.0, status: "active" },
  { id: "CS2021008", name: "Isabella Thomas", email: "isabella.thomas@university.edu", semester: 6, cgpa: 3.55, attendance: 88.7, status: "active" },
];

export const facultyMembers = [
  { id: "TCH001", name: "Dr. Emily Carter", email: "emily.carter@university.edu", designation: "Associate Professor", specialization: "Machine Learning", experience: 12, status: "active" },
  { id: "TCH002", name: "Dr. Robert Chen", email: "robert.chen@university.edu", designation: "Professor", specialization: "Data Science", experience: 18, status: "active" },
  { id: "TCH003", name: "Dr. Lisa Anderson", email: "lisa.anderson@university.edu", designation: "Assistant Professor", specialization: "Computer Networks", experience: 7, status: "active" },
  { id: "TCH004", name: "Dr. Michael Roberts", email: "michael.roberts@university.edu", designation: "Associate Professor", specialization: "Software Engineering", experience: 10, status: "active" },
];

export const courses = [
  { id: "CS301", name: "Data Structures", credits: 4, semester: 5, instructor: "Dr. Emily Carter", enrolled: 85, capacity: 100 },
  { id: "CS302", name: "Algorithm Design", credits: 4, semester: 5, instructor: "Dr. Robert Chen", enrolled: 78, capacity: 100 },
  { id: "CS303", name: "Database Systems", credits: 3, semester: 5, instructor: "Dr. Lisa Anderson", enrolled: 92, capacity: 100 },
  { id: "CS304", name: "Computer Networks", credits: 3, semester: 5, instructor: "Dr. Michael Roberts", enrolled: 88, capacity: 100 },
  { id: "CS305", name: "Operating Systems", credits: 4, semester: 5, instructor: "Dr. Emily Carter", enrolled: 82, capacity: 100 },
];

export const publications = [
  { id: 1, title: "Advanced Machine Learning Techniques for Big Data", authors: "Dr. Emily Carter, Dr. Robert Chen", journal: "IEEE Transactions", year: 2025, citations: 45 },
  { id: 2, title: "Efficient Algorithms for Network Optimization", authors: "Dr. Lisa Anderson", journal: "ACM Computing Surveys", year: 2024, citations: 32 },
  { id: 3, title: "Software Design Patterns in Modern Applications", authors: "Dr. Michael Roberts", journal: "Journal of Software Engineering", year: 2024, citations: 28 },
  { id: 4, title: "Deep Learning Approaches for Computer Vision", authors: "Dr. Emily Carter", journal: "Nature Machine Intelligence", year: 2026, citations: 12 },
];

export const notes = [
  { id: 1, title: "Introduction to Data Structures", course: "CS301", uploadDate: "2026-03-15", type: "PDF", size: "2.4 MB", downloads: 125 },
  { id: 2, title: "Sorting Algorithms Explained", course: "CS301", uploadDate: "2026-03-18", type: "PDF", size: "1.8 MB", downloads: 98 },
  { id: 3, title: "Graph Theory Basics", course: "CS302", uploadDate: "2026-03-20", type: "PDF", size: "3.1 MB", downloads: 87 },
  { id: 4, title: "SQL Query Examples", course: "CS303", uploadDate: "2026-03-22", type: "PDF", size: "1.2 MB", downloads: 112 },
];

export const timetable = [
  { day: "Monday", slots: [
    { time: "9:00 - 10:00", course: "Data Structures", room: "CS-101", instructor: "Dr. Carter" },
    { time: "10:00 - 11:00", course: "Algorithm Design", room: "CS-102", instructor: "Dr. Chen" },
    { time: "11:00 - 12:00", course: "Break", room: "-", instructor: "-" },
    { time: "12:00 - 1:00", course: "Database Systems", room: "CS-103", instructor: "Dr. Anderson" },
  ]},
  { day: "Tuesday", slots: [
    { time: "9:00 - 10:00", course: "Computer Networks", room: "CS-104", instructor: "Dr. Roberts" },
    { time: "10:00 - 11:00", course: "Operating Systems", room: "CS-101", instructor: "Dr. Carter" },
    { time: "11:00 - 12:00", course: "Break", room: "-", instructor: "-" },
    { time: "12:00 - 1:00", course: "Lab Session", room: "Lab-1", instructor: "TAs" },
  ]},
  { day: "Wednesday", slots: [
    { time: "9:00 - 10:00", course: "Data Structures", room: "CS-101", instructor: "Dr. Carter" },
    { time: "10:00 - 11:00", course: "Algorithm Design", room: "CS-102", instructor: "Dr. Chen" },
    { time: "11:00 - 12:00", course: "Break", room: "-", instructor: "-" },
    { time: "12:00 - 1:00", course: "Database Systems", room: "CS-103", instructor: "Dr. Anderson" },
  ]},
  { day: "Thursday", slots: [
    { time: "9:00 - 10:00", course: "Computer Networks", room: "CS-104", instructor: "Dr. Roberts" },
    { time: "10:00 - 11:00", course: "Operating Systems", room: "CS-101", instructor: "Dr. Carter" },
    { time: "11:00 - 12:00", course: "Break", room: "-", instructor: "-" },
    { time: "12:00 - 1:00", course: "Lab Session", room: "Lab-1", instructor: "TAs" },
  ]},
  { day: "Friday", slots: [
    { time: "9:00 - 10:00", course: "Data Structures", room: "CS-101", instructor: "Dr. Carter" },
    { time: "10:00 - 11:00", course: "Project Work", room: "CS-102", instructor: "Various" },
    { time: "11:00 - 12:00", course: "Break", room: "-", instructor: "-" },
    { time: "12:00 - 1:00", course: "Seminar", room: "Auditorium", instructor: "Guest" },
  ]},
];

export const searchSuggestions = {
  students: ["Alex Morgan", "Emma Wilson", "James Brown", "Sophia Davis"],
  files: ["Data Structures Notes.pdf", "Algorithm Design Slides.pptx", "Database Assignment.doc"],
  notices: ["Mid-Semester Exam Schedule", "Workshop on Machine Learning", "Project Submission Deadline"],
  courses: ["Data Structures", "Algorithm Design", "Database Systems", "Computer Networks"],
};

export const statsData = {
  student: {
    totalCourses: 5,
    averageAttendance: 92.5,
    currentCGPA: 3.78,
    upcomingTests: 2,
  },
  teacher: {
    totalStudents: 245,
    activeCourses: 3,
    pendingAssignments: 12,
    avgClassAttendance: 88.5,
  },
  admin: {
    totalStudents: 245,
    totalFaculty: 18,
    activeCourses: 24,
    departmentRanking: 12,
  }
};
