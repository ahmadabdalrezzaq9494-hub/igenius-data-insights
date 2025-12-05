import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Brain,
  Shield,
  LineChart,
  Zap,
  Database,
  Lock,
  BarChart3,
  MessageSquare,
  Play,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { NavLink } from "@/components/NavLink";


interface WebsiteVideo {
  id: number;
  title: string;
  short_description: string;
  long_description: string;
  photo_file: string;
  video_number: string;
  video_file?: string;
}

const Products = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [videos, setVideos] = useState<WebsiteVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add this function to filter videos
  const getFilteredVideos = (): WebsiteVideo[] => {
    if (user?.is_admin) {
      return videos; // Admin sees all videos
    }

    if (user?.account_type === "premium") {
      return videos; // Premium users see all videos
    }

    if (user?.account_type === "elite") {
      return videos.slice(0, 4); // Elite users see only 2 videos
    }

    return videos.slice(0, 2); // Default: show only 2 videos for non-authenticated or other users
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://rakantrad.eu/api/website-videos");

        if (!response.ok) {
          throw new Error("Failed to fetch videos");
        }

        const data = await response.json();
        console.log("fetched data = ", data);
        if (data.success) {
          setVideos(data.videos);
        } else {
          throw new Error(data.message || "Failed to load videos");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Parse features from long_description (assuming format: ["feature1", "feature2", ...])
  // Update the parseFeatures function to handle undefined/null values
  // Replace the parseFeatures function with this:
  const parseFeatures = (
    longDescription: string | null | undefined
  ): string[] => {
    if (!longDescription) return [];

    // If it's already a valid JSON array, parse it
    try {
      const parsed = JSON.parse(longDescription);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // If not JSON, check if it's a string with array-like format
      const trimmed = longDescription.trim();

      // Check for array format like ["feature1", "feature2"]
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          // Try to parse as JSON again after cleaning
          const cleaned = trimmed.replace(/'/g, '"');
          const parsed = JSON.parse(cleaned);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        } catch {
          // If still fails, split by commas and clean up
          const features = trimmed
            .slice(1, -1) // Remove brackets
            .split(",")
            .map((feature) => feature.trim().replace(/['"]/g, ""))
            .filter((feature) => feature.length > 0);
          return features;
        }
      }

      // If it's just a regular string, return it as a single feature
      return [longDescription];
    }

    return [];
  };
  // Get icon based on video number or title
  const getIcon = (video: WebsiteVideo, index: number) => {
    const icons = [
      Brain,
      Shield,
      LineChart,
      Database,
      BarChart3,
      MessageSquare,
      Zap,
      Lock,
    ];
    return icons[index % icons.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <p className="text-red-500">Error: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            {t.products?.title || "Our Products"}
          </h1>
          <p
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            {t.products?.subtitle || "Discover our innovative solutions"}
          </p>
        </div>
      </section>
      {/* Products Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {getFilteredVideos().length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No products available at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-24">
              {getFilteredVideos().map((video, index) => {
                const Icon = getIcon(video, index);
                const isEven = index % 2 === 0;
                const features = parseFeatures(video.long_description);

                return (
                  <div
                    key={video.id}
                    className={`flex flex-col ${
                      isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                    } gap-12 items-center animate-fade-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* Video/Content */}
                    <div className="flex-1 w-full">
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl bg-secondary/5 backdrop-blur-sm border border-border/50 group hover:shadow-elegant hover:scale-[1.02] transition-all duration-300">
                        {video.video_file ? (
                          <video
                            className="w-full h-full object-cover"
                            controls
                            poster={
                              video.photo_file
                                ? `https://rakantrad.eu/storage/app/public/${video.photo_file}`
                                : undefined
                            }
                          >
                            <source
                              src={`https://rakantrad.eu/storage/app/public/${video.video_file}`}
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary">
                            <div className="text-center">
                              <Play className="w-16 h-16 text-primary mx-auto mb-4" />
                              <p className="text-muted-foreground">
                                Video preview not available
                              </p>
                            </div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                          <Play className="w-16 h-16 text-primary" />
                        </div>
                    
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-6">
                      <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary">
                        <Icon className="w-8 h-8" />
                      </div>

                      <h2 className="text-3xl sm:text-4xl font-bold">
                        {video.title}
                      </h2>

                      <p className="text-lg text-muted-foreground">
                        {video.short_description}
                      </p>

                      {features.length > 0 && (
                        <div className="space-y-3">
                          {features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                               <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                               <span className="text-foreground font-medium">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-4 pt-4">
                        <Button variant="default" size="lg">
                          {t.products?.learnMore || "Learn More"}
                        </Button>
                        <Button variant="outline" size="lg">
                          {t.products?.watchVideo || "Watch Demo"}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
      {/* CTA Section */}
      {!user && getFilteredVideos().length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Want to see more videos?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Log in to access our full library of exclusive content and
              training materials.
            </p>
            <Button variant="hero" size="lg" asChild>
              <NavLink to="/login">Log In to See More</NavLink>
            </Button>
          </div>
        </section>
      )}
      {user?.account_type === "elite" && getFilteredVideos().length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Want unlimited access?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Upgrade to Premium account to unlock all videos and exclusive
              content.
            </p>
            <Button variant="hero" size="lg">
              Upgrade to Premium
            </Button>
          </div>
        </section>
      )}
      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>{t.footer?.copyright || "© 2025 iGenius. All rights reserved."}</p>
        </div>
      </footer>
    </div>
  );
};

export default Products;
