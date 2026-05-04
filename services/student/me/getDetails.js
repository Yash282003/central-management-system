import { httpaxious } from "@/helper/httphelper";

export async function getDetails() {
  const token = localStorage.getItem("token");

  console.log("TOKEN IN getDetails:", token); // 👈 ADD

  const result = await httpaxious.get("/api/student/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return result.data;
}