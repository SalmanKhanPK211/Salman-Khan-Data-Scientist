
-- Certificates: remove permissive write policies, keep public read
DROP POLICY IF EXISTS "Anyone can insert certificates" ON public.certificates;
DROP POLICY IF EXISTS "Anyone can update certificates" ON public.certificates;
DROP POLICY IF EXISTS "Anyone can delete certificates" ON public.certificates;

-- Site settings: remove permissive write policies, keep public read
DROP POLICY IF EXISTS "Anyone can insert site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Anyone can update site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Anyone can delete site_settings" ON public.site_settings;

-- Ensure service_role can be used by the admin edge function
GRANT ALL ON public.certificates TO service_role;
GRANT ALL ON public.site_settings TO service_role;
