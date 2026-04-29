import { useEffect, useState } from "react";

export interface ClientConfig {
  backgroundColor: string;
  titleColor: string;
  textColor: string;
  logo: string;
  welcomeText: string;
  headerLeft: string;
  headerRight: string;
  footerText: string;
  /** Local PDF file path relative to public/Cliente/ — e.g. "apresentacao.pdf" */
  presentationFile: string;
  visibleFolders: string[];
}

const DEFAULTS: ClientConfig = {
  backgroundColor: "#0f1117",
  titleColor: "#f0f0f0",
  textColor: "#a0a0b0",
  logo: "",
  welcomeText: "Bem-vindo(a) ao diretório visual da marca.",
  headerLeft: "pecindesign.com.br",
  headerRight: "Entrega de Projeto",
  footerText: "Pecin Design · Entrega de Projeto",
  presentationFile: "",
  visibleFolders: [
    "Logotipo",
    "Paleta de Cores",
    "Tipografia",
    "Iconografia",
    "Redes Sociais",
    "Papelaria",
    "Mockups",
    "Downloads",
  ],
};

interface State {
  config: ClientConfig;
  loading: boolean;
  error: string | null;
}

export function useClientConfig() {
  const [state, setState] = useState<State>({
    config: DEFAULTS,
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetch("/Cliente/config.json")
      .then((res) => {
        if (!res.ok) throw new Error("config.json não encontrado");
        return res.json() as Promise<Partial<ClientConfig>>;
      })
      .then((data) =>
        setState({ config: { ...DEFAULTS, ...data }, loading: false, error: null })
      )
      .catch((err) =>
        setState({ config: DEFAULTS, loading: false, error: err.message })
      );
  }, []);

  return state;
}
