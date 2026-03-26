import 'dotenv/config';

export const env = {
    NODE_ENV : process.env.NODE_ENV ?? 'development',
    PORT : process.env.PORT ?? 3000,
    VERIFY_TOKEN : process.env.VERIFY_TOKEN || '',
    OPENAI_API_KEY : process.env.OPENAI_API_KEY || '',
    JWT_SECRET : process.env.JWT_SECRET || '',
    JWT_REFRESH_SECRET : process.env.JWT_REFRESH_SECRET || '',
    DB_URL_PRISMA : process.env.DB_URL_PRISMA || '',
    FIRMA_ACCESS_TOKEN : process.env.FIRMA_ACCESS_TOKEN,
    FIRMA_REFRESH_TOKEN : process.env.FIRMA_REFRESH_TOKEN,
}