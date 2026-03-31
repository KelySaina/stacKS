import {
  CopyObjectCommand,
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MinioService {
  private readonly client: S3Client;

  constructor() {
    const endpoint = `${process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'}://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`;

    this.client = new S3Client({
      endpoint,
      forcePathStyle: true,
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY ?? 'minioadmin',
        secretAccessKey: process.env.MINIO_SECRET_KEY ?? 'minioadmin',
      },
    });
  }

  async ensureBucket(bucket: string) {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: bucket }));
    } catch {
      await this.client.send(new CreateBucketCommand({ Bucket: bucket }));
    }
  }

  async deleteBucket(bucket: string) {
    const listed = await this.client.send(new ListObjectsV2Command({ Bucket: bucket }));
    const objects = listed.Contents ?? [];

    for (const object of objects) {
      if (object.Key) {
        await this.client.send(new DeleteObjectCommand({ Bucket: bucket, Key: object.Key }));
      }
    }

    await this.client.send(new DeleteBucketCommand({ Bucket: bucket }));
  }

  async uploadObject(bucket: string, key: string, body: Buffer, contentType: string) {
    await this.client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  }

  async copyObject(bucket: string, sourceKey: string, targetKey: string) {
    await this.client.send(
      new CopyObjectCommand({
        Bucket: bucket,
        Key: targetKey,
        CopySource: `${bucket}/${sourceKey}`,
      }),
    );
  }

  async deleteObject(bucket: string, key: string) {
    await this.client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  }

  async getDownloadUrl(bucket: string, key: string, expiresIn = 3600) {
    return getSignedUrl(
      this.client,
      new GetObjectCommand({ Bucket: bucket, Key: key }),
      { expiresIn },
    );
  }

  async getUploadUrl(bucket: string, key: string, contentType: string, expiresIn = 900) {
    return getSignedUrl(
      this.client,
      new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
      { expiresIn },
    );
  }
}