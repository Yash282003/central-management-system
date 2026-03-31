
import axios from "axios";

export const httpaxious=axios.create({
    baseURL:process.env.BASE_URL,
})