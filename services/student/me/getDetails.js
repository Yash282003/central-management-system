import { httpaxious } from "@/helper/httphelper";

export async function getDetails() {
  const result = await httpaxious.get("/api/student/me", { withCredentials: true });
  return result.data;
}
