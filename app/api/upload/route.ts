import { r2 } from '@/lib/r2';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const body = new Uint8Array(arrayBuffer);
    
    const fullPath = formData.get('fullPath') as string | null;
    let finalKey = '';
    if (fullPath && fullPath.includes('/')) {
      const parts = fullPath.split('/');
      const originalName = parts.pop() || file.name;
      const safeName = originalName.replace(/[^a-zA-Z0-9.\s-()_]/g, '_');
      const safePath = parts.map(p => p.replace(/[^a-zA-Z0-9.\s-()_]/g, '_')).join('/');
      finalKey = `${safePath}/${safeName}`;
    } else {
      finalKey = file.name.replace(/[^a-zA-Z0-9.\s-()_]/g, '_');
    }

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: finalKey,
        Body: body,
        ContentType: file.type,
      })
    );

    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${finalKey.split('/').map(encodeURIComponent).join('/')}`;

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}
