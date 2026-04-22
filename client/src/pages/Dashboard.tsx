import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as db from "@/lib/db";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart
} from "recharts";
import { TrendingUp, Package, DollarSign, Clock, CheckCircle, Coffee, Activity } from "lucide-react";

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

const COLORS = ["#10b981", "#34d399", "#6366f1", "#f59e0b", "#ec4899", "#a5b4fc", "#60a5fa", "#fb923c"];

function KPICard({ icon: Icon, label, value, sub, color, delay = 0 }: any) {
  const animated = useCountUp(typeof value === "number" ? Math.round(value) : 0);
  const display = typeof value === "number"
    ? value >= 1000 ? `R$ ${animated.toLocaleString("pt-BR")}` : `${animated.toLocaleString("pt-BR")} kg`
    : value;

  return (
    <div
      className="rounded-xl p-4 animate-fade-in-up"
      style={{
        animationDelay: `${delay}ms`,
        opacity: 0,
        animationFillMode: "forwards",
        background: "var(--bg-card)",
        border: `1px solid rgba(255,255,255,0.07)`,
        transition: "border-color 200ms ease, box-shadow 200ms ease",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = `${color}40`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${color}15`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
      data-testid="kpi-card"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
        <Activity size={12} style={{ color: "rgba(255,255,255,0.15)" }} />
      </div>
      <p className="kpi-value" style={{ color, letterSpacing: "-0.04em" }}>{display}</p>
      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{label}</p>
      {sub && <p className="mt-0.5" style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.62rem", fontFamily: "'IBM Plex Mono', monospace" }}>{sub}</p>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "#1a1b1e", border: "1px solid rgba(16,185,129,0.2)", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
      <p style={{ color: "#34d399", marginBottom: 4, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.65rem" }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {typeof p.value === "number" ? p.value.toLocaleString("pt-BR") : p.value}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: () => db.getStats(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Coffee className="mx-auto mb-3" size={28} style={{ color: "#10b981", opacity: 0.7 }} />
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontFamily: "'IBM Plex Mono', monospace" }}>carregando dados...</p>
        </div>
      </div>
    );
  }

  const vendasPorDiaFormatado = (stats?.vendasPorDia || []).map((d: any) => ({
    ...d,
    label: new Date(d.data + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
  }));

  return (
    <div className="p-6 space-y-6 max-w-full">
      {/* Header */}
      <div className="animate-fade-in-up flex items-start justify-between" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="dot-live" />
            <span style={{ fontSize: "0.62rem", color: "rgba(52,211,153,0.6)", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.08em" }}>
              AO VIVO
            </span>
          </div>
          <h1 className="font-display text-xl font-700" style={{ color: "#fff", fontWeight: 700, letterSpacing: "-0.04em" }}>
            Controle de Saída de Vendas
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "-0.01em" }}>
            Fevereiro – Abril 2026 · Gerente: Valtim
          </p>
        </div>
        <div className="rounded-lg px-3 py-1.5" style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
          <p style={{ fontSize: "0.65rem", color: "#34d399", fontFamily: "'IBM Plex Mono', monospace" }}>
            {stats?.totalVendas || 0} registros
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPICard icon={Package}    label="Total de Vendas"   value={stats?.totalVendas || 0}  sub="registros"   color="#10b981" delay={0}   />
        <KPICard icon={Coffee}     label="Total em Kg"       value={stats?.totalKg || 0}       sub="quilogramas" color="#f59e0b" delay={80}  />
        <KPICard icon={DollarSign} label="Valor Recebido"    value={stats?.totalPago || 0}     sub="confirmado"  color="#34d399" delay={160} />
        <KPICard icon={Clock}      label="A Receber"         value={stats?.totalPendente || 0} sub="pendente"    color="#f87171" delay={240} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Área de vendas por dia */}
        <div className="rounded-xl p-4 animate-fade-in-up delay-200" style={{ opacity: 0, animationFillMode: "forwards", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-600 text-sm" style={{ color: "#34d399", fontWeight: 600, letterSpacing: "-0.03em" }}>
              Receita por Dia
            </h3>
            <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>R$</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={vendasPorDiaFormatado}>
              <defs>
                <linearGradient id="gradEm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="valor" stroke="#10b981" strokeWidth={2} fill="url(#gradEm)" dot={false} name="R$" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Kg por dia */}
        <div className="rounded-xl p-4 animate-fade-in-up delay-300" style={{ opacity: 0, animationFillMode: "forwards", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-600 text-sm" style={{ color: "#f59e0b", fontWeight: 600, letterSpacing: "-0.03em" }}>
              Quilos por Dia
            </h3>
            <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>kg</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={vendasPorDiaFormatado}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "'IBM Plex Mono', monospace" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="kg" fill="#f59e0b" radius={[3, 3, 0, 0]} name="kg" opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Por marca */}
        <div className="rounded-xl p-4 animate-fade-in-up delay-300 lg:col-span-2" style={{ opacity: 0, animationFillMode: "forwards", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h3 className="font-display font-600 text-sm mb-4" style={{ color: "#a5b4fc", fontWeight: 600, letterSpacing: "-0.03em" }}>
            Volume por Linha de Produto
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={(stats?.vendasPorMarca || []).sort((a: any, b: any) => b.kg - a.kg)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="marca" width={100} tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 10 }} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="kg" radius={[0, 4, 4, 0]} name="kg">
                {(stats?.vendasPorMarca || []).map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Forma de pagamento */}
        <div className="rounded-xl p-4 animate-fade-in-up delay-400" style={{ opacity: 0, animationFillMode: "forwards", background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <h3 className="font-display font-600 text-sm mb-3" style={{ color: "#ec4899", fontWeight: 600, letterSpacing: "-0.03em" }}>
            Forma de Pagamento
          </h3>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={stats?.vendasPorPagamento || []} dataKey="count" nameKey="forma" cx="50%" cy="50%" outerRadius={60} innerRadius={32}>
                {(stats?.vendasPorPagamento || []).map((_: any, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-2">
            {(stats?.vendasPorPagamento || []).map((p: any, i: number) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                  <span style={{ color: "var(--text-muted)" }}>{p.forma}</span>
                </span>
                <span className="font-mono" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.72rem" }}>{p.count}x</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
