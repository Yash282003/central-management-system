import { httpaxious } from "@/helper/httphelper";

// Fetch all company drive listings
// Optional query params: category (e.g. "Dream"), branch (e.g. "CSE")
export async function fetchCompanies({ category, branch } = {}) {
  const params = new URLSearchParams();

  if (category) params.append("category", category);
  if (branch) params.append("branch", branch);

  const query = params.toString() ? `?${params.toString()}` : "";

  const result = await httpaxious
    .get(`/api/tnp/companies${query}`)
    .then((response) => response.data);

    console.log('Result is ', result)
  return result;
}
