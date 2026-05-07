import { httpaxious } from "@/helper/httphelper";

export async function Loginadmin(data) {
  const result = await httpaxious
    .post("/api/admin/login", data, { withCredentials: true })
    .then((response) => response.data);
  return result;
}
