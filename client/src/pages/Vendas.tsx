import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Venda } from "@shared/schema";
import { Plus, Search, Filter, Pencil, Trash2, X, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STATUS_OPTIONS = ["pendente", "pago", "parcial"];
const PAGAMENTO_OPTIONS = ["pix", "dinheiro", "cartão", "boleto", "não informado"];
const MARCAS = [
  "Café Jireh Almofada 250g",
  "Café Jireh Almofada 500g",
  "Café Jireh Vacu 500g",
  "Café Cerezino Almofada 250g",
  "Café Cerezino Almofada 500g",
  "Café Vida Almofada 250g",
  "Café Vida Almofada 500g",
  "Café Caseiro Transparente 250g",
  "Café Caseiro Transparente 500g",
  "Café Grão Torrado 500g",
  "Café Grão Torrado 1kg",
  "Café Grão Torrado 5kg",
  "Café Grão Torrado Saca 20kg",
  "Outro",
];
const PRODUTOS = [
  "Café Jireh 250g",
  "Café Jireh 500g",
  "Café Vida 500g",
  "Café Cerezino 250g",
  "Café Cerezino 500g",
  "Café Grão Torrado 5kg",
  "Café Grão Torrado 1kg",
  "Café Grão Torrado 500g",
  "Outro",
];

function StatusBadge({ status, id, onUpdate }: { status: string; id: number; onUpdate: (id: number, status: string) => void }) {
  const [open, setOpen] = useState(false);
  const cls = status === "pago" ? "badge-pago" : status === "parcial" ? "badge-parcial" : "badge-pendente";
  const icon = status === "pago" ? <Check size={10} /> : status === "parcial" ? <AlertCircle size={10} /> : <X size={10} />;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`${cls} flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-600 cursor-pointer transition-all`}
        data-testid={`status-btn-${id}`}
        style={{ fontWeight: 600, fontSize: "0.7rem" }}
      >
        {icon} {status.charAt(0).toUpperCase() + status.slice(1)}
      </button>
      {open && (
        <div
          className="absolute top-7 left-0 z-50 glass rounded-lg overflow-hidden"
          style={{ border: "1px solid rgba(16,185,129,0.2)", minWidth: 110 }}
        >
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => { onUpdate(id, s); setOpen(false); }}
              className="block w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 transition-colors"
              style={{ color: s === "pago" ? "#4ade80" : s === "parcial" ? "#93c5fd" : "#fbbf24" }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProdutoBadge({ produto, id, onUpdate }: { produto: string; id: number; onUpdate: (id: number, produto: string) => void }) {
  const [open, setOpen] = useState(false);
  const [digitando, setDigitando] = useState(false);
  const [outroTexto, setOutroTexto] = useState("");
  const label = produto && produto.trim() ? produto : "— produto —";

  const handleOutroConfirm = () => {
    if (outroTexto.trim()) {
      onUpdate(id, outroTexto.trim());
    }
    setDigitando(false);
    setOutroTexto("");
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-600 cursor-pointer transition-all"
        style={{
          background: "rgba(16,185,129,0.12)",
          border: "1px solid rgba(52,211,153,0.2)",
          color: "#34d399",
          fontWeight: 600,
          maxWidth: 130,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          display: "block",
        }}
        title={produto}
      >
        {label}
      </button>
      {open && (
        <div
          className="absolute top-7 left-0 z-50 rounded-lg overflow-hidden"
          style={{ border: "1px solid rgba(16,185,129,0.25)", minWidth: 180, backgroundColor: "hsl(0,0%,8%)", backdropFilter: "blur(16px)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
        >
          {digitando ? (
            <div className="p-2 flex flex-col gap-1">
              <input
                type="text"
                autoFocus
                value={outroTexto}
                onChange={e => setOutroTexto(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleOutroConfirm(); if (e.key === "Escape") { setDigitando(false); setOpen(false); } }}
                placeholder="Nome do produto..."
                className="w-full rounded px-2 py-1 text-xs outline-none"
                style={{ backgroundColor: "rgba(16,185,129,0.1)", border: "1px solid rgba(52,211,153,0.25)", color: "#6ee7b7" }}
              />
              <div className="flex gap-1">
                <button
                  onClick={handleOutroConfirm}
                  className="flex-1 py-1 rounded text-xs transition-colors"
                  style={{ backgroundColor: "rgba(16,185,129,0.2)", color: "hsl(158,84%,70%)" }}
                >
                  Confirmar
                </button>
                <button
                  onClick={() => { setDigitando(false); setOpen(false); }}
                  className="px-2 py-1 rounded text-xs transition-colors"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)" }}
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            PRODUTOS.map(p => (
              <button
                key={p}
                onClick={() => {
                  if (p === "Outro") { setDigitando(true); }
                  else { onUpdate(id, p); setOpen(false); }
                }}
                className="block w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 transition-colors"
                style={{ color: p === produto ? "hsl(158,84%,70%)" : "rgba(255,255,255,0.75)", fontWeight: p === produto ? 700 : 400 }}
              >
                {p === produto ? "✓ " : ""}{p}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function MarcaBadge({ marca, id, onUpdate }: { marca: string; id: number; onUpdate: (id: number, marca: string) => void }) {
  const [open, setOpen] = useState(false);
  const [digitando, setDigitando] = useState(false);
  const [outroTexto, setOutroTexto] = useState("");
  const label = marca && marca.trim() ? marca : "— marca —";

  const handleOutroConfirm = () => {
    if (outroTexto.trim()) onUpdate(id, outroTexto.trim());
    setDigitando(false);
    setOutroTexto("");
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-2 py-0.5 rounded text-xs cursor-pointer transition-all"
        style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(52,211,153,0.2)", color: "#34d399", fontWeight: 600, maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}
        title={marca}
      >
        {label}
      </button>
      {open && (
        <div className="absolute top-7 left-0 z-50 rounded-lg overflow-hidden" style={{ border: "1px solid rgba(52,211,153,0.2)", minWidth: 220, backgroundColor: "hsl(0,0%,8%)", backdropFilter: "blur(16px)", boxShadow: "0 8px 32px rgba(0,0,0,0.6)" }}>
          {digitando ? (
            <div className="p-2 flex flex-col gap-1">
              <input
                type="text" autoFocus
                value={outroTexto}
                onChange={e => setOutroTexto(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleOutroConfirm(); if (e.key === "Escape") { setDigitando(false); setOpen(false); } }}
                placeholder="Nome do produto..."
                className="w-full rounded px-2 py-1 text-xs outline-none"
                style={{ backgroundColor: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)", color: "#6ee7b7" }}
              />
              <div className="flex gap-1">
                <button onClick={handleOutroConfirm} className="flex-1 py-1 rounded text-xs" style={{ backgroundColor: "rgba(52,211,153,0.15)", color: "#34d399" }}>Confirmar</button>
                <button onClick={() => { setDigitando(false); setOpen(false); }} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "var(--text-muted)" }}>✕</button>
              </div>
            </div>
          ) : (
            MARCAS.map(m => (
              <button
                key={m}
                onClick={() => {
                  if (m === "Outro") { setDigitando(true); }
                  else { onUpdate(id, m); setOpen(false); }
                }}
                className="block w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 transition-colors"
                style={{ color: m === marca ? "#34d399" : "rgba(255,255,255,0.65)", fontWeight: m === marca ? 700 : 400 }}
              >
                {m === marca ? "✓ " : ""}{m}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function ClienteCell({ nome, id, onUpdate }: { nome: string | null; id: number; onUpdate: (id: number, nome: string) => void }) {
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(nome ?? "");

  const confirmar = () => {
    onUpdate(id, valor.trim());
    setEditando(false);
  };

  if (editando) {
    return (
      <div className="flex items-center gap-1" style={{ minWidth: 120 }}>
        <input
          autoFocus
          type="text"
          value={valor}
          onChange={e => setValor(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") confirmar(); if (e.key === "Escape") setEditando(false); }}
          onBlur={confirmar}
          className="rounded px-2 py-0.5 text-xs outline-none flex-1"
          style={{ backgroundColor: "rgba(16,185,129,0.1)", border: "1px solid rgba(52,211,153,0.3)", color: "#6ee7b7", minWidth: 0 }}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 group" style={{ minWidth: 80 }}>
      <span style={{ color: "rgba(255,255,255,0.75)", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 110 }}>
        {nome || <span style={{ color: "var(--text-muted)" }}>—</span>}
      </span>
      <button
        onClick={() => { setValor(nome ?? ""); setEditando(true); }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-white/10"
        style={{ color: "hsl(192,60%,55%)", flexShrink: 0 }}
        title="Editar cliente"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
    </div>
  );
}

// Helper: adiciona N dias a uma data ISO (YYYY-MM-DD)
function addDias(dataIso: string, dias: number): string {
  const d = new Date(dataIso + "T12:00:00");
  d.setDate(d.getDate() + dias);
  return d.toISOString().substring(0, 10);
}

function fmtData(iso: string) {
  const [y, m, dia] = iso.split("-");
  return `${dia}/${m}/${y}`;
}

type Parcela = { dias: number; valor: string; dataVenc: string };
type PagSalvo = { entrada: string; parcelas: Parcela[] };

// Converte string para número (aceita vírgula ou ponto)
function parseVal(s: string): number {
  return parseFloat(s.replace(",", ".")) || 0;
}

function PagamentoBadge({
  pagamento, parcelas: parcelasJson, valorTotal, id, onUpdate
}: {
  pagamento: string | null;
  parcelas: string | null;
  valorTotal: number | null;
  id: number;
  onUpdate: (id: number, pag: string, parcelas: string | null) => void;
}) {
  const [fase, setFase] = useState<"fechado" | "menu" | "parcelas">("fechado");
  const hoje = new Date().toISOString().substring(0, 10);
  const vt = valorTotal ?? 0; // valor total imutável de referência

  // Desserializa estado salvo
  const estadoInicial = (): { entrada: string; parcelas: Parcela[] } => {
    if (parcelasJson) {
      try {
        const parsed = JSON.parse(parcelasJson) as PagSalvo;
        if (parsed.parcelas) return parsed;
      } catch { /* */ }
    }
    return { entrada: "", parcelas: [{ dias: 7, valor: "", dataVenc: addDias(hoje, 7) }] };
  };

  const [entrada, setEntradaState] = useState(estadoInicial().entrada);
  const [parcelas, setParcelas] = useState<Parcela[]>(estadoInicial().parcelas);
  const [pagSelecionado, setPagSelecionado] = useState<string>(pagamento ?? "");
  const [rolo, setRolo] = useState(false); // alarme anti-rolo

  const temParcelas = (pagamento === "boleto" || pagamento === "cartão") && parcelasJson;
  const label = pagamento ? pagamento.charAt(0).toUpperCase() + pagamento.slice(1) : "—";
  const qtdParcelas = parcelasJson ? (() => {
    try { const p = JSON.parse(parcelasJson) as PagSalvo; return p.parcelas?.length ?? 0; } catch { return 0; }
  })() : 0;

  // Cálculos em tempo real
  const valorEntrada = parseVal(entrada);
  const saldoRestante = Math.max(0, vt - valorEntrada);
  const totalParcelas = parcelas.reduce((s, p) => s + parseVal(p.valor), 0);
  const totalGeral = valorEntrada + totalParcelas;
  const diff = Math.abs(totalGeral - vt);
  const taBatendo = vt > 0 && diff < 0.01; // considera ok com até 1 centavo de diferença de arredondamento
  const taPassando = vt > 0 && totalGeral > vt + 0.01;

  // Recalcula datas encadeadas
  const recalcularDatas = (lista: Parcela[], fromIndex: number): Parcela[] => {
    const nova = [...lista];
    for (let i = fromIndex; i < nova.length; i++) {
      const base = i === 0 ? hoje : nova[i - 1].dataVenc;
      nova[i] = { ...nova[i], dataVenc: addDias(base, Number(nova[i].dias) || 0) };
    }
    return nova;
  };

  const setDias = (i: number, val: number) => {
    const dias = Math.max(0, Math.min(365, val));
    const nova = parcelas.map((p, idx) => idx === i ? { ...p, dias } : p);
    setParcelas(recalcularDatas(nova, i));
  };

  const setValorParcela = (i: number, val: string) => {
    setParcelas(p => p.map((x, idx) => idx === i ? { ...x, valor: val } : x));
  };

  const addParcela = () => {
    if (parcelas.length >= 6) return;
    const ultima = parcelas[parcelas.length - 1];
    const novaData = addDias(ultima?.dataVenc ?? hoje, 7);
    setParcelas([...parcelas, { dias: 7, valor: "", dataVenc: novaData }]);
  };

  const removeParcela = (i: number) => {
    if (parcelas.length <= 1) return;
    const nova = parcelas.filter((_, idx) => idx !== i);
    setParcelas(recalcularDatas(nova, i > 0 ? i - 1 : 0));
  };

  const confirmarParcelas = () => {
    if (vt > 0 && !taBatendo) {
      setRolo(true);
      setTimeout(() => setRolo(false), 4000);
      return;
    }
    const salvo: PagSalvo = { entrada, parcelas };
    onUpdate(id, pagSelecionado, JSON.stringify(salvo));
    setFase("fechado");
  };

  const selecionarSimples = (p: string) => {
    if (p === "boleto" || p === "cartão") {
      setPagSelecionado(p);
      const ini = estadoInicial();
      setEntradaState(ini.entrada);
      setParcelas(ini.parcelas);
      setFase("parcelas");
    } else {
      onUpdate(id, p, null);
      setFase("fechado");
    }
  };

  // Barra de progresso do total digitado vs valor total
  const pct = vt > 0 ? Math.min(100, (totalGeral / vt) * 100) : 0;

  return (
    <div className="relative">
      <button
        onClick={() => setFase(fase === "fechado" ? "menu" : "fechado")}
        className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs cursor-pointer transition-all"
        style={{
          background: pagamento ? "rgba(0,120,160,0.15)" : "transparent",
          border: pagamento ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(255,255,255,0.15)",
          color: pagamento ? "#34d399" : "rgba(255,255,255,0.4)",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        {label}{temParcelas && qtdParcelas > 0 ? <span style={{ opacity: 0.6, fontSize: "0.65rem" }}> ·{qtdParcelas}x</span> : null}
      </button>

      {/* Menu inicial */}
      {fase === "menu" && (
        <div
          className="absolute top-7 left-0 z-50 rounded-lg overflow-hidden"
          style={{ border: "1px solid rgba(16,185,129,0.25)", minWidth: 130, backgroundColor: "hsl(0,0%,8%)", backdropFilter: "blur(16px)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
        >
          {PAGAMENTO_OPTIONS.filter(p => p !== "não informado").map(p => (
            <button
              key={p}
              onClick={() => selecionarSimples(p)}
              className="flex items-center justify-between w-full text-left px-3 py-1.5 text-xs hover:bg-white/5 transition-colors"
              style={{ color: p === pagamento ? "hsl(158,84%,70%)" : "rgba(255,255,255,0.75)", fontWeight: p === pagamento ? 700 : 400 }}
            >
              <span>{p === pagamento ? "✓ " : ""}{p.charAt(0).toUpperCase() + p.slice(1)}</span>
              {(p === "boleto" || p === "cartão") && <span style={{ fontSize: "0.6rem", color: "hsl(38,80%,60%)", marginLeft: 6 }}>parcelas ▶</span>}
            </button>
          ))}
        </div>
      )}

      {/* Painel de parcelas */}
      {fase === "parcelas" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/60" onClick={() => setFase("fechado")} />

          <div
            className="relative rounded-xl p-5"
            style={{
              width: 460, maxWidth: "96vw",
              backgroundColor: "hsl(0,0%,7%)",
              border: rolo ? "1.5px solid rgba(239,68,68,0.7)" : "1px solid rgba(52,211,153,0.2)",
              boxShadow: rolo ? "0 0 40px rgba(239,68,68,0.4), 0 20px 60px rgba(0,0,0,0.7)" : "0 20px 60px rgba(0,0,0,0.7)",
              animation: rolo ? "roloShake 0.4s ease" : "none",
            }}
          >
            {/* Título */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-sm font-700" style={{ color: "hsl(158,84%,70%)", fontWeight: 700 }}>
                  Parcelas — {pagSelecionado.charAt(0).toUpperCase() + pagSelecionado.slice(1)}
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>Data base: {fmtData(hoje)} · máx. 6 parcelas</p>
              </div>
              <button onClick={() => setFase("fechado")} style={{ color: "var(--text-muted)" }} className="p-1 rounded hover:bg-white/10">
                <X size={15} />
              </button>
            </div>

            {/* VALOR TOTAL DE REFERÊNCIA — intocável */}
            <div className="rounded-lg px-4 py-3 mb-4 flex items-center justify-between"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(52,211,153,0.15)" }}>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Valor Total (referência)</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-700 text-base" style={{ color: "hsl(38,90%,65%)", fontWeight: 700 }}>
                  R$ {vt.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: "rgba(16,185,129,0.15)", color: "hsl(192,60%,60%)", fontSize: "0.6rem" }}>NÃO EDITÁVEL</span>
              </div>
            </div>

            {/* ENTRADA */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1">
                <label className="text-xs mb-1 block" style={{ color: "rgba(255,255,255,0.6)" }}>Entrada (opcional)</label>
                <input
                  type="text"
                  placeholder="0,00"
                  value={entrada}
                  onChange={e => setEntradaState(e.target.value)}
                  className="w-full rounded-lg px-3 py-1.5 text-sm outline-none font-mono"
                  style={{ border: "1px solid rgba(52,211,153,0.2)", background: "rgba(16,185,129,0.08)", color: "hsl(38,90%,65%)" }}
                />
              </div>
              <div className="text-right">
                <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>Saldo a parcelar</p>
                <p className="font-mono font-700 text-sm" style={{ color: "#34d399", fontWeight: 700 }}>
                  R$ {saldoRestante.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Divisória */}
            <div className="mb-3" style={{ borderTop: "1px solid rgba(16,185,129,0.12)" }} />

            {/* Cabeçalho colunas */}
            <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: "24px 60px 1fr 90px 20px", padding: "0 2px" }}>
              <span />
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Dias</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Valor (R$)</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>Vencimento</span>
              <span />
            </div>

            {/* Linhas de parcelas */}
            <div className="flex flex-col gap-2">
              {parcelas.map((p, i) => (
                <div key={i} className="grid items-center gap-2" style={{ gridTemplateColumns: "24px 60px 1fr 90px 20px" }}>
                  <span className="text-xs text-center font-mono" style={{ color: "hsl(38,80%,55%)", fontWeight: 700 }}>{i + 1}º</span>
                  <div className="flex items-center rounded" style={{ border: "1px solid rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.08)" }}>
                    <input
                      type="number" min={0} max={365}
                      value={p.dias}
                      onChange={e => setDias(i, parseInt(e.target.value) || 0)}
                      className="w-full px-1.5 py-1 text-xs outline-none bg-transparent text-center font-mono"
                      style={{ color: "#6ee7b7" }}
                    />
                  </div>
                  <input
                    type="text" placeholder="0,00"
                    value={p.valor}
                    onChange={e => setValorParcela(i, e.target.value)}
                    className="rounded px-2 py-1 text-xs outline-none font-mono"
                    style={{ border: "1px solid rgba(16,185,129,0.15)", background: "rgba(16,185,129,0.06)", color: "hsl(38,90%,65%)" }}
                  />
                  <span className="text-xs font-mono text-center" style={{ color: "rgba(255,255,255,0.7)" }}>{fmtData(p.dataVenc)}</span>
                  <button
                    onClick={() => removeParcela(i)}
                    className="flex items-center justify-center rounded hover:bg-red-500/15 transition-colors"
                    style={{ color: parcelas.length > 1 ? "rgba(248,113,113,0.5)" : "transparent", width: 18, height: 18 }}
                    disabled={parcelas.length <= 1}
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>

            {/* Barra de progresso */}
            {vt > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>Entrada + Parcelas</span>
                  <span style={{ color: taPassando ? "#f87171" : taBatendo ? "#4ade80" : "hsl(38,80%,60%)", fontWeight: 700 }}>
                    R$ {totalGeral.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    {taBatendo && " ✔️"}
                    {taPassando && " ⚠️"}
                  </span>
                </div>
                <div className="rounded-full overflow-hidden" style={{ height: 6, background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: taPassando
                        ? "linear-gradient(90deg,#ef4444,#dc2626)"
                        : taBatendo
                        ? "linear-gradient(90deg,#4ade80,#22c55e)"
                        : "linear-gradient(90deg,hsl(192,85%,40%),hsl(38,85%,50%))",
                    }}
                  />
                </div>
              </div>
            )}

            {/* ALARME ANTI-ROLO */}
            {rolo && (
              <div
                className="mt-3 rounded-lg px-4 py-3 flex items-center gap-3"
                style={{
                  background: "rgba(239,68,68,0.12)",
                  border: "1.5px solid rgba(239,68,68,0.5)",
                  animation: "roloPulse 0.6s ease infinite alternate",
                }}
              >
                <span style={{ fontSize: "1.4rem" }}>🚨</span>
                <div>
                  <p className="text-xs font-700" style={{ color: "#f87171", fontWeight: 700 }}>OPERAÇÃO NÃO PERMITIDA!</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(248,113,113,0.8)" }}>
                    Aqui não faz rolo, meu parceiro! — Total digitado (R$ {totalGeral.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}) não bate com o valor total (R$ {vt.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}).
                  </p>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={addParcela}
                disabled={parcelas.length >= 6}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: parcelas.length < 6 ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(16,185,129,0.2)",
                  color: parcelas.length < 6 ? "hsl(192,65%,70%)" : "rgba(255,255,255,0.3)",
                }}
              >
                <Plus size={12} /> + Parcela
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setFase("menu")}
                  className="px-3 py-1.5 rounded-lg text-xs transition-colors"
                  style={{ border: "1px solid rgba(16,185,129,0.15)", color: "rgba(255,255,255,0.6)" }}
                >
                  Voltar
                </button>
                <button
                  onClick={confirmarParcelas}
                  className="px-4 py-1.5 rounded-lg text-xs font-600 transition-all"
                  style={{
                    background: taBatendo || vt === 0
                      ? "linear-gradient(135deg, hsl(158,84%,25%), hsl(158,84%,18%))"
                      : "rgba(80,40,40,0.4)",
                    color: taBatendo || vt === 0 ? "#fff" : "rgba(200,150,150,0.6)",
                    fontWeight: 600,
                    border: !taBatendo && vt > 0 ? "1px solid rgba(239,68,68,0.2)" : "none",
                  }}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditModal({ venda, onClose, onSave }: { venda: Venda | null; onClose: () => void; onSave: (data: any) => void }) {
  const isNew = !venda;
  const [form, setForm] = useState<any>(venda ? { ...venda } : {
    data: new Date().toISOString().substring(0, 10),
    marca: "Café Jireh Almofada 500g",
    tipoProduto: "",
    pesoPacote: "500g",
    quantidadeKg: "",
    precoKg: "",
    valorTotal: "",
    formaPagamento: "pix",
    statusPagamento: "pendente",
    clienteNome: "",
    emitirNota: false,
    observacoes: "",
  });

  const f = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const labelCls = "block text-xs mb-1 font-600" as const;
  const inputCls = "w-full rounded-lg px-3 py-1.5 text-sm bg-white/5 border focus:outline-none focus:border-cyan-500/50 transition-colors" as const;
  const inputStyle = { borderColor: "rgba(16,185,129,0.2)", color: "#d1fae5", backgroundColor: "#111214" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="glass relative rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
        style={{ border: "1px solid rgba(52,211,153,0.2)", zIndex: 51 }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "rgba(16,185,129,0.15)" }}>
          <h2 className="font-display font-700 text-sm" style={{ color: "hsl(158,84%,70%)", fontWeight: 700 }}>
            {isNew ? "Nova Venda" : "Editar Venda"}
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10" style={{ color: "rgba(255,255,255,0.6)" }}>
            <X size={16} />
          </button>
        </div>

        <div className="p-4 grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls} style={{ color: "#34d399" }}>Data de Saída</label>
            <input type="date" className={inputCls} style={inputStyle} value={form.data} onChange={e => f("data", e.target.value)} data-testid="input-data" />
          </div>
          <div>
            <label className={labelCls} style={{ color: "#34d399" }}>Marca</label>
            <select className={inputCls} style={inputStyle} value={form.marca} onChange={e => f("marca", e.target.value)} data-testid="input-marca">
              {MARCAS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className={labelCls} style={{ color: "#34d399" }}>Tipo / Descrição do Produto</label>
            <select
              className={inputCls}
              style={inputStyle}
              value={PRODUTOS.includes(form.tipoProduto) ? form.tipoProduto : form.tipoProduto ? "Outro" : ""}
              onChange={e => {
                if (e.target.value === "Outro") f("tipoProduto", "Outro");
                else f("tipoProduto", e.target.value);
              }}
              data-testid="input-tipo"
            >
              <option value="">— selecione o produto —</option>
              {PRODUTOS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {(form.tipoProduto === "Outro" || (form.tipoProduto && !PRODUTOS.slice(0, -1).includes(form.tipoProduto))) && (
              <input
                type="text"
                className={inputCls}
                style={{ ...inputStyle, marginTop: 6 }}
                placeholder="Digite o nome do produto..."
                value={form.tipoProduto === "Outro" ? "" : form.tipoProduto}
                onChange={e => f("tipoProduto", e.target.value || "Outro")}
                autoFocus
                data-testid="input-tipo-outro"
              />
            )}
          </div>
          <div>
            <label className={labelCls} style={{ color: "#34d399" }}>Embalagem</label>
            <select className={inputCls} style={inputStyle} value={form.pesoPacote} onChange={e => f("pesoPacote", e.target.value)}>
              {["250g","500g","1kg","5kg","10kg","Granel"].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} style={{ color: "#34d399" }}>Quantidade (kg)</label>
            <input type="number" step="0.001" className={inputCls} style={inputStyle} value={form.quantidadeKg} onChange={e => f("quantidadeKg", parseFloat(e.target.value))} data-testid="input-qtd" />
          </div>
          <div>
            <label className={labelCls} style={{ color: "#34d399" }}>Preço/kg (R$)</label>
            <input type="number" step="0.01" className={inputCls} style={inputStyle} placeholder="opcional" value={form.precoKg ?? ""} onChange={e => f("precoKg", e.target.value ? parseFloat(e.target.value) : null)} />
          </div>
          <div>
            <label className={labelCls} style={{ color: "hsl(38,90%,65%)" }}>Valor Total (R$)</label>
            <input type="number" step="0.01" className={inputCls} style={{ ...inputStyle, borderColor: "rgba(230,160,40,0.25)" }} placeholder="0,00" value={form.valorTotal ?? ""} onChange={e => f("valorTotal", e.target.value ? parseFloat(e.target.value) : null)} data-testid="input-valor" />
          </div>
          <div>
            <label className={labelCls} style={{ color: "#34d399" }}>Forma de Pagamento</label>
            <select className={inputCls} style={inputStyle} value={form.formaPagamento ?? ""} onChange={e => f("formaPagamento", e.target.value)}>
              <option value="">— selecione —</option>
              {PAGAMENTO_OPTIONS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls} style={{ color: "#34d399" }}>Status</label>
            <select className={inputCls} style={inputStyle} value={form.statusPagamento} onChange={e => f("statusPagamento", e.target.value)} data-testid="input-status">
              {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className={labelCls} style={{ color: "#34d399" }}>Cliente</label>
            <input type="text" className={inputCls} style={inputStyle} placeholder="Nome do cliente" value={form.clienteNome ?? ""} onChange={e => f("clienteNome", e.target.value)} data-testid="input-cliente" />
          </div>
          <div className="col-span-2">
            <label className={labelCls} style={{ color: "#34d399" }}>Observações</label>
            <textarea className={inputCls} style={inputStyle} rows={2} value={form.observacoes ?? ""} onChange={e => f("observacoes", e.target.value)} />
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <input type="checkbox" id="nota" checked={!!form.emitirNota} onChange={e => f("emitirNota", e.target.checked)} className="w-4 h-4 rounded accent-cyan-400" />
            <label htmlFor="nota" className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>Emitiu / Emitir nota fiscal</label>
          </div>
        </div>

        <div className="flex gap-2 px-4 pb-4">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg text-sm border transition-colors hover:bg-white/5"
            style={{ borderColor: "rgba(16,185,129,0.2)", color: "rgba(255,255,255,0.7)" }}>
            Cancelar
          </button>
          <button onClick={() => onSave(form)} className="flex-1 py-2 rounded-lg text-sm font-600 transition-all"
            style={{ background: "linear-gradient(135deg, hsl(158,84%,25%), hsl(158,84%,18%))", color: "#fff", fontWeight: 600 }}
            data-testid="btn-salvar">
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Vendas() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [editVenda, setEditVenda] = useState<Venda | null | undefined>(undefined);

  const { data: vendas = [], isLoading } = useQuery<Venda[]>({
    queryKey: ["/api/vendas"],
    queryFn: () => apiRequest("GET", "/api/vendas").then(r => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/vendas", data).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/vendas"] }); queryClient.invalidateQueries({ queryKey: ["/api/stats"] }); toast({ title: "Venda criada!" }); setEditVenda(undefined); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => apiRequest("PATCH", `/api/vendas/${id}`, data).then(r => r.json()),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/vendas"] }); queryClient.invalidateQueries({ queryKey: ["/api/stats"] }); toast({ title: "Atualizado!" }); setEditVenda(undefined); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/vendas/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/vendas"] }); queryClient.invalidateQueries({ queryKey: ["/api/stats"] }); toast({ title: "Removido" }); },
  });

  const handleSave = (data: any) => {
    if (editVenda?.id) updateMutation.mutate({ id: editVenda.id, data });
    else createMutation.mutate(data);
  };

  const handleStatusUpdate = (id: number, status: string) => {
    updateMutation.mutate({ id, data: { statusPagamento: status } });
  };

  const filtered = vendas.filter(v => {
    const matchSearch = !search ||
      (v.clienteNome ?? "").toLowerCase().includes(search.toLowerCase()) ||
      v.marca.toLowerCase().includes(search.toLowerCase()) ||
      v.tipoProduto.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "todos" || v.statusPagamento === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalFiltrado = filtered.reduce((s, v) => s + (v.quantidadeKg || 0), 0);
  const valorFiltrado = filtered.reduce((s, v) => s + (v.valorTotal || 0), 0);

  return (
    <div className="p-6 space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <div>
          <h1 className="font-display font-800 text-xl" style={{ color: "hsl(158,84%,75%)", fontWeight: 800 }}>
            Registro de Saídas
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
            {filtered.length} registro(s) · {totalFiltrado.toFixed(1)} kg · R$ {valorFiltrado.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <button
          onClick={() => setEditVenda(null)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-600 transition-all"
          style={{ background: "linear-gradient(135deg, hsl(158,84%,25%), hsl(158,84%,18%))", color: "#fff", fontWeight: 600 }}
          data-testid="btn-nova-venda"
        >
          <Plus size={15} /> Nova Saída
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap animate-fade-in-up delay-100" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <div className="flex items-center gap-2 glass rounded-lg px-3 py-1.5 flex-1 min-w-48">
          <Search size={14} style={{ color: "rgba(0,180,200,0.5)" }} />
          <input
            type="text"
            placeholder="Buscar cliente, marca, produto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm flex-1 outline-none"
            style={{ color: "#f0fdf4" }}
            data-testid="input-search"
          />
        </div>
        <div className="flex gap-1">
          {["todos", "pendente", "pago", "parcial"].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-600 transition-all"
              style={{
                fontWeight: 600,
                background: filterStatus === s ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${filterStatus === s ? "rgba(52,211,153,0.3)" : "rgba(16,185,129,0.1)"}`,
                color: filterStatus === s ? "#34d399" : "rgba(255,255,255,0.6)",
              }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="glass rounded-xl overflow-hidden flex-1 animate-fade-in-up delay-200" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <div className="overflow-x-auto overflow-y-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <p style={{ color: "var(--text-muted)" }}>Carregando vendas...</p>
            </div>
          ) : (
            <table className="w-full table-valtim">
              <thead className="sticky top-0">
                <tr>
                  <th>Data de Saída</th>
                  <th>Marca</th>
                  <th>Produto / Emb.</th>
                  <th>Qtd (kg)</th>
                  <th>Preço/kg</th>
                  <th>Valor Total</th>
                  <th>Pagamento</th>
                  <th>Status</th>
                  <th>Cliente</th>
                  <th>Nota Fiscal</th>
                  <th>Obs.</th>
                  <th style={{ width: 80 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(v => (
                  <tr key={v.id} data-testid={`row-venda-${v.id}`}>
                    <td className="font-mono" style={{ color: "hsl(192,50%,70%)", fontSize: "0.75rem" }}>
                      {new Date(v.data + "T12:00:00").toLocaleDateString("pt-BR")}
                    </td>
                    <td>
                      <MarcaBadge marca={v.marca} id={v.id} onUpdate={(id, m) => updateMutation.mutate({ id, data: { marca: m } })} />
                    </td>
                    <td style={{ maxWidth: 160 }}>
                      <ProdutoBadge produto={v.tipoProduto} id={v.id} onUpdate={(id, p) => updateMutation.mutate({ id, data: { tipoProduto: p } })} />
                      <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", display: "block", marginTop: 2 }}>· {v.pesoPacote}</span>
                    </td>
                    <td className="font-mono" style={{ color: "hsl(38,90%,65%)", fontWeight: 600 }}>
                      {v.quantidadeKg?.toLocaleString("pt-BR")} kg
                    </td>
                    <td className="font-mono" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {v.precoKg ? `R$ ${v.precoKg.toFixed(2)}` : "—"}
                    </td>
                    <td className="font-mono" style={{ color: v.valorTotal ? "#4ade80" : "rgba(255,255,255,0.4)", fontWeight: v.valorTotal ? 600 : 400 }}>
                      {v.valorTotal ? `R$ ${v.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "—"}
                    </td>
                    <td>
                      <PagamentoBadge
                        pagamento={v.formaPagamento ?? null}
                        parcelas={(v as any).parcelas ?? null}
                        valorTotal={v.valorTotal ?? null}
                        id={v.id}
                        onUpdate={(id, pag, parc) => updateMutation.mutate({ id, data: { formaPagamento: pag, ...(parc !== undefined ? { parcelas: parc } : {}) } as any })}
                      />
                    </td>
                    <td>
                      <StatusBadge status={v.statusPagamento} id={v.id} onUpdate={handleStatusUpdate} />
                    </td>
                    <td style={{ maxWidth: 140 }}>
                      <ClienteCell nome={v.clienteNome ?? null} id={v.id} onUpdate={(id, nome) => updateMutation.mutate({ id, data: { clienteNome: nome } })} />
                    </td>
                    <td>
                      {v.emitirNota
                        ? <span className="badge-pago px-2 py-0.5 rounded-full text-xs">Sim</span>
                        : <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>Não</span>}
                    </td>
                    <td style={{ color: "rgba(255,255,255,0.5)", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", fontSize: "0.7rem" }}>
                      {v.observacoes || ""}
                    </td>
                    <td>
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => setEditVenda(v)} className="p-1.5 rounded hover:bg-white/10 transition-colors" style={{ color: "hsl(192,70%,60%)" }} data-testid={`btn-edit-${v.id}`}>
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => { if (confirm("Remover esta venda?")) deleteMutation.mutate(v.id); }} className="p-1.5 rounded hover:bg-red-500/10 transition-colors" style={{ color: "#f87171" }} data-testid={`btn-delete-${v.id}`}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {editVenda !== undefined && (
        <EditModal venda={editVenda} onClose={() => setEditVenda(undefined)} onSave={handleSave} />
      )}
    </div>
  );
}
