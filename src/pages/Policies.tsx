import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Lock, FileText, CheckCircle2, Globe, Server, Eye, UserCheck } from "lucide-react";

const Policies = () => {
  const { t } = useLanguage();

  const policies = [
    {
      icon: Shield,
      title: t.policies.privacy.title,
      description: t.policies.privacy.content,
      sections: [
        "Data Collection & Usage",
        "User Rights & Choices",
        "Cookie Policy",
        "Third-Party Services",
      ],
    },
    {
      icon: FileText,
      title: t.policies.terms.title,
      description: t.policies.terms.content,
      sections: [
        "Service Usage Terms",
        "User Responsibilities",
        "Intellectual Property",
        "Limitation of Liability",
      ],
    },
    {
      icon: Lock,
      title: t.policies.cookies.title,
      description: t.policies.cookies.content,
      sections: [
        "Data Processing Principles",
        "Subprocessor List",
        "Data Transfer Mechanisms",
        "Data Retention Policy",
      ],
    },
    {
      icon: Server,
      title: t.policies.data.title,
      description: t.policies.data.content,
      sections: [
        "Infrastructure Security",
        "Access Controls",
        "Incident Response",
        "Security Certifications",
      ],
    },
  ];

  const compliance = [
    { name: "GDPR", icon: Globe, description: "EU General Data Protection Regulation" },
    { name: "SOC 2 Type II", icon: Shield, description: "Security and Availability Controls" },
    { name: "ISO 27001", icon: CheckCircle2, description: "Information Security Management" },
    { name: "HIPAA", icon: Lock, description: "Healthcare Data Protection" },
  ];

  const principles = [
    {
      icon: Eye,
      title: "Transparency",
      description: "Clear communication about how we handle your data and operate our services.",
    },
    {
      icon: Lock,
      title: "Security First",
      description: "Bank-level encryption and security measures to protect your information.",
    },
    {
      icon: UserCheck,
      title: "User Control",
      description: "You maintain full control over your data with the right to access, modify, or delete.",
    },
    {
      icon: Shield,
      title: "Compliance",
      description: "Adherence to international standards and regulations for data protection.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            {t.policies.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
            {t.policies.subtitle}
          </p>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <div 
                  key={index}
                  className="text-center space-y-4 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-primary/10 text-primary">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold">{principle.title}</h3>
                  <p className="text-muted-foreground">{principle.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Policy Documents */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Policy Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {policies.map((policy, index) => {
              const Icon = policy.icon;
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
                    <CardTitle className="text-xl">{policy.title}</CardTitle>
                    <p className="text-muted-foreground text-sm pt-2">{policy.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {policy.sections.map((section, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{section}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      Read Full Document
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compliance Certifications */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Compliance & Certifications</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            We maintain the highest standards of compliance with international regulations
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {compliance.map((cert, index) => {
              const Icon = cert.icon;
              return (
                <Card 
                  key={index}
                  className="text-center hover:shadow-elegant transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="pt-6 space-y-3">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg">{cert.name}</h3>
                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-subtle">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Questions About Our Policies?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our compliance team is here to help answer any questions about our security practices and policies.
          </p>
          <Button variant="hero" size="lg">
            Contact Compliance Team
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center text-muted-foreground">
          <p className="mb-4">{t.footer.copyright}</p>
          <p className="text-sm">Last Updated: January 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Policies;