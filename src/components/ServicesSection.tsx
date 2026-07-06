import { Sparkles, BarChart3, LayoutDashboard, PieChart, FileText, Database } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const services = [
  { icon: Sparkles, title: "Data Cleaning & Preparation", desc: "Excel, CSV, datasets — ensuring quality data for analysis" },
  { icon: BarChart3, title: "Data Analysis & Insights", desc: "Trend analysis, KPIs, and actionable business insights" },
  { icon: LayoutDashboard, title: "Dashboard Creation", desc: "Interactive Excel dashboards, Power BI ready solutions" },
  { icon: PieChart, title: "Data Visualization", desc: "Charts, graphs, and data storytelling for impact" },
  { icon: FileText, title: "Business Reporting", desc: "Comprehensive reports with actionable recommendations" },
  { icon: Database, title: "Data Entry & Formatting", desc: "Structured, accurate, and well-organized data" },
];

const ServicesSection = () => (
  <section id="services" className="section-padding">
    <div className="container mx-auto">
      <AnimatedSection>
        <h2 className="section-title">My <span className="gradient-text">Services</span></h2>
        <p className="section-subtitle">What I can do for you</p>
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(({ icon: Icon, title, desc }, i) => (
          <AnimatedSection key={title} delay={i * 0.1}>
            <div className="group p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 h-full">
              <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon size={24} className="text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm">{desc}</p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
