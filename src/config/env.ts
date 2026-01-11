import 'dotenv/config';

export const env = {
    NODE_ENV : process.env.NODE_ENV ?? 'development',
    PORT : process.env.PORT ?? 3000,
    DB_HOST : process.env.DB_HOST ?? 'localhost',
    DB_USER : process.env.DB_USER ?? 'root',
    DB_PASS : process.env.DB_PASS ?? '',
    DB_NAME : process.env.DB_NAME ?? 'empenosysdb',
    DB_PORT : process.env.DB_PORT ?? 3306,
    FIRMA_ACCESS_TOKEN : process.env.FIRMA_ACCESS_TOKEN ?? '',
    ACCESS_TOKEN_DURATION : process.env.ACCESS_TOKEN_DURATION ?? '15Min',
    FIRMA_REFRESH_TOKEN : process.env.FIRMA_REFRESH_TOKEN ?? '',
    REFRESH_TOKEN_DURATION : process.env.REFRESH_TOKEN_DURATION ?? '7Days',
}