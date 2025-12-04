import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Brain,
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Eye,
  Video,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  MoreVertical,
  Play,
  Filter,
  Search,
  RefreshCw,
  Download,
  Upload,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Video {
  id: number;
  title: string;
  short_description: string;
  long_description?: string;
  photo_file?: string;
  video_file?: string;
  video_number: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const VideosList = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);

  // Status update states
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  // Fetch videos on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchVideos();
    }
  }, [isAuthenticated]);

  // Filter videos when search term or filter changes
  useEffect(() => {
    let filtered = [...videos];

    // Filter by active status
    if (showActiveOnly) {
      filtered = filtered.filter((video) => video.is_active);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(term) ||
          video.short_description.toLowerCase().includes(term) ||
          video.video_number.toString().includes(term)
      );
    }

    setFilteredVideos(filtered);
  }, [videos, searchTerm, showActiveOnly]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("https://rakantrad.eu/api/website-videos");

      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setVideos(data.videos);
        setFilteredVideos(data.videos);
      } else {
        setError(data.message || "Failed to load videos");
        toast.error(data.message || "Failed to load videos");
      }
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError("Unable to connect to server. Please try again.");
      toast.error("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video: Video) => {
    navigate(`/edit-video/${video.id}`);
  };

  const handleView = (video: Video) => {
    navigate(`/view-video/${video.id}`);
  };

  const confirmDelete = (video: Video) => {
    setVideoToDelete(video);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!videoToDelete) return;

    try {
      const response = await fetch(
        `https://rakantrad.eu/api/website-videos/${videoToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Remove deleted video from state
        setVideos((prev) => prev.filter((v) => v.id !== videoToDelete.id));
        toast.success("Video deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete video");
      }
    } catch (err) {
      console.error("Error deleting video:", err);
      toast.error("Failed to delete video");
    } finally {
      setDeleteDialogOpen(false);
      setVideoToDelete(null);
    }
  };

  const toggleVideoStatus = async (video: Video) => {
    setUpdatingStatus(video.id);

    try {
      const response = await fetch(
        `https://rakantrad.eu/api/website-videos/${video.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_active: !video.is_active,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Update failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update video in state
        setVideos((prev) =>
          prev.map((v) =>
            v.id === video.id ? { ...v, is_active: !v.is_active } : v
          )
        );
        toast.success(
          `Video ${!video.is_active ? "activated" : "deactivated"}`
        );
      } else {
        toast.error(data.message || "Failed to update video status");
      }
    } catch (err) {
      console.error("Error updating video status:", err);
      toast.error("Failed to update video status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getFileUrl = (filePath: string) => {
    return `https://rakantrad.eu/storage/app/public/${filePath}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <XCircle className="h-8 w-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Access Required
            </h2>
            <p className="text-muted-foreground mb-6">
              Please log in to access the video management system.
            </p>
            <Button onClick={() => navigate("/login")}>Go to Login</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {t.videos?.management || "Video Management"}
              </h1>
              <p className="text-muted-foreground">
                {t.videos?.manageAllVideos || "Manage all website videos"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-lg font-semibold">
                {filteredVideos.length}{" "}
                {filteredVideos.length === 1 ? "Video" : "Videos"}
              </span>
            </div>
            <Button
              variant="hero"
              onClick={() => navigate("/add-video")}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              {t.videos?.addVideo || "Add Video"}
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <Card className="shadow-sm mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search videos by title, description, or number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active-only"
                    checked={showActiveOnly}
                    onCheckedChange={setShowActiveOnly}
                  />
                  <Label htmlFor="active-only" className="text-sm">
                    Active Only
                  </Label>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchVideos}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-700" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading videos...</p>
          </div>
        ) : (
          <>
            {/* Stats Summary */}
            {videos.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Videos
                        </p>
                        <p className="text-2xl font-bold">{videos.length}</p>
                      </div>
                      <Video className="h-8 w-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Active Videos
                        </p>
                        <p className="text-2xl font-bold text-green-700">
                          {videos.filter((v) => v.is_active).length}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Latest Video #
                        </p>
                        <p className="text-2xl font-bold text-amber-700">
                          {videos.length > 0
                            ? Math.max(...videos.map((v) => v.video_number))
                            : 0}
                        </p>
                      </div>
                      <Upload className="h-8 w-8 text-amber-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Videos Table */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Video className="h-5 w-5 text-primary" />
                    <span>All Videos</span>
                  </div>
                  <Badge variant="outline">
                    {filteredVideos.length} videos
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Click on any video to view details or use the action menu
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredVideos.length === 0 ? (
                  <div className="text-center py-12">
                    <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No videos found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {searchTerm
                        ? "Try adjusting your search criteria"
                        : "Get started by adding your first video"}
                    </p>
                    {!searchTerm && (
                      <Button onClick={() => navigate("/list-video")}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Video
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">#</TableHead>
                          <TableHead className="min-w-[200px]">
                            Title & Description
                          </TableHead>
                          <TableHead className="w-[120px]">Thumbnail</TableHead>
                          <TableHead className="w-[100px]">Status</TableHead>
                          <TableHead className="w-[120px]">Created</TableHead>
                          <TableHead className="text-right w-[100px]">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredVideos.map((video) => (
                          <TableRow
                            key={video.id}
                            className="hover:bg-secondary/50 cursor-pointer"
                            onClick={() => handleView(video)}
                          >
                            <TableCell className="font-mono font-bold">
                              {video.video_number}
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <h4 className="font-semibold text-foreground line-clamp-1">
                                  {video.title}
                                </h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {video.short_description}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {video.photo_file ? (
                                <div className="relative w-16 h-12 rounded-md overflow-hidden border">
                                  <img
                                    src={getFileUrl(video.photo_file)}
                                    alt={video.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-16 h-12 rounded-md border border-dashed flex items-center justify-center bg-secondary">
                                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    video.is_active
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }`}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleVideoStatus(video);
                                  }}
                                  disabled={updatingStatus === video.id}
                                  className="h-6 px-2"
                                >
                                  {updatingStatus === video.id ? (
                                    <RefreshCw className="h-3 w-3 animate-spin" />
                                  ) : video.is_active ? (
                                    <span className="text-xs text-green-600">
                                      Active
                                    </span>
                                  ) : (
                                    <span className="text-xs text-red-600">
                                      Inactive
                                    </span>
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="text-sm text-muted-foreground">
                                      {formatDate(video.created_at)}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Last updated: {formatDate(video.updated_at)}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger
                                  asChild
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => handleView(video)}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                     onClick={(e) => {
                                      e.stopPropagation();  // Add this line
                                      handleEdit(video);
                                    }}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {video.video_file && (
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(
                                          getFileUrl(video.video_file!),
                                          "_blank"
                                        );
                                      }}
                                    >
                                      <Play className="h-4 w-4 mr-2" />
                                      Play Video
                                    </DropdownMenuItem>
                                  )}
                                  {video.photo_file && (
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(
                                          getFileUrl(video.photo_file!),
                                          "_blank"
                                        );
                                      }}
                                    >
                                      <ImageIcon className="h-4 w-4 mr-2" />
                                      View Image
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      confirmDelete(video);
                                    }}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              video "{videoToDelete?.title}" and remove all associated files
              from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setVideoToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Video
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VideosList;
