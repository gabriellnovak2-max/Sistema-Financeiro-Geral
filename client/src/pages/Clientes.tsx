import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import * as db from "@/lib/db";
import type { Cliente } from "@shared/schema";
import { Plus, Pencil, Trash2, X, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function ClienteModal({ cliente, onClose, onSave }: { cliente: Cliente | null; onClose: () => void; onSave: (d: any) => void }) {
  const isNew = !cliente;
  const [form, setForm] = useState<any>(cliente ?? { nome: "", cpfCnpj: "", telefone: "", endereco: "" });
  const f = (k: string, v: string) => setForm((p: any) => ({ ...p, [k]: v }));
  const inputCls = "w-full rounded-lg px-3 py-1.5 text-sm bg-white/5 border focus:outline-none focus:border-cyan-500/50 transition-colors";
  const inputStyle = { borderColor: "rgba(16,185,129,0.2)", color: "#d1fae5" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="glass relative rounded-2xl w-full max-w-md" style={{ border: "1px solid rgba(52,211,153,0.2)", zIndex: 51 }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "rgba(16,185,129,0.15)" }}>
          <h2 className="font-display font-700 text-sm" style={{ color: "#34d399", fontWeight: 700 }}>
            {isNew ? "Novo Cliente" : "Editar Cliente"}
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-white/10" style={{ color: "rgba(255,255,255,0.6)" }}><X size={16} /></button>
        </div>
        <div className="p-4 space-y-3">
          {[["nome", "Nome *", "text", "Ex: João da Silva"], ["cpfCnpj", "CPF / CNPJ", "text", "000.000.000-00"], ["telefone", "Telefone", "tel", "(62) 9 0000-0000"], ["endereco", "Endereço", "text", "Rua, número, cidade"]].map(([k, l, t, ph]) => (
            <div key={k}>
              <label className="block text-xs mb-1 font-600" style={{ color: "#34d399", fontWeight: 600 }}>{l}</label>
              <input type={t} placeholder={ph} className={inputCls} style={inputStyle} value={form[k] ?? ""} onChange={e => f(k, e.target.value)} data-testid={`input-${k}`} />
            </div>
          ))}
        </div>
        <div className="flex gap-2 px-4 pb-4">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg text-sm border transition-colors hover:bg-white/5" style={{ borderColor: "rgba(16,185,129,0.2)", color: "rgba(255,255,255,0.7)" }}>Cancelar</button>
          <button onClick={() => onSave(form)} className="flex-1 py-2 rounded-lg text-sm font-600" style={{ background: "linear-gradient(135deg, hsl(192,85%,32%), hsl(158,84%,18%))", color: "#fff", fontWeight: 600 }} data-testid="btn-salvar-cliente">Salvar</button>
        </div>
      </div>
    </div>
  );
}

export default function Clientes() {
  const { toast } = useToast();
  const [editCliente, setEditCliente] = useState<Cliente | null | undefined>(undefined);
  const [search, setSearch] = useState("");

  const { data: clientes = [] } = useQuery<Cliente[]>({
    queryKey: ["/api/clientes"],
    queryFn: () => db.getClientes(),
  });

  const create = useMutation({
    mutationFn: (d: any) => db.createCliente(d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/clientes"] }); toast({ title: "Cliente cadastrado!" }); setEditCliente(undefined); },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: any) => db.updateCliente(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/clientes"] }); toast({ title: "Atualizado!" }); setEditCliente(undefined); },
  });

  const remove = useMutation({
    mutationFn: (id: number) => db.deleteCliente(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/clientes"] }); toast({ title: "Removido" }); },
  });

  const handleSave = (data: any) => {
    if (editCliente?.id) update.mutate({ id: editCliente.id, data });
    else create.mutate(data);
  };

  const filtered = clientes.filter(c =>
    !search || c.nome.toLowerCase().includes(search.toLowerCase()) || (c.cpfCnpj ?? "").includes(search)
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between animate-fade-in-up" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <div>
          <h1 className="font-display font-800 text-xl" style={{ color: "hsl(158,84%,75%)", fontWeight: 800 }}>Clientes</h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{filtered.length} cadastrado(s)</p>
        </div>
        <button onClick={() => setEditCliente(null)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-600 transition-all"
          style={{ background: "linear-gradient(135deg, hsl(158,84%,25%), hsl(192,85%,20%))", color: "#fff", fontWeight: 600 }} data-testid="btn-novo-cliente">
          <Plus size={15} /> Novo Cliente
        </button>
      </div>

      <div className="glass rounded-lg px-3 py-1.5 flex items-center gap-2 animate-fade-in-up delay-100" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <User size={14} style={{ color: "rgba(0,180,200,0.5)" }} />
        <input type="text" placeholder="Buscar por nome ou CPF/CNPJ..." value={search} onChange={e => setSearch(e.target.value)}
          className="bg-transparent text-sm flex-1 outline-none" style={{ color: "hsl(210,20%,80%)" }} data-testid="search-clientes" />
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center animate-fade-in-up delay-200" style={{ opacity: 0, animationFillMode: "forwards" }}>
          <User size={32} className="mx-auto mb-3" style={{ color: "rgba(16,185,129,0.3)" }} />
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Nenhum cliente cadastrado ainda.</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Clique em "Novo Cliente" para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 animate-fade-in-up delay-200" style={{ opacity: 0, animationFillMode: "forwards" }}>
          {filtered.map(c => (
            <div key={c.id} className="glass rounded-xl p-4" data-testid={`card-cliente-${c.id}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(52,211,153,0.15)" }}>
                  <User size={15} style={{ color: "hsl(192,70%,60%)" }} />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditCliente(c)} className="p-1.5 rounded hover:bg-white/10" style={{ color: "hsl(192,70%,60%)" }} data-testid={`btn-edit-cliente-${c.id}`}><Pencil size={13} /></button>
                  <button onClick={() => { if (confirm("Remover?")) remove.mutate(c.id); }} className="p-1.5 rounded hover:bg-red-500/10" style={{ color: "#f87171" }}><Trash2 size={13} /></button>
                </div>
              </div>
              <p className="font-display font-700 text-sm" style={{ color: "hsl(192,60%,80%)", fontWeight: 700 }}>{c.nome}</p>
              {c.cpfCnpj && <p className="text-xs mt-1 font-mono" style={{ color: "rgba(255,255,255,0.6)" }}>CPF/CNPJ: {c.cpfCnpj}</p>}
              {c.telefone && <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>Tel: {c.telefone}</p>}
              {c.endereco && <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{c.endereco}</p>}
            </div>
          ))}
        </div>
      )}

      {editCliente !== undefined && (
        <ClienteModal cliente={editCliente} onClose={() => setEditCliente(undefined)} onSave={handleSave} />
      )}
    </div>
  );
}
