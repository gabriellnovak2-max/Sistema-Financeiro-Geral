import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Target, TrendingUp, Package, DollarSign, Plus, Trash2, Check } from "lucide-react";

type Meta = { id: number; label: string; tipo: "valor" | "kg" | "vendas"; alvo: number };

const METAS_DEFAULT: Meta[] = [
  { id: 1, label: "Receita Mensal", tipo: "valor", alvo: 5000 },
  { id: 2, label: "Volume Mensal (kg)", tipo: "kg", alvo: 200 },
  { id: 3, label: "Saídas no Mês", tipo: "vendas", alvo: 30 },
];

export default function Metas() {
  const [metas, setMetas] = useState<Meta[]>(METAS_DEFAULT);
  const [editando, setEditando] = useState<number | null>(null);
  const [novaLabel, setNovaLabel] = useState("");
  const [novoAlvo, setNovoAlvo] = useState("");
  const [novoTipo, setNovoTipo] = useState<"valor" | "kg" | "vendas">("valor");
  const [adicionando, setAdicionando] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: () => apiRequest("GET", "/api/stats").then(r => r.json()),
  });

  const atual = (tipo: string) => {
    if (tipo === "valor") return stats?.totalPago ?? 0;
    if (tipo === "kg") return stats?.totalKg ?? 0;
    if (tipo === "vendas") return stats?.totalVendas ?? 0;
    return 0;
  };

  const addMeta = () => {
    if (!novaLabel.trim() || !novoAlvo) return;
    setMetas(m => [...m, { id: Date.now(), label: novaLabel.trim(), tipo: novoTipo, alvo: parseFloat(novoAlvo) }]);
    setNovaLabel(""); setNovoAlvo(""); setAdicionando(false);
  };

  const delMeta = (id: number) => setMetas(m => m.filter(x => x.id !== id));

  const fmtVal = (tipo: string, v: number) => {
    if (tipo === "valor") return `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
    if (tipo === "kg") return `${v.toLocaleString("pt-BR")} kg`;
    return `${v}`;
  };

  const tipoIcon = (tipo: string) => {
    if (tipo === "valor") return <DollarSign size={14} style={{ color: "#34d399" }} />;
    if (tipo === "kg") return <Package size={14} style={{ color: "#f59e0b" }} />;
    return <TrendingUp size={14} style={{ color: "#a5b4fc" }} />;
  };

  const tipoColor = (tipo: string) => tipo === "valor" ? "#34d399" : tipo === "kg" ? "#f59e0b" : "#a5b4fc";

  return (
    <div className="p-6 space-y-6 max-w-full">
      <div className="animate-fade-in-up flex items-start justify-between" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <div>
          <h1 className="font-display text-xl font-700" style={{ color: "#fff", fontWeight: 700, letterSpacing: "-0.04em" }}>
            METAS
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Defina e acompanhe seus objetivos de vendas</p>
        </div>
        <button
          onClick={() => setAdicionando(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
          style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", color: "#34d399", fontWeight: 600 }}
        >
          <Plus size={14} /> Nova Meta
        </button>
      </div>

      {/* Form nova meta */}
      {adicionando && (
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid rgba(52,211,153,0.2)" }}>
          <p className="text-xs font-700 mb-3" style={{ color: "#34d399", textTransform: "uppercase", letterSpacing: "0.06em" }}>Nova Meta</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Nome da Meta</label>
              <input value={novaLabel} onChange={e => setNovaLabel(e.target.value)} placeholder="ex: Receita de Março"
                className="w-full rounded-lg px-3 py-1.5 text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Tipo</label>
              <select value={novoTipo} onChange={e => setNovoTipo(e.target.value as any)}
                className="w-full rounded-lg px-3 py-1.5 text-sm outline-none"
                style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
                <option value="valor">Valor (R$)</option>
                <option value="kg">Volume (kg)</option>
                <option value="vendas">Qtd. Vendas</option>
              </select>
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Meta Alvo</label>
              <input type="number" value={novoAlvo} onChange={e => setNovoAlvo(e.target.value)} placeholder="0"
                className="w-full rounded-lg px-3 py-1.5 text-sm outline-none font-mono"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={addMeta} className="px-4 py-1.5 rounded-lg text-xs font-600 transition-all"
              style={{ background: "linear-gradient(135deg,hsl(158,84%,25%),hsl(158,84%,18%))", color: "#fff", fontWeight: 600 }}>
              Salvar Meta
            </button>
            <button onClick={() => setAdicionando(false)} className="px-3 py-1.5 rounded-lg text-xs transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-muted)" }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Cards de metas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {metas.map(m => {
          const atu = atual(m.tipo);
          const pct = Math.min(100, m.alvo > 0 ? (atu / m.alvo) * 100 : 0);
          const atingida = pct >= 100;
          const cor = tipoColor(m.tipo);
          return (
            <div key={m.id} className="rounded-xl p-5 relative group"
              style={{ background: "var(--bg-card)", border: `1px solid ${atingida ? "rgba(52,211,153,0.3)" : "rgba(255,255,255,0.07)"}`,
                boxShadow: atingida ? "0 0 20px rgba(16,185,129,0.1)" : "none" }}>
              {atingida && (
                <div className="absolute top-3 right-10 flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(52,211,153,0.3)" }}>
                  <Check size={10} style={{ color: "#34d399" }} />
                  <span style={{ fontSize: "0.6rem", color: "#34d399", fontWeight: 700 }}>ATINGIDA</span>
                </div>
              )}
              <button onClick={() => delMeta(m.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/15 transition-all"
                style={{ color: "rgba(248,113,113,0.5)" }}>
                <Trash2 size={12} />
              </button>
              <div className="flex items-center gap-2 mb-3">
                {tipoIcon(m.tipo)}
                <span className="text-xs font-700 uppercase" style={{ color: cor, letterSpacing: "0.04em", fontWeight: 700 }}>{m.label}</span>
              </div>
              <div className="flex items-end justify-between mb-2">
                <p className="font-mono font-700 text-lg" style={{ color: "#fff", fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>
                  {fmtVal(m.tipo, atu)}
                </p>
                <p className="text-xs font-mono" style={{ color: "var(--text-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>
                  / {fmtVal(m.tipo, m.alvo)}
                </p>
              </div>
              <div className="rounded-full overflow-hidden mb-1" style={{ height: 6, background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: atingida ? "linear-gradient(90deg,#10b981,#34d399)" : `linear-gradient(90deg,${cor},${cor}88)` }} />
              </div>
              <p className="text-xs text-right font-mono" style={{ color: cor, fontFamily: "'IBM Plex Mono', monospace" }}>
                {pct.toFixed(1)}%
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
