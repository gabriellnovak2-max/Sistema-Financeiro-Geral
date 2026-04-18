import { useState } from "react";
import { Package, Plus, Pencil, Trash2, Check, X } from "lucide-react";

type Produto = { id: number; nome: string; categoria: string; ativo: boolean };

const CATEGORIAS = ["Almofada", "Vacu", "Transparente", "Grão Torrado", "Outro"];

const PRODUTOS_INICIAIS: Produto[] = [
  { id: 1, nome: "Café Jireh Almofada 250g", categoria: "Almofada", ativo: true },
  { id: 2, nome: "Café Jireh Almofada 500g", categoria: "Almofada", ativo: true },
  { id: 3, nome: "Café Jireh Vacu 500g", categoria: "Vacu", ativo: true },
  { id: 4, nome: "Café Cerezino Almofada 250g", categoria: "Almofada", ativo: true },
  { id: 5, nome: "Café Cerezino Almofada 500g", categoria: "Almofada", ativo: true },
  { id: 6, nome: "Café Vida Almofada 250g", categoria: "Almofada", ativo: true },
  { id: 7, nome: "Café Vida Almofada 500g", categoria: "Almofada", ativo: true },
  { id: 8, nome: "Café Caseiro Transparente 250g", categoria: "Transparente", ativo: true },
  { id: 9, nome: "Café Caseiro Transparente 500g", categoria: "Transparente", ativo: true },
  { id: 10, nome: "Café Grão Torrado 500g", categoria: "Grão Torrado", ativo: true },
  { id: 11, nome: "Café Grão Torrado 1kg", categoria: "Grão Torrado", ativo: true },
  { id: 12, nome: "Café Grão Torrado 5kg", categoria: "Grão Torrado", ativo: true },
  { id: 13, nome: "Café Grão Torrado Saca 20kg", categoria: "Grão Torrado", ativo: true },
];

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>(PRODUTOS_INICIAIS);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editCat, setEditCat] = useState("");
  const [adicionando, setAdicionando] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novaCat, setNovaCat] = useState("Almofada");
  const [filtro, setFiltro] = useState("Todos");

  const salvarEdicao = (id: number) => {
    setProdutos(p => p.map(x => x.id === id ? { ...x, nome: editNome.trim() || x.nome, categoria: editCat } : x));
    setEditandoId(null);
  };

  const toggleAtivo = (id: number) => setProdutos(p => p.map(x => x.id === id ? { ...x, ativo: !x.ativo } : x));
  const deletar = (id: number) => setProdutos(p => p.filter(x => x.id !== id));

  const adicionar = () => {
    if (!novoNome.trim()) return;
    setProdutos(p => [...p, { id: Date.now(), nome: novoNome.trim(), categoria: novaCat, ativo: true }]);
    setNovoNome(""); setAdicionando(false);
  };

  const filtrados = filtro === "Todos" ? produtos : produtos.filter(p => p.categoria === filtro);
  const catColor: Record<string, string> = {
    "Almofada": "#34d399", "Vacu": "#a5b4fc", "Transparente": "#60a5fa",
    "Grão Torrado": "#f59e0b", "Outro": "rgba(255,255,255,0.4)"
  };

  return (
    <div className="p-6 space-y-6 max-w-full">
      <div className="animate-fade-in-up flex items-start justify-between" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <div>
          <h1 className="font-display text-xl font-700" style={{ color: "#fff", fontWeight: 700, letterSpacing: "-0.04em" }}>
            PRODUTOS
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Cadastro e gestão dos produtos da linha Gyrée</p>
        </div>
        <button onClick={() => setAdicionando(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
          style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)", color: "#34d399", fontWeight: 600 }}>
          <Plus size={14} /> Novo Produto
        </button>
      </div>

      {/* Filtro por categoria */}
      <div className="flex flex-wrap gap-2">
        {["Todos", ...CATEGORIAS].map(c => (
          <button key={c} onClick={() => setFiltro(c)}
            className="px-3 py-1 rounded-full text-xs font-600 transition-all"
            style={{
              background: filtro === c ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.04)",
              border: filtro === c ? "1px solid rgba(52,211,153,0.35)" : "1px solid rgba(255,255,255,0.08)",
              color: filtro === c ? "#34d399" : "rgba(255,255,255,0.45)",
              fontWeight: filtro === c ? 700 : 400,
            }}>
            {c}
          </button>
        ))}
      </div>

      {/* Form novo produto */}
      {adicionando && (
        <div className="rounded-xl p-4" style={{ background: "var(--bg-card)", border: "1px solid rgba(52,211,153,0.2)" }}>
          <p className="text-xs font-700 mb-3" style={{ color: "#34d399", textTransform: "uppercase", letterSpacing: "0.06em" }}>Novo Produto</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Nome do Produto</label>
              <input value={novoNome} onChange={e => setNovoNome(e.target.value)} placeholder="ex: Café Jireh Vacu 250g" autoFocus
                className="w-full rounded-lg px-3 py-1.5 text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: "var(--text-muted)" }}>Categoria</label>
              <select value={novaCat} onChange={e => setNovaCat(e.target.value)}
                className="w-full rounded-lg px-3 py-1.5 text-sm outline-none"
                style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
                {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={adicionar} className="px-4 py-1.5 rounded-lg text-xs font-600"
              style={{ background: "linear-gradient(135deg,hsl(158,84%,25%),hsl(158,84%,18%))", color: "#fff", fontWeight: 600 }}>
              Salvar
            </button>
            <button onClick={() => setAdicionando(false)} className="px-3 py-1.5 rounded-lg text-xs"
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-muted)" }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de produtos */}
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <span className="text-xs font-700 uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.08em" }}>
            {filtrados.length} produto{filtrados.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          {filtrados.map(p => (
            <div key={p.id} className="px-5 py-3 flex items-center gap-3 hover:bg-white/5 group transition-colors">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${catColor[p.categoria] ?? "#34d399"}15` }}>
                <Package size={12} style={{ color: catColor[p.categoria] ?? "#34d399" }} />
              </div>

              {editandoId === p.id ? (
                <>
                  <input value={editNome} onChange={e => setEditNome(e.target.value)} autoFocus
                    className="flex-1 rounded px-2 py-0.5 text-sm outline-none"
                    style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)", color: "#fff" }} />
                  <select value={editCat} onChange={e => setEditCat(e.target.value)}
                    className="rounded px-2 py-0.5 text-xs outline-none"
                    style={{ background: "var(--bg-card)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
                    {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <button onClick={() => salvarEdicao(p.id)} className="p-1 rounded hover:bg-emerald-500/10" style={{ color: "#34d399" }}><Check size={13} /></button>
                  <button onClick={() => setEditandoId(null)} className="p-1 rounded hover:bg-red-500/10" style={{ color: "rgba(248,113,113,0.5)" }}><X size={13} /></button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm" style={{ color: p.ativo ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)", textDecoration: p.ativo ? "none" : "line-through" }}>
                    {p.nome}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs" style={{ background: `${catColor[p.categoria] ?? "#34d399"}15`, color: catColor[p.categoria] ?? "#34d399", fontSize: "0.65rem" }}>
                    {p.categoria}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => toggleAtivo(p.id)} className="p-1 rounded hover:bg-white/10 text-xs" style={{ color: p.ativo ? "#f59e0b" : "#34d399" }}>
                      {p.ativo ? "Desativar" : "Ativar"}
                    </button>
                    <button onClick={() => { setEditandoId(p.id); setEditNome(p.nome); setEditCat(p.categoria); }}
                      className="p-1 rounded hover:bg-white/10" style={{ color: "rgba(52,211,153,0.6)" }}>
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => deletar(p.id)} className="p-1 rounded hover:bg-red-500/10" style={{ color: "rgba(248,113,113,0.5)" }}>
                      <Trash2 size={12} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
