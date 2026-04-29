
import { httpaxious } from "@/helper/httphelper";

export async function getStudentProfile(email) {
  const result = await httpaxious
    .get(`/api/student/profile?email=${email}`)
    .then((response) => response.data);
  return result;
}

export async function updateStudentProfile(data) {
  const result = await httpaxious
    .put("/api/student/profile", data)
    .then((response) => response.data);
  return result;
}

export async function deleteStudentProfile(email) {
  const result = await httpaxious
    .delete(`/api/student/profile?email=${email}`)
    .then((response) => response.data);
  return result;
}
