import { useEffect, useRef, useState } from "react";
import AnimatedSection from "./AnimatedSection";
import { supabase } from "@/integrations/supabase/client";
import { resolveImageUrl } from "@/lib/portfolioAssets";
import certPlaceholder from "@/assets/certificate-placeholder.jpg";

type Cert = { id: string; title: string; description: string; image_url: string };

const CertificationsSection = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [certs, setCerts] = useState<Cert[]>([]);

  useEffect(() => {
    supabase
      .from("certificates")
      .select("id,title,description,image_url")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        if (data) setCerts(data as Cert[]);
      });
  }, []);

  const pause = () => {
    if (marqueeRef.current) marqueeRef.current.style.animationPlayState = "paused";
  };
  const play = () => {
    if (marqueeRef.current) marqueeRef.current.style.animationPlayState = "running";
  };

  const list = certs.length > 0 ? certs : [];

  return (
    <section id="certifications" className="section-padding">
      <div className="container mx-auto">
        <AnimatedSection>
          <h2 className="section-title">My <span className="gradient-text">Certifications</span></h2>
          <p className="section-subtitle">Professional development and continuous learning</p>
        </AnimatedSection>

        {list.length === 0 ? (
          <p className="text-center text-muted-foreground">Loading certifications…</p>
        ) : (
          <div className="overflow-hidden">
            <div ref={marqueeRef} className="flex animate-marquee w-max gap-6">
              {[...list, ...list].map((cert, i) => (
                <div
                  key={`${cert.id}-${i}`}
                  onMouseEnter={pause}
                  onMouseLeave={play}
                  className="flex-shrink-0 w-72 rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group cursor-default"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={resolveImageUrl(cert.image_url, certPlaceholder)}
                      alt={cert.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                      <p className="text-background text-sm text-center leading-relaxed">{cert.description}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1">{cert.title}</h3>
                    <p className="text-xs text-muted-foreground">Certificate of Completion</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CertificationsSection;
