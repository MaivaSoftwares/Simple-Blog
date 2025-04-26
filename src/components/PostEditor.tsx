import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BlogPost } from "./BlogCard";
import { toast } from "sonner";
import { createPost, updatePost } from "@/lib/db";

interface PostEditorProps {
  post?: BlogPost;
  onSave: () => void;
  onCancel?: () => void;
}

export function PostEditor({ post, onSave, onCancel }: PostEditorProps) {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    authorName: "Admin",
    authorAvatar: "",
    category: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage || "",
        category: post.category,
        authorName: post.author.name,
        authorAvatar: post.author.avatar || "",
      });
    }
  }, [post]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.category) {
      toast.error("Title, content, and category are required");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const postData = {
        title: formData.title,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + "...",
        content: formData.content,
        coverImage: formData.coverImage || undefined,
        category: formData.category,
        author: {
          name: formData.authorName,
          avatar: formData.authorAvatar || undefined,
        },
      };
      
      if (post) {
        await updatePost(post._id, postData);
      } else {
        await createPost(postData);
      }
      
      onSave();
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Post title"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt (optional)</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          placeholder="Brief description of your post (will use the first 150 characters of content if left empty)"
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="coverImage">Cover Image URL (optional)</Label>
        <Input
          id="coverImage"
          name="coverImage"
          value={formData.coverImage}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content (supports HTML)</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write your post content here..."
          rows={15}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="authorName">Author Name</Label>
        <Input
          id="authorName"
          name="authorName"
          value={formData.authorName}
          onChange={handleChange}
          placeholder="Author name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="authorAvatar">Author Avatar URL (optional)</Label>
        <Input
          id="authorAvatar"
          name="authorAvatar"
          value={formData.authorAvatar}
          onChange={handleChange}
          placeholder="https://example.com/avatar.jpg"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button variant="outline" type="button" onClick={() => onCancel()}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : (post ? "Update Post" : "Create Post")}
        </Button>
      </div>
    </form>
  );
}
