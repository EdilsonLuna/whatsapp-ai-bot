import 'dotenv/config';

export const env = {
    NODE_ENV : process.env.NODE_ENV ?? 'development',
    PORT : process.env.PORT ?? 3000,
    VERIFY_TOKEN : process.env.VERIFY_TOKEN || '',
    OPENAI_API_KEY : process.env.OPENAI_API_KEY || ''
}