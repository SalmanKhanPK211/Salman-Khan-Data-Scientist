import { useEffect, useState, useMemo } from "react";
import { Download, Eye } from "lucide-react";
import { useProfilePic } from "@/hooks/useProfilePic";

const useTypingEffect = (texts: string[], typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) => {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(current.substring(0, charIndex + 1));
        setCharIndex((i) => i + 1);
        if (charIndex + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      } else {
        setDisplayText(current.substring(0, charIndex - 1));
        setCharIndex((i) => i - 1);
        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setTextIndex((i) => (i + 1) % texts.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, pauseTime]);

  return displayText;
};

const HeroSection = () => {
  const [offset, setOffset] = useState(0);
  const titles = useMemo(() => ["Data Analyst", "Problem Solver", "Insight Generator"], []);
  const typedText = useTypingEffect(titles);
  const profileImg = useProfilePic();

  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center section-padding pt-28 relative overflow-hidden">
      {/* Parallax background elements */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `translateY(${offset * 0.3}px)` }}
      >
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `translateY(${offset * 0.15}px)` }}
      >
        <div className="absolute top-40 right-1/4 w-4 h-4 rounded-full bg-primary/20" />
        <div className="absolute top-60 left-1/3 w-3 h-3 rounded-full bg-accent/30" />
        <div className="absolute bottom-40 right-1/3 w-5 h-5 rounded-full bg-primary/15" />
      </div>

      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="order-2 lg:order-1 space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fade-in-up">
            👋 Welcome to my Portfolio
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in-up relative" style={{ animationDelay: "0.1s" }}>
            <span className="invisible" aria-hidden="true">
              Aspiring {titles.reduce((a, b) => a.length >= b.length ? a : b, "")}| Turning Data into Insights
            </span>
            <span className="absolute inset-0">
              Aspiring <span className="gradient-text">{typedText}</span><span className="animate-pulse">|</span> Turning Data into Insights
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Skilled in Python, Data Cleaning, Visualization, and Business Insights
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <a href="/Salman_Khan_CV.pdf" download="Salman_Khan_CV.pdf" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gradient-bg text-primary-foreground font-medium hover:opacity-90 transition-opacity shadow-lg">
              <Download size={18} /> Download CV
            </a>
            <a href="#projects" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary text-primary font-medium hover:bg-primary/5 transition-colors">
              <Eye size={18} /> View Projects
            </a>
          </div>
        </div>
        <div className="order-1 lg:order-2 flex justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="relative" style={{ transform: `translateY(${offset * -0.1}px)` }}>
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/20 shadow-card-hover animate-float group">
              <img src={profileImg} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full gradient-bg opacity-30 blur-xl" />
            <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-accent/30 blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
