import AnimatedSection from "./AnimatedSection";
import { FileSpreadsheet, Database, BarChart3, Code2, Terminal, Github } from "lucide-react";

const tools = [
  { icon: FileSpreadsheet, name: "Microsoft Excel", color: "hsl(141, 71%, 38%)" },
  { icon: Database, name: "SQL", color: "hsl(210, 79%, 46%)" },
  { icon: BarChart3, name: "Power BI", color: "hsl(45, 93%, 47%)" },
  { icon: Code2, name: "Python", color: "hsl(207, 51%, 44%)" },
  { icon: Terminal, name: "VS Code", color: "hsl(210, 79%, 46%)" },
  { icon: Github, name: "GitHub", color: "hsl(0, 0%, 40%)" },
];

const ToolsSection = () => (
  <section id="tools" className="section-padding bg-card">
    <div className="container mx-auto">
      <AnimatedSection>
        <h2 className="section-title">Tools I <span className="gradient-text">Use</span></h2>
        <p className="section-subtitle">Technologies powering my data analysis workflow</p>
      </AnimatedSection>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 max-w-4xl mx-auto">
        {tools.map(({ icon: Icon, name }, i) => (
          <AnimatedSection key={name} delay={i * 0.08}>
            <div className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-background border border-border shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon size={28} className="text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-center">{name}</span>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default ToolsSection;
