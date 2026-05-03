import { createClient } from '@supabase/supabase-js';
import type { Cliente, InsertCliente, Venda, InsertVenda } from "@shared/schema";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("[storage] SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausentes. Rotas de dados retornarão erro.");
}

const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

function db() {
  if (!supabase) {
    throw new Error("Supabase não configurado: defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY");
  }
  return supabase;
}

function mapVenda(row: any): Venda {
  return {
    id: row.id,
    data: row.data,
    marca: row.marca,
    tipoProduto: row.tipo_produto,
    pesoPacote: row.peso_pacote,
    quantidadeKg: row.quantidade_kg,
    precoKg: row.preco_kg,
    valorTotal: row.valor_total,
    formaPagamento: row.forma_pagamento,
    statusPagamento: row.status_pagamento,
    clienteNome: row.cliente_nome,
    clienteId: row.cliente_id,
    emitirNota: row.emitir_nota,
    observacoes: row.observacoes,
    parcelas: row.parcelas,
  };
}

function mapCliente(row: any): Cliente {
  return {
    id: row.id,
    nome: row.nome,
    cpfCnpj: row.cpf_cnpj,
    telefone: row.telefone,
    endereco: row.endereco,
  };
}

function toISODateKey(value: string | Date) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value.slice(0, 10);
}

function toVendaRow(v: InsertVenda) {
  return {
    data: v.data,
    marca: v.marca,
    tipo_produto: v.tipoProduto,
    peso_pacote: v.pesoPacote,
    quantidade_kg: v.quantidadeKg,
    preco_kg: v.precoKg ?? null,
    valor_total: v.valorTotal ?? null,
    forma_pagamento: v.formaPagamento ?? null,
    status_pagamento: v.statusPagamento,
    cliente_nome: v.clienteNome ?? null,
    cliente_id: v.clienteId ?? null,
    emitir_nota: v.emitirNota ?? false,
    observacoes: v.observacoes ?? null,
    parcelas: v.parcelas ?? null,
  };
}

export interface RequestScope {
  userId: string;
  empresaId?: string;
}

export function buildScopeFilter(scope: RequestScope) {
  const filters = [`user_id.eq.${scope.userId}`];

  if (scope.empresaId) {
    filters.unshift(`empresa_id.eq.${scope.empresaId}`);
  }

  // Mantem visiveis os registros criados antes da migration de escopo
  // ate existir um backfill seguro de ownership/tenant.
  filters.push("and(user_id.is.null,empresa_id.is.null)");

  return filters.join(",");
}

function withScope(query: any, scope: RequestScope) {
  return query.or(buildScopeFilter(scope));
}

export interface IStorage {
  getVendas(scope: RequestScope): Promise<Venda[]>;
  getVenda(scope: RequestScope, id: number): Promise<Venda | undefined>;
  createVenda(scope: RequestScope, venda: InsertVenda): Promise<Venda>;
  updateVenda(scope: RequestScope, id: number, venda: Partial<InsertVenda>): Promise<Venda | undefined>;
  deleteVenda(scope: RequestScope, id: number): Promise<void>;
  getClientes(scope: RequestScope): Promise<Cliente[]>;
  getCliente(scope: RequestScope, id: number): Promise<Cliente | undefined>;
  createCliente(scope: RequestScope, cliente: InsertCliente): Promise<Cliente>;
  updateCliente(scope: RequestScope, id: number, cliente: Partial<InsertCliente>): Promise<Cliente | undefined>;
  deleteCliente(scope: RequestScope, id: number): Promise<void>;
  getStats(scope: RequestScope): Promise<{
    totalVendas: number;
    totalKg: number;
    totalValor: number;
    totalPago: number;
    totalPendente: number;
    vendasPorDia: { data: string; valor: number; kg: number }[];
    vendasPorMarca: { marca: string; kg: number; valor: number }[];
    vendasPorPagamento: { forma: string; count: number; valor: number }[];
  }>;
}

