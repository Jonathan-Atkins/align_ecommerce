import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import auth from '../middleware/auth';
const prisma = new PrismaClient();
const router = Router();
const upload = multer({ dest: '/tmp/uploads' });

router.get('/', async (_req, res) => {
  const posts = await prisma.post.findMany({ orderBy: { publishedAt: 'desc' } });
  res.json(posts);
});

router.get('/:slug', async (req, res) => {
  const post = await prisma.post.findUnique({ where: { slug: req.params.slug } });
  if (!post) return res.status(404).end();
  res.json(post);
});

router.post('/', auth, upload.single('image'), async (req: any, res: any) => {
  const { title, content, tags, published } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const slug = title.toLowerCase().replace(/\s+/g, '-').slice(0, 200);
  const post = await prisma.post.create({
    data: {
      title,
      content,
      imageUrl,
      tags: tags ? JSON.parse(tags) : [],
      publishedAt: published ? new Date() : null,
      slug,
      authorId: req.userId
    }
  });
  res.json(post);
});

router.put('/:id', auth, async (req: any, res: any) => {
  const updated = await prisma.post.update({ where: { id: req.params.id }, data: req.body });
  res.json(updated);
});

router.delete('/:id', auth, async (req: any, res: any) => {
  await prisma.post.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;
