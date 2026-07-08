import { r2 } from '@/lib/r2';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    const bucket = process.env.R2_BUCKET_NAME;
    if (!bucket) {
      return NextResponse.json({ error: 'Bucket not configured' }, { status: 500 });
    }

    const command = new ListObjectsV2Command({ Bucket: bucket });
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

    const files = allObjects.map(obj => {
      const ext = obj.Key?.split('.').pop()?.toLowerCase();
      let type = 'Document';
      if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) {
        type = 'Image';
      }

      return {
        id: obj.Key,
        name: obj.Key,
        type: type,
        size: obj.Size || 0,
        url: `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${obj.Key?.split('/').map(encodeURIComponent).join('/')}`,
        created_at: obj.LastModified?.toISOString(),
      };
    });

    files.sort((a, b) => {
      if (!a.created_at || !b.created_at) return 0;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return NextResponse.json(files);
  } catch (error: any) {
    console.error('Failed to list files:', error);
    return NextResponse.json({ error: 'Failed to list files', details: error.message, stack: error.stack }, { status: 500 });
  }
}
