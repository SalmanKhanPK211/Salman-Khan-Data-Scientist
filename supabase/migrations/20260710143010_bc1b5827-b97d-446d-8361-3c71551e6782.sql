CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  live_demo_url TEXT,
  short_description TEXT NOT NULL,
  brief_description TEXT NOT NULL,
  other_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  project_report_url TEXT,
  github_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.projects TO anon;
GRANT SELECT ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.projects (title, image_url, short_description, brief_description, sort_order) VALUES
('Sales Performance Dashboard', 'asset:project-1', 'Interactive dashboard tracking sales KPIs, revenue trends, and team performance metrics.', 'Interactive dashboard tracking sales KPIs, revenue trends, and team performance metrics across multiple regions and product categories.', 10),
('Inventory Management System', 'asset:project-2', 'Data-driven inventory tracking with stock alerts and demand forecasting analysis.', 'Data-driven inventory tracking system with automated stock alerts, demand forecasting, and supplier performance analysis.', 20),
('Electricity Consumption Analysis', 'asset:project-3', 'Analysis of electricity usage patterns to identify cost-saving opportunities.', 'Detailed analysis of electricity usage patterns across periods and appliances to identify peak-hour trends and cost-saving opportunities.', 30),
('Customer Segmentation Analysis', 'asset:project-4', 'Segmenting customers by behavior and demographics for targeted marketing.', 'Segmentation of customers by purchasing behavior and demographics to power targeted marketing campaigns and improve retention.', 40),
('Student Performance Insights', 'asset:project-5', 'Analyzing student grades and attendance to identify improvement areas.', 'In-depth analysis of student grades, attendance, and engagement to identify at-risk students and improvement areas.', 50),
('Business Revenue Dashboard', 'asset:project-6', 'Comprehensive revenue dashboard with monthly/quarterly breakdowns.', 'Comprehensive revenue dashboard with monthly and quarterly breakdowns, growth trends, and channel-level performance.', 60);
