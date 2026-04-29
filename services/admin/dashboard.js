
import { httpaxious } from "@/helper/httphelper";

export async function getDashboardStats() {
  const result = await httpaxious
    .get("/api/admin/dashboard")
    .then((response) => response.data);
  return result;
}
