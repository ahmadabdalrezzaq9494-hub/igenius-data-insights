import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  Star,
  TrendingUp,
  Users,
  Briefcase,
  Lock,
  Award,
  ChevronRight,
} from "lucide-react";

// Splash Screen Component
const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-dark flex items-center justify-center">
      <div className="text-center animate-fade-in">
        <img
          src="/logo.png"
          alt="Rakan Logo"
          className="h-28 w-28 mx-auto mb-8 animate-scale-in"
        />
        <p className="text-lg text-gold-light font-serif tracking-luxury uppercase">
          {t.splash.tagline}
        </p>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-charcoal-900 text-ivory-100 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Rakan" className="h-10 w-10" />
              <span className="text-2xl font-serif font-bold">Rakan</span>
            </div>
            <p className="text-ivory-100/70 mb-6 max-w-md">
              {t.footer.description}
            </p>
            <p className="text-sm text-ivory-100/50">{t.footer.confidential}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-primary">{t.footer.quickLinks}</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-ivory-100/70 hover:text-primary transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-ivory-100/70 hover:text-primary transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-ivory-100/70 hover:text-primary transition-colors">
                  {t.nav.services}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-ivory-100/70 hover:text-primary transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-primary">{t.footer.legal}</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-ivory-100/70 hover:text-primary transition-colors">
                  {t.footer.privacy}
                </a>
              </li>
              <li>
                <a href="#" className="text-ivory-100/70 hover:text-primary transition-colors">
                  {t.footer.terms}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-ivory-100/10 mt-12 pt-8 text-center text-sm text-ivory-100/50">
          {t.footer.copyright}
        </div>
      </div>
    </footer>
  );
};

const Index = () => {
  const { t } = useLanguage();
  const [showSplash, setShowSplash] = useState(true);

  // Check if splash was already shown this session
  useEffect(() => {
    const splashShown = sessionStorage.getItem("splashShown");
    if (splashShown) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem("splashShown", "true");
    setShowSplash(false);
  };

  const services = [
    { icon: Briefcase, title: t.services.items.strategic.title, description: t.services.items.strategic.description },
    { icon: TrendingUp, title: t.services.items.wealth.title, description: t.services.items.wealth.description },
    { icon: Lock, title: t.services.items.private.title, description: t.services.items.private.description },
    { icon: Users, title: t.services.items.family.title, description: t.services.items.family.description },
    { icon: Shield, title: t.services.items.risk.title, description: t.services.items.risk.description },
    { icon: Award, title: t.services.items.lifestyle.title, description: t.services.items.lifestyle.description },
  ];

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      <div className={`min-h-screen bg-background ${showSplash ? "opacity-0" : "opacity-100 transition-opacity duration-500"}`}>
        <Navigation />

        <main>
          {/* Hero Section */}
          <section className="relative min-h-[90vh] flex items-center overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-charcoal-800/20" />
            
            {/* Decorative elements */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-0 w-80 h-80 bg-champagne-500/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <div className="animate-fade-in">
                  <img
                    src="/logo.png"
                    alt="Rakan"
                    className="h-20 w-20 mx-auto mb-8 opacity-80"
                  />
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-foreground mb-6 leading-tight animate-slide-up">
                  {t.hero.title}
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: "100ms" }}>
                  {t.hero.subtitle}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "200ms" }}>
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
                    asChild
                  >
                    <Link to="/contact">
                      {t.hero.cta}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary/30 hover:border-primary px-8 py-6 text-lg"
                    asChild
                  >
                    <Link to="/about">
                      {t.hero.secondary}
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center pt-2">
                <div className="w-1 h-2 bg-primary/50 rounded-full" />
              </div>
            </div>
          </section>

          {/* About Preview Section */}
          <section className="py-24 md:py-32 bg-secondary/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
                  {t.about.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  {t.about.subtitle}
                </p>
                <p className="text-foreground/80 leading-relaxed mb-10">
                  {t.about.description}
                </p>
                <Button variant="outline" asChild className="border-primary/30 hover:border-primary">
                  <Link to="/about">
                    {t.services.learnMore}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Services Grid */}
          <section className="py-24 md:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
                  {t.services.title}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {t.services.subtitle}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <Card
                    key={index}
                    className="group bg-background border-border/50 hover:border-primary/50 transition-all duration-500 animate-fade-in overflow-hidden"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-8">
                      <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                        <service.icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-12">
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link to="/services">
                    {t.services.learnMore}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-24 md:py-32 bg-charcoal-900 text-ivory-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
                  {t.about.values.title}
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {[
                  { icon: Lock, ...t.about.values.discretion },
                  { icon: Star, ...t.about.values.excellence },
                  { icon: TrendingUp, ...t.about.values.innovation },
                ].map((value, index) => (
                  <div
                    key={index}
                    className="text-center p-8 rounded-xl border border-ivory-100/10 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <value.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                    <p className="text-ivory-100/70 leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 md:py-32 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-champagne-500/5" />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-6">
                  {t.services.cta.title}
                </h2>
                <p className="text-lg text-muted-foreground mb-10">
                  {t.services.cta.description}
                </p>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg"
                  asChild
                >
                  <Link to="/contact">
                    {t.services.cta.button}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
