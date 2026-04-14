const Minio = require('minio');
const { randomUUID } = require('crypto');
require('dotenv').config();

const client = new Minio.Client({
  endPoint:  process.env.MINIO_ENDPOINT,
  port:      parseInt(process.env.MINIO_PORT || '443'),
  useSSL:    process.env.MINIO_USE_SSL !== 'false',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const BUCKET = process.env.MINIO_BUCKET || 'diary';

async function ensureBucket() {
  const exists = await client.bucketExists(BUCKET);
  if (!exists) await client.makeBucket(BUCKET);
}

async function uploadFile(buffer, mimetype, originalname) {
  const ext = originalname.split('.').pop() || 'jpg';
  const key = `${randomUUID()}.${ext}`;
  await client.putObject(BUCKET, key, buffer, buffer.length, { 'Content-Type': mimetype });
  const url = `${process.env.MINIO_PUBLIC_URL}/${BUCKET}/${key}`;
  return { key, url };
}

async function deleteFile(key) {
  await client.removeObject(BUCKET, key);
}

module.exports = { ensureBucket, uploadFile, deleteFile };
