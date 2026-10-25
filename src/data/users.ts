import { env } from '../utils/env';

export interface Credentials {
  username: string;
  password: string;
}

export const users = {
  standard: { username: env.users.standard, password: env.password },
  locked: { username: env.users.locked, password: env.password },
  problem: { username: env.users.problem, password: env.password },
} satisfies Record<string, Credentials>;

export const errorMessages = {
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  firstNameRequired: 'Error: First Name is required',
  lastNameRequired: 'Error: Last Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
} as const;
