import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Calendar, 
  BarChart3, 
  Video, 
  BookOpen, 
  Settings,
  Clock,
  Zap,
  TrendingUp,
  Award,
  Shield,
  HelpCircle
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for dashboard
  const [dashboardData, setDashboardData] = useState({
    videosWatched: 12,
    totalVideos: 50,
    learningProgress: 65,
    streakDays: 7,
    recentActivity: [
      { id: 1, action: "completed_video", title: "Introduction to AI", time: "2 hours ago" },
      { id: 2, action: "started_course", title: "Data Analysis Fundamentals", time: "1 day ago" },
      { id: 3, action: "earned_badge", title: "Quick Learner", time: "2 days ago" }
    ],
    recommendedVideos: [
      { id: 1, title: "Advanced Analytics Techniques", duration: "15 min", category: "Advanced" },
      { id: 2, title: "Data Visualization Best Practices", duration: "12 min", category: "Intermediate" },
      { id: 3, title: "Machine Learning Basics", duration: "20 min", category: "Beginner" }
    ]
  });

  // Calculate days remaining with fallback
  const daysRemaining = user?.days_remaining !== null ? user.days_remaining : 'N/A';

  // Format approval period
  const formatApprovalPeriod = () => {
    if (!user?.approved_from || !user?.approved_to) {
      return "Not specified";
    }
    return `${new Date(user.approved_from).toLocaleDateString()} - ${new Date(user.approved_to).toLocaleDateString()}`;
  };

  const getAccountTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'premium': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'pro': return 'bg-gradient-to-r from-blue-500 to-teal-500';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t.dashboard?.title || "Dashboard"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t.dashboard?.welcome || "Welcome back"} {user?.first_name} {user?.last_name}!
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <nav className="space-y-2">
                  {[
                    { id: "overview", label: "Overview", icon: BarChart3 },
                    { id: "profile", label: "My Profile", icon: User },
                    { id: "learning", label: "My Learning", icon: BookOpen },
                    { id: "videos", label: "Video Library", icon: Video },
                    { id: "settings", label: "Settings", icon: Settings },
                    { id: "help", label: "Help & Support", icon: HelpCircle }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {activeTab === "overview" && (
              <>
                {/* Account Status Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="animate-fade-in">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        <Badge className={getAccountTypeColor(user?.account_type || '')}>
                          {user?.account_type || 'Standard'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {user?.approved ? 'Active' : 'Pending Approval'}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Days Remaining</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{daysRemaining}</div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatApprovalPeriod()}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
                      <Zap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{dashboardData.streakDays} days</div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Keep going! You're on fire! 🔥
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Progress Section */}
                <Card className="animate-fade-in" style={{ animationDelay: "300ms" }}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Learning Progress</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Course Completion</span>
                        <span>{dashboardData.learningProgress}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${dashboardData.learningProgress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{dashboardData.videosWatched} of {dashboardData.totalVideos} videos completed</span>
                        <span>{Math.round(dashboardData.videosWatched  / dashboardData.totalVideos * 100)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity & Recommended Videos */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <Card className="animate-fade-in" style={{ animationDelay: "400ms" }}>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {dashboardData.recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <Award className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">
                                {activity.title}
                              </p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {activity.action.replace('_', ' ')} • {activity.time}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recommended Videos */}
                  <Card className="animate-fade-in" style={{ animationDelay: "500ms" }}>
                    <CardHeader>
                      <CardTitle>Recommended For You</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {dashboardData.recommendedVideos.map((video) => (
                          <div key={video.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {video.title}
                              </p>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                <span>{video.duration}</span>
                                <span>•</span>
                                <Badge variant="outline" className="text-xs">
                                  {video.category}
                                </Badge>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Video className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {activeTab === "profile" && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          First Name
                        </label>
                        <div className="p-3 rounded-lg border border-border bg-secondary/50">
                          {user?.first_name}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Last Name
                        </label>
                        <div className="p-3 rounded-lg border border-border bg-secondary/50">
                          {user?.last_name}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone Number
                        </label>
                        <div className="p-3 rounded-lg border border-border bg-secondary/50">
                          {user?.phone_number}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email
                        </label>
                        <div className="p-3 rounded-lg border border-border bg-secondary/50">
                          {user?.email || "Not provided"}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Username
                        </label>
                        <div className="p-3 rounded-lg border border-border bg-secondary/50">
                          {user?.username || "Not set"}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Account Type
                        </label>
                        <div className="p-3 rounded-lg border border-border bg-secondary/50">
                          <Badge className={getAccountTypeColor(user?.account_type || '')}>
                            {user?.account_type || 'Standard'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Approval Status
                        </label>
                        <div className="p-3 rounded-lg border border-border bg-secondary/50">
                          <Badge variant={user?.approved ? "default" : "secondary"}>
                            {user?.approved ? "Approved" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Days Remaining
                        </label>
                        <div className="p-3 rounded-lg border border-border bg-secondary/50">
                          {daysRemaining}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "learning" && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>My Learning Journey</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Start Your Learning Journey
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Access our curated video library and start learning today!
                    </p>
                    <Button onClick={() => setActiveTab("videos")}>
                      Browse Videos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "videos" && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Video Library</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Video Content Coming Soon
                    </h3>
                    <p className="text-muted-foreground">
                      Our video library is being prepared with amazing content for you.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "settings" && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Settings Panel
                      </h3>
                      <p className="text-muted-foreground">
                        Account settings and preferences will be available here.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "help" && (
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Help & Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center py-8">
                      <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Need Help?
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Our support team is here to help you with any questions.
                      </p>
                      <Button variant="outline">
                        Contact Support
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;