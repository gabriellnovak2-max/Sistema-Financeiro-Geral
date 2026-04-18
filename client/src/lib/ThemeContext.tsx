import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ThemeId =
  | "esmeralda"
  | "azul-petroleo"
  | "verde-duplo"
  | "petroleo-industria"
  | "branco-gelo"
  | "preto-fosco";

export interface Theme {
  id: ThemeId;
  nome: string;
  bolinha: string;       // cor da bolinha no seletor
  bolinhaB?: string;     // segunda cor (temas duplos)
  // CSS vars aplicadas no :root
  bg: string;            // fundo principal
  bgCard: string;        // fundo dos cards
  bgSidebar: string;     // fundo sidebar
  border: string;        // cor das bordas
  accent: string;        // cor principal (botões, destaques, links ativos)
  accentSoft: string;    // versão suave do accent (fundos de badge)
  accentBorder: string;  // borda no accent
  text: string;          // texto principal
  textMuted: string;     // texto secundário/apagado
  textAccent: string;    // texto na cor accent
  gridLine: string;      // linhas do grid de fundo
  glowColor: string;     // glow do fundo
  chartColors: string[]; // cores dos gráficos
  isDark: boolean;
}

export const THEMES: Theme[] = [
  {
    id: "esmeralda",
    nome: "Verde Esmeralda",
    bolinha: "#10b981",
    bg: "#0a0a0a",
    bgCard: "#111214",
    bgSidebar: "rgba(8,8,8,0.94)",
    border: "rgba(255,255,255,0.07)",
    accent: "#10b981",
    accentSoft: "rgba(16,185,129,0.12)",
    accentBorder: "rgba(52,211,153,0.25)",
    text: "#f5f5f5",
    textMuted: "rgba(255,255,255,0.4)",
    textAccent: "#34d399",
    gridLine: "rgba(16,185,129,0.025)",
    glowColor: "rgba(16,185,129,0.12)",
    chartColors: ["#10b981","#34d399","#6366f1","#f59e0b","#ec4899","#a5b4fc","#60a5fa","#fb923c"],
    isDark: true,
  },
  {
    id: "azul-petroleo",
    nome: "Azul Petróleo",
    bolinha: "#0d6e8a",
    bg: "#040e14",
    bgCard: "#071520",
    bgSidebar: "rgba(4,10,18,0.96)",
    border: "rgba(0,160,190,0.15)",
    accent: "#0d9bbf",
    accentSoft: "rgba(13,155,191,0.12)",
    accentBorder: "rgba(13,155,191,0.3)",
    text: "#e8f4f8",
    textMuted: "rgba(180,220,235,0.45)",
    textAccent: "#38bdf8",
    gridLine: "rgba(13,155,191,0.03)",
    glowColor: "rgba(13,100,140,0.18)",
    chartColors: ["#0d9bbf","#38bdf8","#0284c7","#7dd3fc","#0ea5e9","#6366f1","#f59e0b","#34d399"],
    isDark: true,
  },
  {
    id: "verde-duplo",
    nome: "Verde Escuro + Claro",
    bolinha: "#166534",
    bolinhaB: "#86efac",
    bg: "#021a0a",
    bgCard: "#052010",
    bgSidebar: "rgba(2,18,8,0.97)",
    border: "rgba(22,101,52,0.3)",
    accent: "#16a34a",
    accentSoft: "rgba(22,163,74,0.12)",
    accentBorder: "rgba(134,239,172,0.25)",
    text: "#f0fdf4",
    textMuted: "rgba(187,247,208,0.5)",
    textAccent: "#86efac",
    gridLine: "rgba(22,163,74,0.03)",
    glowColor: "rgba(22,101,52,0.2)",
    chartColors: ["#16a34a","#86efac","#4ade80","#15803d","#bbf7d0","#f59e0b","#6366f1","#f87171"],
    isDark: true,
  },
  {
    id: "petroleo-industria",
    nome: "Petróleo + Cinza Ind.",
    bolinha: "#0d6e8a",
    bolinhaB: "#6b7280",
    bg: "#080c10",
    bgCard: "#0f1520",
    bgSidebar: "rgba(6,10,16,0.97)",
    border: "rgba(107,114,128,0.2)",
    accent: "#0891b2",
    accentSoft: "rgba(8,145,178,0.1)",
    accentBorder: "rgba(8,145,178,0.25)",
    text: "#e2e8f0",
    textMuted: "rgba(148,163,184,0.6)",
    textAccent: "#67e8f9",
    gridLine: "rgba(107,114,128,0.03)",
    glowColor: "rgba(8,80,110,0.15)",
    chartColors: ["#0891b2","#67e8f9","#6b7280","#9ca3af","#0d9bbf","#f59e0b","#f87171","#a5b4fc"],
    isDark: true,
  },
  {
    id: "branco-gelo",
    nome: "Branco Gelo + Cinza",
    bolinha: "#e8f0f7",
    bolinhaB: "#94a3b8",
    bg: "#f0f4f8",
    bgCard: "#ffffff",
    bgSidebar: "rgba(248,250,252,0.98)",
    border: "rgba(148,163,184,0.25)",
    accent: "#0284c7",
    accentSoft: "rgba(2,132,199,0.08)",
    accentBorder: "rgba(2,132,199,0.3)",
    text: "#0f172a",
    textMuted: "rgba(71,85,105,0.8)",
    textAccent: "#0284c7",
    gridLine: "rgba(148,163,184,0.08)",
    glowColor: "rgba(148,163,184,0.1)",
    chartColors: ["#0284c7","#0ea5e9","#6366f1","#16a34a","#f59e0b","#dc2626","#7c3aed","#0891b2"],
    isDark: false,
  },
  {
    id: "preto-fosco",
    nome: "Preto Fosco + Cinza",
    bolinha: "#1c1c1e",
    bolinhaB: "#3d3d3f",
    bg: "#0c0c0c",
    bgCard: "#1a1a1a",
    bgSidebar: "rgba(10,10,10,0.98)",
    border: "rgba(255,255,255,0.08)",
    accent: "#a0a0a8",
    accentSoft: "rgba(160,160,168,0.1)",
    accentBorder: "rgba(160,160,168,0.2)",
    text: "#e5e5e7",
    textMuted: "rgba(161,161,170,0.6)",
    textAccent: "#d4d4d8",
    gridLine: "rgba(255,255,255,0.02)",
    glowColor: "rgba(60,60,60,0.15)",
    chartColors: ["#a0a0a8","#d4d4d8","#71717a","#52525b","#e4e4e7","#f4f4f5","#a1a1aa","#3f3f46"],
    isDark: true,
  },
];

interface ThemeContextType {
  theme: Theme;
  setThemeId: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: THEMES[0],
  setThemeId: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>("esmeralda");

  const theme = THEMES.find(t => t.id === themeId) ?? THEMES[0];

  // Aplica CSS vars no :root sempre que o tema mudar
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--bg", theme.bg);
    root.style.setProperty("--bg-card", theme.bgCard);
    root.style.setProperty("--bg-sidebar", theme.bgSidebar);
    root.style.setProperty("--border", theme.border);
    root.style.setProperty("--accent", theme.accent);
    root.style.setProperty("--accent-soft", theme.accentSoft);
    root.style.setProperty("--accent-border", theme.accentBorder);
    root.style.setProperty("--text", theme.text);
    root.style.setProperty("--text-muted", theme.textMuted);
    root.style.setProperty("--text-accent", theme.textAccent);
    root.style.setProperty("--grid-line", theme.gridLine);
    root.style.setProperty("--glow", theme.glowColor);
    root.style.setProperty("--is-dark", theme.isDark ? "1" : "0");

    // Atualiza background do body direto
    document.body.style.background = theme.bg;
    document.body.style.color = theme.text;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
