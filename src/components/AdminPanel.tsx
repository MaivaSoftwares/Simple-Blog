import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getPosts, deletePost } from "@/lib/db";
import { BlogPost } from "./BlogCard";
import { CalendarIcon, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChatSidebar } from "@/components/ChatSidebar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function fetchMe() {
  const res = await fetch(`${API_URL}/api/admin/me`, { credentials: "include" });
  if (!res.ok) throw new Error("Not authenticated");
  const { user } = await res.json();
  return user;
}

export function AdminPanel() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [showChat, setShowChat] = useState<boolean>(false);

  const navigate = useNavigate();
  const { data: user } = useQuery({ queryKey: ['me'], queryFn: fetchMe });

  const loadPosts = async (category?: string) => {
    setIsLoading(true);
    try {
      const loadedPosts = await getPosts(category);
      setPosts(loadedPosts);
    } catch (error) {
      console.error("Failed to load posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreateNew = () => navigate("/admin/post/new");

  const handleEdit = (post: BlogPost) => navigate(`/admin/post/${post._id}/edit`);

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;
    
    try {
      await deletePost(postToDelete);
      loadPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleLogout = async () => {
    await fetch(`${API_URL}/api/admin/logout`, { method: "POST", credentials: "include" });
    navigate("/login", { replace: true });
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setIsChanging(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/change-password`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Error");
      toast.success(result.message);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className={`${showChat ? "w-3/5" : "w-full"} space-y-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Welcome, {user.username}</h2>
            <p className="text-sm text-muted-foreground">Signed in as {user.username}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleCreateNew}>Create New Post</Button>
            <Button variant="outline" onClick={() => setShowChat(prev => !prev)}>
              {showChat ? "Hide Chat" : "Chat"}
            </Button>
            <Button variant="outline" onClick={handleLogout}>Sign Out</Button>
          </div>
        </div>

        <Tabs defaultValue="posts">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-6">
            <div className="mb-4 flex items-center gap-2 px-6">
              <Label htmlFor="filterCategory">Filter by Category:</Label>
              <Input
                id="filterCategory"
                placeholder="All"
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); loadPosts(e.target.value); }}
              />
            </div>
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <p>Loading posts...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Published</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            No posts found. Create your first post!
                          </TableCell>
                        </TableRow>
                      ) : (
                        posts.map((post) => (
                          <TableRow key={post._id}>
                            <TableCell className="font-medium">{post.title}</TableCell>
                            <TableCell>{post.author.name}</TableCell>
                            <TableCell className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              {formatDate(post.createdAt)}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleEdit(post)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleDeleteClick(post._id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="mt-6">
            <Card>
              <form onSubmit={handleChangePassword}>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="space-y-1">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="pt-0 justify-end">
                  <Button type="submit" disabled={isChanging}>
                    {isChanging ? 'Updating...' : 'Update Password'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the post
                and remove the data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {showChat && (
        <div className="w-2/5 h-screen overflow-auto p-4 border-l">
          <ChatSidebar />
        </div>
      )}
    </div>
  );
}
