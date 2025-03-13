import axios from "axios";

const API_URL = "https://laravel-cloud-sam-main-bdunom.laravel.cloud/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});
