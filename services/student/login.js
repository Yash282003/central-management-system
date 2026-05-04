import { httpaxious } from "@/helper/httphelper";

export async function Loginstudent(data) {
  const result = await httpaxious
    .post("/api/student/login", data)
    .then((response) => response.data);

  console.log("LOGIN RESPONSE:", result); // 🔍 DEBUG

  if (result?.success && result?.token) {
    localStorage.setItem("token", result.token); // ✅ STORE HERE
    console.log("TOKEN STORED:", result.token);
  } else {
    console.log("TOKEN NOT FOUND ❌");
  }

  return result;
}