import { useState } from "react";
import { Settings, Bell, Database, Palette, Shield, Save } from "lucide-react";

export default function Configuracoes() {
  const [nomeEmpresa, setNomeEmpresa] = useState("Gyrée Café");
  const [gerente, setGerente] = useState("Valtim");
  const [periodo, setPeriodo] = useState("Fevereiro – Abril 2026");
  const [notifPendentes, setNotifPendentes] = useState(true);
  const [notifMetas, setNotifMetas] = useState(true);
  const [corTema, setCorTema] = useState("emerald");
  const [salvo, setSalvo] = useState(false);

  const salvar = () => {
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className="relative w-10 h-5 rounded-full transition-all flex-shrink-0"
      style={{ background: value ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.1)", border: value ? "1px solid rgba(52,211,153,0.4)" : "1px solid rgba(255,255,255,0.1)" }}
    >
      <span className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
        style={{ background: value ? "#10b981" : "rgba(255,255,255,0.3)", left: value ? "calc(100% - 18px)" : "2px" }} />
    </button>
  );

  const Section = ({ icon, title, color, children }: any) => (
    <div className="rounded-xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
          {icon}
        </div>
        <p className="text-xs font-700 uppercase" style={{ color, letterSpacing: "0.06em", fontWeight: 700 }}>{title}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const Field = ({ label, sub, children }: any) => (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{sub}</p>}
      </div>
      <div className="ml-4">{children}</div>
    </div>
  );

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
    borderRadius: 8,
    padding: "4px 10px",
    fontSize: "0.8rem",
    outline: "none",
    minWidth: 180,
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="animate-fade-in-up flex items-start justify-between" style={{ opacity: 0, animationFillMode: "forwards" }}>
        <div>
          <h1 className="font-display text-xl font-700" style={{ color: "#fff", fontWeight: 700, letterSpacing: "-0.04em" }}>
            CONFIGURAÇÕES
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Personalize o sistema conforme sua necessidade</p>
        </div>
        <button onClick={salvar}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
          style={{
            background: salvo ? "rgba(52,211,153,0.2)" : "rgba(52,211,153,0.1)",
            border: `1px solid ${salvo ? "rgba(52,211,153,0.5)" : "rgba(52,211,153,0.25)"}`,
            color: "#34d399", fontWeight: 600,
          }}>
          <Save size={14} /> {salvo ? "Salvo ✓" : "Salvar"}
        </button>
      </div>

      {/* Empresa */}
      <Section icon={<Settings size={14} style={{ color: "#34d399" }} />} title="Informações do Sistema" color="#34d399">
        <Field label="Nome da Empresa" sub="Aparece nos relatórios e cabeçalhos">
          <input value={nomeEmpresa} onChange={e => setNomeEmpresa(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Nome do Gerente" sub="Exibido na sidebar e Dashboard">
          <input value={gerente} onChange={e => setGerente(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Período de Referência" sub="Texto exibido no Dashboard">
          <input value={periodo} onChange={e => setPeriodo(e.target.value)} style={inputStyle} />
        </Field>
      </Section>

      {/* Notificações */}
      <Section icon={<Bell size={14} style={{ color: "#f59e0b" }} />} title="Notificações" color="#f59e0b">
        <Field label="Alertar sobre pagamentos pendentes" sub="Destaca vendas com status 'pendente' no dashboard">
          <Toggle value={notifPendentes} onChange={setNotifPendentes} />
        </Field>
        <Field label="Alertar quando meta for atingida" sub="Exibe indicador de meta atingida na aba Metas">
          <Toggle value={notifMetas} onChange={setNotifMetas} />
        </Field>
      </Section>

      {/* Aparência */}
      <Section icon={<Palette size={14} style={{ color: "#a5b4fc" }} />} title="Aparência" color="#a5b4fc">
        <Field label="Cor de destaque" sub="Cor principal usada em botões e destaques">
          <div className="flex gap-2">
            {[
              { id: "emerald", cor: "#10b981", nome: "Esmeralda" },
              { id: "blue", cor: "#3b82f6", nome: "Azul" },
              { id: "purple", cor: "#8b5cf6", nome: "Roxo" },
              { id: "amber", cor: "#f59e0b", nome: "Âmbar" },
            ].map(t => (
              <button key={t.id} onClick={() => setCorTema(t.id)} title={t.nome}
                className="w-6 h-6 rounded-full transition-all"
                style={{ background: t.cor, border: corTema === t.id ? `2px solid ${t.cor}` : "2px solid transparent",
                  boxShadow: corTema === t.id ? `0 0 10px ${t.cor}60` : "none", outline: corTema === t.id ? `2px solid rgba(255,255,255,0.3)` : "none", outlineOffset: 1 }} />
            ))}
          </div>
        </Field>
      </Section>

      {/* Dados */}
      <Section icon={<Database size={14} style={{ color: "#60a5fa" }} />} title="Dados do Sistema" color="#60a5fa">
        <Field label="Banco de dados" sub="Supabase — frontend direto, sem Express">
          <span className="px-2 py-1 rounded text-xs" style={{ background: "rgba(52,211,153,0.1)", color: "#34d399", fontFamily: "'IBM Plex Mono', monospace" }}>
            Supabase ✓
          </span>
        </Field>
      </Section>

      {/* Segurança */}
      <Section icon={<Shield size={14} style={{ color: "#f87171" }} />} title="Segurança" color="#f87171">
        <Field label="Sistema Anti-Rolo" sub="Bloqueia confirmação de parcelas com valor incorreto">
          <span className="px-2 py-1 rounded text-xs" style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}>Ativo</span>
        </Field>
        <Field label="Validação de totais" sub="Exige que entrada + parcelas batam com o valor total da venda">
          <span className="px-2 py-1 rounded text-xs" style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}>Ativo</span>
        </Field>
      </Section>
    </div>
  );
}
