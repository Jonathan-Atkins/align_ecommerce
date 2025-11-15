import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.S3_BUCKET;

const s3 = new S3Client({ region: REGION });

export async function POST(req: NextRequest) {
  try {
    if (!REGION || !BUCKET) {
      return NextResponse.json({ error: 'S3_BUCKET and AWS_REGION must be configured' }, { status: 500 });
    }

    const body = await req.json();
    const { filename, contentType, authorEmail } = body as { filename?: string; contentType?: string; authorEmail?: string };
    if (!filename || !contentType) return NextResponse.json({ error: 'filename and contentType required' }, { status: 400 });

    // Simple owner check (requires authorEmail to match your owner email). This is a light protection.
    const OWNER_EMAIL = 'jonathanatkins.dev@gmail.com';
    if (authorEmail && authorEmail !== OWNER_EMAIL) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

    // Build a storage key: posts/<YYYY-MM-DD>/<ts>-<rand>-<filename>
    const date = new Date();
    const datePart = date.toISOString().slice(0, 10);
    const rand = Math.random().toString(36).slice(2, 10);
    const key = `posts/${datePart}/${Date.now()}-${rand}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;

  // Do not set ACL (bucket may block ACLs). Keep objects private by default.
  const putCmd = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType });

    // Signed PUT URL valid for 15 minutes
    const putExpires = 15 * 60;
    const presignedUrl = await getSignedUrl(s3, putCmd, { expiresIn: putExpires });

    // Public URL we'll construct (may be blocked by bucket settings)
    const publicUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

    // Generate a short-lived presigned GET for quick verification and
    // a long-lived presigned GET (up to 7 days) to allow the UI to display
    // the uploaded image even if the bucket blocks public access.
    const getCmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    const shortGetExpires = 15 * 60; // 15 minutes
    const longGetExpires = 7 * 24 * 60 * 60; // 7 days (max for S3 presigned GET)
    const presignedGetUrl = await getSignedUrl(s3, getCmd, { expiresIn: shortGetExpires });
    const presignedGetUrlLong = await getSignedUrl(s3, getCmd, { expiresIn: longGetExpires });

    return NextResponse.json({ presignedUrl, presignedGetUrl, presignedGetUrlLong, publicUrl, putExpires });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg || 'Unknown error' }, { status: 500 });
  }
}
