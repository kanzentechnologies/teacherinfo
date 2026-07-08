import { r2 } from '@/lib/r2';
import { DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  try {
    const { keys = [], folders = [] } = await request.json();
    const bucket = process.env.R2_BUCKET_NAME;

    if (!bucket) {
      return NextResponse.json({ error: 'Bucket not configured' }, { status: 500 });
    }

    // 1. Delete individual files
    for (const key of keys) {
      await r2.send(new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }));
    }

    // 2. Delete folders (which means all files with that prefix)
    for (const folder of folders) {
      const command = new ListObjectsV2Command({ Bucket: bucket, Prefix: `${folder}/` });
      let isTruncated = true;
      let continuationToken: string | undefined = undefined;
      const allObjects = [];

      while (isTruncated) {
        command.input.ContinuationToken = continuationToken;
        const response = await r2.send(command);
        if (response.Contents) {
          allObjects.push(...response.Contents);
        }
        isTruncated = response.IsTruncated ?? false;
        continuationToken = response.NextContinuationToken;
      }

      for (const obj of allObjects) {
        if (!obj.Key) continue;
        await r2.send(new DeleteObjectCommand({
          Bucket: bucket,
          Key: obj.Key,
        }));
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
