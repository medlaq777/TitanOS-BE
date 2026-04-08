import "dotenv/config";

const config = {
  server: {
    port: Number.parseInt(process.env.PORT, 10) || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    corsOrigin: process.env.CORS_ORIGIN || "*",
  },
  db: {
    mongoUri: process.env.MONGODB_URI,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  },
  minio: {
    bucket: process.env.MINIO_BUCKET || "titan-bucket",
    region: process.env.MINIO_REGION || "us-east-1",
    client: {
      endPoint: process.env.MINIO_ENDPOINT || "localhost",
      port: Number.parseInt(process.env.MINIO_PORT, 10) || 9000,
      useSSL: process.env.MINIO_USE_SSL === "true",
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    }
  },
  media: {
    objectKeySecret: process.env.MEDIA_OBJECT_KEY_SECRET,
    maxFileSize: Number.parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760, // 10MB
  }
};

export default config;