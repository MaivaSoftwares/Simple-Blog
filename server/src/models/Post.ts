import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: String,
    category: { type: String, required: true },
    author: {
      name: { type: String, required: true },
      avatar: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IPost>('Post', PostSchema);
