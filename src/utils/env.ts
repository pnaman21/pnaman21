import dotenv from 'dotenv';

dotenv.config();

const get = (key: string, fallback: string): string => process.env[key] ?? fallback;

export const env = {
  baseUrl: get('BASE_URL', 'https://www.saucedemo.com'),
  apiBaseUrl: get('API_BASE_URL', 'https://restful-booker.herokuapp.com'),
  apiUsername: get('API_USERNAME', 'admin'),
  apiPassword: get('API_PASSWORD', 'password123'),
  password: get('USER_PASSWORD', 'secret_sauce'),
  users: {
    standard: get('STANDARD_USER', 'standard_user'),
    locked: get('LOCKED_USER', 'locked_out_user'),
    problem: get('PROBLEM_USER', 'problem_user'),
  },
} as const;
