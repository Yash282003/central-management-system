
import { httpaxious } from "@/helper/httphelper";

export async function getTeacherProfile(email) {
  const result = await httpaxious
    .get(`/api/teacher/profile?email=${email}`)
    .then((response) => response.data);
  return result;
}

export async function updateTeacherProfile(data) {
  const result = await httpaxious
    .put("/api/teacher/profile", data)
    .then((response) => response.data);
  return result;
}

export async function deleteTeacherProfile(email) {
  const result = await httpaxious
    .delete(`/api/teacher/profile?email=${email}`)
    .then((response) => response.data);
  return result;
}
