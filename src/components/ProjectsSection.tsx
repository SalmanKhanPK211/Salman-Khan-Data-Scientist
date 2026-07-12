import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";
import { supabase } from "@/integrations/supabase/client";
import { resolveImageUrl } from "@/lib/portfolioAssets";

type Project = {
  id: string;
  title: string;
  image_url: string;
  short_description: string;
};

const ProjectsSection = () => {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    supabase
      .from("projects")
      .select("id,title,image_url,short_description")
      .order("sort_order", { ascending: true })
      .then(({ data }) => setProjects((data as Project[]) ?? []));
  }, []);

  const loading = projects === null;

  return (
    <section id="projects" className="section-padding">
      <div className="container mx-auto">
        <AnimatedSection>
          <h2 className="section-title">My <span className="gradient-text">Projects</span></h2>
          <p className="section-subtitle">Recent work and data analysis projects</p>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="p-6 rounded-2xl bg-card border border-border shadow-card h-full flex flex-col animate-pulse"
                aria-hidden="true"
              >
                <div className="w-full h-40 rounded-xl bg-muted mb-4" />
                <div className="h-5 bg-muted rounded w-3/4 mb-3" />
                <div className="h-3 bg-muted rounded w-full mb-2" />
                <div className="h-3 bg-muted rounded w-5/6 mb-2" />
                <div className="h-3 bg-muted rounded w-2/3 mb-4" />
                <div className="h-4 bg-muted rounded w-24 mt-auto" />
              </div>
            ))}

          {!loading && projects.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">No projects yet.</p>
          )}

          {!loading &&
            projects.map((p, i) => (
              <AnimatedSection key={p.id} delay={i * 0.1}>
                <div className="group p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-muted">
                    <img src={resolveImageUrl(p.image_url)} alt={p.title} loading="lazy" width={768} height={512} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                  <p className="text-muted-foreground text-sm flex-1 mb-4">{p.short_description}</p>
                  <Link to={`/projects/${p.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                    View Details <ExternalLink size={14} />
                  </Link>
                </div>
              </AnimatedSection>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
