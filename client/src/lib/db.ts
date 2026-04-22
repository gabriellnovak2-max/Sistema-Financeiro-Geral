import { supabase } from './supabase';
import type { Cliente, InsertCliente, Venda, InsertVenda } from '@shared/schema';

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

// ── Vendas ──────────────────────────────────────────────────────────────────

export async function getVendas(): Promise<Venda[]> {
  const { data, error } = await supabase
    .from('vendas')
    .select('*')
    .order('data', { ascending: false });
  if (error) throw new Error(error.message);
  return (data || []).map(mapVenda);
}

export async function createVenda(venda: InsertVenda): Promise<Venda> {
  const { data, error } = await supabase
    .from('vendas')
    .insert(toVendaRow(venda))
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapVenda(data);
}

export async function updateVenda(id: number, venda: Partial<InsertVenda>): Promise<Venda> {
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
  const { data, error } = await supabase
    .from('vendas')
    .update(row)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapVenda(data);
}

export async function deleteVenda(id: number): Promise<void> {
  const { error } = await supabase.from('vendas').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ── Clientes ─────────────────────────────────────────────────────────────────

export async function getClientes(): Promise<Cliente[]> {
  const { data, error } = await supabase.from('clientes').select('*');
  if (error) throw new Error(error.message);
  return (data || []).map(mapCliente);
}

export async function createCliente(cliente: InsertCliente): Promise<Cliente> {
  const { data, error } = await supabase
    .from('clientes')
    .insert({
      nome: cliente.nome,
      cpf_cnpj: cliente.cpfCnpj ?? null,
      telefone: cliente.telefone ?? null,
      endereco: cliente.endereco ?? null,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapCliente(data);
}

export async function updateCliente(id: number, cliente: Partial<InsertCliente>): Promise<Cliente> {
  const row: any = {};
  if (cliente.nome !== undefined) row.nome = cliente.nome;
  if (cliente.cpfCnpj !== undefined) row.cpf_cnpj = cliente.cpfCnpj;
  if (cliente.telefone !== undefined) row.telefone = cliente.telefone;
  if (cliente.endereco !== undefined) row.endereco = cliente.endereco;
  const { data, error } = await supabase
    .from('clientes')
    .update(row)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return mapCliente(data);
}

export async function deleteCliente(id: number): Promise<void> {
  const { error } = await supabase.from('clientes').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ── Stats (computado client-side a partir das vendas) ────────────────────────

export interface Stats {
  totalVendas: number;
  totalKg: number;
  totalValor: number;
  totalPago: number;
  totalPendente: number;
  vendasPorDia: { data: string; valor: number; kg: number }[];
  vendasPorMarca: { marca: string; kg: number; valor: number }[];
  vendasPorPagamento: { forma: string; count: number; valor: number }[];
}

export function computeStats(vendas: Venda[]): Stats {
  const totalVendas = vendas.length;
  const totalKg = vendas.reduce((s, v) => s + (v.quantidadeKg || 0), 0);
  const totalValor = vendas.reduce((s, v) => s + (v.valorTotal || 0), 0);
  const totalPago = vendas
    .filter(v => v.statusPagamento === 'pago')
    .reduce((s, v) => s + (v.valorTotal || 0), 0);
  const totalPendente = vendas
    .filter(v => v.statusPagamento === 'pendente')
    .reduce((s, v) => s + (v.valorTotal || 0), 0);

  const porDiaMap = new Map<string, { valor: number; kg: number }>();
  vendas.forEach(v => {
    const d = v.data.substring(0, 10);
    const cur = porDiaMap.get(d) || { valor: 0, kg: 0 };
    porDiaMap.set(d, { valor: cur.valor + (v.valorTotal || 0), kg: cur.kg + (v.quantidadeKg || 0) });
  });
  const vendasPorDia = Array.from(porDiaMap.entries())
    .map(([data, vals]) => ({ data, ...vals }))
    .sort((a, b) => a.data.localeCompare(b.data));

  const porMarcaMap = new Map<string, { kg: number; valor: number }>();
  vendas.forEach(v => {
    const cur = porMarcaMap.get(v.marca) || { kg: 0, valor: 0 };
    porMarcaMap.set(v.marca, { kg: cur.kg + (v.quantidadeKg || 0), valor: cur.valor + (v.valorTotal || 0) });
  });
  const vendasPorMarca = Array.from(porMarcaMap.entries()).map(([marca, vals]) => ({ marca, ...vals }));

  const porPagMap = new Map<string, { count: number; valor: number }>();
  vendas.forEach(v => {
    const forma = v.formaPagamento || 'Não informado';
    const cur = porPagMap.get(forma) || { count: 0, valor: 0 };
    porPagMap.set(forma, { count: cur.count + 1, valor: cur.valor + (v.valorTotal || 0) });
  });
  const vendasPorPagamento = Array.from(porPagMap.entries()).map(([forma, vals]) => ({ forma, ...vals }));

  return { totalVendas, totalKg, totalValor, totalPago, totalPendente, vendasPorDia, vendasPorMarca, vendasPorPagamento };
}

export async function getStats(): Promise<Stats> {
  const vendas = await getVendas();
  return computeStats(vendas);
}
