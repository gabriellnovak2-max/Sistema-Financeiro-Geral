import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, ShoppingBag, Users, CalendarDays, Pencil, Check, X, FileText, Target, Package, Settings, LogOut } from "lucide-react";
import { useTheme, THEMES, ThemeId } from "@/lib/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

const MENU_PRINCIPAL = [
  { href: "/",           icon: LayoutDashboard, label: "Dashboard" },
  { href: "/vendas",     icon: ShoppingBag,     label: "Vendas" },
  { href: "/clientes",   icon: Users,           label: "Clientes" },
  { href: "/calendario", icon: CalendarDays,    label: "Calendário" },
];

const MENU_EXTRA = [
  { href: "/relatorios",    icon: FileText, label: "Relatórios" },
  { href: "/metas",         icon: Target,   label: "Metas" },
  { href: "/produtos",      icon: Package,  label: "Produtos" },
  { href: "/configuracoes", icon: Settings, label: "Configurações" },
];

const SELO_SRC = "data:image/png;base64,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";

export { SELO_SRC };

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const { signOut } = useAuth();
  const { theme, setThemeId } = useTheme();
  const [editandoNome, setEditandoNome] = useState(false);
  const [nomeGerente, setNomeGerente] = useState("Valtim");
  const [nomeTemp, setNomeTemp] = useState("Valtim");

  const salvarNome = () => {
    const novo = nomeTemp.trim() || "Valtim";
    setNomeGerente(novo);
    setEditandoNome(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setLocation("/login");
  };

  return (
    <aside
      className="w-60 flex-shrink-0 flex flex-col h-screen overflow-y-auto"
      style={{
        background: theme.bgSidebar,
        backdropFilter: "blur(20px)",
        borderRight: `1px solid ${theme.border}`,
        fontFamily: "'Roboto', 'Inter', sans-serif",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* ── Topo — Selo + Título + Valtim + Temas ── */}
      <div className="px-5 pt-5 pb-4 border-b" style={{ borderColor: theme.border }}>

        {/* Selo grande + Título centralizado */}
        <div className="flex flex-col items-center text-center gap-2 mb-3">
          {/* Selo */}
          <div style={{ width: 72, height: 72, filter: `drop-shadow(0 0 12px rgba(234,179,8,0.45))` }}>
            <img
              src={SELO_SRC}
              alt="Selo Puro Lote"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>

          {/* Título */}
          <div>
            <p style={{
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 900,
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: theme.textAccent,
              lineHeight: 1.25,
            }}>
              Controle de Saída
            </p>
            <p style={{
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 900,
              fontSize: "0.65rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: theme.textAccent,
              opacity: 0.65,
              lineHeight: 1.2,
            }}>
              de Vendas
            </p>
          </div>
        </div>

        {/* Gerente editável — centralizado */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          {editandoNome ? (
            <>
              <input
                autoFocus
                value={nomeTemp}
                onChange={e => setNomeTemp(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") salvarNome(); if (e.key === "Escape") setEditandoNome(false); }}
                className="rounded px-2 py-0.5 text-xs outline-none text-center"
                style={{
                  background: theme.accentSoft,
                  border: `1px solid ${theme.accentBorder}`,
                  color: theme.text,
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: "0.8rem",
                  maxWidth: 110,
                }}
              />
              <button onClick={salvarNome} className="p-0.5 rounded transition-colors" style={{ color: theme.accent }}>
                <Check size={11} />
              </button>
              <button onClick={() => setEditandoNome(false)} className="p-0.5 rounded transition-colors" style={{ color: "rgba(248,113,113,0.6)" }}>
                <X size={11} />
              </button>
            </>
          ) : (
            <>
              <span style={{ fontSize: "0.78rem", color: theme.textMuted, fontFamily: "'Roboto', sans-serif" }}>
                {nomeGerente}
              </span>
              <button
                onClick={() => { setNomeTemp(nomeGerente); setEditandoNome(true); }}
                className="p-0.5 rounded transition-colors"
                style={{ color: theme.accent, opacity: 0.8 }}
                title="Editar nome do gerente"
              >
                <Pencil size={11} />
              </button>
            </>
          )}
        </div>

        {/* ── Seletor de Temas ── */}
        <div>
          <p style={{
            fontSize: "0.55rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: theme.textMuted,
            textAlign: "center",
            marginBottom: "0.5rem",
          }}>
            Tema
          </p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setThemeId(t.id as ThemeId)}
                title={t.nome}
                style={{
                  width: theme.id === t.id ? 22 : 16,
                  height: theme.id === t.id ? 22 : 16,
                  borderRadius: "50%",
                  background: t.bolinhaB
                    ? `linear-gradient(135deg, ${t.bolinha} 50%, ${t.bolinhaB} 50%)`
                    : t.bolinha,
                  border: theme.id === t.id
                    ? `2px solid ${theme.textAccent}`
                    : `2px solid ${theme.border}`,
                  boxShadow: theme.id === t.id
                    ? `0 0 10px ${t.bolinha}80, 0 0 0 3px ${t.bolinha}25`
                    : "none",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Status ao vivo */}
      <div className="px-4 py-2" style={{ borderBottom: `1px solid ${theme.border}` }}>
        <div className="flex items-center gap-2">
          <span className="dot-live" />
          <span style={{ fontSize: "0.58rem", color: theme.accent, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.08em", opacity: 0.7 }}>
            SISTEMA ATIVO
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0">
        <p className="px-1 mb-2" style={{ color: theme.textMuted, fontSize: "0.55rem", fontFamily: "'Roboto', sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Principal
        </p>
        <div className="space-y-0.5 mb-4">
          {MENU_PRINCIPAL.map(({ href, icon: Icon, label }) => {
            const active = location === href;
            return (
              <Link key={href} href={href}>
                <a className={`sidebar-link ${active ? "active" : ""}`}
                  data-testid={`nav-${label.toLowerCase()}`}
                  style={{ fontFamily: "'Roboto', sans-serif", fontWeight: active ? 600 : 400 }}>
                  <Icon size={15} />
                  <span>{label}</span>
                  {active && <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: theme.accent }} />}
                </a>
              </Link>
            );
          })}
        </div>

        <div className="mb-2" style={{ borderTop: `1px solid ${theme.border}` }} />

        <p className="px-1 mb-2 mt-3" style={{ color: theme.textMuted, fontSize: "0.55rem", fontFamily: "'Roboto', sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Gestão
        </p>
        <div className="space-y-0.5">
          {MENU_EXTRA.map(({ href, icon: Icon, label }) => {
            const active = location === href;
            return (
              <Link key={href} href={href}>
                <a className={`sidebar-link ${active ? "active" : ""}`}
                  style={{ fontFamily: "'Roboto', sans-serif", fontWeight: active ? 600 : 400 }}>
                  <Icon size={15} />
                  <span>{label}</span>
                  {active && <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: theme.accent }} />}
                </a>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t" style={{ borderColor: theme.border }}>
        <button
          onClick={handleSignOut}
          className="w-full mb-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors"
          style={{
            border: `1px solid ${theme.border}`,
            color: theme.textAccent,
            background: "rgba(255,255,255,0.02)",
            fontSize: "0.78rem",
          }}
        >
          <LogOut size={14} />
          <span>Sair</span>
        </button>
        <p style={{ color: theme.textMuted, fontSize: "0.58rem", fontFamily: "'IBM Plex Mono', monospace", opacity: 0.6 }}>
          v1.0 · Fev–Abr 2026
        </p>
      </div>
    </aside>
  );
}
