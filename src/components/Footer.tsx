import { Github, Heart, Linkedin, Mail } from "lucide-react";

const footerLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Mail, href: "https://mail.google.com/mail/?view=cm&to=salmankhan.pk211@gmail.com", label: "Email" },
];

const Footer = () => (
  <footer className="py-10 px-4 border-t border-border bg-background">
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <a href="#home" className="text-lg font-bold gradient-text">Salman Khan</a>

      <div className="flex items-center gap-4">
        {footerLinks.map(({ icon: Icon, href, label }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" aria-label={label}>
            <Icon size={18} />
          </a>
        ))}
      </div>

      <p className="text-sm text-muted-foreground flex items-center gap-1">
        © 2026 Salman Khan. Made with <Heart size={14} className="text-primary" /> and Data
      </p>
    </div>
  </footer>
);

export default Footer;
