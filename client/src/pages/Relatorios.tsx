import { useQuery } from "@tanstack/react-query";
import * as db from "@/lib/db";
import { FileText, TrendingUp, Package, DollarSign, Download, Calendar } from "lucide-react";

export default function Relatorios() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: () => db.getStats(),
  });
  const { data: vendas = [] } = useQuery({
    queryKey: ["/api/vendas"],
    queryFn: () => db.getVendas(),
  });

  // Agrupa por mês
  const porMes = vendas.reduce((acc: Record<string, { valor: number; kg: number; qtd: number }>, v: any) => {
    const mes = v.data?.substring(0, 7) ?? "—";
    if (!acc[mes]) acc[mes] = { valor: 0, kg: 0, qtd: 0 };
    acc[mes].valor += v.valorTotal ?? 0;
    acc[mes].kg += v.quantidadeKg ?? 0;
    acc[mes].qtd++;
    return acc;
  }, {});

  const meses = Object.entries(porMes).sort(([a], [b]) => a.localeCompare(b));

  const fmtMes = (iso: string) => {
    const [y, m] = iso.split("-");
    const nomes = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    return `${nomes[parseInt(m)-1]} ${y}`;
  };

  const card = (icon: any, label: string, value: string, color: string) => (
    <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
          {icon}
        </div>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</span>
      </div>
      <p className="font-display text-xl font-700" style={{ color, fontWeight: 700, letterSpacing: "-0.04em" }}>{value}</p>
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-full">
      {/* Header */}
      <div className="animate-fade-in-up" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-700" style={{ color: "#fff", fontWeight: 700, letterSpacing: "-0.04em" }}>
              RELATÓRIOS
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Resumo completo das saídas de vendas</p>
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
            style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", color: "#34d399", fontWeight: 600 }}
          >
            <Download size={14} /> Imprimir / Exportar
          </button>
        </div>
      </div>

      {/* KPIs resumidos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {card(<FileText size={14} style={{ color: "#10b981" }} />, "Total de Registros", `${stats?.totalVendas ?? 0}`, "#10b981")}
        {card(<Package size={14} style={{ color: "#f59e0b" }} />, "Total em Kg", `${(stats?.totalKg ?? 0).toLocaleString("pt-BR")} kg`, "#f59e0b")}
        {card(<DollarSign size={14} style={{ color: "#34d399" }} />, "Receita Total", `R$ ${(stats?.totalPago ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, "#34d399")}
        {card(<TrendingUp size={14} style={{ color: "#f87171" }} />, "A Receber", `R$ ${(stats?.totalPendente ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`, "#f87171")}
      </div>

      {/* Relatório por mês */}
      <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={15} style={{ color: "#34d399" }} />
          <h3 className="font-display font-700 text-sm" style={{ color: "#34d399", fontWeight: 700, letterSpacing: "-0.03em", textTransform: "uppercase" }}>
            Resumo por Mês
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-valtim text-sm">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Mês</th>
                <th style={{ textAlign: "right" }}>Qtd. Saídas</th>
                <th style={{ textAlign: "right" }}>Total Kg</th>
                <th style={{ textAlign: "right" }}>Receita (R$)</th>
                <th style={{ textAlign: "right" }}>Ticket Médio</th>
              </tr>
            </thead>
            <tbody>
              {meses.map(([mes, d]) => (
                <tr key={mes}>
                  <td style={{ color: "#34d399", fontWeight: 600 }}>{fmtMes(mes)}</td>
                  <td style={{ textAlign: "right", color: "rgba(255,255,255,0.6)" }}>{d.qtd}</td>
                  <td style={{ textAlign: "right", color: "#f59e0b", fontFamily: "'IBM Plex Mono', monospace" }}>{d.kg.toLocaleString("pt-BR")} kg</td>
                  <td style={{ textAlign: "right", color: "#4ade80", fontFamily: "'IBM Plex Mono', monospace" }}>R$ {d.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                  <td style={{ textAlign: "right", color: "var(--text-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>
                    R$ {d.qtd > 0 ? (d.valor / d.qtd).toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : "0,00"}
                  </td>
                </tr>
              ))}
              {meses.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", padding: "2rem" }}>Nenhum dado disponível</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top produtos */}
      <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="flex items-center gap-2 mb-4">
          <Package size={15} style={{ color: "#f59e0b" }} />
          <h3 className="font-display font-700 text-sm" style={{ color: "#f59e0b", fontWeight: 700, letterSpacing: "-0.03em", textTransform: "uppercase" }}>
            Ranking de Produtos
          </h3>
        </div>
        <div className="space-y-2">
          {(stats?.vendasPorMarca ?? [])
            .sort((a: any, b: any) => b.kg - a.kg)
            .slice(0, 8)
            .map((m: any, i: number) => {
              const max = stats?.vendasPorMarca?.[0]?.kg ?? 1;
              const pct = Math.max(4, (m.kg / max) * 100);
              return (
                <div key={m.marca} className="flex items-center gap-3">
                  <span className="text-xs font-mono w-5 text-right" style={{ color: "var(--text-muted)" }}>{i + 1}</span>
                  <span className="text-xs w-36 truncate" style={{ color: "rgba(255,255,255,0.7)" }}>{m.marca}</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#10b981,#34d399)" }} />
                  </div>
                  <span className="text-xs font-mono" style={{ color: "#f59e0b", fontFamily: "'IBM Plex Mono', monospace", minWidth: 60, textAlign: "right" }}>{m.kg} kg</span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
