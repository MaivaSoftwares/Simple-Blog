import { toast } from "sonner";
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const getPosts = async (category?: string): Promise<Post[]> => {
  try {
    let url = `${API}/api/posts`;
    if (category) url += `?category=${encodeURIComponent(category)}`;
    const res = await fetch(url, { credentials: "include" });
    if (!res.ok) throw new Error("Fetch error");
    return await res.json();
  } catch (err) {
    console.error(err);
    toast.error("Failed to load posts");
    return [];
  }
};

export const getPost = async (id: string): Promise<Post | null> => {
  try {
    const res = await fetch(`${API}/api/posts/${id}`, { credentials: "include" });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Fetch error");
    return await res.json();
  } catch (err) {
    console.error(err);
    toast.error("Failed to load the post");
    return null;
  }
};

export const createPost = async (
  postData: Omit<Post, "_id" | "createdAt" | "updatedAt">
): Promise<Post> => {
  try {
    const res = await fetch(`${API}/api/posts`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
    if (!res.ok) throw new Error("Failed to create post");
    return await res.json();
  } catch (err) {
    console.error(err);
    toast.error("Failed to create post");
    throw err;
  }
};

export const updatePost = async (
  id: string,
  postData: Partial<Post>
): Promise<Post> => {
  try {
    const res = await fetch(`${API}/api/posts/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });
    if (!res.ok) throw new Error("Failed to update post");
    return await res.json();
  } catch (err) {
    console.error(err);
    toast.error("Failed to update post");
    throw err;
  }
};

export const deletePost = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API}/api/posts/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.status === 404) {
      toast.error("Post not found");
      return false;
    }
    if (!res.ok) throw new Error("Failed to delete post");
    return true;
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete post");
    return false;
  }
};
