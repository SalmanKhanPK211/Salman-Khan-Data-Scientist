import { Github, Linkedin, Mail, Phone, Send } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xzdkpjla";

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com/SalmanKhanPK211" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/salman-khan-a196773aa" },
  { icon: Mail, label: "Email", href: "https://mail.google.com/mail/?view=cm&to=salmankhan.pk211@gmail.com" },
  { icon: Phone, label: "WhatsApp", href: "https://wa.me/923137700673" },
  { icon: Send, label: "TikTok", href: "https://tiktok.com" },
];

const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      if (response.ok) {
        toast({ title: "Message sent!", description: "Thanks for reaching out. I'll get back to you soon." });
        setForm({ name: "", email: "", message: "" });
      } else {
        throw new Error("Failed to send");
      }
    } catch {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-card">
      <div className="container mx-auto">
        <AnimatedSection>
          <h2 className="section-title">Get In <span className="gradient-text">Touch</span></h2>
          <p className="section-subtitle">Feel free to reach out for collaboration or freelance work</p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <AnimatedSection delay={0.1}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              <textarea
                placeholder="Your Message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl gradient-bg text-primary-foreground font-medium hover:opacity-90 transition-opacity shadow-lg disabled:opacity-60"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </AnimatedSection>

          <AnimatedSection delay={0.2} className="flex flex-col justify-center">
            <h3 className="text-xl font-semibold mb-6">Connect with me</h3>
            <div className="flex flex-wrap gap-4">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-background border border-border shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
                >
                  <Icon size={20} className="text-primary" />
                  <span className="text-sm font-medium">{label}</span>
                </a>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
