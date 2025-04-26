import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

export interface BlogPost {
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

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      {post.coverImage && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="p-4">
        <div className="space-y-1">
          <h3 className="text-xl font-bold leading-tight line-clamp-2">
            {post.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground line-clamp-3">
          {post.excerpt}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="outline" className="w-full">
          <Link to={`/post/${post._id}`}>
            Read more
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
