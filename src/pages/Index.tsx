
import { useEffect, useState } from "react";
import { BlogCard, BlogPost } from "@/components/BlogCard";
import { getPosts } from "@/lib/db";

const Index = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Aurora Blog</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore beautiful articles and stories on web development, design, and technology.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <p>Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
