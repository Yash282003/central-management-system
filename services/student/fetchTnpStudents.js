import { httpaxious } from "@/helper/httphelper";

/**
 * Fetch TNP students with server-side search, filter, and pagination.
 *
 * @param {object} params
 * @param {string} [params.search]   - Name or regdNo search string
 * @param {string} [params.branch]   - Branch filter ("ALL" or e.g. "CSE")
 * @param {string} [params.status]   - Status filter ("ALL" | "PLACED" | "UNPLACED" | "INELIGIBLE")
 * @param {number} [params.page]     - Page number (default 1)
 * @param {number} [params.limit]    - Page size (default 10)
 */
export async function fetchTnpStudents({ search = "", branch = "ALL", status = "ALL", page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams();

  if (search)              params.set("search", search);
  if (branch !== "ALL")    params.set("branch", branch);
  if (status !== "ALL")    params.set("status", status);
  params.set("page",  String(page));
  params.set("limit", String(limit));

  const result = await httpaxious
    .get(`/api/tnp/students?${params.toString()}`)
    .then((res) => res.data);

  return result;
}
