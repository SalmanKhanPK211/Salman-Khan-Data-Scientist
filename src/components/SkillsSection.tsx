import AnimatedSection from "./AnimatedSection";

const skills = [
  { name: "Microsoft Excel (Advanced)", level: 90 },
  { name: "Data Cleaning", level: 85 },
  { name: "Data Visualization", level: 80 },
  { name: "Pivot Tables & Dashboards", level: 85 },
  { name: "Basic Python (Pandas)", level: 60 },
  { name: "SQL (Basic)", level: 55 },
  { name: "Problem Solving", level: 90 },
  { name: "Analytical Thinking", level: 88 },
];

const SkillsSection = () => (
  <section id="skills" className="section-padding bg-card">
    <div className="container mx-auto">
      <AnimatedSection>
        <h2 className="section-title">My <span className="gradient-text">Skills</span></h2>
        <p className="section-subtitle">Technologies and abilities I bring to the table</p>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {skills.map(({ name, level }, i) => (
          <AnimatedSection key={name} delay={i * 0.05}>
            <div className="p-4 rounded-xl bg-background border border-border shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 cursor-default">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-sm">{name}</span>
                <span className="text-sm text-primary font-semibold">{level}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full gradient-bg transition-all duration-1000" style={{ width: `${level}%` }} />
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default SkillsSection;
