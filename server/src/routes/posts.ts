import express from 'express';
import Post from '../models/Post';
import { requireAuth } from '../middleware/auth'; // if you want protected writes

const router = express.Router();

// GET all
router.get('/', async (req, res) => {
  try {
    const filter: any = {};
    if (req.query.category) filter.category = req.query.category as string;
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// GET one
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Not found' });
  res.json(post);
});

// POST create (protected)
router.post('/', requireAuth, async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch {
    res.status(400).json({ message: 'Invalid data' });
  }
});

// PUT update (protected)
router.put('/:id', requireAuth, async (req, res) => {
  const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

// DELETE (protected)
router.delete('/:id', requireAuth, async (req, res) => {
  const removed = await Post.findByIdAndDelete(req.params.id);
  if (!removed) return res.status(404).json({ message: 'Not found' });
  res.sendStatus(204);
});

export default router;