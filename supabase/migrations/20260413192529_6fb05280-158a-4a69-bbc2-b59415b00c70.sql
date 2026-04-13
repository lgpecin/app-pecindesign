-- Create site_settings table (single row for global config)
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  logo_url TEXT,
  title TEXT NOT NULL DEFAULT 'Entrega de Projeto',
  description TEXT DEFAULT 'Bem-vindo(a) ao diretório visual da marca.',
  presentation_url TEXT,
  header_left TEXT DEFAULT 'pecindesign.com.br',
  header_right TEXT DEFAULT 'Entrega de Projeto',
  footer_text TEXT DEFAULT 'Pecin Design · Entrega de Projeto',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create folders table
CREATE TABLE public.folders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create folder_items table
CREATE TABLE public.folder_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  folder_id UUID NOT NULL REFERENCES public.folders(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL DEFAULT 'text',
  title TEXT,
  content TEXT,
  image_url TEXT,
  metadata JSONB DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folder_items ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view folders" ON public.folders FOR SELECT USING (true);
CREATE POLICY "Public can view folder items" ON public.folder_items FOR SELECT USING (true);

-- Authenticated users can manage everything
CREATE POLICY "Auth users can insert site settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update site settings" ON public.site_settings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete site settings" ON public.site_settings FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth users can insert folders" ON public.folders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update folders" ON public.folders FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete folders" ON public.folders FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth users can insert folder items" ON public.folder_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update folder items" ON public.folder_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete folder items" ON public.folder_items FOR DELETE TO authenticated USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON public.folders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_folder_items_updated_at BEFORE UPDATE ON public.folder_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

CREATE POLICY "Public can view uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Auth users can upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'uploads');
CREATE POLICY "Auth users can update uploads" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'uploads');
CREATE POLICY "Auth users can delete uploads" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'uploads');

-- Insert default site settings
INSERT INTO public.site_settings (title, description) VALUES ('Entrega de Projeto', 'Bem-vindo(a) ao diretório visual da marca. Explore os elementos que compõem a identidade visual do seu projeto.');

-- Insert default folders
INSERT INTO public.folders (label, description, sort_order) VALUES
  ('Logotipo', 'Arquivos do logotipo e variações.', 1),
  ('Paleta de Cores', 'Cores da marca e códigos.', 2),
  ('Tipografia', 'Fontes e estilos tipográficos.', 3),
  ('Redes Sociais', 'Templates e artes para redes.', 4),
  ('Papelaria', 'Cartão de visita, envelopes etc.', 5),
  ('Downloads', 'Arquivos originais e pacotes.', 6);