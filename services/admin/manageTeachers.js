
import { httpaxious } from "@/helper/httphelper";

export async function getAllTeachers() {
  const result = await httpaxious
    .get("/api/admin/manage-teachers")
    .then((response) => response.data);
  return result;
}

export async function deleteTeacherById(id) {
  const result = await httpaxious
    .delete(`/api/admin/manage-teachers?id=${id}`)
    .then((response) => response.data);
  return result;
}
