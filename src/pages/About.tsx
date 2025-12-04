import { NavLink } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Star, Zap, Eye, Target, Clock } from "lucide-react";

const About = () => {
  const { t, isRTL } = useLanguage();

  const values = [
    {
      icon: Shield,
      title: t.about?.values?.discretion?.title || "Absolute Discretion",
      description: t.about?.values?.discretion?.description || "Privacy is not just a promise—it's the foundation of everything we do.",
    },
    {
      icon: Star,
      title: t.about?.values?.excellence?.title || "Uncompromising Excellence",
      description: t.about?.values?.excellence?.description || "We accept nothing less than perfection in every detail, every interaction.",
    },
    {
      icon: Zap,
      title: t.about?.values?.innovation?.title || "Intelligent Innovation",
      description: t.about?.values?.innovation?.description || "Cutting-edge solutions delivered with timeless sophistication.",
    },
  ];

  const milestones = [
    { year: "2010", title: isRTL ? "التأسيس" : "Foundation", description: isRTL ? "تأسيس ركان بمبادئ التميز والسرية" : "Rakan established with principles of excellence and discretion" },
    { year: "2015", title: isRTL ? "التوسع العالمي" : "Global Expansion", description: isRTL ? "توسيع الخدمات للعملاء الدوليين" : "Extended services to international clientele" },
    { year: "2020", title: isRTL ? "الابتكار الرقمي" : "Digital Innovation", description: isRTL ? "دمج التكنولوجيا المتقدمة مع الخدمة الشخصية" : "Integrated advanced technology with personal service" },
    { year: "2024", title: isRTL ? "قيادة الصناعة" : "Industry Leadership", description: isRTL ? "معترف بها كمعيار للتميز" : "Recognized as the benchmark for excellence" },
  ];

  const team = [
    { name: isRTL ? "أحمد المنصور" : "Ahmad Al-Mansour", role: isRTL ? "المؤسس والرئيس التنفيذي" : "Founder & CEO", image: "/placeholder.svg" },
    { name: isRTL ? "سارة الخالد" : "Sarah Al-Khalid", role: isRTL ? "مدير العمليات" : "Chief Operations Officer", image: "/placeholder.svg" },
    { name: isRTL ? "محمد العلي" : "Mohammed Al-Ali", role: isRTL ? "رئيس الاستشارات" : "Head of Advisory", image: "/placeholder.svg" },
  ];

  return (
    <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-dark via-charcoal to-charcoal-light" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-sans text-xs tracking-wide-luxury uppercase text-primary mb-4 block animate-fade-in">
              {t.nav?.about || "About"}
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-medium text-ivory leading-tight mb-6 animate-fade-up">
              {t.about?.title || "The Rakan Difference"}
            </h1>
            <p className="font-sans text-lg text-champagne/80 leading-relaxed animate-fade-up animation-delay-200">
              {t.about?.subtitle || "A legacy of excellence, built on trust and discretion."}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="font-sans text-xs tracking-wide-luxury uppercase text-primary mb-4 block">
                {t.about?.story?.title || "Our Story"}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-6">
                {isRTL ? "إرث من التميز" : "A Legacy of Excellence"}
              </h2>
              <p className="font-sans text-muted-foreground text-lg leading-relaxed mb-8">
                {t.about?.story?.description || "Founded on principles of excellence and discretion, Rakan has grown to become the preferred choice for clients who value privacy, quality, and unparalleled service."}
              </p>
              <p className="font-sans text-muted-foreground leading-relaxed">
                {t.about?.description || "For those who demand the extraordinary, Rakan represents the pinnacle of professional service."}
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-charcoal rounded-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-champagne/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-6xl font-medium tracking-luxury text-ivory/10">RAKAN</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-gold rounded-sm opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 lg:py-32 bg-muted">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-10 bg-card rounded-sm luxury-card">
              <div className="flex items-center gap-4 mb-6">
                <Target className="h-8 w-8 text-primary" />
                <h3 className="font-serif text-2xl font-medium text-foreground">
                  {t.about?.mission?.title || "Our Mission"}
                </h3>
              </div>
              <p className="font-sans text-muted-foreground leading-relaxed">
                {t.about?.mission?.description || "To redefine what's possible for our clients by combining world-class expertise with an unwavering commitment to discretion and excellence."}
              </p>
            </div>
            <div className="p-10 bg-card rounded-sm luxury-card">
              <div className="flex items-center gap-4 mb-6">
                <Eye className="h-8 w-8 text-primary" />
                <h3 className="font-serif text-2xl font-medium text-foreground">
                  {t.about?.vision?.title || "Our Vision"}
                </h3>
              </div>
              <p className="font-sans text-muted-foreground leading-relaxed">
                {t.about?.vision?.description || "To be the trusted partner of choice for distinguished individuals and organizations seeking exceptional, confidential solutions."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 lg:py-32 bg-charcoal-dark">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="font-sans text-xs tracking-wide-luxury uppercase text-primary mb-4 block">
              {isRTL ? "قيمنا" : "Our Values"}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-medium text-ivory mb-6">
              {t.about?.values?.title || "Our Values"}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group p-8 bg-charcoal/50 border border-champagne/10 rounded-sm hover:border-primary/30 transition-all duration-500"
              >
                <value.icon className="h-10 w-10 text-primary mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-serif text-xl md:text-2xl font-medium text-ivory mb-4">
                  {value.title}
                </h3>
                <p className="font-sans text-champagne/70 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="font-sans text-xs tracking-wide-luxury uppercase text-primary mb-4 block">
              {isRTL ? "رحلتنا" : "Our Journey"}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-medium text-foreground">
              {isRTL ? "محطات بارزة" : "Key Milestones"}
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`relative flex items-center gap-8 mb-12 last:mb-0 ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
                    <span className="font-serif text-3xl font-medium text-primary">{milestone.year}</span>
                    <h4 className="font-serif text-xl font-medium text-foreground mt-2">{milestone.title}</h4>
                    <p className="font-sans text-muted-foreground mt-2">{milestone.description}</p>
                  </div>
                  <div className="relative z-10 w-4 h-4 bg-primary rounded-full border-4 border-background" />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 lg:py-32 bg-muted">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="font-sans text-xs tracking-wide-luxury uppercase text-primary mb-4 block">
              {t.about?.team?.title || "Leadership"}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-medium text-foreground mb-6">
              {t.about?.team?.title || "Leadership"}
            </h2>
            <p className="font-sans text-muted-foreground text-lg">
              {t.about?.team?.subtitle || "Guided by expertise, driven by excellence."}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="group text-center">
                <div className="aspect-square bg-charcoal rounded-sm overflow-hidden mb-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-4xl font-medium text-ivory/20">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <h4 className="font-serif text-xl font-medium text-foreground mb-1">{member.name}</h4>
                <p className="font-sans text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-charcoal-dark">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-5xl font-medium text-ivory mb-6">
              {t.services?.cta?.title || "Begin Your Journey"}
            </h2>
            <p className="font-sans text-champagne/70 text-lg leading-relaxed mb-10">
              {t.services?.cta?.description || "Every exceptional outcome starts with a conversation."}
            </p>
            <NavLink to="/contact">
              <Button size="lg" className="luxury-button text-base px-10 py-6 font-sans tracking-wide group">
                {t.services?.cta?.button || "Schedule a Private Consultation"}
                <ArrowRight className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
              </Button>
            </NavLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-charcoal-dark border-t border-champagne/10">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="font-serif text-xl tracking-luxury text-ivory">RAKAN</span>
            <p className="font-sans text-xs text-champagne/40">
              {t.footer?.copyright || "© 2025 Rakan. All rights reserved."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;