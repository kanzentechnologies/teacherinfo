/**
 * Lightweight R2/S3 client for Cloudflare Edge Runtime.
 * Uses native fetch() + Web Crypto API for AWS Signature V4.
 * No Node.js or browser-only APIs needed.
 */

function getEnv() {
  return {
    accountId: process.env.R2_ACCOUNT_ID || '',
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    bucket: process.env.R2_BUCKET_NAME || '',
    region: 'auto',
  };
}

// ---------- Web Crypto helpers ----------

async function hmacSha256(key: any, data: string): Promise<ArrayBuffer> {
  const cryptoKey =
    key instanceof CryptoKey
      ? key
      : await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(data));
}

async function sha256Hex(data: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ---------- SigV4 signer ----------

async function signRequest(
  method: string,
  url: URL,
  headers: Record<string, string>,
  body: string = '',
): Promise<Record<string, string>> {
  const env = getEnv();
  const now = new Date();
  const dateStr = now.toISOString().replace(/[:-]|\.\d{3}/g, '').slice(0, 8);
  const datetimeStr = now.toISOString().replace(/[:-]|\.\d{3}/g, '').slice(0, 15) + 'Z';

  const payloadHash = await sha256Hex(body);

  const allHeaders: Record<string, string> = {
    ...headers,
    host: url.host,
    'x-amz-date': datetimeStr,
    'x-amz-content-sha256': payloadHash,
  };

  const sortedHeaderKeys = Object.keys(allHeaders).sort();
  const canonicalHeaders = sortedHeaderKeys.map(k => `${k.toLowerCase()}:${allHeaders[k].trim()}`).join('\n') + '\n';
  const signedHeaders = sortedHeaderKeys.map(k => k.toLowerCase()).join(';');

  const canonicalQuery = url.searchParams.toString()
    .split('&')
    .sort()
    .join('&');

  const canonicalRequest = [
    method.toUpperCase(),
    url.pathname,
    canonicalQuery,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const scope = `${dateStr}/${env.region}/s3/aws4_request`;
  const stringToSign = ['AWS4-HMAC-SHA256', datetimeStr, scope, await sha256Hex(canonicalRequest)].join('\n');

  const kDate = await hmacSha256(new TextEncoder().encode(`AWS4${env.secretAccessKey}`), dateStr);
  const kRegion = await hmacSha256(kDate, env.region);
  const kService = await hmacSha256(kRegion, 's3');
  const kSigning = await hmacSha256(kService, 'aws4_request');
  const signature = toHex(await hmacSha256(kSigning, stringToSign));

  return {
    ...allHeaders,
    Authorization: `AWS4-HMAC-SHA256 Credential=${env.accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
}

// ---------- XML helpers (no DOMParser) ----------

function extractXmlValues(xml: string, tag: string): string[] {
  const results: string[] = [];
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'g');
  let m;
  while ((m = re.exec(xml)) !== null) {
    results.push(m[1]);
  }
  return results;
}

interface S3Object {
  Key: string;
  LastModified: string;
  Size: number;
}

function parseListObjectsResponse(xml: string): { objects: S3Object[]; isTruncated: boolean; nextContinuationToken?: string } {
  const objects: S3Object[] = [];
  const contentBlocks = extractXmlValues(xml, 'Contents');
  for (const block of contentBlocks) {
    const key = extractXmlValues(block, 'Key')[0] ?? '';
    const lastModified = extractXmlValues(block, 'LastModified')[0] ?? '';
    const size = parseInt(extractXmlValues(block, 'Size')[0] ?? '0', 10);
    if (key) objects.push({ Key: key, LastModified: lastModified, Size: size });
  }
  const isTruncated = extractXmlValues(xml, 'IsTruncated')[0]?.toLowerCase() === 'true';
  const nextContinuationToken = extractXmlValues(xml, 'NextContinuationToken')[0];
  return { objects, isTruncated, nextContinuationToken };
}

// ---------- Public API ----------

export async function r2ListAllObjects(prefix?: string): Promise<S3Object[]> {
  const env = getEnv();
  const endpoint = `https://${env.accountId}.r2.cloudflarestorage.com`;
  const allObjects: S3Object[] = [];
  let continuationToken: string | undefined;

  do {
    const url = new URL(`/${env.bucket}`, endpoint);
    url.searchParams.set('list-type', '2');
    if (prefix) url.searchParams.set('prefix', prefix);
    if (continuationToken) url.searchParams.set('continuation-token', continuationToken);

    const signedHeaders = await signRequest('GET', url, {});
    const res = await fetch(url.toString(), { headers: signedHeaders });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`R2 ListObjects failed: ${res.status} ${text}`);
    }

    const xml = await res.text();
    const { objects, isTruncated, nextContinuationToken } = parseListObjectsResponse(xml);
    allObjects.push(...objects);
    continuationToken = isTruncated ? nextContinuationToken : undefined;
  } while (continuationToken);

  return allObjects;
}

export async function r2DeleteObject(key: string): Promise<void> {
  const env = getEnv();
  const endpoint = `https://${env.accountId}.r2.cloudflarestorage.com`;
  const url = new URL(`/${env.bucket}/${key.split('/').map(encodeURIComponent).join('/')}`, endpoint);

  const signedHeaders = await signRequest('DELETE', url, {});
  const res = await fetch(url.toString(), { method: 'DELETE', headers: signedHeaders });
  if (!res.ok && res.status !== 204) {
    const text = await res.text();
    throw new Error(`R2 DeleteObject failed: ${res.status} ${text}`);
  }
}

export async function r2CopyObject(sourceKey: string, destKey: string): Promise<void> {
  const env = getEnv();
  const endpoint = `https://${env.accountId}.r2.cloudflarestorage.com`;
  const destUrl = new URL(`/${env.bucket}/${destKey.split('/').map(encodeURIComponent).join('/')}`, endpoint);
  const copySource = `/${env.bucket}/${sourceKey.split('/').map(encodeURIComponent).join('/')}`;

  const signedHeaders = await signRequest('PUT', destUrl, { 'x-amz-copy-source': copySource });
  const res = await fetch(destUrl.toString(), { method: 'PUT', headers: signedHeaders });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`R2 CopyObject failed: ${res.status} ${text}`);
  }
}

export async function r2PutObject(key: string, body: Uint8Array, contentType: string): Promise<void> {
  const env = getEnv();
  const endpoint = `https://${env.accountId}.r2.cloudflarestorage.com`;
  const url = new URL(`/${env.bucket}/${key.split('/').map(encodeURIComponent).join('/')}`, endpoint);

  // For binary uploads, we can't easily hash in SigV4, use unsigned payload
  const headers: Record<string, string> = {
    'content-type': contentType,
    'x-amz-content-sha256': 'UNSIGNED-PAYLOAD',
  };
  const signedHeaders = await signRequest('PUT', url, headers, '');
  // Override the sha256 header to match what we signed
  signedHeaders['x-amz-content-sha256'] = 'UNSIGNED-PAYLOAD';

  const res = await fetch(url.toString(), { method: 'PUT', headers: signedHeaders, body: new Blob([body as any]) });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`R2 PutObject failed: ${res.status} ${text}`);
  }
}
