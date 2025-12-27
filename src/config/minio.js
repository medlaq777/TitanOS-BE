import { Client } from 'minio';

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT ?? 'localhost',
  port: parseInt(process.env.MINIO_PORT ?? '9000', 10),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY ?? 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY ?? 'minioadmin',
});

export const MEDIA_BUCKET = process.env.MINIO_BUCKET ?? 'titanos-media';

/**
 * Ensures the media bucket exists, creating it if necessary.
 */
export async function ensureBucket() {
  const exists = await minioClient.bucketExists(MEDIA_BUCKET);
  if (!exists) {
    await minioClient.makeBucket(MEDIA_BUCKET, process.env.MINIO_REGION ?? 'us-east-1');
  }
}

export default minioClient;
