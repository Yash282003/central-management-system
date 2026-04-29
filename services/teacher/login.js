
import { httpaxious } from "@/helper/httphelper";

export async function Loginteacher(data) {
  const result = await httpaxious
    .post("/api/teacher/login", data)
    .then((response) => response.data);
  return result;
}
