import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, Users, DollarSign, Activity, Building2, Globe, Zap, Target, Play } from "lucide-react";

const SuccessStories = () => {
  const { t, isRTL } = useLanguage();

  const stories = [
    {
      company: "Global Logistics Inc.",
      industry: "Logistics & Supply Chain",
      icon: Globe,
      videoId: "dQw4w9WgXcQ",
      metrics: [
        { label: "Time Saved", value: "30%", icon: TrendingUp },
        { label: "Cost Reduction", value: "$2.5M", icon: DollarSign },
        { label: "User Adoption", value: "95%", icon: Users },
      ],
      challenge: "Manual reporting processes were taking weeks to complete, delaying critical business decisions and consuming valuable analyst time.",
      solution: "Implemented iGenius AI Data Assistant across finance and operations teams, automating routine queries and enabling self-service analytics.",
      results: "Monthly reporting time reduced by 30%, freeing up the finance team to focus on strategic analysis. Real-time dashboards now provide instant visibility into key metrics.",
      testimonial: "iGenius transformed how we work with data. What used to take days now happens in seconds.",
      author: "Sarah Chen, CFO",
    },
    {
      company: "TechCorp Solutions",
      industry: "Technology & SaaS",
      icon: Zap,
      videoId: "9bZkp7q19f0",
      metrics: [
        { label: "Pipeline Visibility", value: "100%", icon: Target },
        { label: "Decision Speed", value: "5x", icon: Activity },
        { label: "Team Efficiency", value: "40%", icon: TrendingUp },
      ],
      challenge: "Sales managers struggled to get real-time pipeline insights, relying on outdated dashboards and manual reports that were often several days old.",
      solution: "Deployed iGenius across the entire sales organization with integration to CRM and sales systems, enabling natural language queries for instant insights.",
      results: "Sales managers now have real-time pipeline visibility without waiting for dashboards. Decision-making speed increased 5x, and team productivity improved by 40%.",
      testimonial: "The game-changer was instant access to data. Our team can now ask questions and get answers immediately.",
      author: "Michael Torres, VP of Sales",
    },
    {
      company: "Healthcare Solutions Group",
      industry: "Healthcare",
      icon: Building2,
      videoId: "jNQXAC9IVRw",
      metrics: [
        { label: "Issue Detection", value: "Real-time", icon: Activity },
        { label: "Operational Efficiency", value: "35%", icon: TrendingUp },
        { label: "Cost Savings", value: "$1.8M", icon: DollarSign },
      ],
      challenge: "Operational bottlenecks were difficult to identify quickly, leading to delays in patient care and inefficient resource allocation across facilities.",
      solution: "Integrated iGenius with operational systems to monitor performance metrics in real-time, with AI-powered alerts for anomalies and bottlenecks.",
      results: "Now able to identify operational bottlenecks instantly. iGenius has become essential to daily operations, improving efficiency by 35% and saving $1.8M annually.",
      testimonial: "We can now see and solve problems before they impact patient care. It's been transformational.",
      author: "Emma Williams, COO",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            {t.successStories.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {t.successStories.subtitle}
          </p>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto space-y-24">
          {stories.map((story, index) => {
            const CompanyIcon = story.icon;
            
            return (
              <div 
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-elegant">
                  <CardHeader className="bg-gradient-subtle pb-8">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                          <CompanyIcon className="w-8 h-8" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl sm:text-3xl mb-2">{story.company}</CardTitle>
                          <p className="text-muted-foreground">{story.industry}</p>
                        </div>
                      </div>
                    </div>

                    {/* Video */}
                    <div className="mt-8 relative rounded-lg overflow-hidden aspect-video bg-black/5">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${story.videoId}`}
                        title={`${story.company} Success Story`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                      {story.metrics.map((metric, idx) => {
                        const MetricIcon = metric.icon;
                        return (
                          <div key={idx} className="text-center p-4 rounded-lg bg-background/50 backdrop-blur-sm">
                            <MetricIcon className="w-6 h-6 text-primary mx-auto mb-2" />
                            <div className="text-3xl font-bold text-primary mb-1">{metric.value}</div>
                            <div className="text-sm text-muted-foreground">{metric.label}</div>
                          </div>
                        );
                      })}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-8 space-y-6">
                    {/* Challenge */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-primary">{t.successStories.challenge}</h3>
                      <p className="text-muted-foreground leading-relaxed">{story.challenge}</p>
                    </div>

                    {/* Solution */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-primary">{t.successStories.solution}</h3>
                      <p className="text-muted-foreground leading-relaxed">{story.solution}</p>
                    </div>

                    {/* Results */}
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-primary">{t.successStories.results}</h3>
                      <p className="text-muted-foreground leading-relaxed">{story.results}</p>
                    </div>

                    {/* Testimonial */}
                    <div className="bg-gradient-subtle p-6 rounded-lg border border-border mt-6">
                      <p className="text-lg italic mb-4">"{story.testimonial}"</p>
                      <p className="font-semibold">— {story.author}</p>
                    </div>

                    <div className="pt-4">
                      <Button variant="outline" size="lg">
                        {t.successStories.cta}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            {t.successStories.ctaSection.title}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t.successStories.ctaSection.subtitle}
          </p>
          <Button variant="hero" size="lg">
            {t.nav.login_button}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>{t.footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
};

export default SuccessStories;