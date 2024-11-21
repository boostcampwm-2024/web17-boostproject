import { randomUUID } from 'node:crypto';
import * as dotenv from 'dotenv';

dotenv.config();
type none = 'none';
export const sessionConfig = {
  secret: process.env.COOKIE_SECRET || randomUUID().toString(),
  resave: false,
  saveUninitialized: false,
  name: process.env.COOKIE_NAME,
  cookie: {
    maxAge: Number(process.env.COOKIE_MAX_AGE),
    httpOnly: true,
    secure: true,
    domain: 'juchum.info',
    sameSite: 'none' as none,
  },
};
