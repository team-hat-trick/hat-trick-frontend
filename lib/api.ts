import axios from "axios";

const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_FOOTBALL_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "x-apisports-key": process.env.NEXT_PUBLIC_FOOTBALL_API_KEY,
  },
} as const;

export const apiClient = axios.create(API_CONFIG);
