import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Brain,
  ArrowLeft,
  Upload,
  Video,
  Image,
  Plus,
  AlertCircle,
} from "lucide-react";

const AddVideo = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    long_description: "",
    video_number: "",
  });

  const [files, setFiles] = useState({
    photo_file: null as File | null,
    video_file: null as File | null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFiles((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate required fields
    if (
      !formData.title ||
      !formData.short_description ||
      !formData.video_number
    ) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();

      // Append form data
      submitData.append("title", formData.title);
      submitData.append("short_description", formData.short_description);
      submitData.append("long_description", formData.long_description);
      submitData.append("video_number", formData.video_number);

      // Append files if they exist
      if (files.photo_file) {
        submitData.append("photo_file", files.photo_file);
      }
      if (files.video_file) {
        submitData.append("video_file", files.video_file);
      }

      console.log("start sending vedio");
      const response = await fetch("https://rakantrad.eu/api/website-videos", {
        method: "POST",
        body: submitData,
        // Don't set Content-Type header for FormData - browser will set it automatically with boundary
      });

      if (!response.ok) {
        // Try to get more error details
        const errorText = await response.text();
        console.error("Server response error:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });

        throw new Error(
          `Server error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Full response data:", data);

      if (data.success) {
        setSuccess("Video uploaded successfully!");
        // Reset form
        setFormData({
          title: "",
          short_description: "",
          long_description: "",
          video_number: "",
        });
        setFiles({
          photo_file: null,
          video_file: null,
        });
        // Redirect to videos list after 2 seconds
        setTimeout(() => {
          navigate("/videos");
        }, 2000);
      } else {
        setError(data.message || "Failed to upload video");
        console.error('Upload error details:', data.Message);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto text-center">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Access Denied
            </h2>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to upload videos.
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {t.videos?.addVideo || "Add New Video"}
              </h1>
              <p className="text-muted-foreground">
                {t.videos?.addVideoSubtitle ||
                  "Upload a new video to the website"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg">
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-primary" />
                <span>{t.videos?.videoDetails || "Video Details"}</span>
              </CardTitle>
              <CardDescription>
                {t.videos?.fillVideoDetails ||
                  "Fill in the details for your new video"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Video Number */}
                <div className="space-y-2">
                  <label
                    htmlFor="video_number"
                    className="text-sm font-medium text-foreground"
                  >
                    {t.videos?.videoNumber || "Video Number"} *
                  </label>
                  <Input
                    id="video_number"
                    name="video_number"
                    type="number"
                    placeholder={
                      t.videos?.videoNumberPlaceholder ||
                      "Enter video number (must be unique)"
                    }
                    value={formData.video_number}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <label
                    htmlFor="title"
                    className="text-sm font-medium text-foreground"
                  >
                    {t.videos?.title || "Title"} *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    placeholder={
                      t.videos?.titlePlaceholder || "Enter video title"
                    }
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Short Description */}
                <div className="space-y-2">
                  <label
                    htmlFor="short_description"
                    className="text-sm font-medium text-foreground"
                  >
                    {t.videos?.shortDescription || "Short Description"} *
                  </label>
                  <Textarea
                    id="short_description"
                    name="short_description"
                    placeholder={
                      t.videos?.shortDescriptionPlaceholder ||
                      "Brief description (max 500 characters)"
                    }
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
                  <label
                    htmlFor="long_description"
                    className="text-sm font-medium text-foreground"
                  >
                    {t.videos?.longDescription || "Long Description"}
                  </label>
                  <Textarea
                    id="long_description"
                    name="long_description"
                    placeholder={
                      t.videos?.longDescriptionPlaceholder ||
                      "Detailed description (optional)"
                    }
                    value={formData.long_description}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>

                {/* Photo File Upload */}
                <div className="space-y-2">
                  <label
                    htmlFor="photo_file"
                    className="text-sm font-medium text-foreground"
                  >
                    {t.videos?.thumbnail || "Thumbnail Image"}
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <Input
                      id="photo_file"
                      name="photo_file"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="photo_file" className="cursor-pointer">
                      <Image className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">
                        {files.photo_file
                          ? files.photo_file.name
                          : t.videos?.uploadThumbnail ||
                            "Click to upload thumbnail"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.videos?.imageRequirements ||
                          "PNG, JPG, GIF up to 2MB"}
                      </p>
                    </label>
                  </div>
                </div>

                {/* Video File Upload */}
                <div className="space-y-2">
                  <label
                    htmlFor="video_file"
                    className="text-sm font-medium text-foreground"
                  >
                    {t.videos?.videoFile || "Video File"}
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <Input
                      id="video_file"
                      name="video_file"
                      type="file"
                      accept="video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="video_file" className="cursor-pointer">
                      <Video className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">
                        {files.video_file
                          ? files.video_file.name
                          : t.videos?.uploadVideo || "Click to upload video"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.videos?.videoRequirements ||
                          "MP4, AVI, MOV up to 1000MB"}
                      </p>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="hero"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t.videos?.uploading || "Uploading..."}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      {t.videos?.uploadVideo || "Upload Video"}
                    </>
                  )}
                </Button>

                {/* Form Requirements */}
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>{t.videos?.note || "Note"}:</strong>{" "}
                    {t.videos?.requiredFields ||
                      "Fields marked with * are required."}
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AddVideo;
