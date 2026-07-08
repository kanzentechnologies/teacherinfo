import { r2 } from '@/lib/r2';
import { CopyObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { oldKey, newKey, isFolder } = await request.json();
    const bucket = process.env.R2_BUCKET_NAME;

    if (!bucket || !oldKey || !newKey) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    if (isFolder) {
      const command = new ListObjectsV2Command({ Bucket: bucket, Prefix: `${oldKey}/` });
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
        const newObjKey = obj.Key.replace(`${oldKey}/`, `${newKey}/`);
        const encodedSource = `${bucket}/${obj.Key.split('/').map(encodeURIComponent).join('/')}`;
        
        await r2.send(new CopyObjectCommand({
          Bucket: bucket,
          CopySource: encodedSource,
          Key: newObjKey,
        }));
        
        await r2.send(new DeleteObjectCommand({
          Bucket: bucket,
          Key: obj.Key,
        }));
      }
    } else {
      const encodedSource = `${bucket}/${oldKey.split('/').map(encodeURIComponent).join('/')}`;
      await r2.send(new CopyObjectCommand({
        Bucket: bucket,
        CopySource: encodedSource,
        Key: newKey,
      }));
      
      await r2.send(new DeleteObjectCommand({
        Bucket: bucket,
        Key: oldKey,
      }));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to rename:', error);
    return NextResponse.json({ error: 'Failed to rename' }, { status: 500 });
  }
}