export const storage: IStorage = {
  async getVendas(scope) {
    const scopedQuery = withScope(db().from('vendas').select('*'), scope);
    const { data, error } = await scopedQuery.order('data', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapVenda);
  },
  async getVenda(scope, id) {
    const scopedQuery = withScope(db().from('vendas').select('*').eq('id', id), scope);
    const { data, error } = await scopedQuery.single();
    if (error) return undefined;
    return data ? mapVenda(data) : undefined;
  },
  async createVenda(scope, venda) {
    const { data, error } = await db()
      .from('vendas')
      .insert({
        ...toVendaRow(venda),
        user_id: scope.userId,
        empresa_id: scope.empresaId ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return mapVenda(data);
  },
  async updateVenda(scope, id, venda) {
    const row: any = {};
    if (venda.data !== undefined) row.data = venda.data;
    if (venda.marca !== undefined) row.marca = venda.marca;
    if (venda.tipoProduto !== undefined) row.tipo_produto = venda.tipoProduto;
    if (venda.pesoPacote !== undefined) row.peso_pacote = venda.pesoPacote;
    if (venda.quantidadeKg !== undefined) row.quantidade_kg = venda.quantidadeKg;
    if (venda.precoKg !== undefined) row.preco_kg = venda.precoKg;
    if (venda.valorTotal !== undefined) row.valor_total = venda.valorTotal;
    if (venda.formaPagamento !== undefined) row.forma_pagamento = venda.formaPagamento;
    if (venda.statusPagamento !== undefined) row.status_pagamento = venda.statusPagamento;
    if (venda.clienteNome !== undefined) row.cliente_nome = venda.clienteNome;
    if (venda.clienteId !== undefined) row.cliente_id = venda.clienteId;
    if (venda.emitirNota !== undefined) row.emitir_nota = venda.emitirNota;
    if (venda.observacoes !== undefined) row.observacoes = venda.observacoes;
    if (venda.parcelas !== undefined) row.parcelas = venda.parcelas;
    const scopedQuery = withScope(db().from('vendas').update(row).eq('id', id), scope);
    const { data, error } = await scopedQuery.select().single();
    if (error) return undefined;
    return data ? mapVenda(data) : undefined;
  },
  async deleteVenda(scope, id) {
    const scopedQuery = withScope(db().from('vendas').delete().eq('id', id), scope);
    await scopedQuery;
  },
  async getClientes(scope) {
    const scopedQuery = withScope(db().from('clientes').select('*'), scope);
    const { data, error } = await scopedQuery;
    if (error) throw error;
    return (data || []).map(mapCliente);
  },
  async getCliente(scope, id) {
    const scopedQuery = withScope(db().from('clientes').select('*').eq('id', id), scope);
    const { data, error } = await scopedQuery.single();
    if (error) return undefined;
    return data ? mapCliente(data) : undefined;
  },
  async createCliente(scope, cliente) {
    const row = {
      nome: cliente.nome,
      cpf_cnpj: cliente.cpfCnpj ?? null,
      telefone: cliente.telefone ?? null,
      endereco: cliente.endereco ?? null,
      user_id: scope.userId,
      empresa_id: scope.empresaId ?? null,
    };
    const { data, error } = await db().from('clientes').insert(row).select().single();
    if (error) throw error;
    return mapCliente(data);
  },
  async updateCliente(scope, id, cliente) {
    const row: any = {};
    if (cliente.nome !== undefined) row.nome = cliente.nome;
    if (cliente.cpfCnpj !== undefined) row.cpf_cnpj = cliente.cpfCnpj;
    if (cliente.telefone !== undefined) row.telefone = cliente.telefone;
    if (cliente.endereco !== undefined) row.endereco = cliente.endereco;
    const scopedQuery = withScope(db().from('clientes').update(row).eq('id', id), scope);
    const { data, error } = await scopedQuery.select().single();
    if (error) return undefined;
    return data ? mapCliente(data) : undefined;
  },
  async deleteCliente(scope, id) {
    const scopedQuery = withScope(db().from('clientes').delete().eq('id', id), scope);
    await scopedQuery;
  },
  async getStats(scope) {
    const scopedQuery = withScope(db().from('vendas').select('*'), scope);
    const { data: todasVendas } = await scopedQuery;
    const vendas: Venda[] = (todasVendas || []).map(mapVenda);
    const totalVendas = vendas.length;
    const totalKg = vendas.reduce((s, v) => s + (v.quantidadeKg || 0), 0);
    const totalValor = vendas.reduce((s, v) => s + (v.valorTotal || 0), 0);
    const totalPago = vendas.filter(v => v.statusPagamento === "pago").reduce((s, v) => s + (v.valorTotal || 0), 0);
    const totalPendente = vendas.filter(v => v.statusPagamento === "pendente").reduce((s, v) => s + (v.valorTotal || 0), 0);
    const porDiaMap = new Map<string, { valor: number; kg: number }>();
    vendas.forEach(v => {
      const d = toISODateKey(v.data);
      const cur = porDiaMap.get(d) || { valor: 0, kg: 0 };
      porDiaMap.set(d, { valor: cur.valor + (v.valorTotal || 0), kg: cur.kg + (v.quantidadeKg || 0) });
    });
    const vendasPorDia = Array.from(porDiaMap.entries()).map(([data, vals]) => ({ data, ...vals })).sort((a, b) => a.data.localeCompare(b.data));
    const porMarcaMap = new Map<string, { kg: number; valor: number }>();
    vendas.forEach(v => {
      const cur = porMarcaMap.get(v.marca) || { kg: 0, valor: 0 };
      porMarcaMap.set(v.marca, { kg: cur.kg + (v.quantidadeKg || 0), valor: cur.valor + (v.valorTotal || 0) });
    });
    const vendasPorMarca = Array.from(porMarcaMap.entries()).map(([marca, vals]) => ({ marca, ...vals }));
    const porPagMap = new Map<string, { count: number; valor: number }>();
    vendas.forEach(v => {
      const forma = v.formaPagamento || "Não informado";
      const cur = porPagMap.get(forma) || { count: 0, valor: 0 };
      porPagMap.set(forma, { count: cur.count + 1, valor: cur.valor + (v.valorTotal || 0) });
    });
    const vendasPorPagamento = Array.from(porPagMap.entries()).map(([forma, vals]) => ({ forma, ...vals }));
    return { totalVendas, totalKg, totalValor, totalPago, totalPendente, vendasPorDia, vendasPorMarca, vendasPorPagamento };
  }
};
