
import { httpaxious } from "@/helper/httphelper";

export async function getAllStudents() {
  const result = await httpaxious
    .get("/api/admin/manage-students")
    .then((response) => response.data);
  return result;
}

export async function deleteStudentById(id) {
  const result = await httpaxious
    .delete(`/api/admin/manage-students?id=${id}`)
    .then((response) => response.data);
  return result;
}
