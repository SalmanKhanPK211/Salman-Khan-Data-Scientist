import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";

const navLinks = ["Home", "About", "Services", "Skills", "Projects", "Tools", "Certifications", "Contact"];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-card/80 backdrop-blur-lg shadow-card border-b border-border" : "bg-transparent"}`}>
      <div className="container mx-auto flex items-center justify-between py-4">
        <a href="/#home" className="text-xl font-bold gradient-text">Salman Khan</a>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link} href={`/#${link.toLowerCase()}`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              {link}
            </a>
          ))}
          <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full bg-secondary hover:bg-muted transition-colors" aria-label="Toggle dark mode">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-3 lg:hidden">
          <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full bg-secondary" aria-label="Toggle dark mode">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2" aria-label="Menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-card/95 backdrop-blur-lg border-t border-border animate-fade-in">
          <div className="container mx-auto py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a key={link} href={`/#${link.toLowerCase()}`} onClick={() => setIsOpen(false)} className="py-2 px-4 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
