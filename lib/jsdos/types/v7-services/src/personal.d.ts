import { S3BucketName, S3BucketKey, S3BucketUrl } from './s3Types';

export const UPLOADS_S3_BUCKET: S3BucketName = "doszone-uploads";

export function generatePersonalBundleS3Key(namespace: string, id: string, bundleUrl: string, publishToken?: string): S3BucketKey {
  // implementation here
}

export function generatePersonalBundleS3Url(namespace: string, id: string, bundleUrl: string, publishToken?: string): S3BucketUrl {
  // implementation here
}


export type S3BucketName = string;
export type S3BucketKey = string;
export type S3BucketUrl = string;
