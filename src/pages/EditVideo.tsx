import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Brain,
  ArrowLeft,
  Save,
  Upload,
  Video,
  Image as ImageIcon,
  AlertCircle,
  Eye,
  RefreshCw,
  Play,
  X,
  Download,
} from "lucide-react";
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

const EditVideo = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    long_description: "",
    video_number: "",
    is_active: true,
  });

  const [files, setFiles] = useState({
    photo_file: null as File | null,
    video_file: null as File | null,
  });

  const [existingFiles, setExistingFiles] = useState({
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
        const video = data.video;
        setFormData({
          title: video.title || "",
          short_description: video.short_description || "",
          long_description: video.long_description || "",
          video_number: video.video_number.toString(),
          is_active: video.is_active,
        });

        // Get file URLs
        const urlsResponse = await fetch(
          `https://rakantrad.eu/api/website-videos/${id}/urls`
        );
        if (urlsResponse.ok) {
          const urlsData = await urlsResponse.json();
          if (urlsData.success) {
            setExistingFiles({
              photo_url: urlsData.urls.photo_url || "",
              video_url: urlsData.urls.video_url || "",
            });
          }
        }
      } else {
        setError(data.message || "Failed to load video data");
      }
    } catch (err) {
      console.error("Error fetching video:", err);
      setError(err instanceof Error ? err.message : "Unable to load video");
      toast.error("Failed to load video data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      is_active: checked,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList[0]) {
      setFiles((prev) => ({
        ...prev,
        [name]: fileList[0],
      }));
    }
  };

  const removeFile = (fileType: "photo_file" | "video_file") => {
    setFiles((prev) => ({
      ...prev,
      [fileType]: null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.short_description ||
      !formData.video_number
    ) {
      setError("Please fill in all required fields");
      toast.error("Please fill in all required fields");
      return;
    }

    setUpdating(true);
    setError("");

    try {
      const submitData = new FormData();

      // Append form data
      submitData.append("title", formData.title);
      submitData.append("short_description", formData.short_description);
      submitData.append("long_description", formData.long_description);
      submitData.append("video_number", formData.video_number);
      submitData.append("is_active", formData.is_active.toString());

      // Append files only if new ones are provided
      if (files.photo_file) {
        submitData.append("photo_file", files.photo_file);
      }
      if (files.video_file) {
        submitData.append("video_file", files.video_file);
      }

      // Use PUT method for update
      const response = await fetch(
        `https://rakantrad.eu/api/website-videos/${id}`,
        {
          method: "PUT",
          body: submitData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Update error:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error(
          `Update failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Video updated successfully!");
        navigate("/list-video");
      } else {
        setError(data.message || "Failed to update video");
        toast.error(data.message || "Failed to update video");
      }
    } catch (err) {
      console.error("Error updating video:", err);
      setError("Failed to update video. Please try again.");
      toast.error("Failed to update video");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      )
    ) {
      navigate("/list-video");
    }
  };

  const getFileUrl = (filePath: string) => {
    if (!filePath) return "";

    // If it's already a full URL (from the /urls API endpoint)
    if (filePath.startsWith("http")) {
      // Fix the API URL by adding /app/public if it's missing
      if (
        filePath.includes("https://rakantrad.eu/storage/") &&
        !filePath.includes("/app/public/")
      ) {
        return filePath.replace(
          "https://rakantrad.eu/storage/",
          "https://rakantrad.eu/storage/app/public/"
        );
      }
      return filePath;
    }

    return `https://rakantrad.eu/storage/app/public/${filePath}`;
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Access Required
            </h2>
            <p className="text-muted-foreground mb-6">
              Please log in to edit videos.
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
            <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Loading Video...
            </h2>
            <p className="text-muted-foreground">
              Please wait while we load the video data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Error Loading Video
            </h2>
            <p className="text-muted-foreground mb-6">{error}</p>
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/list-video")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {t.videos?.editVideo || "Edit Video"}
              </h1>
              <p className="text-muted-foreground">
                {t.videos?.editVideoSubtitle ||
                  "Update video details and files"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-sm text-muted-foreground">
              Video #{formData.video_number}
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-700" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-elegant h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Save className="h-5 w-5 text-primary" />
                    <span>
                      {t.videos?.editVideoDetails || "Edit Video Details"}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {t.videos?.updateVideoDetails ||
                      "Update the video information below"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Video Status */}
                    <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div>
                        <Label
                          htmlFor="is_active"
                          className="text-sm font-medium text-foreground"
                        >
                          Video Status
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {formData.is_active
                            ? "This video is visible on the website"
                            : "This video is hidden from the website"}
                        </p>
                      </div>
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={handleSwitchChange}
                      />
                    </div>

                    {/* Video Number */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        Video Number *
                      </Label>
                      <Input
                        name="video_number"
                        type="number"
                        placeholder="Enter video number"
                        value={formData.video_number}
                        onChange={handleInputChange}
                        required
                        min="1"
                      />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        Title *
                      </Label>
                      <Input
                        name="title"
                        type="text"
                        placeholder="Enter video title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Short Description */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        Short Description *
                      </Label>
                      <Textarea
                        name="short_description"
                        placeholder="Brief description (max 500 characters)"
                        value={formData.short_description}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        maxLength={500}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.short_description.length}/500 characters
                      </p>
                    </div>

                    {/* Long Description */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">
                        Long Description
                      </Label>
                      <Textarea
                        name="long_description"
                        placeholder="Detailed description (optional)"
                        value={formData.long_description}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="flex-1"
                        disabled={updating}
                      >
                        {t.videos?.cancel || "Cancel"}
                      </Button>
                      <Button
                        type="submit"
                        variant="hero"
                        className="flex-1"
                        disabled={updating}
                      >
                        {updating ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            {t.videos?.updating || "Updating..."}
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            {t.videos?.saveChanges || "Save Changes"}
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Form Requirements */}
                    <div className="p-4 bg-secondary rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>{t.videos?.note || "Note"}:</strong>{" "}
                        {t.videos?.requiredFields ||
                          "Fields marked with * are required. Leave file fields empty to keep existing files."}
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - File Management */}
            <div className="space-y-6">
              {/* Current Thumbnail */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <ImageIcon className="h-4 w-4" />
                    <span>Current Thumbnail</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {existingFiles.photo_url ? (
                    <div className="space-y-4">
                      <div className="relative aspect-video rounded-lg overflow-hidden border">
                        <img
                          src={getFileUrl(existingFiles.photo_url)}
                          alt="Current thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            window.open(
                              getFileUrl(existingFiles.photo_url),
                              "_blank"
                            )
                          }
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            window.open(
                              getFileUrl(existingFiles.photo_url),
                              "_blank"
                            )
                          }
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-sm text-muted-foreground">
                        No thumbnail uploaded
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* New Thumbnail Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Update Thumbnail</span>
                  </CardTitle>
                  <CardDescription>
                    Upload a new image to replace the current thumbnail
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {files.photo_file ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                          <div className="flex items-center space-x-3">
                            <ImageIcon className="h-5 w-5 text-primary" />
                            <div className="overflow-hidden">
                              <p className="text-sm font-medium truncate">
                                {files.photo_file.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(files.photo_file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile("photo_file")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                        <Input
                          name="photo_file"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="photo_file_edit"
                        />
                        <label
                          htmlFor="photo_file_edit"
                          className="cursor-pointer block"
                        >
                          <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-1">
                            Click to upload new thumbnail
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, GIF up to 2MB
                          </p>
                        </label>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Current Video */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Video className="h-4 w-4" />
                    <span>Current Video</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {existingFiles.video_url ? (
                    <div className="space-y-4">
                      <div className="aspect-video rounded-lg bg-secondary border flex items-center justify-center">
                        <Video className="h-12 w-12 text-primary opacity-70" />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            window.open(
                              getFileUrl(existingFiles.video_url),
                              "_blank"
                            )
                          }
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Play
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            window.open(
                              getFileUrl(existingFiles.video_url),
                              "_blank"
                            )
                          }
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-sm text-muted-foreground">
                        No video uploaded
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* New Video Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Update Video File</span>
                  </CardTitle>
                  <CardDescription>
                    Upload a new video to replace the current file
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {files.video_file ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Video className="h-5 w-5 text-primary" />
                            <div className="overflow-hidden">
                              <p className="text-sm font-medium truncate">
                                {files.video_file.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(
                                  files.video_file.size /
                                  (1024 * 1024)
                                ).toFixed(1)}{" "}
                                MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile("video_file")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                        <Input
                          name="video_file"
                          type="file"
                          accept="video/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="video_file_edit"
                        />
                        <label
                          htmlFor="video_file_edit"
                          className="cursor-pointer block"
                        >
                          <Video className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground mb-1">
                            Click to upload new video
                          </p>
                          <p className="text-xs text-muted-foreground">
                            MP4, AVI, MOV up to 1000MB
                          </p>
                        </label>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditVideo;
