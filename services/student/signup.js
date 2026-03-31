
import { httpaxious } from "@/helper/httphelper";

export async function Signupstudent(data) {
  const result = await httpaxious.post("/api/student/signup", data).then((response) => response.data);
  return result
}