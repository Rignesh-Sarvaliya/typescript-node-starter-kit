import 'dotenv/config';

export const env = {
  APP_ENV: process.env.NODE_ENV || 'development',
};

export const isProduction = env.APP_ENV === 'production';
export const isDevelopment = env.APP_ENV === 'development';
export const isTest = env.APP_ENV === 'test';
