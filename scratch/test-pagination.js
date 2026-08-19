const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const bucket = process.env.R2_BUCKET_NAME;

async function test() {
    const command = new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 500 });
    let isTruncated = true;
    let continuationToken = undefined;
    let pages = 0;
    while (isTruncated) {
      command.input.ContinuationToken = continuationToken;
      const response = await r2.send(command);
      console.log(`Page ${pages+1}: ${response.Contents?.length} objects, NextContinuationToken: ${response.NextContinuationToken?.substring(0,10)}...`);
      isTruncated = response.IsTruncated ?? false;
      continuationToken = response.NextContinuationToken;
      pages++;
      if (pages > 10) break;
    }
}
test();
