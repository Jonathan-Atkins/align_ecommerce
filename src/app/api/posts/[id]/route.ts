import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, type PostStatus } from '@prisma/client';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const prisma = new PrismaClient();
const S3_REGION = process.env.AWS_REGION;
const S3_BUCKET = process.env.S3_BUCKET;
const s3 = new S3Client({ region: S3_REGION });

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const post = await prisma.post.findUnique({ where: { id }, include: { author: { select: { id: true, email: true } } } });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg || 'Unknown error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const { title, content, imageUrl, status } = body as { title?: string; content?: string; imageUrl?: string | null; status?: PostStatus | string };

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;
    if (status !== undefined) data.status = status as PostStatus;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Load existing post so we can remove previous image if replaced
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    try {
      const post = await prisma.post.update({ where: { id }, data });

      // If imageUrl was changed and the old image lives in our S3 bucket, try to delete the old object
      try {
        if (imageUrl !== undefined && existing.imageUrl && existing.imageUrl !== imageUrl && S3_BUCKET && S3_REGION) {
          const prefix = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/`;
          if (existing.imageUrl.startsWith(prefix)) {
            const oldKey = existing.imageUrl.slice(prefix.length);
            await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: oldKey }));
          }
        }
      } catch (s3err) {
        // log and continue; don't fail the whole request because of S3 delete issues
        // eslint-disable-next-line no-console
        console.error('Failed to delete old S3 object:', s3err);
      }

      return NextResponse.json(post);
    } catch (e: unknown) {
      // Prisma not found error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errAny = e as any;
      if (errAny?.code === 'P2025') {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      throw e;
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg || 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    // Find post to see if it has an image to delete
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    // Attempt to delete the S3 object if it belongs to our bucket
    try {
      if (post.imageUrl && S3_BUCKET && S3_REGION) {
        const prefix = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/`;
        if (post.imageUrl.startsWith(prefix)) {
          const key = post.imageUrl.slice(prefix.length);
          await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }));
        }
      }
    } catch (s3err) {
      // log and continue
      // eslint-disable-next-line no-console
      console.error('Failed to delete S3 object during post delete:', s3err);
    }

    await prisma.post.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg || 'Unknown error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const action = body?.action as string | undefined;
    const delta = typeof body?.delta === 'number' ? body.delta : 1;

    if (!action) return NextResponse.json({ error: 'action required' }, { status: 400 });

    if (!['view', 'like', 'comment'].includes(action)) {
      return NextResponse.json({ error: 'unknown action' }, { status: 400 });
    }

    // atomic increment
    const field = action === 'view' ? 'views' : action === 'like' ? 'likes' : 'commentsCount';

    // Use Prisma's increment
    // @ts-ignore dynamic key
    const updated = await prisma.post.update({ where: { id }, data: { [field]: { increment: delta } } as any });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg || 'Unknown error' }, { status: 500 });
  }
}
