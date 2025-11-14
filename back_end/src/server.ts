import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth';
import postsRoutes from './routes/posts';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));

const ADMIN_SLUG = process.env.ADMIN_SLUG || 'site-admin-2025';
app.use(`/admin-${ADMIN_SLUG}`, authRoutes);
app.use(`/admin-${ADMIN_SLUG}/posts`, postsRoutes);

// public posts
app.use('/posts', postsRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`API running on ${port}`));
