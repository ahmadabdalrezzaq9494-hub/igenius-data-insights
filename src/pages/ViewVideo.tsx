import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Brain,
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Video as VideoIcon,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  ExternalLink,
  Copy,
  Download,
  Play,
  Share2,
  FileText,
  Hash,
  ChevronRight,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
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

const ViewVideo = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileUrls, setFileUrls] = useState({
    photo_url: "",
    video_url: "",
  });

  // Fetch video data on component mount
  useEffect(() => {
    if (isAuthenticated && id) {
      fetchVideoData();
    }
  }, [isAuthenticated, id]);

  const fetchVideoData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch video details
      const response = await fetch(
        `https://rakantrad.eu/api/website-videos/${id}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Video not found");
        }
        throw new Error(`Failed to fetch video: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.video) {
        setVideo(data.video);

        // Fetch file URLs
        const urlsResponse = await fetch(
          `https://rakantrad.eu/api/website-videos/${id}/urls`
        );
        if (urlsResponse.ok) {
          const urlsData = await urlsResponse.json();
          if (urlsData.success) {
            setFileUrls({
              photo_url: urlsData.urls.photo_url || "",
              video_url: urlsData.urls.video_url || "",
            });
          }
        }
      } else {
        setError(data.message || "Failed to load video data");
        toast.error(data.message || "Failed to load video data");
      }
    } catch (err) {
      console.error("Error fetching video:", err);
      setError(err instanceof Error ? err.message : "Unable to load video");
      toast.error("Failed to load video details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!video) return;

    try {
      const response = await fetch(
        `https://rakantrad.eu/api/website-videos/${video.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Video deleted successfully");
        navigate("/list-video");
      } else {
        toast.error(data.message || "Failed to delete video");
      }
    } catch (err) {
      console.error("Error deleting video:", err);
      toast.error("Failed to delete video");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const getFileUrl = (filePath: string) => {
    if (!filePath) return "";

    // If it's already a full URL (from the /urls API endpoint), return it as is
    if (filePath.startsWith("http")) {
      return filePath;
    }

    // If it's just a database path like "website-videos/photos/..."
    // Add the full storage path
    return `https://rakantrad.eu/storage/app/public/${filePath}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success(`${label} copied to clipboard`))
      .catch(() => toast.error("Failed to copy"));
  };

  const shareVideo = () => {
    if (navigator.share && video) {
      navigator.share({
        title: video.title,
        text: video.short_description,
        url: window.location.href,
      });
    } else {
      copyToClipboard(window.location.href, "Video URL");
    }
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
              Please log in to view video details.
            </p>
            <Button onClick={() => navigate("/login")}>Go to Login</Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Loading Video...
            </h2>
            <p className="text-muted-foreground">
              Please wait while we load the video details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {error || "Video Not Found"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {error ||
                "The video you're looking for doesn't exist or has been removed."}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/list-video")}>
                Back to Videos
              </Button>
              <Button variant="outline" onClick={fetchVideoData}>
                Try Again
              </Button>
            </div>
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
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/list-video")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-foreground">
                  {video.title}
                </h1>
                <Badge
                  variant={video.is_active ? "default" : "secondary"}
                  className={`${
                    video.is_active
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {video.is_active ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Inactive
                    </>
                  )}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 mt-2">
                <p className="text-muted-foreground">
                  Video #{video.video_number}
                </p>
                <span className="text-xs text-muted-foreground">•</span>
                <p className="text-sm text-muted-foreground">
                  {formatTimeAgo(video.created_at)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={shareVideo}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/edit-video/${video.id}`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Video Preview & Files */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Preview */}
            <Card className="shadow-elegant overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <VideoIcon className="h-5 w-5 text-primary" />
                    <span>Video Preview</span>
                  </CardTitle>
                  {video.video_file && (
                    <Badge variant="outline" className="bg-white">
                      {video.video_file.split(".").pop()?.toUpperCase()}
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  {video.video_file
                    ? "Click to play video"
                    : "No video file uploaded"}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0">
                {video.video_file ? (
                  <div className="relative aspect-video">
                    <video
                      src={getFileUrl(video.video_file)}
                      controls
                      className="w-full h-full object-contain bg-black"
                      poster={getFileUrl(video.photo_file || "")}
                    />
                    <div className="absolute bottom-4 right-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          window.open(getFileUrl(video.video_file!), "_blank")
                        }
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open in New Tab
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video flex flex-col items-center justify-center bg-secondary p-8">
                    <VideoIcon className="h-20 w-20 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No Video Available
                    </h3>
                    <p className="text-muted-foreground text-center mb-4">
                      This video doesn't have a video file uploaded yet.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/edit-video/${video.id}`)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Video
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Video Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Video Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Short Description */}
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                    Short Description
                  </h4>
                  <p className="text-foreground whitespace-pre-wrap">
                    {video.short_description}
                  </p>
                </div>

                {/* Long Description */}
                {video.long_description && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                      Detailed Description
                    </h4>
                    <p className="text-foreground whitespace-pre-wrap">
                      {video.long_description}
                    </p>
                  </div>
                )}

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Video Number
                    </p>
                    <div className="flex items-center space-x-2">
                      <Hash className="h-4 w-4 text-primary" />
                      <p className="font-semibold">{video.video_number}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          copyToClipboard(
                            video.video_number.toString(),
                            "Video number"
                          )
                        }
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge
                      variant={video.is_active ? "default" : "secondary"}
                      className={`${
                        video.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {video.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Created</p>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <p className="font-medium">
                        {formatDate(video.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Last Updated
                    </p>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <p className="font-medium">
                        {formatDate(video.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Thumbnail & Actions */}
          <div className="space-y-6">
            {/* Thumbnail Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4" />
                  <span>Thumbnail Image</span>
                </CardTitle>
                <CardDescription>
                  Preview of the video thumbnail
                </CardDescription>
              </CardHeader>
              <CardContent>
                {fileUrls.photo_url ? (
                  <div className="space-y-4">
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                      <img
                        src={getFileUrl(video.photo_file!)}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          window.open(fileUrls.photo_url, "_blank")
                        }
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Size
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() =>
                          window.open(getFileUrl(video.photo_file!), "_blank")
                        }
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center p-8">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      No thumbnail available
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/edit-video/${video.id}`)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Thumbnail
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(`/edit-video/${video.id}`)}
                >
                  <Edit className="h-4 w-4 mr-3" />
                  Edit Video Details
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => copyToClipboard(video.title, "Video title")}
                >
                  <Copy className="h-4 w-4 mr-3" />
                  Copy Title
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    copyToClipboard(video.short_description, "Description")
                  }
                >
                  <Copy className="h-4 w-4 mr-3" />
                  Copy Description
                </Button>

                {fileUrls.video_url && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(getFileUrl(video.video_file!), "_blank")}
                  >
                    <Play className="h-4 w-4 mr-3" />
                    Play Video in New Tab
                  </Button>
                )}

                {fileUrls.photo_url && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(getFileUrl(video.photo_file!), "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-3" />
                    Open Thumbnail
                  </Button>
                )}

                <Separator />

                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-3" />
                  Delete Video
                </Button>
              </CardContent>
            </Card>

            {/* Video Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Video Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">ID</span>
                  <span className="text-sm font-mono">{video.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    variant={video.is_active ? "default" : "secondary"}
                    className={
                      video.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {video.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm cursor-help">
                          {formatTimeAgo(video.created_at)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {formatDate(video.created_at)}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Updated</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm cursor-help">
                          {formatTimeAgo(video.updated_at)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {formatDate(video.updated_at)}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>

            {/* Share Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Share</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(video.title, "Title")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Title
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(video.short_description, "Description")
                    }
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Description
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareVideo}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="mt-8 flex items-center space-x-2 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0"
            onClick={() => navigate("/list-video")}
          >
            Videos
          </Button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Video #{video.video_number}</span>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              video "{video?.title}" and remove all associated files from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
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

export default ViewVideo;
