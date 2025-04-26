import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PostEditor } from "@/components/PostEditor";
import { getPost } from "@/lib/db";
import { BlogPost } from "@/components/BlogCard";
import { toast } from "sonner";
import { ChatSidebar } from "@/components/ChatSidebar";
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
    <div className="flex h-full">
      <div className={`${showChat ? "w-3/5" : "w-full"} container py-8 px-4`}>
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
      {showChat && (
        <div className="w-2/5 h-screen overflow-auto p-4 border-l">
          <ChatSidebar />
        </div>
      )}
    </div>
  );
}
