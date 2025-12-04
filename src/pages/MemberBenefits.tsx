import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Crown, Award, Users, BookOpen, Headphones, Sparkles, 
  Trophy, Gift, Calendar, MessageSquare, Shield, Zap 
} from "lucide-react";

const MemberBenefits = () => {
  const { t } = useLanguage();

  const benefits = [
    {
      icon: Crown,
      title: "Priority Support",
      description: "Get dedicated support from our expert team with faster response times and priority issue resolution.",
      features: ["24/7 Priority Access", "Dedicated Account Manager", "Direct Escalation Channel"],
    },
    {
      icon: BookOpen,
      title: "Exclusive Training",
      description: "Access premium training materials, workshops, and certification programs to maximize your team's potential.",
      features: ["Advanced Workshops", "Certification Programs", "Custom Training Sessions"],
    },
    {
      icon: Sparkles,
      title: "Early Access",
      description: "Be the first to try new features and products before they're released to the general public.",
      features: ["Beta Feature Access", "Product Previews", "Exclusive Webinars"],
    },
    {
      icon: Users,
      title: "Community Network",
      description: "Connect with other enterprise leaders, share best practices, and learn from success stories.",
      features: ["Private Member Forums", "Networking Events", "User Groups"],
    },
    {
      icon: Trophy,
      title: "Performance Analytics",
      description: "Advanced analytics and insights to track your team's usage and measure ROI effectively.",
      features: ["Custom Reports", "Usage Analytics", "ROI Tracking"],
    },
    {
      icon: Gift,
      title: "Special Discounts",
      description: "Enjoy exclusive pricing on additional licenses, premium features, and partner services.",
      features: ["Volume Discounts", "Partner Benefits", "Upgrade Privileges"],
    },
  ];

  const tiers = [
    {
      name: "Silver",
      icon: Award,
      price: "Custom",
      features: [
        "Priority Support",
        "Monthly Training Sessions",
        "Community Access",
        "Quarterly Reviews",
      ],
    },
    {
      name: "Gold",
      icon: Trophy,
      price: "Custom",
      popular: true,
      features: [
        "All Silver Benefits",
        "Dedicated Account Manager",
        "Early Feature Access",
        "Custom Integrations",
        "Monthly Strategy Sessions",
      ],
    },
    {
      name: "Platinum",
      icon: Crown,
      price: "Custom",
      features: [
        "All Gold Benefits",
        "24/7 Premium Support",
        "Custom Development",
        "Executive Briefings",
        "On-site Training",
        "SLA Guarantees",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            {t.memberBenefits.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {t.memberBenefits.subtitle}
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card 
                  key={index}
                  className="hover:shadow-elegant transition-all duration-300 hover:scale-105 animate-fade-in border-2 hover:border-primary/50"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-4 w-fit">
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{benefit.description}</p>
                    <div className="space-y-2 pt-2">
                      {benefit.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Membership Tiers</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the membership level that best fits your organization's needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {tiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <Card 
                  key={index}
                  className={`relative ${tier.popular ? 'border-primary border-2 shadow-elegant scale-105' : 'border-2'} hover:shadow-elegant transition-all duration-300 animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="text-center pb-8">
                    <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/10 text-primary mx-auto mb-4">
                      <Icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                    <div className="text-3xl font-bold">{tier.price}</div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    <div className="pt-6">
                      <Button 
                        variant={tier.popular ? "default" : "outline"} 
                        className="w-full"
                        size="lg"
                      >
                        {t.memberBenefits.cta}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Unlock Premium Benefits?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contact our team to discuss which membership tier is right for your organization.
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

export default MemberBenefits;