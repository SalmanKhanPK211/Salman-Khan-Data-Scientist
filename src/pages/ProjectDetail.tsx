import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Github, FileText, ChevronLeft, ChevronRight, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { resolveImageUrl } from "@/lib/portfolioAssets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Project = {
  id: string;
  title: string;
  image_url: string;
  live_demo_url: string | null;
  short_description: string;
  brief_description: string;
  other_images: string[];
  project_report_url: string | null;
  github_url: string | null;
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const images = project?.other_images ?? [];
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const showNext = useCallback(
    () => setLightboxIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setProject({
            ...data,
            other_images: Array.isArray(data.other_images) ? (data.other_images as string[]) : [],
          } as Project);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Project not found.</p>
        <Link to="/#projects" className="text-primary hover:underline">← Back to projects</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-16 max-w-4xl">
        <Link to="/#projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft size={16} /> Back to projects
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="gradient-text">{project.title}</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8">{project.short_description}</p>

        <div className="w-full rounded-2xl overflow-hidden border border-border shadow-card mb-8">
          <img src={resolveImageUrl(project.image_url)} alt={project.title} className="w-full h-auto object-cover" />
        </div>

        <div className="flex flex-wrap gap-3 mb-10">
          {project.live_demo_url && (
            <a href={project.live_demo_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-bg text-primary-foreground text-sm font-medium shadow-card hover:shadow-card-hover hover:-translate-y-0.5 hover:opacity-90 transition-all duration-300">
              <ExternalLink size={16} /> Live Demo
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-sm font-medium border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-300">
              <Github size={16} /> GitHub Repo
            </a>
          )}
          {project.project_report_url && (
            <a href={project.project_report_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-sm font-medium border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-300">
              <FileText size={16} /> Project Report
            </a>
          )}
        </div>


        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3">Overview</h2>
          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{project.brief_description}</p>
        </section>

        {images.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {images.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className="group relative rounded-xl overflow-hidden border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5"
                  aria-label={`Open image ${i + 1}`}
                >
                  <img
                    src={resolveImageUrl(src)}
                    alt={`${project.title} ${i + 1}`}
                    className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            aria-label="Close"
          >
            <X size={22} />
          </button>
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); showPrev(); }}
              className="absolute left-4 md:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Previous image"
            >
              <ChevronLeft size={26} />
            </button>
          )}
          <figure className="max-w-5xl w-full flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <img
              src={resolveImageUrl(images[lightboxIndex])}
              alt={`${project.title} ${lightboxIndex + 1}`}
              className="max-h-[80vh] w-auto max-w-full rounded-lg shadow-2xl object-contain"
            />
            <figcaption className="text-white/70 text-sm">
              {lightboxIndex + 1} / {images.length}
            </figcaption>
          </figure>
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); showNext(); }}
              className="absolute right-4 md:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
              aria-label="Next image"
            >
              <ChevronRight size={26} />
            </button>
          )}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProjectDetail;
