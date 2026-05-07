import { httpaxious } from "@/helper/httphelper";

export async function getTeacherDetails() {
  const result = await httpaxious.get("/api/teacher/me", { withCredentials: true });
  return result.data;
}
