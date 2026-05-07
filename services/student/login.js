import { httpaxious } from "@/helper/httphelper";

export async function Loginstudent(data) {
  const result = await httpaxious
    .post("/api/student/login", data, { withCredentials: true })
    .then((response) => response.data);
  return result;
}
