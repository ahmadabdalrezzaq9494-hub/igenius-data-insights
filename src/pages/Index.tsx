import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  MessageSquare,
  Shield,
  BarChart3,
  Zap,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  Database,
  ArrowRight,
  CheckCircle2,
  Star,
  Lock,
  Brain,
  LineChart,
  Play,
} from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.jpg";
import { useState, useEffect } from "react";

interface Testimonial {
  id: number;
  star_count: number;
  comment_text: string;
  commenter_name: string;
  commenter_job?: string;
  created_at: string;
  updated_at: string;
}

const Index = () => {
  const { t } = useLanguage();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch testimonials from Laravel backend
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(
          "https://rakantrad.eu/api/customer-comments"
        );
        const data = await response.json();

        if (data.success) {
          setTestimonials(data.data);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // controll sending contact requests
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    role: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://rakantrad.eu/api/contact", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Reset form
        setFormData({
          name: "",
          company: "",
          email: "",
          role: "",
          message: "",
        });

        // Show success message
        alert(result.message);
      } else {
        // Handle validation errors
        if (result.errors) {
          const errorMessages = Object.values(result.errors).flat().join("\n");
          alert(`Please fix the following errors:\n${errorMessages}`);
        } else {
          alert(result.message || "Something went wrong!");
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-subtle py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-up">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                  {t.hero.title}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                  {t.hero.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={() => scrollToSection("contact")}
                  >
                    {t.hero.bookDemo}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => scrollToSection("how-it-works")}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    {t.hero.watchDemo}
                  </Button>
                </div>
              </div>
              <div className="animate-scale-in">
                <img
                  src={heroDashboard}
                  alt="AI-powered data analytics dashboard interface"
                  className="rounded-2xl shadow-elegant w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-muted-foreground mb-8 text-sm uppercase tracking-wider font-semibold">
              {t.trustedBy}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-60">
              {[
                "Acme Corp",
                "TechVision",
                "DataFlow Inc",
                "InnovateCo",
                "FutureScale",
              ].map((company) => (
                <div
                  key={company}
                  className="text-xl font-bold text-foreground"
                >
                  {company}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product Overview Section */}
        <section id="product" className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {t.product.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t.product.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: MessageSquare,
                  title: t.product.features.naturalLanguage.title,
                  description: t.product.features.naturalLanguage.description,
                },
                {
                  icon: Shield,
                  title: t.product.features.security.title,
                  description: t.product.features.security.description,
                },
                {
                  icon: BarChart3,
                  title: t.product.features.realTime.title,
                  description: t.product.features.realTime.description,
                },
                {
                  icon: Brain,
                  title: t.product.features.explainable.title,
                  description: t.product.features.explainable.description,
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="group hover:border-primary transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section id="solutions" className="py-20 md:py-32 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {t.useCases.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t.useCases.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: TrendingUp,
                  title: t.useCases.executives.title,
                  description: t.useCases.executives.description,
                },
                {
                  icon: DollarSign,
                  title: t.useCases.finance.title,
                  description: t.useCases.finance.description,
                },
                {
                  icon: Users,
                  title: t.useCases.sales.title,
                  description: t.useCases.sales.description,
                },
                {
                  icon: Activity,
                  title: t.useCases.operations.title,
                  description: t.useCases.operations.description,
                },
              ].map((useCase, index) => (
                <Card
                  key={index}
                  className="group hover:border-accent transition-all duration-300 bg-background animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                      <useCase.icon className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="text-xl">{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {useCase.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {t.howItWorks.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t.howItWorks.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {[
                {
                  step: "01",
                  icon: Database,
                  title: t.howItWorks.step1.title,
                  description: t.howItWorks.step1.description,
                },
                {
                  step: "02",
                  icon: MessageSquare,
                  title: t.howItWorks.step2.title,
                  description: t.howItWorks.step2.description,
                },
                {
                  step: "03",
                  icon: LineChart,
                  title: t.howItWorks.step3.title,
                  description: t.howItWorks.step3.description,
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="text-center animate-slide-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative mb-8">
                    <div className="h-20 w-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto shadow-elegant">
                      <step.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-accent">
                        {step.step}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 md:py-32 bg-gradient-subtle">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {t.benefits.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t.benefits.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: Zap,
                  title: t.benefits.speed.title,
                  description: t.benefits.speed.description,
                },
                {
                  icon: Users,
                  title: t.benefits.democratization.title,
                  description: t.benefits.democratization.description,
                },
                {
                  icon: TrendingUp,
                  title: t.benefits.efficiency.title,
                  description: t.benefits.efficiency.description,
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-8 rounded-xl bg-background shadow-card hover:shadow-elegant transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="customers" className="py-20 md:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {t.testimonials.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t.testimonials.subtitle}
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : testimonials.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card
                    key={testimonial.id || index}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader>
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < testimonial.star_count
                                ? "fill-accent text-accent"
                                : "fill-muted text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-foreground italic mb-6">
                        "{testimonial.comment_text}"
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="border-t border-border pt-6">
                        <p className="font-bold text-foreground">
                          {testimonial.commenter_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.commenter_job || "Customer"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No testimonials available yet.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Resources Section */}
        <section id="resources" className="py-20 md:py-32 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                {t.resources.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t.resources.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  type: "Guide",
                  title: t.resources.guide.title,
                  description: t.resources.guide.description,
                  cta: t.resources.guide.cta,
                },
                {
                  type: "Webinar",
                  title: t.resources.webinar.title,
                  description: t.resources.webinar.description,
                  cta: t.resources.webinar.cta,
                },
                {
                  type: "Whitepaper",
                  title: t.resources.whitepaper.title,
                  description: t.resources.whitepaper.description,
                  cta: t.resources.whitepaper.cta,
                },
              ].map((resource, index) => (
                <Card
                  key={index}
                  className="group cursor-pointer hover:border-primary transition-all duration-300 bg-background animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="text-sm font-semibold text-accent mb-2">
                      {resource.type}
                    </div>
                    <CardTitle className="text-xl mb-4 group-hover:text-primary transition-colors">
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {resource.description}
                    </p>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto font-semibold group-hover:text-primary"
                    >
                      {resource.cta}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact / Demo Section */}
        {/* Contact / Demo Section */}
        <section id="contact" className="py-20 md:py-32 bg-gradient-primary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                  {t.contact.title}
                </h2>
                <p className="text-lg text-white/90">{t.contact.subtitle}</p>
              </div>

              <Card className="bg-background/95 backdrop-blur shadow-elegant">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t.contact.form.name}
                        </label>
                        <Input
                          placeholder={t.contact.form.name}
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t.contact.form.company}
                        </label>
                        <Input
                          placeholder={t.contact.form.company}
                          value={formData.company}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              company: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t.contact.form.email}
                        </label>
                        <Input
                          type="email"
                          placeholder={t.contact.form.email}
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          {t.contact.form.role}
                        </label>
                        <Input
                          placeholder={t.contact.form.role}
                          value={formData.role}
                          onChange={(e) =>
                            setFormData({ ...formData, role: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t.contact.form.message}
                      </label>
                      <Textarea
                        placeholder={t.contact.form.message}
                        rows={4}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : t.contact.form.submit}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  iGenius
                </span>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                {t.footer.tagline}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">
                {t.footer.product}
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("product")}
                    className="text-muted-foreground hover:text-primary text-sm"
                  >
                    {t.nav.product}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("solutions")}
                    className="text-muted-foreground hover:text-primary text-sm"
                  >
                    {t.nav.solutions}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">
                {t.footer.company}
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("customers")}
                    className="text-muted-foreground hover:text-primary text-sm"
                  >
                    {t.nav.customers}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("resources")}
                    className="text-muted-foreground hover:text-primary text-sm"
                  >
                    {t.nav.resources}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">
                {t.footer.legal}
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary text-sm"
                  >
                    {t.footer.privacy}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary text-sm"
                  >
                    {t.footer.terms}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <p className="text-center text-muted-foreground text-sm">
              {t.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
