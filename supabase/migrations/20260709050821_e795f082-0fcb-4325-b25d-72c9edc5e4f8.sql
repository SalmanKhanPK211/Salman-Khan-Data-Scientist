
-- Certificates table
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO anon, authenticated;
GRANT ALL ON public.certificates TO service_role;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Anyone can insert certificates" ON public.certificates FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update certificates" ON public.certificates FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete certificates" ON public.certificates FOR DELETE USING (true);

-- Site settings (key/value) for profile pic etc.
CREATE TABLE public.site_settings (
  key TEXT NOT NULL PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can insert site_settings" ON public.site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update site_settings" ON public.site_settings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can delete site_settings" ON public.site_settings FOR DELETE USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
