import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Venda } from "@shared/schema";
import {
  ChevronLeft, ChevronRight, Package, CalendarDays,
  Clock, Flame, TrendingUp, Coffee, DollarSign, BarChart2, Grid, List
} from "lucide-react";

const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const DIAS_SEMANA = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];
const DIAS_SEMANA_CURTO = ["D","S","T","Q","Q","S","S"];

function getDiasDoMes(ano: number, mes: number) {
  return {
    diasAntes: new Date(ano, mes, 1).getDay(),
    total: new Date(ano, mes + 1, 0).getDate(),
  };
}

function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) { setValue(0); return; }
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

// ─── Stat mini card ───
function StatCard({ label, value, color, icon: Icon }: any) {
  return (
    <div className="glass rounded-xl px-3 py-2.5 text-center">
      <Icon size={13} className="mx-auto mb-1" style={{ color, opacity: 0.7 }} />
      <p className="font-display font-800 text-sm" style={{ color, fontWeight: 800 }}>{value}</p>
      <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.6rem" }}>{label}</p>
    </div>
  );
}

// ─── Painel de detalhe do dia ───
function DiaDetalhe({ vendas, dia, mes, ano, onClose }: { vendas: Venda[]; dia: number; mes: number; ano: number; onClose: () => void }) {
  return (
    <div className="glass rounded-xl p-4 cal-animate" style={{ border: "1px solid rgba(52,211,153,0.2)" }}>
      <div className="flex items-center justify-between mb-3 pb-2" style={{ borderBottom: "1px solid rgba(16,185,129,0.15)" }}>
        <div>
          <p className="font-display font-800 text-sm" style={{ color: "#34d399", fontWeight: 800 }}>
            {String(dia).padStart(2,"0")}/{String(mes+1).padStart(2,"0")}/{ano}
          </p>
          <div className="flex gap-3 mt-0.5">
            <span className="text-xs font-mono" style={{ color: "hsl(38,90%,60%)" }}>
              {vendas.reduce((s,v) => s+(v.quantidadeKg||0),0).toFixed(1)} kg
            </span>
            <span className="text-xs font-mono" style={{ color: "#4ade80" }}>
              R$ {vendas.reduce((s,v) => s+(v.valorTotal||0),0).toLocaleString("pt-BR",{minimumFractionDigits:2})}
            </span>
          </div>
        </div>
        <button onClick={onClose} className="text-xs px-2 py-1 rounded-lg hover:bg-white/10 transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>✕</button>
      </div>
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {vendas.map(v => (
          <div key={v.id} className="rounded-lg p-2" style={{ background: "rgba(0,120,150,0.08)", border: "1px solid rgba(16,185,129,0.08)" }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-600 px-1.5 py-0.5 rounded" style={{ background: "rgba(16,185,129,0.12)", color: "hsl(192,70%,65%)", fontWeight:600, fontSize:"0.65rem" }}>{v.marca}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${v.statusPagamento==="pago"?"badge-pago":v.statusPagamento==="parcial"?"badge-parcial":"badge-pendente"}`} style={{ fontSize:"0.6rem" }}>{v.statusPagamento}</span>
            </div>
            <p className="text-xs truncate" style={{ color:"rgba(255,255,255,0.7)", fontSize:"0.65rem" }}>{v.tipoProduto}</p>
            <div className="flex justify-between mt-0.5">
              <span className="text-xs font-mono" style={{ color:"hsl(38,90%,55%)", fontSize:"0.65rem" }}>{v.quantidadeKg} kg</span>
              {v.valorTotal ? <span className="text-xs font-mono" style={{ color:"#4ade80", fontSize:"0.65rem" }}>R$ {v.valorTotal.toLocaleString("pt-BR")}</span> : null}
            </div>
            {v.clienteNome && <p className="text-xs mt-0.5 truncate" style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.6rem" }}>{v.clienteNome}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MODELO 1 — Grade Clássica
// ═══════════════════════════════════════════════════════
function CalGrade({ vendas }: { vendas: Venda[] }) {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());
  const [diaSel, setDiaSel] = useState<number|null>(null);

  const mesStr = `${ano}-${String(mes+1).padStart(2,"0")}`;
  const vpd: Record<number, Venda[]> = {};
  vendas.forEach(v => {
    if (v.data.startsWith(mesStr)) {
      const d = parseInt(v.data.substring(8,10));
      if (!vpd[d]) vpd[d] = [];
      vpd[d].push(v);
    }
  });

  const { diasAntes, total } = getDiasDoMes(ano, mes);
  const todasMes = Object.values(vpd).flat();
  const kgMes = todasMes.reduce((s,v) => s+(v.quantidadeKg||0),0);
  const valMes = todasMes.reduce((s,v) => s+(v.valorTotal||0),0);
  const diasAtivos = Object.keys(vpd).length;

  const prevMes = () => { if(mes===0){setAno(a=>a-1);setMes(11);}else setMes(m=>m-1); setDiaSel(null); };
  const nextMes = () => { if(mes===11){setAno(a=>a+1);setMes(0);}else setMes(m=>m+1); setDiaSel(null); };

  return (
    <div className="glass rounded-2xl p-5 cal-animate space-y-4" style={{ border:"1px solid rgba(16,185,129,0.12)" }}>
      <div className="flex items-center gap-2 mb-1">
        <CalendarDays size={16} style={{ color:"hsl(192,70%,60%)" }} />
        <p className="font-display font-800 text-sm" style={{ color:"hsl(158,84%,75%)", fontWeight:800 }}>Grade Clássica</p>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={prevMes} className="p-1.5 rounded-lg hover:bg-white/10 transition-all hover:scale-110" style={{ color:"hsl(192,70%,60%)" }}><ChevronLeft size={16}/></button>
        <div className="text-center">
          <p className="font-display font-700 text-base" style={{ color:"hsl(158,84%,75%)", fontWeight:700 }}>{MESES[mes]}</p>
          <p className="text-xs font-mono" style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.65rem" }}>{ano}</p>
        </div>
        <button onClick={nextMes} className="p-1.5 rounded-lg hover:bg-white/10 transition-all hover:scale-110" style={{ color:"hsl(192,70%,60%)" }}><ChevronRight size={16}/></button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DIAS_SEMANA_CURTO.map((d,i) => (
          <div key={i} className="text-center text-xs font-600" style={{ color:"rgba(100,140,160,0.6)", fontWeight:600, fontSize:"0.6rem" }}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({length:diasAntes}).map((_,i) => <div key={`e${i}`} className="h-9"/>)}
        {Array.from({length:total}).map((_,i) => {
          const dia = i+1;
          const tem = !!vpd[dia];
          const isHoje = dia===hoje.getDate()&&mes===hoje.getMonth()&&ano===hoje.getFullYear();
          const isSel = diaSel===dia;
          const qtd = vpd[dia]?.length||0;
          return (
            <button key={dia} onClick={()=>setDiaSel(isSel?null:dia)}
              className="h-9 rounded-lg flex flex-col items-center justify-center transition-all hover:scale-105"
              style={{
                background: isSel?"rgba(16,185,129,0.25)":tem?"rgba(0,120,150,0.1)":"rgba(255,255,255,0.02)",
                border: isSel?"1px solid rgba(52,211,153,0.5)":isHoje?"1px solid rgba(52,211,153,0.25)":tem?"1px solid rgba(16,185,129,0.12)":"1px solid transparent",
                color: isSel?"#fff":isHoje?"#34d399":tem?"#d1fae5":"rgba(255,255,255,0.4)",
              }}>
              <span className="text-xs" style={{ fontSize:"0.72rem", fontWeight:isSel||isHoje?700:400 }}>{dia}</span>
              {tem && <span style={{ color:isSel?"rgba(255,255,255,0.7)":"hsl(38,90%,60%)", fontSize:"0.5rem" }}>{qtd}x</span>}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1" style={{ borderTop:"1px solid rgba(16,185,129,0.08)" }}>
        <StatCard label="Dias" value={diasAtivos} color="#00c8e0" icon={CalendarDays}/>
        <StatCard label="Total kg" value={`${kgMes.toFixed(1)}`} color="#f59e0b" icon={Coffee}/>
        <StatCard label="Recebido" value={`R$${valMes.toLocaleString("pt-BR",{maximumFractionDigits:0})}`} color="#22c55e" icon={DollarSign}/>
      </div>

      {diaSel && vpd[diaSel] && (
        <DiaDetalhe vendas={vpd[diaSel]} dia={diaSel} mes={mes} ano={ano} onClose={()=>setDiaSel(null)}/>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MODELO 2 — Heatmap (mapa de calor)
// ═══════════════════════════════════════════════════════
function CalHeatmap({ vendas }: { vendas: Venda[] }) {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());
  const [diaSel, setDiaSel] = useState<number|null>(null);

  const mesStr = `${ano}-${String(mes+1).padStart(2,"0")}`;
  const vpd: Record<number, Venda[]> = {};
  vendas.forEach(v => {
    if (v.data.startsWith(mesStr)) {
      const d = parseInt(v.data.substring(8,10));
      if (!vpd[d]) vpd[d] = [];
      vpd[d].push(v);
    }
  });

  const { diasAntes, total } = getDiasDoMes(ano, mes);
  const todasMes = Object.values(vpd).flat();
  const kgMes = todasMes.reduce((s,v) => s+(v.quantidadeKg||0),0);
  const valMes = todasMes.reduce((s,v) => s+(v.valorTotal||0),0);
  const diasAtivos = Object.keys(vpd).length;
  const maxKg = Math.max(1,...Object.values(vpd).map(arr=>arr.reduce((s,v)=>s+(v.quantidadeKg||0),0)));

  const prevMes = () => { if(mes===0){setAno(a=>a-1);setMes(11);}else setMes(m=>m-1); setDiaSel(null); };
  const nextMes = () => { if(mes===11){setAno(a=>a+1);setMes(0);}else setMes(m=>m+1); setDiaSel(null); };

  function heatBg(kg: number) {
    if (!kg) return "rgba(255,255,255,0.02)";
    const t = Math.min(kg/maxKg,1);
    if (t < 0.25) return "rgba(0,150,180,0.18)";
    if (t < 0.5)  return "rgba(0,175,205,0.32)";
    if (t < 0.75) return "rgba(0,200,225,0.48)";
    return "rgba(0,220,245,0.65)";
  }

  return (
    <div className="glass rounded-2xl p-5 cal-animate space-y-4" style={{ border:"1px solid rgba(16,185,129,0.12)" }}>
      <div className="flex items-center gap-2 mb-1">
        <Flame size={16} style={{ color:"hsl(38,90%,60%)" }} />
        <p className="font-display font-800 text-sm" style={{ color:"hsl(158,84%,75%)", fontWeight:800 }}>Mapa de Calor</p>
        <span className="text-xs ml-1" style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.6rem" }}>mais escuro = mais kg</span>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={prevMes} className="p-1.5 rounded-lg hover:bg-white/10 transition-all hover:scale-110" style={{ color:"hsl(192,70%,60%)" }}><ChevronLeft size={16}/></button>
        <div className="text-center">
          <p className="font-display font-700 text-base" style={{ color:"hsl(158,84%,75%)", fontWeight:700 }}>{MESES[mes]}</p>
          <p className="text-xs font-mono" style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.65rem" }}>{ano}</p>
        </div>
        <button onClick={nextMes} className="p-1.5 rounded-lg hover:bg-white/10 transition-all hover:scale-110" style={{ color:"hsl(192,70%,60%)" }}><ChevronRight size={16}/></button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DIAS_SEMANA_CURTO.map((d,i) => (
          <div key={i} className="text-center text-xs" style={{ color:"rgba(100,140,160,0.6)", fontSize:"0.6rem" }}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({length:diasAntes}).map((_,i) => <div key={`e${i}`} className="aspect-square"/>)}
        {Array.from({length:total}).map((_,i) => {
          const dia = i+1;
          const kg = (vpd[dia]||[]).reduce((s,v)=>s+(v.quantidadeKg||0),0);
          const qtd = vpd[dia]?.length||0;
          const isSel = diaSel===dia;
          const isHoje = dia===hoje.getDate()&&mes===hoje.getMonth()&&ano===hoje.getFullYear();
          return (
            <button key={dia} onClick={()=>setDiaSel(isSel?null:dia)}
              className="aspect-square rounded-lg flex flex-col items-center justify-center transition-all hover:scale-110 group relative"
              style={{
                background: isSel?"rgba(52,211,153,0.4)":heatBg(kg),
                border: isSel?"2px solid rgba(0,220,245,0.6)":isHoje?"1px solid rgba(52,211,153,0.3)":"1px solid transparent",
                boxShadow: isSel?"0 0 14px rgba(52,211,153,0.2)":"none",
                color: isSel?"#fff":kg>0?"hsl(192,50%,85%)":"rgba(255,255,255,0.35)",
              }}>
              <span style={{ fontSize:"0.72rem", fontWeight:isSel||isHoje?700:400 }}>{dia}</span>
              {kg>0 && <span style={{ color:isSel?"rgba(255,255,255,0.8)":"hsl(38,90%,55%)", fontSize:"0.45rem" }}>{kg.toFixed(0)}kg</span>}
              {kg>0 && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50"
                  style={{ background:"rgba(4,10,20,0.95)", border:"1px solid rgba(52,211,153,0.3)", color:"hsl(158,84%,75%)", fontSize:"0.6rem" }}>
                  {qtd}x · {kg.toFixed(1)}kg
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="flex items-center justify-end gap-1.5">
        <span style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.6rem" }}>Menos</span>
        {[0,0.18,0.32,0.48,0.65].map((op,i) => (
          <div key={i} className="w-3.5 h-3.5 rounded" style={{
            background: i===0?"rgba(255,255,255,0.02)":`rgba(0,${150+i*18},${180+i*15},${op})`,
          }}/>
        ))}
        <span style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.6rem" }}>Mais</span>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-1" style={{ borderTop:"1px solid rgba(16,185,129,0.08)" }}>
        <StatCard label="Dias" value={diasAtivos} color="#00c8e0" icon={CalendarDays}/>
        <StatCard label="Total kg" value={`${kgMes.toFixed(1)}`} color="#f59e0b" icon={Coffee}/>
        <StatCard label="Recebido" value={`R$${valMes.toLocaleString("pt-BR",{maximumFractionDigits:0})}`} color="#22c55e" icon={DollarSign}/>
      </div>

      {diaSel && vpd[diaSel] && (
        <DiaDetalhe vendas={vpd[diaSel]} dia={diaSel} mes={mes} ano={ano} onClose={()=>setDiaSel(null)}/>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MODELO 3 — Timeline Vertical
// ═══════════════════════════════════════════════════════
function CalTimeline({ vendas }: { vendas: Venda[] }) {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());

  const mesStr = `${ano}-${String(mes+1).padStart(2,"0")}`;
  const vpd: Record<number, Venda[]> = {};
  vendas.forEach(v => {
    if (v.data.startsWith(mesStr)) {
      const d = parseInt(v.data.substring(8,10));
      if (!vpd[d]) vpd[d] = [];
      vpd[d].push(v);
    }
  });

  const todasMes = Object.values(vpd).flat();
  const kgMes = todasMes.reduce((s,v) => s+(v.quantidadeKg||0),0);
  const valMes = todasMes.reduce((s,v) => s+(v.valorTotal||0),0);
  const diasAtivos = Object.keys(vpd).length;
  const dias = Object.keys(vpd).map(Number).sort((a,b)=>a-b);

  const prevMes = () => { if(mes===0){setAno(a=>a-1);setMes(11);}else setMes(m=>m-1); };
  const nextMes = () => { if(mes===11){setAno(a=>a+1);setMes(0);}else setMes(m=>m+1); };

  return (
    <div className="glass rounded-2xl p-5 cal-animate space-y-4" style={{ border:"1px solid rgba(16,185,129,0.12)" }}>
      <div className="flex items-center gap-2 mb-1">
        <Clock size={16} style={{ color:"hsl(192,70%,60%)" }} />
        <p className="font-display font-800 text-sm" style={{ color:"hsl(158,84%,75%)", fontWeight:800 }}>Linha do Tempo</p>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={prevMes} className="p-1.5 rounded-lg hover:bg-white/10 transition-all hover:scale-110" style={{ color:"hsl(192,70%,60%)" }}><ChevronLeft size={16}/></button>
        <p className="font-display font-700 text-base" style={{ color:"hsl(158,84%,75%)", fontWeight:700 }}>{MESES[mes]} {ano}</p>
        <button onClick={nextMes} className="p-1.5 rounded-lg hover:bg-white/10 transition-all hover:scale-110" style={{ color:"hsl(192,70%,60%)" }}><ChevronRight size={16}/></button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Dias" value={diasAtivos} color="#00c8e0" icon={CalendarDays}/>
        <StatCard label="Total kg" value={`${kgMes.toFixed(1)}`} color="#f59e0b" icon={Coffee}/>
        <StatCard label="Recebido" value={`R$${valMes.toLocaleString("pt-BR",{maximumFractionDigits:0})}`} color="#22c55e" icon={DollarSign}/>
      </div>

      {dias.length === 0 ? (
        <p className="text-xs text-center py-4" style={{ color:"rgba(255,255,255,0.4)" }}>Nenhuma saída neste mês</p>
      ) : (
        <div className="relative max-h-64 overflow-y-auto pr-1">
          <div className="absolute left-4 top-0 bottom-0 w-px" style={{ background:"linear-gradient(180deg,rgba(52,211,153,0.3),rgba(52,211,153,0.04))" }}/>
          <div className="space-y-3">
            {dias.map((dia, idx) => {
              const vDia = vpd[dia];
              const kg = vDia.reduce((s,v)=>s+(v.quantidadeKg||0),0);
              const val = vDia.reduce((s,v)=>s+(v.valorTotal||0),0);
              const dsem = DIAS_SEMANA[new Date(ano,mes,dia).getDay()];
              return (
                <div key={dia} className="relative pl-10 cal-animate" style={{ animationDelay:`${idx*60}ms` }}>
                  <div className="absolute left-2.5 top-3 w-3 h-3 rounded-full z-10"
                    style={{ background:val>0?"rgba(52,211,153,0.2)":"rgba(245,158,11,0.2)", border:val>0?"2px solid rgba(52,211,153,0.5)":"2px solid rgba(245,158,11,0.4)" }}>
                    <div className="w-1.5 h-1.5 rounded-full m-auto mt-px" style={{ background:val>0?"#00c8e0":"#f59e0b" }}/>
                  </div>
                  <div className="rounded-xl p-3" style={{ background:"rgba(0,80,100,0.08)", border:"1px solid rgba(16,185,129,0.08)" }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-800 text-base leading-none" style={{ color:"hsl(158,84%,75%)", fontWeight:800 }}>{String(dia).padStart(2,"0")}</span>
                        <span className="text-xs" style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.6rem" }}>{dsem}</span>
                        <span className="text-xs" style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.65rem" }}>{vDia.length} saída{vDia.length>1?"s":""}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono" style={{ color:"hsl(38,90%,60%)", fontSize:"0.65rem" }}>{kg.toFixed(1)}kg</span>
                        {val>0 && <span className="text-xs font-mono ml-2" style={{ color:"#4ade80", fontSize:"0.65rem" }}>R${val.toLocaleString("pt-BR")}</span>}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {vDia.map(v => (
                        <span key={v.id} className="text-xs px-1.5 py-0.5 rounded" style={{ background:"rgba(16,185,129,0.1)", color:"hsl(192,70%,65%)", fontSize:"0.6rem" }}>
                          {v.marca} {v.quantidadeKg}kg
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MODELO 4 — Mini Calendário Compacto (dois meses lado a lado)
// ═══════════════════════════════════════════════════════
function CalDoisMeses({ vendas }: { vendas: Venda[] }) {
  const hoje = new Date();
  const [anoBase, setAnoBase] = useState(hoje.getFullYear());
  const [mesBase, setMesBase] = useState(Math.max(0, hoje.getMonth() - 1));
  const [diaSel, setDiaSel] = useState<{dia:number,mes:number,ano:number}|null>(null);

  const prevPar = () => { if(mesBase===0){setAnoBase(a=>a-1);setMesBase(10);}else if(mesBase===1){setAnoBase(a=>a-1);setMesBase(11);}else setMesBase(m=>m-2); setDiaSel(null); };
  const nextPar = () => { if(mesBase===11){setAnoBase(a=>a+1);setMesBase(1);}else if(mesBase>=10){setAnoBase(a=>a+1);setMesBase(0);}else setMesBase(m=>m+2); setDiaSel(null); };

  function getVpd(ano: number, mes: number) {
    const mesStr = `${ano}-${String(mes+1).padStart(2,"0")}`;
    const vpd: Record<number, Venda[]> = {};
    vendas.forEach(v => {
      if (v.data.startsWith(mesStr)) {
        const d = parseInt(v.data.substring(8,10));
        if (!vpd[d]) vpd[d] = [];
        vpd[d].push(v);
      }
    });
    return vpd;
  }

  const mes2 = mesBase === 11 ? 0 : mesBase + 1;
  const ano2 = mesBase === 11 ? anoBase + 1 : anoBase;

  const vpd1 = getVpd(anoBase, mesBase);
  const vpd2 = getVpd(ano2, mes2);

  const allMes = [...Object.values(vpd1).flat(), ...Object.values(vpd2).flat()];
  const kgTotal = allMes.reduce((s,v)=>s+(v.quantidadeKg||0),0);
  const valTotal = allMes.reduce((s,v)=>s+(v.valorTotal||0),0);

  function MiniMes({ ano, mes, vpd }: { ano: number; mes: number; vpd: Record<number,Venda[]> }) {
    const { diasAntes, total } = getDiasDoMes(ano, mes);
    return (
      <div className="flex-1 min-w-0">
        <p className="text-center font-700 text-sm mb-2" style={{ color:"#34d399", fontWeight:700 }}>{MESES[mes].substring(0,3)} {ano}</p>
        <div className="grid grid-cols-7 mb-1">
          {DIAS_SEMANA_CURTO.map((d,i) => (
            <div key={i} className="text-center" style={{ color:"rgba(100,140,160,0.5)", fontSize:"0.55rem" }}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({length:diasAntes}).map((_,i) => <div key={`e${i}`} className="h-7"/>)}
          {Array.from({length:total}).map((_,i) => {
            const dia = i+1;
            const tem = !!vpd[dia];
            const isSel = diaSel?.dia===dia && diaSel?.mes===mes && diaSel?.ano===ano;
            const isHoje = dia===hoje.getDate()&&mes===hoje.getMonth()&&ano===hoje.getFullYear();
            return (
              <button key={dia} onClick={()=>setDiaSel(isSel?null:{dia,mes,ano})}
                className="h-7 rounded-md flex flex-col items-center justify-center transition-all hover:scale-110"
                style={{
                  background: isSel?"rgba(16,185,129,0.3)":tem?"rgba(0,120,150,0.12)":"rgba(255,255,255,0.02)",
                  border: isSel?"1px solid rgba(52,211,153,0.5)":isHoje?"1px solid rgba(52,211,153,0.2)":"1px solid transparent",
                  color: isSel?"#fff":isHoje?"#34d399":tem?"hsl(210,20%,80%)":"rgba(255,255,255,0.35)",
                }}>
                <span style={{ fontSize:"0.65rem", fontWeight:isSel||isHoje?700:400 }}>{dia}</span>
                {tem && <div className="w-1 h-1 rounded-full mt-0.5" style={{ background:isSel?"rgba(255,255,255,0.8)":"hsl(38,90%,60%)" }}/>}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const selVendas = diaSel ? (getVpd(diaSel.ano,diaSel.mes)[diaSel.dia]||[]) : [];

  return (
    <div className="glass rounded-2xl p-5 cal-animate space-y-4" style={{ border:"1px solid rgba(16,185,129,0.12)" }}>
      <div className="flex items-center gap-2 mb-1">
        <Grid size={16} style={{ color:"hsl(192,70%,60%)" }} />
        <p className="font-display font-800 text-sm" style={{ color:"hsl(158,84%,75%)", fontWeight:800 }}>Dois Meses</p>
      </div>

      <div className="flex items-center justify-between mb-2">
        <button onClick={prevPar} className="p-1.5 rounded-lg hover:bg-white/10 transition-all hover:scale-110" style={{ color:"hsl(192,70%,60%)" }}><ChevronLeft size={16}/></button>
        <span className="text-xs" style={{ color:"rgba(255,255,255,0.5)" }}>{MESES[mesBase].substring(0,3)} – {MESES[mes2].substring(0,3)} {anoBase}</span>
        <button onClick={nextPar} className="p-1.5 rounded-lg hover:bg-white/10 transition-all hover:scale-110" style={{ color:"hsl(192,70%,60%)" }}><ChevronRight size={16}/></button>
      </div>

      <div className="flex gap-4">
        <MiniMes ano={anoBase} mes={mesBase} vpd={vpd1}/>
        <div className="w-px self-stretch" style={{ background:"rgba(16,185,129,0.1)" }}/>
        <MiniMes ano={ano2} mes={mes2} vpd={vpd2}/>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1" style={{ borderTop:"1px solid rgba(16,185,129,0.08)" }}>
        <StatCard label="Total kg (2 meses)" value={`${kgTotal.toFixed(1)}`} color="#f59e0b" icon={Coffee}/>
        <StatCard label="Recebido (2 meses)" value={`R$${valTotal.toLocaleString("pt-BR",{maximumFractionDigits:0})}`} color="#22c55e" icon={DollarSign}/>
      </div>

      {diaSel && selVendas.length > 0 && (
        <DiaDetalhe vendas={selVendas} dia={diaSel.dia} mes={diaSel.mes} ano={diaSel.ano} onClose={()=>setDiaSel(null)}/>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MODELO 5 — Ranking semanal por barras
// ═══════════════════════════════════════════════════════
function CalSemanas({ vendas }: { vendas: Venda[] }) {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());

  const mesStr = `${ano}-${String(mes+1).padStart(2,"0")}`;
  const vpd: Record<number, Venda[]> = {};
  vendas.forEach(v => {
    if (v.data.startsWith(mesStr)) {
      const d = parseInt(v.data.substring(8,10));
      if (!vpd[d]) vpd[d] = [];
      vpd[d].push(v);
    }
  });

  const { diasAntes, total } = getDiasDoMes(ano, mes);
  const todasMes = Object.values(vpd).flat();
  const kgMes = todasMes.reduce((s,v)=>s+(v.quantidadeKg||0),0);
  const valMes = todasMes.reduce((s,v)=>s+(v.valorTotal||0),0);

  // Agrupa em semanas
  const semanas: { dias: number[] }[] = [];
  let semAtual: number[] = Array(diasAntes).fill(0);
  for (let d = 1; d <= total; d++) {
    semAtual.push(d);
    if (semAtual.length === 7) { semanas.push({ dias: semAtual }); semAtual = []; }
  }
  if (semAtual.length > 0) { while(semAtual.length < 7) semAtual.push(0); semanas.push({ dias: semAtual }); }

  const maxKgSem = Math.max(1, ...semanas.map(s => s.dias.reduce((acc, d) => acc + (d ? (vpd[d]||[]).reduce((s,v)=>s+(v.quantidadeKg||0),0) : 0), 0)));

  const prevMes = () => { if(mes===0){setAno(a=>a-1);setMes(11);}else setMes(m=>m-1); };
  const nextMes = () => { if(mes===11){setAno(a=>a+1);setMes(0);}else setMes(m=>m+1); };

  return (
    <div className="glass rounded-2xl p-5 cal-animate space-y-4" style={{ border:"1px solid rgba(16,185,129,0.12)" }}>
      <div className="flex items-center gap-2 mb-1">
        <BarChart2 size={16} style={{ color:"hsl(192,70%,60%)" }} />
        <p className="font-display font-800 text-sm" style={{ color:"hsl(158,84%,75%)", fontWeight:800 }}>Por Semanas</p>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={prevMes} className="p-1.5 rounded-lg hover:bg-white/10 transition-all hover:scale-110" style={{ color:"hsl(192,70%,60%)" }}><ChevronLeft size={16}/></button>
        <p className="font-display font-700 text-base" style={{ color:"hsl(158,84%,75%)", fontWeight:700 }}>{MESES[mes]} {ano}</p>
        <button onClick={nextMes} className="p-1.5 rounded-lg hover:bg-white/10 transition-all hover:scale-110" style={{ color:"hsl(192,70%,60%)" }}><ChevronRight size={16}/></button>
      </div>

      {/* Header dias */}
      <div className="grid grid-cols-8 gap-1">
        <div className="text-xs text-right pr-1" style={{ color:"rgba(100,140,160,0.4)", fontSize:"0.55rem" }}>Sem</div>
        {DIAS_SEMANA_CURTO.map((d,i) => (
          <div key={i} className="text-center text-xs" style={{ color:"rgba(100,140,160,0.5)", fontSize:"0.6rem" }}>{d}</div>
        ))}
      </div>

      <div className="space-y-2">
        {semanas.map((sem, si) => {
          const kgSem = sem.dias.reduce((acc,d) => acc+(d?(vpd[d]||[]).reduce((s,v)=>s+(v.quantidadeKg||0),0):0),0);
          const pct = (kgSem/maxKgSem)*100;
          return (
            <div key={si} className="space-y-1 cal-animate" style={{ animationDelay:`${si*80}ms` }}>
              <div className="grid grid-cols-8 gap-1 items-center">
                <div className="text-xs text-right pr-1 font-mono" style={{ color:"rgba(255,255,255,0.35)", fontSize:"0.55rem" }}>S{si+1}</div>
                {sem.dias.map((dia, di) => {
                  const tem = dia > 0 && !!vpd[dia];
                  const isHoje = dia>0 && dia===hoje.getDate()&&mes===hoje.getMonth()&&ano===hoje.getFullYear();
                  return (
                    <div key={di} className="h-8 rounded-md flex items-center justify-center transition-all"
                      style={{
                        background: dia===0?"transparent":tem?"rgba(0,120,150,0.15)":"rgba(255,255,255,0.02)",
                        border: isHoje?"1px solid rgba(52,211,153,0.3)":dia===0?"none":tem?"1px solid rgba(16,185,129,0.12)":"1px solid rgba(255,255,255,0.03)",
                        color: dia===0?"transparent":isHoje?"#34d399":tem?"hsl(210,20%,80%)":"rgba(255,255,255,0.35)",
                      }}>
                      <span style={{ fontSize:"0.7rem", fontWeight:tem||isHoje?600:400 }}>{dia||""}</span>
                    </div>
                  );
                })}
              </div>
              {/* Barra de kg da semana */}
              {kgSem > 0 && (
                <div className="flex items-center gap-2 pl-6">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:"rgba(0,120,150,0.15)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width:`${pct}%`, background:"linear-gradient(90deg,hsl(192,70%,35%),hsl(192,70%,55%))" }}/>
                  </div>
                  <span className="text-xs font-mono flex-shrink-0" style={{ color:"hsl(38,90%,60%)", fontSize:"0.6rem", minWidth:30 }}>{kgSem.toFixed(0)}kg</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1" style={{ borderTop:"1px solid rgba(16,185,129,0.08)" }}>
        <StatCard label="Total kg" value={`${kgMes.toFixed(1)}`} color="#f59e0b" icon={Coffee}/>
        <StatCard label="Recebido" value={`R$${valMes.toLocaleString("pt-BR",{maximumFractionDigits:0})}`} color="#22c55e" icon={DollarSign}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MODELO 6 — Agenda (lista compacta dia a dia)
// ═══════════════════════════════════════════════════════
function CalAgenda({ vendas }: { vendas: Venda[] }) {
  const hoje = new Date();
  const [ano, setAno] = useState(hoje.getFullYear());
  const [mes, setMes] = useState(hoje.getMonth());

  const mesStr = `${ano}-${String(mes+1).padStart(2,"0")}`;
  const vpd: Record<number, Venda[]> = {};
  vendas.forEach(v => {
    if (v.data.startsWith(mesStr)) {
      const d = parseInt(v.data.substring(8,10));
      if (!vpd[d]) vpd[d] = [];
      vpd[d].push(v);
    }
  });

  const todasMes = Object.values(vpd).flat();
  const kgMes = todasMes.reduce((s,v)=>s+(v.quantidadeKg||0),0);
  const valMes = todasMes.reduce((s,v)=>s+(v.valorTotal||0),0);
  const dias = Object.keys(vpd).map(Number).sort((a,b)=>a-b);

  const prevMes = () => { if(mes===0){setAno(a=>a-1);setMes(11);}else setMes(m=>m-1); };
  const nextMes = () => { if(mes===11){setAno(a=>a+1);setMes(0);}else setMes(m=>m+1); };

  return (
    <div className="glass rounded-2xl p-5 cal-animate space-y-4" style={{ border:"1px solid rgba(16,185,129,0.12)" }}>
      <div className="flex items-center gap-2 mb-1">
        <List size={16} style={{ color:"hsl(192,70%,60%)" }} />
        <p className="font-display font-800 text-sm" style={{ color:"hsl(158,84%,75%)", fontWeight:800 }}>Agenda</p>
      </div>

      <div className="flex items-center justify-between">
        <button onClick={prevMes} className="p-1.5 rounded-lg hover:bg-white/10 transition-all hover:scale-110" style={{ color:"hsl(192,70%,60%)" }}><ChevronLeft size={16}/></button>
        <p className="font-display font-700 text-base" style={{ color:"hsl(158,84%,75%)", fontWeight:700 }}>{MESES[mes]} {ano}</p>
        <button onClick={nextMes} className="p-1.5 rounded-lg hover:bg-white/10 transition-all hover:scale-110" style={{ color:"hsl(192,70%,60%)" }}><ChevronRight size={16}/></button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <StatCard label="Total kg" value={`${kgMes.toFixed(1)}`} color="#f59e0b" icon={Coffee}/>
        <StatCard label="Recebido" value={`R$${valMes.toLocaleString("pt-BR",{maximumFractionDigits:0})}`} color="#22c55e" icon={DollarSign}/>
      </div>

      {dias.length === 0 ? (
        <p className="text-xs text-center py-4" style={{ color:"rgba(255,255,255,0.4)" }}>Nenhuma saída neste mês</p>
      ) : (
        <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
          {dias.map((dia, idx) => {
            const vDia = vpd[dia];
            const kg = vDia.reduce((s,v)=>s+(v.quantidadeKg||0),0);
            const val = vDia.reduce((s,v)=>s+(v.valorTotal||0),0);
            const dsem = DIAS_SEMANA[new Date(ano,mes,dia).getDay()];
            const isHoje = dia===hoje.getDate()&&mes===hoje.getMonth()&&ano===hoje.getFullYear();
            return (
              <div key={dia} className="flex items-start gap-3 rounded-xl px-3 py-2.5 cal-animate transition-all hover:scale-[1.01]"
                style={{ background:isHoje?"rgba(16,185,129,0.12)":"rgba(0,80,100,0.07)", border:`1px solid ${isHoje?"rgba(52,211,153,0.2)":"rgba(16,185,129,0.07)"}`, animationDelay:`${idx*50}ms` }}>
                {/* Data */}
                <div className="text-center flex-shrink-0" style={{ minWidth:36 }}>
                  <p className="font-display font-800 leading-none" style={{ color:isHoje?"#34d399":"#34d399", fontWeight:800, fontSize:"1.1rem" }}>{String(dia).padStart(2,"0")}</p>
                  <p style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.55rem" }}>{dsem}</p>
                </div>
                {/* Divisor */}
                <div className="w-px self-stretch" style={{ background:"rgba(16,185,129,0.12)" }}/>
                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-600" style={{ color:"rgba(255,255,255,0.8)", fontWeight:600, fontSize:"0.7rem" }}>{vDia.length} saída{vDia.length>1?"s":""}</span>
                    <div className="flex gap-2">
                      <span className="font-mono text-xs" style={{ color:"hsl(38,90%,60%)", fontSize:"0.65rem" }}>{kg.toFixed(1)}kg</span>
                      {val>0&&<span className="font-mono text-xs" style={{ color:"#4ade80", fontSize:"0.65rem" }}>R${val.toLocaleString("pt-BR")}</span>}
                    </div>
                  </div>
                  {/* Tags de marcas */}
                  <div className="flex flex-wrap gap-1">
                    {Array.from(new Set(vDia.map(v=>v.marca))).map(marca => (
                      <span key={marca} className="text-xs px-1.5 py-0.5 rounded" style={{ background:"rgba(16,185,129,0.1)", color:"hsl(192,70%,60%)", fontSize:"0.6rem" }}>{marca}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL — todos os calendários juntos
// ═══════════════════════════════════════════════════════
export default function Calendario() {
  const { data: vendas = [] } = useQuery<Venda[]>({
    queryKey: ["/api/vendas"],
    queryFn: () => apiRequest("GET", "/api/vendas").then(r => r.json()),
  });

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="cal-animate">
        <h1 className="font-display font-800 text-xl" style={{ color:"hsl(158,84%,75%)", fontWeight:800 }}>Calendário de Saídas</h1>
        <p className="text-xs mt-0.5" style={{ color:"rgba(255,255,255,0.5)" }}>6 formatos de visualização — todos ao vivo</p>
      </div>

      {/* Grid 3 colunas com os 6 calendários */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <CalGrade    vendas={vendas} />
        <CalHeatmap  vendas={vendas} />
        <CalTimeline vendas={vendas} />
        <CalDoisMeses vendas={vendas} />
        <CalSemanas  vendas={vendas} />
        <CalAgenda   vendas={vendas} />
      </div>
    </div>
  );
}
