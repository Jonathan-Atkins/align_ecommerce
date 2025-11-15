import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, type PostStatus } from '@prisma/client';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const prisma = new PrismaClient();

const S3_REGION = process.env.AWS_REGION;
const S3_BUCKET = process.env.S3_BUCKET;
const s3 = S3_REGION && S3_BUCKET ? new S3Client({ region: S3_REGION }) : null;

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const statusParam = url.searchParams.get('status');
    const authorId = url.searchParams.get('authorId');

    const where: Record<string, unknown> = {};
    if (statusParam) where.status = statusParam as PostStatus;
    if (authorId) where.authorId = Number(authorId);

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, email: true } } },
    });

    // If we have S3 configured, generate a presigned GET to use for display
    const enhanced = await Promise.all(posts.map(async (p) => {
      // copy base post
      const out: any = { ...p };
      try {
        if (p.imageUrl && s3 && S3_BUCKET && S3_REGION) {
          const prefix = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/`;
          if (typeof p.imageUrl === 'string' && p.imageUrl.startsWith(prefix)) {
            const key = p.imageUrl.slice(prefix.length);
            const getCmd = new GetObjectCommand({ Bucket: S3_BUCKET, Key: key });
            // 7 days max for sigv4
            const expiresIn = 7 * 24 * 60 * 60;
            const presigned = await getSignedUrl(s3, getCmd, { expiresIn });
            out.displayImageUrl = presigned;
          }
        }
      } catch (err) {
        // don't break listing if presign fails
        // eslint-disable-next-line no-console
        console.error('Failed to generate presigned GET for post', p.id, err);
      }
      return out;
    }));

    return NextResponse.json(enhanced);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg || 'Unknown error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, imageUrl, authorId, authorEmail, status } = body as {
      title?: string;
      content?: string;
      imageUrl?: string | null;
      authorId?: number;
      authorEmail?: string;
      status?: PostStatus | string;
    };
    if (!title || !content) return NextResponse.json({ error: 'title and content required' }, { status: 400 });

    let authorIdResolved = authorId;
    if (!authorIdResolved && authorEmail) {
      const user = await prisma.user.findUnique({ where: { email: authorEmail } });
      if (!user) return NextResponse.json({ error: 'author not found' }, { status: 404 });
      authorIdResolved = user.id;
    }
    if (!authorIdResolved) return NextResponse.json({ error: 'authorId or authorEmail required' }, { status: 400 });

    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl: imageUrl ?? null,
        status: (status ?? 'DRAFT') as PostStatus,
        authorId: Number(authorIdResolved),
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg || 'Unknown error' }, { status: 500 });
  }
}
