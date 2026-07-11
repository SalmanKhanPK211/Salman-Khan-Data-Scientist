import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fileToDataUrl, resolveImageUrl } from "@/lib/portfolioAssets";
import { toast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Save, X, LogOut, Upload } from "lucide-react";

const PASSCODE = "khan-admin-2026";
const SESSION_KEY = "khan_admin_ok";

type Cert = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  sort_order: number;
};

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
  sort_order: number;
};

const emptyCert = { title: "", description: "", image_url: "", sort_order: 0 };
const emptyProject: Omit<Project, "id"> = {
  title: "",
  image_url: "",
  live_demo_url: "",
  short_description: "",
  brief_description: "",
  other_images: [],
  project_report_url: "",
  github_url: "",
  sort_order: 0,
};

const KhanAsAdmin = () => {
  const [authed, setAuthed] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [certs, setCerts] = useState<Cert[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [profileUrl, setProfileUrl] = useState<string>("");

  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certForm, setCertForm] = useState(emptyCert);
  const [showCertForm, setShowCertForm] = useState(false);

  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Omit<Project, "id">>(emptyProject);
  const [showProjectForm, setShowProjectForm] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      setPasscode(saved);
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (!authed) return;
    void loadAll();
  }, [authed]);

  const loadAll = async () => {
    const [{ data: c }, { data: p }, { data: s }] = await Promise.all([
      supabase.from("certificates").select("*").order("sort_order", { ascending: true }),
      supabase.from("projects").select("*").order("sort_order", { ascending: true }),
      supabase.from("site_settings").select("value").eq("key", "profile_pic_url").maybeSingle(),
    ]);
    if (c) setCerts(c as Cert[]);
    if (p) {
      setProjects(
        (p as any[]).map((row) => ({
          ...row,
          other_images: Array.isArray(row.other_images) ? row.other_images : [],
        })) as Project[],
      );
    }
    if (s?.value) setProfileUrl(s.value);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === PASSCODE) {
      sessionStorage.setItem(SESSION_KEY, passcode);
      setAuthed(true);
    } else {
      toast({ title: "Wrong passcode", variant: "destructive" });
    }
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    setPasscode("");
  };

  const callAdmin = async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("admin-mutate", {
      body: { passcode, ...body },
    });
    if (error) throw new Error(error.message);
    if (data && (data as { error?: string }).error) throw new Error((data as { error: string }).error);
  };

  // ---------- Certificates ----------
  const startEditCert = (cert: Cert) => {
    setEditingCertId(cert.id);
    setCertForm({
      title: cert.title,
      description: cert.description,
      image_url: cert.image_url,
      sort_order: cert.sort_order,
    });
    setShowCertForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startAddCert = () => {
    setEditingCertId(null);
    setCertForm({ ...emptyCert, sort_order: (certs.at(-1)?.sort_order ?? 0) + 10 });
    setShowCertForm(true);
  };

  const cancelCert = () => {
    setEditingCertId(null);
    setCertForm(emptyCert);
    setShowCertForm(false);
  };

  const saveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title.trim() || !certForm.description.trim() || !certForm.image_url) {
      toast({ title: "All fields required (image, title, description)", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      if (editingCertId) {
        await callAdmin({ action: "cert_update", id: editingCertId, data: certForm });
        toast({ title: "Certificate updated" });
      } else {
        await callAdmin({ action: "cert_insert", data: certForm });
        toast({ title: "Certificate added" });
      }
      cancelCert();
      await loadAll();
    } catch (err) {
      toast({ title: "Save failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const removeCert = async (id: string) => {
    if (!confirm("Delete this certificate?")) return;
    try {
      await callAdmin({ action: "cert_delete", id });
      toast({ title: "Deleted" });
      await loadAll();
    } catch (err) {
      toast({ title: "Delete failed", description: (err as Error).message, variant: "destructive" });
    }
  };

  const onCertFile = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Image too large (max 2 MB)", variant: "destructive" });
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setCertForm((f) => ({ ...f, image_url: dataUrl }));
  };

  // ---------- Profile ----------
  const onProfileFile = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Image too large (max 2 MB)", variant: "destructive" });
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    try {
      await callAdmin({ action: "setting_upsert", key: "profile_pic_url", value: dataUrl });
      toast({ title: "Profile picture updated" });
      setProfileUrl(dataUrl);
    } catch (err) {
      toast({ title: "Update failed", description: (err as Error).message, variant: "destructive" });
    }
  };

  // ---------- Projects ----------
  const startEditProject = (p: Project) => {
    setEditingProjectId(p.id);
    setProjectForm({
      title: p.title,
      image_url: p.image_url,
      live_demo_url: p.live_demo_url ?? "",
      short_description: p.short_description,
      brief_description: p.brief_description,
      other_images: p.other_images,
      project_report_url: p.project_report_url ?? "",
      github_url: p.github_url ?? "",
      sort_order: p.sort_order,
    });
    setShowProjectForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startAddProject = () => {
    setEditingProjectId(null);
    setProjectForm({ ...emptyProject, sort_order: (projects.at(-1)?.sort_order ?? 0) + 10 });
    setShowProjectForm(true);
  };

  const cancelProject = () => {
    setEditingProjectId(null);
    setProjectForm(emptyProject);
    setShowProjectForm(false);
  };

  const onProjectMainFile = async (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Image too large (max 2 MB)", variant: "destructive" });
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setProjectForm((f) => ({ ...f, image_url: dataUrl }));
  };

  const onProjectExtraFiles = async (files: FileList) => {
    const added: string[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ title: `${file.name} too large (max 2 MB)`, variant: "destructive" });
        continue;
      }
      added.push(await fileToDataUrl(file));
    }
    if (added.length) {
      setProjectForm((f) => ({ ...f, other_images: [...f.other_images, ...added] }));
    }
  };

  const removeExtraImage = (idx: number) => {
    setProjectForm((f) => ({ ...f, other_images: f.other_images.filter((_, i) => i !== idx) }));
  };

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !projectForm.title.trim() ||
      !projectForm.image_url ||
      !projectForm.short_description.trim() ||
      !projectForm.brief_description.trim()
    ) {
      toast({ title: "Title, image, short & brief description are required", variant: "destructive" });
      return;
    }
    setLoading(true);
    const payload = {
      title: projectForm.title.trim(),
      image_url: projectForm.image_url,
      live_demo_url: projectForm.live_demo_url?.trim() || null,
      short_description: projectForm.short_description.trim(),
      brief_description: projectForm.brief_description.trim(),
      other_images: projectForm.other_images,
      project_report_url: projectForm.project_report_url?.trim() || null,
      github_url: projectForm.github_url?.trim() || null,
      sort_order: projectForm.sort_order,
    };
    try {
      if (editingProjectId) {
        await callAdmin({ action: "project_update", id: editingProjectId, data: payload });
        toast({ title: "Project updated" });
      } else {
        await callAdmin({ action: "project_insert", data: payload });
        toast({ title: "Project added" });
      }
      cancelProject();
      await loadAll();
    } catch (err) {
      toast({ title: "Save failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const removeProject = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      await callAdmin({ action: "project_delete", id });
      toast({ title: "Deleted" });
      await loadAll();
    } catch (err) {
      toast({ title: "Delete failed", description: (err as Error).message, variant: "destructive" });
    }
  };

  // ---------- Render ----------
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-card p-8 space-y-4">
          <h1 className="text-2xl font-bold gradient-text text-center">KhanAsAdmin</h1>
          <p className="text-sm text-muted-foreground text-center">Enter passcode to continue</p>
          <input
            type="password"
            autoFocus
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="Passcode"
            className="w-full px-4 py-2 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button type="submit" className="w-full py-2 rounded-lg gradient-bg text-primary-foreground font-medium">
            Unlock
          </button>
        </form>
      </div>
    );
  }

  const inputCls = "w-full px-3 py-2 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold gradient-text">KhanAsAdmin</h1>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-muted-foreground hover:text-primary">View site</a>
            <button onClick={logout} className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg bg-secondary hover:bg-muted">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Profile pic */}
        <section className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-primary/20 bg-secondary flex-shrink-0">
              {profileUrl && (
                <img src={resolveImageUrl(profileUrl)} alt="Profile" className="w-full h-full object-cover" />
              )}
            </div>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-bg text-primary-foreground text-sm font-medium cursor-pointer">
              <Upload size={16} /> Upload new picture
              <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onProfileFile(e.target.files[0])} />
            </label>
          </div>
        </section>

        {/* Projects */}
        <section className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Projects ({projects.length})</h2>
            {!showProjectForm && (
              <button onClick={startAddProject} className="inline-flex items-center gap-1 px-4 py-2 rounded-lg gradient-bg text-primary-foreground text-sm font-medium">
                <Plus size={16} /> Add Project
              </button>
            )}
          </div>

          {showProjectForm && (
            <form onSubmit={saveProject} className="space-y-4 border border-border rounded-xl p-4 mb-6 bg-background">
              <div>
                <label className="block text-sm font-medium mb-1">Project Image *</label>
                <div className="flex items-center gap-4">
                  {projectForm.image_url && (
                    <img src={resolveImageUrl(projectForm.image_url)} alt="preview" className="w-32 h-20 object-cover rounded border border-border" />
                  )}
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-muted text-sm cursor-pointer">
                    <Upload size={14} /> {projectForm.image_url ? "Change image" : "Choose image"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onProjectMainFile(e.target.files[0])} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Project Title *</label>
                <input type="text" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} className={inputCls} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Live Demo (site link)</label>
                <input type="url" placeholder="https://…" value={projectForm.live_demo_url ?? ""} onChange={(e) => setProjectForm({ ...projectForm, live_demo_url: e.target.value })} className={inputCls} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Short Description * <span className="text-muted-foreground font-normal">(shown on card)</span></label>
                <textarea rows={2} value={projectForm.short_description} onChange={(e) => setProjectForm({ ...projectForm, short_description: e.target.value })} className={inputCls} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Brief Description * <span className="text-muted-foreground font-normal">(shown on detail page)</span></label>
                <textarea rows={5} value={projectForm.brief_description} onChange={(e) => setProjectForm({ ...projectForm, brief_description: e.target.value })} className={inputCls} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Other Images (optional)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {projectForm.other_images.map((src, i) => (
                    <div key={i} className="relative group">
                      <img src={resolveImageUrl(src)} alt={`extra ${i}`} className="w-20 h-14 object-cover rounded border border-border" />
                      <button type="button" onClick={() => removeExtraImage(i)} className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-muted text-sm cursor-pointer">
                  <Upload size={14} /> Add images
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && onProjectExtraFiles(e.target.files)} />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Project Report link (optional)</label>
                <input type="url" placeholder="https://… (PDF or doc link)" value={projectForm.project_report_url ?? ""} onChange={(e) => setProjectForm({ ...projectForm, project_report_url: e.target.value })} className={inputCls} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">GitHub Repo Link (optional)</label>
                <input type="url" placeholder="https://github.com/…" value={projectForm.github_url ?? ""} onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })} className={inputCls} />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Sort order</label>
                <input type="number" value={projectForm.sort_order} onChange={(e) => setProjectForm({ ...projectForm, sort_order: Number(e.target.value) })} className="w-32 px-3 py-2 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={loading} className="inline-flex items-center gap-1 px-4 py-2 rounded-lg gradient-bg text-primary-foreground text-sm font-medium disabled:opacity-50">
                  <Save size={16} /> {editingProjectId ? "Update" : "Add"}
                </button>
                <button type="button" onClick={cancelProject} className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-secondary hover:bg-muted text-sm">
                  <X size={16} /> Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid gap-3">
            {projects.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl border border-border hover:bg-secondary/50 transition-colors">
                <img src={resolveImageUrl(p.image_url)} alt={p.title} className="w-24 h-16 object-cover rounded flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{p.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{p.short_description}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEditProject(p)} className="p-2 rounded-lg hover:bg-primary/10 text-primary" aria-label="Edit">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => removeProject(p.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive" aria-label="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No projects yet.</p>}
          </div>
        </section>

        {/* Certificates */}
        <section className="bg-card border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Certificates ({certs.length})</h2>
            {!showCertForm && (
              <button onClick={startAddCert} className="inline-flex items-center gap-1 px-4 py-2 rounded-lg gradient-bg text-primary-foreground text-sm font-medium">
                <Plus size={16} /> Add Certificate
              </button>
            )}
          </div>

          {showCertForm && (
            <form onSubmit={saveCert} className="space-y-4 border border-border rounded-xl p-4 mb-6 bg-background">
              <div>
                <label className="block text-sm font-medium mb-1">Certificate Image *</label>
                <div className="flex items-center gap-4">
                  {certForm.image_url && (
                    <img src={resolveImageUrl(certForm.image_url)} alt="preview" className="w-24 h-16 object-cover rounded border border-border" />
                  )}
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-muted text-sm cursor-pointer">
                    <Upload size={14} /> {certForm.image_url ? "Change image" : "Choose image"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onCertFile(e.target.files[0])} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input type="text" value={certForm.title} onChange={(e) => setCertForm({ ...certForm, title: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description (shown on hover) *</label>
                <textarea rows={3} value={certForm.description} onChange={(e) => setCertForm({ ...certForm, description: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sort order</label>
                <input type="number" value={certForm.sort_order} onChange={(e) => setCertForm({ ...certForm, sort_order: Number(e.target.value) })} className="w-32 px-3 py-2 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={loading} className="inline-flex items-center gap-1 px-4 py-2 rounded-lg gradient-bg text-primary-foreground text-sm font-medium disabled:opacity-50">
                  <Save size={16} /> {editingCertId ? "Update" : "Add"}
                </button>
                <button type="button" onClick={cancelCert} className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-secondary hover:bg-muted text-sm">
                  <X size={16} /> Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid gap-3">
            {certs.map((cert) => (
              <div key={cert.id} className="flex items-center gap-4 p-3 rounded-xl border border-border hover:bg-secondary/50 transition-colors">
                <img src={resolveImageUrl(cert.image_url)} alt={cert.title} className="w-20 h-14 object-cover rounded flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm truncate">{cert.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{cert.description}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEditCert(cert)} className="p-2 rounded-lg hover:bg-primary/10 text-primary" aria-label="Edit">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => removeCert(cert.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive" aria-label="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {certs.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No certificates yet.</p>}
          </div>
        </section>
      </main>
    </div>
  );
};

export default KhanAsAdmin;
