import profileImg from "@/assets/profile.jpg";
import { GraduationCap, BarChart3, Briefcase } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const highlights = [
  { icon: GraduationCap, label: "BS Computer Science" },
  { icon: BarChart3, label: "Data Science Learner" },
  { icon: Briefcase, label: "Freelancing Enthusiast" },
];

const AboutSection = () => (
  <section id="about" className="section-padding bg-card">
    <div className="container mx-auto">
      <AnimatedSection>
        <h2 className="section-title">About <span className="gradient-text">Me</span></h2>
        <p className="section-subtitle">Get to know me better</p>
      </AnimatedSection>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <AnimatedSection className="flex justify-center" delay={0.1}>
          <div className="w-72 h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden shadow-card-hover group">
            <img src={profileImg} alt="About me" loading="lazy" width={512} height={512} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <p className="text-muted-foreground leading-relaxed mb-8">
            I am a Computer Science graduate passionate about Data Analytics. I specialize in transforming raw data into meaningful insights using tools like Excel, Python, and visualization platforms. I enjoy solving real-world problems and helping businesses make data-driven decisions.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {highlights.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 p-4 rounded-xl bg-background shadow-card border border-border hover:shadow-card-hover transition-shadow">
                <div className="p-2 rounded-lg gradient-bg">
                  <Icon size={20} className="text-primary-foreground" />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
);

export default AboutSection;
