
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost } from "@/lib/db";
import { BlogPost } from "@/components/BlogCard";
import { BlogPostContent } from "@/components/BlogPost";

const Post = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) {
          navigate("/404");
          return;
        }

        const data = await getPost(id);
        
        if (!data) {
          navigate("/404");
          return;
        }
        
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
        navigate("/404");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="container min-h-[60vh] flex items-center justify-center">
        <p>Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container min-h-[60vh] flex items-center justify-center">
        <p>Post not found</p>
      </div>
    );
  }

  return <BlogPostContent post={post} />;
};

export default Post;
