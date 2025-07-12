import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Users, MessageCircle, Share, Plus, User, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Community() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
    isAnonymous: false,
  });
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ["/api/community/posts", selectedCategory],
    enabled: isAuthenticated,
    retry: false,
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: typeof newPost) => {
      await apiRequest('POST', '/api/community/posts', postData);
    },
    onSuccess: () => {
      toast({
        title: "Post Created",
        description: "Your post has been shared with the community.",
      });
      setNewPost({ title: "", content: "", category: "", isAnonymous: false });
      setShowNewPostDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-therapy-gray-light">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-therapy-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-therapy-gray">Loading community...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createPostMutation.mutate(newPost);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      anxiety: "bg-blue-100 text-blue-800",
      depression: "bg-purple-100 text-purple-800",
      recovery: "bg-green-100 text-green-800",
      relationships: "bg-pink-100 text-pink-800",
      general: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.general;
  };

  return (
    <div className="min-h-screen bg-therapy-gray-light">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-therapy-teal to-therapy-blue rounded-lg flex items-center justify-center">
                <Heart className="text-white h-6 w-6" />
              </div>
              <span className="text-xl font-semibold text-gray-900">MindHaven</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-therapy-teal transition-colors">Dashboard</Link>
              <Link href="/therapists" className="text-gray-700 hover:text-therapy-teal transition-colors">Therapists</Link>
              <Link href="/community" className="text-therapy-teal font-medium">Community</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Join Our Supportive Community
          </h1>
          <p className="text-xl text-therapy-gray max-w-3xl mx-auto">
            Connect with others on similar journeys in a safe, moderated environment that reduces isolation and builds understanding.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-therapy-gray">Active Members</span>
                  <span className="font-semibold text-gray-900">12,847</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-therapy-gray">Support Groups</span>
                  <span className="font-semibold text-gray-900">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-therapy-gray">Posts This Week</span>
                  <span className="font-semibold text-gray-900">1,236</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-therapy-gray">Peer Responses</span>
                  <span className="font-semibold text-therapy-teal">4,892</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Community Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle>Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-therapy-gray">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-therapy-teal rounded-full mt-2"></div>
                    <span>Be respectful and kind to all members</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-therapy-teal rounded-full mt-2"></div>
                    <span>Share experiences, not medical advice</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-therapy-teal rounded-full mt-2"></div>
                    <span>Maintain confidentiality and privacy</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-therapy-teal rounded-full mt-2"></div>
                    <span>Report concerning content to moderators</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              {/* Community Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Community Posts</CardTitle>
                  <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-therapy-teal hover:bg-therapy-teal-light text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        New Post
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Create New Post</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={newPost.title}
                            onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="What's on your mind?"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select value={newPost.category} onValueChange={(value) => setNewPost(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="anxiety">Anxiety Support</SelectItem>
                              <SelectItem value="depression">Depression</SelectItem>
                              <SelectItem value="recovery">Recovery</SelectItem>
                              <SelectItem value="relationships">Relationships</SelectItem>
                              <SelectItem value="general">General Support</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="content">Share your thoughts</Label>
                          <Textarea
                            id="content"
                            value={newPost.content}
                            onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                            placeholder="Tell the community what's going on..."
                            rows={4}
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="anonymous"
                            checked={newPost.isAnonymous}
                            onCheckedChange={(checked) => setNewPost(prev => ({ ...prev, isAnonymous: checked as boolean }))}
                          />
                          <Label htmlFor="anonymous" className="text-sm">
                            Post anonymously
                          </Label>
                        </div>
                        
                        <Button 
                          onClick={handleCreatePost}
                          disabled={createPostMutation.isPending}
                          className="w-full bg-therapy-teal hover:bg-therapy-teal-light text-white"
                        >
                          {createPostMutation.isPending ? "Posting..." : "Share Post"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {/* Category Tabs */}
                <div className="flex space-x-6 mt-4">
                  <button 
                    onClick={() => setSelectedCategory("")}
                    className={`pb-2 font-medium transition-colors ${selectedCategory === "" ? "text-therapy-teal border-b-2 border-therapy-teal" : "text-therapy-gray hover:text-therapy-teal"}`}
                  >
                    All Posts
                  </button>
                  <button 
                    onClick={() => setSelectedCategory("anxiety")}
                    className={`pb-2 font-medium transition-colors ${selectedCategory === "anxiety" ? "text-therapy-teal border-b-2 border-therapy-teal" : "text-therapy-gray hover:text-therapy-teal"}`}
                  >
                    Anxiety Support
                  </button>
                  <button 
                    onClick={() => setSelectedCategory("depression")}
                    className={`pb-2 font-medium transition-colors ${selectedCategory === "depression" ? "text-therapy-teal border-b-2 border-therapy-teal" : "text-therapy-gray hover:text-therapy-teal"}`}
                  >
                    Depression
                  </button>
                  <button 
                    onClick={() => setSelectedCategory("recovery")}
                    className={`pb-2 font-medium transition-colors ${selectedCategory === "recovery" ? "text-therapy-teal border-b-2 border-therapy-teal" : "text-therapy-gray hover:text-therapy-teal"}`}
                  >
                    Recovery
                  </button>
                </div>
              </CardHeader>
              
              {/* Community Posts */}
              <CardContent className="p-0">
                {postsLoading ? (
                  <div className="divide-y divide-gray-200">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="p-6 animate-pulse">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded mb-4"></div>
                            <div className="h-20 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : posts && posts.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {posts.map((post: any) => (
                      <div key={post.id} className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-therapy-blue rounded-full flex items-center justify-center text-white font-semibold">
                            {post.isAnonymous ? (
                              <User className="h-5 w-5" />
                            ) : (
                              <span>{post.author?.firstName?.[0] || 'U'}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-gray-900">
                                {post.isAnonymous ? "Anonymous" : (post.author?.firstName || "User")}
                              </span>
                              <Clock className="h-3 w-3 text-therapy-gray" />
                              <span className="text-sm text-therapy-gray">{formatTimeAgo(post.createdAt)}</span>
                              <Badge className={getCategoryColor(post.category)}>
                                {post.category}
                              </Badge>
                            </div>
                            
                            <h4 className="font-semibold text-gray-900 mb-2">{post.title}</h4>
                            
                            <p className="text-therapy-gray mb-4">{post.content}</p>
                            
                            <div className="flex items-center space-x-6 text-sm">
                              <button className="flex items-center space-x-2 text-therapy-gray hover:text-therapy-teal transition-colors">
                                <Heart className="h-4 w-4" />
                                <span>{post.likesCount || 0}</span>
                              </button>
                              <button className="flex items-center space-x-2 text-therapy-gray hover:text-therapy-teal transition-colors">
                                <MessageCircle className="h-4 w-4" />
                                <span>{post.commentsCount || 0} responses</span>
                              </button>
                              <button className="flex items-center space-x-2 text-therapy-gray hover:text-therapy-teal transition-colors">
                                <Share className="h-4 w-4" />
                                <span>Share support</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-therapy-gray">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                    <p>Be the first to share with the community!</p>
                  </div>
                )}
                
                {posts && posts.length > 0 && (
                  <div className="p-6 border-t border-gray-200 text-center">
                    <Button variant="link" className="text-therapy-blue hover:text-therapy-blue-light">
                      Load More Posts →
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
