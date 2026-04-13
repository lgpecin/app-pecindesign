import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Save, Plus, Trash2, GripVertical, Upload, FolderOpen } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type SiteSettings = Tables<"site_settings">;
type Folder = Tables<"folders">;
type FolderItem = Tables<"folder_items">;

const ITEM_TYPES = [
  { value: "text", label: "Texto" },
  { value: "image", label: "Imagem" },
  { value: "color_palette", label: "Paleta de Cores" },
  { value: "heading", label: "Título / Seção" },
  { value: "button", label: "Botão / Link" },
  { value: "divider", label: "Divisor" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [folderItems, setFolderItems] = useState<FolderItem[]>([]);
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    const [settingsRes, foldersRes] = await Promise.all([
      supabase.from("site_settings").select("*").limit(1).single(),
      supabase.from("folders").select("*").order("sort_order"),
    ]);
    if (settingsRes.data) setSettings(settingsRes.data);
    if (foldersRes.data) setFolders(foldersRes.data);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate("/admin");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/admin");
    });
    loadData();
    return () => subscription.unsubscribe();
  }, [navigate, loadData]);

  useEffect(() => {
    if (selectedFolder) {
      supabase.from("folder_items").select("*").eq("folder_id", selectedFolder).order("sort_order")
        .then(({ data }) => { if (data) setFolderItems(data); });
    }
  }, [selectedFolder]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase.from("site_settings").update({
      title: settings.title,
      description: settings.description,
      logo_url: settings.logo_url,
      presentation_url: settings.presentation_url,
      header_left: settings.header_left,
      header_right: settings.header_right,
      footer_text: settings.footer_text,
    }).eq("id", settings.id);
    if (error) toast.error("Erro ao salvar");
    else toast.success("Configurações salvas!");
    setSaving(false);
  };

  const uploadFile = async (file: File, path: string) => {
    const ext = file.name.split(".").pop();
    const fileName = `${path}/${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from("uploads").upload(fileName, file);
    if (error) { toast.error("Erro no upload"); return null; }
    const { data: urlData } = supabase.storage.from("uploads").getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;
    const url = await uploadFile(file, "logos");
    if (url) setSettings({ ...settings, logo_url: url });
  };

  const addFolder = async () => {
    const { data, error } = await supabase.from("folders").insert({
      label: "Nova Pasta",
      description: "",
      sort_order: folders.length + 1,
    }).select().single();
    if (data) setFolders([...folders, data]);
    if (error) toast.error("Erro ao criar pasta");
  };

  const updateFolder = (id: string, field: string, value: string) => {
    setFolders(folders.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  const saveFolders = async () => {
    setSaving(true);
    for (const folder of folders) {
      await supabase.from("folders").update({
        label: folder.label,
        description: folder.description,
        sort_order: folder.sort_order,
      }).eq("id", folder.id);
    }
    toast.success("Pastas salvas!");
    setSaving(false);
  };

  const deleteFolder = async (id: string) => {
    await supabase.from("folders").delete().eq("id", id);
    setFolders(folders.filter(f => f.id !== id));
    if (selectedFolder === id) { setSelectedFolder(null); setFolderItems([]); }
    toast.success("Pasta removida");
  };

  const addItem = async () => {
    if (!selectedFolder) return;
    const { data, error } = await supabase.from("folder_items").insert({
      folder_id: selectedFolder,
      item_type: "text",
      title: "Novo item",
      content: "",
      sort_order: folderItems.length + 1,
    }).select().single();
    if (data) setFolderItems([...folderItems, data]);
    if (error) toast.error("Erro ao criar item");
  };

  const updateItem = (id: string, field: string, value: string) => {
    setFolderItems(folderItems.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const saveItems = async () => {
    setSaving(true);
    for (const item of folderItems) {
      await supabase.from("folder_items").update({
        item_type: item.item_type,
        title: item.title,
        content: item.content,
        image_url: item.image_url,
        metadata: item.metadata,
        sort_order: item.sort_order,
      }).eq("id", item.id);
    }
    toast.success("Itens salvos!");
    setSaving(false);
  };

  const deleteItem = async (id: string) => {
    await supabase.from("folder_items").delete().eq("id", id);
    setFolderItems(folderItems.filter(i => i.id !== id));
    toast.success("Item removido");
  };

  const handleItemImageUpload = async (itemId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, "items");
    if (url) updateItem(itemId, "image_url", url);
  };

  if (!settings) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Carregando...</div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-background z-10">
        <h1 className="font-heading font-bold text-lg">Painel Admin</h1>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-10">
        {/* Site Settings */}
        <section>
          <h2 className="font-heading text-xl font-bold mb-4">Configurações do Site</h2>
          <div className="grid gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Logo</label>
              <div className="flex items-center gap-4">
                {settings.logo_url && <img src={settings.logo_url} alt="Logo" className="h-16 object-contain rounded-lg bg-card p-2" />}
                <label className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors text-sm">
                  <Upload className="w-4 h-4" /> Upload Logo
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Título</label>
                <input value={settings.title} onChange={e => setSettings({ ...settings, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">URL da Apresentação (PDF)</label>
                <input value={settings.presentation_url || ""} onChange={e => setSettings({ ...settings, presentation_url: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm" placeholder="https://..." />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Descrição</label>
              <textarea value={settings.description || ""} onChange={e => setSettings({ ...settings, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm h-20 resize-none" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Header Esquerda</label>
                <input value={settings.header_left || ""} onChange={e => setSettings({ ...settings, header_left: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Header Direita</label>
                <input value={settings.header_right || ""} onChange={e => setSettings({ ...settings, header_right: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Footer</label>
                <input value={settings.footer_text || ""} onChange={e => setSettings({ ...settings, footer_text: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-card border border-border text-foreground text-sm" />
              </div>
            </div>
            <button onClick={saveSettings} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-heading font-semibold text-sm w-fit hover:opacity-90 disabled:opacity-50">
              <Save className="w-4 h-4" /> Salvar Configurações
            </button>
          </div>
        </section>

        {/* Folders */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-xl font-bold">Pastas</h2>
            <button onClick={addFolder} className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded-lg text-sm hover:bg-secondary">
              <Plus className="w-4 h-4" /> Nova Pasta
            </button>
          </div>
          <div className="space-y-2">
            {folders.map(folder => (
              <div key={folder.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${selectedFolder === folder.id ? 'bg-primary/10 border-primary/30' : 'bg-card border-border hover:bg-secondary/50'}`}>
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <FolderOpen className="w-4 h-4 text-primary" />
                <input value={folder.label} onChange={e => updateFolder(folder.id, "label", e.target.value)}
                  className="flex-1 bg-transparent text-sm font-medium focus:outline-none" />
                <input value={folder.description || ""} onChange={e => updateFolder(folder.id, "description", e.target.value)}
                  className="flex-1 bg-transparent text-xs text-muted-foreground focus:outline-none" placeholder="Descrição..." />
                <button onClick={() => setSelectedFolder(folder.id)} className="text-xs text-primary hover:underline">Editar itens</button>
                <button onClick={() => deleteFolder(folder.id)} className="text-destructive hover:opacity-70"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
          <button onClick={saveFolders} disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-heading font-semibold text-sm w-fit hover:opacity-90 disabled:opacity-50 mt-3">
            <Save className="w-4 h-4" /> Salvar Pastas
          </button>
        </section>

        {/* Folder Items */}
        {selectedFolder && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-bold">
                Itens: {folders.find(f => f.id === selectedFolder)?.label}
              </h2>
              <button onClick={addItem} className="flex items-center gap-1 px-3 py-1.5 bg-card border border-border rounded-lg text-sm hover:bg-secondary">
                <Plus className="w-4 h-4" /> Novo Item
              </button>
            </div>
            <div className="space-y-4">
              {folderItems.map(item => (
                <div key={item.id} className="p-4 rounded-xl bg-card border border-border space-y-3">
                  <div className="flex items-center gap-3">
                    <select value={item.item_type} onChange={e => updateItem(item.id, "item_type", e.target.value)}
                      className="px-2 py-1 rounded-lg bg-secondary border border-border text-xs">
                      {ITEM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    <input value={item.title || ""} onChange={e => updateItem(item.id, "title", e.target.value)}
                      className="flex-1 bg-transparent text-sm font-medium focus:outline-none" placeholder="Título do item" />
                    <button onClick={() => deleteItem(item.id)} className="text-destructive hover:opacity-70"><Trash2 className="w-4 h-4" /></button>
                  </div>

                  {(item.item_type === "text" || item.item_type === "heading") && (
                    <textarea value={item.content || ""} onChange={e => updateItem(item.id, "content", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm h-20 resize-none" placeholder="Conteúdo..." />
                  )}

                  {item.item_type === "image" && (
                    <div className="flex items-center gap-4">
                      {item.image_url && <img src={item.image_url} alt="" className="h-20 rounded-lg object-cover" />}
                      <label className="flex items-center gap-2 px-3 py-1.5 bg-secondary border border-border rounded-lg cursor-pointer text-xs hover:bg-muted">
                        <Upload className="w-3 h-3" /> Upload
                        <input type="file" accept="image/*" onChange={e => handleItemImageUpload(item.id, e)} className="hidden" />
                      </label>
                      <input value={item.image_url || ""} onChange={e => updateItem(item.id, "image_url", e.target.value)}
                        className="flex-1 bg-transparent text-xs text-muted-foreground focus:outline-none" placeholder="ou cole URL da imagem" />
                    </div>
                  )}

                  {item.item_type === "color_palette" && (
                    <textarea value={item.content || ""} onChange={e => updateItem(item.id, "content", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-sm h-20 resize-none font-mono"
                      placeholder="Uma cor por linha: #FF5733 Vermelho&#10;#3498DB Azul&#10;#2ECC71 Verde" />
                  )}

                  {item.item_type === "button" && (
                    <div className="grid grid-cols-2 gap-3">
                      <input value={item.content || ""} onChange={e => updateItem(item.id, "content", e.target.value)}
                        className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm" placeholder="Texto do botão" />
                      <input value={item.image_url || ""} onChange={e => updateItem(item.id, "image_url", e.target.value)}
                        className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm" placeholder="URL de destino" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button onClick={saveItems} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-heading font-semibold text-sm w-fit hover:opacity-90 disabled:opacity-50 mt-3">
              <Save className="w-4 h-4" /> Salvar Itens
            </button>
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
