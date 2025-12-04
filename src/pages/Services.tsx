import { NavLink } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Star, Lock, Users, AlertTriangle, Sparkles, ChevronRight } from "lucide-react";

const Services = () => {
  const { t, isRTL } = useLanguage();

  const services = [
    {
      icon: Shield,
      title: t.services?.items?.strategic?.title || "Strategic Advisory",
      description: t.services?.items?.strategic?.description || "Expert guidance for complex decisions, delivered with confidentiality and precision.",
      features: [
        isRTL ? "التخطيط الاستراتيجي" : "Strategic Planning",
        isRTL ? "تحليل السوق" : "Market Analysis",
        isRTL ? "إدارة المخاطر" : "Risk Management",
        isRTL ? "تطوير الأعمال" : "Business Development",
      ],
    },
    {
      icon: Star,
      title: t.services?.items?.wealth?.title || "Wealth Preservation",
      description: t.services?.items?.wealth?.description || "Sophisticated strategies to protect and grow generational wealth.",
      features: [
        isRTL ? "تخطيط التركة" : "Estate Planning",
        isRTL ? "تحسين الضرائب" : "Tax Optimization",
        isRTL ? "إدارة الأصول" : "Asset Management",
        isRTL ? "نقل الثروة" : "Wealth Transfer",
      ],
    },
    {
      icon: Lock,
      title: t.services?.items?.private?.title || "Private Transactions",
      description: t.services?.items?.private?.description || "Discreet facilitation of high-value acquisitions and arrangements.",
      features: [
        isRTL ? "عمليات الاستحواذ" : "Acquisitions",
        isRTL ? "المفاوضات" : "Negotiations",
        isRTL ? "العناية الواجبة" : "Due Diligence",
        isRTL ? "هيكلة الصفقات" : "Deal Structuring",
      ],
    },
    {
      icon: Users,
      title: t.services?.items?.family?.title || "Family Office Services",
      description: t.services?.items?.family?.description || "Comprehensive management for distinguished family enterprises.",
      features: [
        isRTL ? "حوكمة العائلة" : "Family Governance",
        isRTL ? "تخطيط الخلافة" : "Succession Planning",
        isRTL ? "إدارة الاستثمار" : "Investment Management",
        isRTL ? "الخدمات الإدارية" : "Administrative Services",
      ],
    },
    {
      icon: AlertTriangle,
      title: t.services?.items?.risk?.title || "Risk Intelligence",
      description: t.services?.items?.risk?.description || "Proactive identification and mitigation of potential vulnerabilities.",
      features: [
        isRTL ? "تقييم التهديدات" : "Threat Assessment",
        isRTL ? "التحقيقات" : "Investigations",
        isRTL ? "إدارة الأزمات" : "Crisis Management",
        isRTL ? "حماية السمعة" : "Reputation Protection",
      ],
    },
    {
      icon: Sparkles,
      title: t.services?.items?.lifestyle?.title || "Lifestyle Concierge",
      description: t.services?.items?.lifestyle?.description || "Elevated experiences curated to the most exacting standards.",
      features: [
        isRTL ? "ترتيبات السفر" : "Travel Arrangements",
        isRTL ? "الوصول الحصري" : "Exclusive Access",
        isRTL ? "التجارب الفاخرة" : "Luxury Experiences",
        isRTL ? "الشراء الخاص" : "Private Acquisitions",
      ],
    },
  ];

  return (
    <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-dark via-charcoal to-charcoal-light" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-sans text-xs tracking-wide-luxury uppercase text-primary mb-4 block animate-fade-in">
              {t.nav?.services || "Services"}
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-medium text-ivory leading-tight mb-6 animate-fade-up">
              {t.services?.title || "Our Services"}
            </h1>
            <p className="font-sans text-lg text-champagne/80 leading-relaxed animate-fade-up animation-delay-200">
              {t.services?.description || "Each engagement is tailored to your unique requirements, delivered with the discretion and excellence that define the Rakan experience."}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group p-8 bg-card border border-border rounded-sm hover:border-primary/30 hover:shadow-elegant transition-all duration-500"
              >
                <service.icon className="h-10 w-10 text-primary mb-6 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-serif text-xl md:text-2xl font-medium text-foreground mb-4">
                  {service.title}
                </h3>
                <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                  {service.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className={`flex items-center font-sans text-sm text-muted-foreground ${isRTL ? "flex-row-reverse" : ""}`}>
                      <ChevronRight className={`h-4 w-4 text-primary ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <NavLink
                  to="/contact"
                  className={`inline-flex items-center font-sans text-sm text-primary hover:text-primary-dark transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  {t.services?.learnMore || "Learn More"}
                  <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 lg:py-32 bg-muted">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="font-sans text-xs tracking-wide-luxury uppercase text-primary mb-4 block">
              {isRTL ? "نهجنا" : "Our Approach"}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-medium text-foreground mb-6">
              {isRTL ? "كيف نعمل" : "How We Work"}
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: isRTL ? "الاستشارة" : "Consultation", desc: isRTL ? "محادثة سرية لفهم احتياجاتك" : "A confidential conversation to understand your needs" },
              { step: "02", title: isRTL ? "التحليل" : "Analysis", desc: isRTL ? "تقييم شامل لمتطلباتك" : "Comprehensive assessment of your requirements" },
              { step: "03", title: isRTL ? "الاستراتيجية" : "Strategy", desc: isRTL ? "حل مخصص مصمم لأهدافك" : "Tailored solution designed for your objectives" },
              { step: "04", title: isRTL ? "التنفيذ" : "Execution", desc: isRTL ? "تنفيذ دقيق مع دعم مستمر" : "Precise implementation with ongoing support" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <span className="font-serif text-5xl font-light text-primary/30 mb-4 block">{item.step}</span>
                <h4 className="font-serif text-xl font-medium text-foreground mb-2">{item.title}</h4>
                <p className="font-sans text-sm text-muted-foreground">{item.desc}</p>
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

export default Services;