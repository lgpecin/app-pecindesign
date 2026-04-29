import { useEffect, useState } from "react";

export interface FolderConfigItem {
  type: "heading" | "text" | "image" | "color_palette" | "button" | "divider";
  title?: string;
  content?: string;
  file?: string;
  label?: string;
  colors?: { hex: string; name?: string }[];
}

export interface FolderConfig {
  title: string;
  description?: string;
  items: FolderConfigItem[];
}

interface State {
  data: FolderConfig | null;
  loading: boolean;
  error: string | null;
}

export function useFolderConfig(folderName: string | undefined) {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null });

  useEffect(() => {
    if (!folderName) return;

    setState({ data: null, loading: true, error: null });

    fetch(`/Cliente/${encodeURIComponent(folderName)}/config.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Pasta não encontrada: ${folderName}`);
        return res.json() as Promise<FolderConfig>;
      })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => setState({ data: null, loading: false, error: err.message }));
  }, [folderName]);

  return state;
}
