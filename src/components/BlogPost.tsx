
import { CalendarIcon, UserIcon } from "lucide-react";
import { BlogPost } from "./BlogCard";

interface BlogPostProps {
  post: BlogPost;
}

export function BlogPostContent({ post }: BlogPostProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article className="container max-w-4xl py-10 animate-fadeIn">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span>{post.author.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </header>

      {post.coverImage && (
        <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div 
        className="prose dark:prose-invert" 
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
