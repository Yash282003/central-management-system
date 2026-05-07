import { httpaxious } from "@/helper/httphelper";

export async function getAdminDetails() {
  const result = await httpaxious.get("/api/admin/me", { withCredentials: true });
  return result.data;
}
