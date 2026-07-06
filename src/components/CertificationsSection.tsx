import { useRef } from "react";
import AnimatedSection from "./AnimatedSection";
import certImg from "@/assets/certificate-placeholder.jpg";
import certDabi from "@/assets/cert-dabi.jpg";
import certMysql from "@/assets/cert-mysql.jpeg";

const certs = [
  { name: "Data Analytics & Business Intelligence", desc: "Completed a course learning Excel, SQL, and Power BI, gaining practical skills to analyze, visualize, and derive insights from data effectively.", img: certDabi },
  { name: "SQL for Beginners - MySQL and Database Fundamentals", desc: "Completed a hands-on course covering SQL syntax, MySQL, database design, queries, joins, and fundamentals of relational databases.", img: certMysql },
  { name: "Excel for Data Analysis", desc: "Advanced Excel techniques including formulas, pivot tables, and data manipulation for analysis.", img: certImg },
  { name: "Data Visualization Basics", desc: "Learn to create impactful charts, graphs, and visual stories from complex datasets.", img: certImg },
  { name: "Python for Beginners", desc: "Foundational Python programming with focus on data handling using Pandas and NumPy.", img: certImg },
  { name: "Business Analytics Introduction", desc: "Understanding business metrics, KPIs, and data-driven decision making strategies.", img: certImg },
];

const CertificationsSection = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  const pause = () => {
    if (marqueeRef.current) marqueeRef.current.style.animationPlayState = "paused";
  };
  const play = () => {
    if (marqueeRef.current) marqueeRef.current.style.animationPlayState = "running";
  };

  return (
    <section id="certifications" className="section-padding">
      <div className="container mx-auto">
        <AnimatedSection>
          <h2 className="section-title">My <span className="gradient-text">Certifications</span></h2>
          <p className="section-subtitle">Professional development and continuous learning</p>
        </AnimatedSection>

        <div className="overflow-hidden">
          <div ref={marqueeRef} className="flex animate-marquee w-max gap-6">
            {[...certs, ...certs].map((cert, i) => (
              <div
                key={i}
                onMouseEnter={pause}
                onMouseLeave={play}
                className="flex-shrink-0 w-72 rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group cursor-default"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={cert.img} alt={cert.name} loading="lazy" width={704} height={512} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <p className="text-background text-sm text-center leading-relaxed">{cert.desc}</p>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1">{cert.name}</h3>
                  <p className="text-xs text-muted-foreground">Certificate of Completion</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
