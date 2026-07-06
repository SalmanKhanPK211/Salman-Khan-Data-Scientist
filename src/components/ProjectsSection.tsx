import { ExternalLink } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import proj1 from "@/assets/project-1.jpg";
import proj2 from "@/assets/project-2.jpg";
import proj3 from "@/assets/project-3.jpg";
import proj4 from "@/assets/project-4.jpg";
import proj5 from "@/assets/project-5.jpg";
import proj6 from "@/assets/project-6.jpg";

const projects = [
  { title: "Sales Performance Dashboard", desc: "Interactive dashboard tracking sales KPIs, revenue trends, and team performance metrics.", img: proj1 },
  { title: "Inventory Management System", desc: "Data-driven inventory tracking with stock alerts and demand forecasting analysis.", img: proj2 },
  { title: "Electricity Consumption Analysis", desc: "Analysis of electricity usage patterns to identify cost-saving opportunities.", img: proj3 },
  { title: "Customer Segmentation Analysis", desc: "Segmenting customers by behavior and demographics for targeted marketing.", img: proj4 },
  { title: "Student Performance Insights", desc: "Analyzing student grades and attendance to identify improvement areas.", img: proj5 },
  { title: "Business Revenue Dashboard", desc: "Comprehensive revenue dashboard with monthly/quarterly breakdowns.", img: proj6 },
];

const ProjectsSection = () => (
  <section id="projects" className="section-padding">
    <div className="container mx-auto">
      <AnimatedSection>
        <h2 className="section-title">My <span className="gradient-text">Projects</span></h2>
        <p className="section-subtitle">Recent work and data analysis projects</p>
      </AnimatedSection>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(({ title, desc, img }, i) => (
          <AnimatedSection key={title} delay={i * 0.1}>
            <div className="group p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
              <div className="w-full h-40 rounded-xl overflow-hidden mb-4">
                <img src={img} alt={title} loading="lazy" width={768} height={512} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm flex-1 mb-4">{desc}</p>
              <button className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                View Details <ExternalLink size={14} />
              </button>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default ProjectsSection;
