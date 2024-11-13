import { randomUUID } from 'node:crypto';
import * as dotenv from 'dotenv';

dotenv.config();

export const sessionConfig = {
  secret: process.env.COOKIE_SECRET || randomUUID().toString(),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: Number(process.env.COOKIE_MAX_AGE),
  },
};
