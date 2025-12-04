import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Lock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://rakantrad.eu/api/contact-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.phone, // Using company field for phone
          role: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: isRTL ? "تم الإرسال بنجاح" : "Message Sent",
          description: isRTL
            ? "سنتواصل معك في أقرب وقت ممكن."
            : "We will contact you as soon as possible.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      toast({
        title: isRTL ? "خطأ" : "Error",
        description: isRTL
          ? "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى."
          : "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-background ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal-dark via-charcoal to-charcoal-light" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="font-sans text-xs tracking-wide-luxury uppercase text-primary mb-4 block animate-fade-in">
              {t.nav?.contact || "Contact"}
            </span>
            <h1 className="font-serif text-4xl md:text-6xl font-medium text-ivory leading-tight mb-6 animate-fade-up">
              {t.contact?.title || "Start a Confidential Conversation"}
            </h1>
            <p className="font-sans text-lg text-champagne/80 leading-relaxed animate-fade-up animation-delay-200">
              {t.contact?.subtitle || "Your inquiry will be handled with the utmost discretion."}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans text-sm text-foreground mb-2">
                      {t.contact?.form?.name || "Full Name"} *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-card border-border focus:border-primary"
                      placeholder={isRTL ? "الاسم الكامل" : "Your full name"}
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-sm text-foreground mb-2">
                      {t.contact?.form?.email || "Email Address"} *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-card border-border focus:border-primary"
                      placeholder={isRTL ? "بريدك الإلكتروني" : "Your email"}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans text-sm text-foreground mb-2">
                      {t.contact?.form?.phone || "Phone Number"}
                    </label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-card border-border focus:border-primary"
                      placeholder={isRTL ? "رقم الهاتف" : "Your phone number"}
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-sm text-foreground mb-2">
                      {t.contact?.form?.subject || "Subject"}
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="bg-card border-border focus:border-primary"
                      placeholder={isRTL ? "موضوع الاستفسار" : "Subject of inquiry"}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-sm text-foreground mb-2">
                    {t.contact?.form?.message || "Your Message"} *
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="bg-card border-border focus:border-primary resize-none"
                    placeholder={isRTL ? "كيف يمكننا مساعدتك؟" : "How can we assist you?"}
                  />
                </div>

                <div className={`flex items-start gap-3 p-4 bg-muted rounded-sm ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                  <Lock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="font-sans text-sm text-muted-foreground">
                    {t.contact?.privacy || "All communications are encrypted and handled with strict confidentiality."}
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full luxury-button text-base py-6 font-sans tracking-wide group"
                >
                  {isSubmitting ? (
                    t.contact?.form?.submitting || "Sending..."
                  ) : (
                    <>
                      {t.contact?.form?.submit || "Send Inquiry"}
                      <Send className={`h-5 w-5 ${isRTL ? "mr-2" : "ml-2"}`} />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="lg:pl-8">
              <div className="sticky top-32">
                <h2 className="font-serif text-2xl md:text-3xl font-medium text-foreground mb-4">
                  {t.contact?.info?.title || "Direct Contact"}
                </h2>
                <p className="font-sans text-muted-foreground mb-10">
                  {t.contact?.info?.subtitle || "For matters requiring immediate attention."}
                </p>

                <div className="space-y-6">
                  <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                    <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-medium text-foreground mb-1">
                        {isRTL ? "البريد الإلكتروني" : "Email"}
                      </h4>
                      <a href="mailto:inquiries@rakan.com" className="font-sans text-muted-foreground hover:text-primary transition-colors">
                        {t.contact?.info?.email || "inquiries@rakan.com"}
                      </a>
                    </div>
                  </div>

                  <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                    <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-medium text-foreground mb-1">
                        {isRTL ? "الهاتف" : "Phone"}
                      </h4>
                      <a href="tel:+18007252" className="font-sans text-muted-foreground hover:text-primary transition-colors">
                        {t.contact?.info?.phone || "+1 (800) RAKAN"}
                      </a>
                    </div>
                  </div>

                  <div className={`flex items-start gap-4 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                    <div className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-sans text-sm font-medium text-foreground mb-1">
                        {isRTL ? "الموقع" : "Location"}
                      </h4>
                      <p className="font-sans text-muted-foreground">
                        {t.contact?.info?.address || "By appointment only"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative Element */}
                <div className="mt-16 p-8 bg-charcoal rounded-sm">
                  <div className="w-12 h-px bg-gradient-gold mb-6" />
                  <p className="font-serif text-lg text-ivory italic">
                    {isRTL
                      ? "\"كل رحلة استثنائية تبدأ بمحادثة واحدة.\""
                      : "\"Every exceptional journey begins with a single conversation.\""}
                  </p>
                </div>
              </div>
            </div>
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

export default Contact;