import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostEditor } from "@/components/PostEditor";
import { getPost } from "@/lib/db";
import { BlogPost } from "@/components/BlogCard";
import { toast } from "sonner";
import { ChatBox } from "@/components/ChatBox";
import { Button } from "@/components/ui/button";

export default function AdminPostEditor() {
  const [showChat, setShowChat] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(!!id);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getPost(id)
        .then((p) => {
          if (p) setPost(p as BlogPost);
          else {
            toast.error("Post not found");
            navigate("/admin");
          }
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to load post");
          navigate("/admin");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSave = () => {
    navigate("/admin");
  };

  return (
    <div className="relative">
      <div className={`container mx-auto py-8 px-4 ${showChat ? 'pr-[40vw]' : ''}`}>
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">
              {id ? "Edit Post" : "Create New Post"}
            </h1>
            <Button variant="outline" onClick={() => setShowChat(prev => !prev)}>
              {showChat ? "Hide Chat" : "Chat"}
            </Button>
          </div>
          <PostEditor post={post} onSave={handleSave} onCancel={() => navigate("/admin")} />
        </div>
      </div>
      {showChat && (
        <div className="fixed top-16 bottom-0 right-0 w-2/5 p-4 border-l bg-background overflow-hidden z-30">
          <ChatBox />
        </div>
      )}
    </div>
  );
}
